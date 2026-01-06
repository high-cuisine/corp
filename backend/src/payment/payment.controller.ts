import { Controller, Post, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SendDTO } from './dto/send.dto';
import { JwtAuthGuard } from 'lib/shared/jwt/guard/jwt-guard.guard';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('send')
    @UseGuards(JwtAuthGuard)
    async send(@Body() body: SendDTO) {
        //return this.paymentService.send(body.userId, body.token);
    }

}