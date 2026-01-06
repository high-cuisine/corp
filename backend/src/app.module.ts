import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from '../lib/infrastructere/telegram/telegram.module';
import { UsersModule } from './users/users.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
    UsersModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
