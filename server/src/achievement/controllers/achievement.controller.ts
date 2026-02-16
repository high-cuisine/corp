import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'lib/shared/jwt/guard/jwt-guard.guard';
import { AchievementService } from '../services/achievement.service';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  /**
   * Список всех достижений с флагом «получено» для текущего пользователя.
   * Требуется JWT (Authorization: Bearer <token>).
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAchievements(@Req() req: Request) {
    const user = req.user as { userId: number } | undefined;
    if (!user?.userId) {
      throw new Error('User not found in request');
    }
    return this.achievementService.getAchievementsForUser(Number(user.userId));
  }
}
