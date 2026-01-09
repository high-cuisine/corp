import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './repository/payment.repository';
import { UsersModule } from '../users/users.module';
import { TelegramModule } from '../../lib/infrastructere/telegram/telegram.module';
import { JWTModule } from '../../lib/shared/jwt/jwt.module';

@Module({
    imports: [UsersModule, TelegramModule, JWTModule],
    controllers: [PaymentController],
    providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}