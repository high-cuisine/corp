import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../lib/infrastructere/prisma/prisma.service';
import { Achievement } from '@prisma/client';

@Injectable()
export class AchievementRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Все достижения из БД, отсортированы по sortOrder, затем по id. */
  async findAllAchievements(): Promise<Achievement[]> {
    return this.prisma.achievement.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  /** Id достижений, которые пользователь уже получил. */
  async findUserAchievementIds(userId: number): Promise<number[]> {
    const rows = await this.prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });
    return rows.map((r) => r.achievementId);
  }

  /** Выдать достижение пользователю (идемпотентно: если уже есть — не дублируем). */
  async grantAchievement(userId: number, achievementId: number): Promise<void> {
    await this.prisma.userAchievement.upsert({
      where: {
        userId_achievementId: { userId, achievementId },
      },
      create: { userId, achievementId },
      update: {},
    });
  }
}
