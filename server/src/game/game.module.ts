import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { JWTModule } from 'lib/shared/jwt/jwt.module';

@Module({
  imports: [UsersModule, JWTModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}

