import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../lib/infrastructere/prisma/prisma.service';
import { TransactionsCoins, TransactionsType } from '@prisma/client';

@Injectable()
export class PaymentRepository {
    constructor(private readonly prisma: PrismaService) {}


    async createTransaction(type: TransactionsType, token: TransactionsCoins, amount: number, userId: number) {
        try {
            return await this.prisma.transaction.create({
                data: {
                    type,
                    token,
                    amount,
                    userId
                }
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async findTransactionByUserId(userId: number) {
        try {
            return await this.prisma.transaction.findMany({
                where: { userId }
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}