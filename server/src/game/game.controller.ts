import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'lib/shared/jwt/guard/jwt-guard.guard';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  /**
   * Завершение уровня.
   * Принимает только JWT токен (через Authorization header),
   * берёт userId из req.user и инкрементирует level пользователя.
   */
  @Post('end-level')
  @UseGuards(JwtAuthGuard)
  async endLevel(@Req() req: Request) {
    if (!req.user || typeof (req.user as any).userId === 'undefined') {
      throw new Error('User not found in request');
    }

    const userId = Number((req.user as any).userId);
    const user = await this.gameService.endLevel(userId);

    return {
      id: user.id,
      level: user.level,
    };
  }
}

