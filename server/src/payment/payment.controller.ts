import { Controller, Get, Post, Query, Req, UseGuards, Body } from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { SendDTO } from './dto/send.dto';
import { JwtAuthGuard } from 'lib/shared/jwt/guard/jwt-guard.guard';
import { SwitchDTO } from './dto/switch.dto';
import { TopupDTO } from './dto/topup.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('send')
    @UseGuards(JwtAuthGuard)
    async send(@Req() req: Request, @Body() body: SendDTO) {
        if (!req.user) {
            throw new Error('User not found in request');
        }
        const fromId = String(req.user.userId);
        return this.paymentService.send(fromId, String(body.toId), body.token, body.amount);
    }

    @Get('transactions')
    @UseGuards(JwtAuthGuard)
    async getTransactions(@Req() req: Request) {
        if (!req.user) {
            throw new Error('User not found in request');
        }
        const userId = req.user.userId;
        return this.paymentService.getTransactions(Number(userId));
    }

    @Post('switch')
    @UseGuards(JwtAuthGuard)
    async switch(@Req() req: Request, @Body() body: SwitchDTO) {
        if (!req.user) {
            throw new Error('User not found in request');
        }
        const userId = req.user.userId;
        return this.paymentService.switch(Number(userId), body.tokenFrom, body.tokenTo, body.amount);
    }

    @Post('topup')
    @UseGuards(JwtAuthGuard)
    async topup(@Req() req: Request, @Body() body: TopupDTO) {
        if (!req.user) {
            throw new Error('User not found in request');
        }
        const userId = req.user.userId;
        return this.paymentService.topUp(Number(userId), body.token, body.amount);
    }
}