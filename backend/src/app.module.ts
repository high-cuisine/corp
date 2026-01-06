import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../lib/infrastructere/prisma/prisma.module';
import { TelegramModule } from '../lib/infrastructere/telegram/telegram.module';
import { UsersModule } from './users/users.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TelegramModule,
    UsersModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
