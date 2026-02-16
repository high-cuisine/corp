import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../lib/infrastructere/prisma/prisma.module';
import { TelegramModule } from '../lib/infrastructere/telegram/telegram.module';
import { AchievementModule } from './achievement/achievement.module';
import { GameModule } from './game/game.module';
import { PaymentModule } from './payment/payment.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TelegramModule,
    UsersModule,
    PaymentModule,
    GameModule,
    AchievementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
