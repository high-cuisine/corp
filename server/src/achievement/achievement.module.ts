import { Module } from '@nestjs/common';
import { JWTModule } from 'lib/shared/jwt/jwt.module';
import { UsersModule } from '../users/users.module';
import { AchievementController } from './controllers/achievement.controller';
import { AchievementRepository } from './repositorys/achievement.repository';
import { AchievementService } from './services/achievement.service';

@Module({
  imports: [JWTModule, UsersModule],
  controllers: [AchievementController],
  providers: [AchievementService, AchievementRepository],
  exports: [AchievementService],
})
export class AchievementModule {}
