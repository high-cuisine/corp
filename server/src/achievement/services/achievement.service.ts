import { Injectable } from '@nestjs/common';
import type { Achievement, User } from '@prisma/client';
import { AchievementRepository } from '../repositorys/achievement.repository';
import type { AchievementsListRto, AchievementItemRto } from '../rto/achievement.rto';
import { UserRepository } from '../../users/repositorys/user.repository';

@Injectable()
export class AchievementService {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /** Список всех достижений с флагом «получено» для пользователя. */
  async getAchievementsForUser(userId: number): Promise<AchievementsListRto> {
    const [all, obtainedIds] = await Promise.all([
      this.achievementRepository.findAllAchievements(),
      this.achievementRepository.findUserAchievementIds(userId),
    ]);
    const obtainedSet = new Set(obtainedIds);
    const achievements: AchievementItemRto[] = all.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      type: a.type,
      targetValue: a.targetValue,
      sortOrder: a.sortOrder,
      obtained: obtainedSet.has(a.id),
    }));
    return { achievements };
  }

  /**
   * Проверяет все достижения пользователя и автоматически выдаёт те,
   * условия которых выполнены (по типу и targetValue).
   */
  async checkAndGrantAchievements(userId: number): Promise<void> {
    const [user, allAchievements, obtainedIds] = await Promise.all([
      this.userRepository.findUserById(userId),
      this.achievementRepository.findAllAchievements(),
      this.achievementRepository.findUserAchievementIds(userId),
    ]);
    if (!user) return;

    const obtainedSet = new Set(obtainedIds);
    const friendsCount = await this.userRepository.countFriendsAsReferrer(userId);

    for (const achievement of allAchievements) {
      if (obtainedSet.has(achievement.id)) continue;
      if (!this.isAchievementReached(achievement, user, friendsCount)) continue;

      await this.achievementRepository.grantAchievement(userId, achievement.id);
      obtainedSet.add(achievement.id);
    }
  }

  private isAchievementReached(
    achievement: Achievement,
    user: User,
    friendsCount: number,
  ): boolean {
    const target = achievement.targetValue ?? 0;
    switch (achievement.type) {
      case 'LEVEL_REACHED':
        return user.level >= target;
      case 'FRIENDS_INVITED':
        return friendsCount >= target;
      case 'COINS_EARNED':
        return Number(user.coinBalance) >= target;
      case 'GAMES_PLAYED':
        // Нет счётчика игр в User — можно добавить позже
        return false;
      case 'CUSTOM':
        return false;
      default:
        return false;
    }
  }
}
