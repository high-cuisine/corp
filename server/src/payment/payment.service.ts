import { BadRequestException, Injectable } from '@nestjs/common';
import { TelegramService } from 'lib/infrastructere/telegram/telegram.service';
import { UserRepository } from 'src/users/repositorys/user.repository';
import { PaymentRepository } from './repository/payment.repository';
import { TransactionsCoins, TransactionsType } from '@prisma/client';

@Injectable()
export class PaymentService {

    constructor(
        private readonly usersRepository: UserRepository,
        private readonly telegramService: TelegramService,
        private readonly paymentRepository: PaymentRepository
    ) {

    }

    async createTransaction(type: TransactionsType, token: TransactionsCoins, amount: number, userId: number) {
        return await this.paymentRepository.createTransaction(type, token, amount, userId);
    }

    async send(fromId: string, toId: string, token: string, amount: number) {
        const user = await this.usersRepository.findUserById(Number(fromId));

        if(!user) {
            throw new BadRequestException('user not found');
        }

        try {
            if(token === 'TON' || token === 'ton') {
                if(Number(user.tonBalance) < Number(amount)) 
                    throw new BadRequestException('balance to low') 
                await this.usersRepository.incrementTonBalance(Number(toId), amount)
                await this.usersRepository.decrementTonBalance(Number(fromId), amount)

                await this.telegramService.sendMessage(Number(toId), `Вы получили ${amount} TON от ${user.username}`);
                const receiveTransaction = await this.createTransaction('RECEIVE', 'TON', amount, Number(toId));
                await this.createTransaction('SEND', 'TON', amount, Number(fromId));
                return receiveTransaction;
            }
            else {
                if(Number(user.coinBalance) < Number(amount)) 
                    throw new BadRequestException('balance to low')
                await this.usersRepository.incrementCoinBalance(Number(toId), amount)
                await this.usersRepository.decrementCoinBalance(Number(fromId), amount)

                await this.telegramService.sendMessage(Number(toId), `Вы получили ${amount} ${token} от ${user.username}`);
                const receiveTransaction = await this.createTransaction('RECEIVE', 'COIN', amount, Number(toId));
                await this.createTransaction('SEND', 'COIN', amount, Number(fromId));
                return receiveTransaction;
            }
        }

        catch(e) {
            console.error(e);
            throw e;
        }
    }

    async switch(userId: number, tokenFrom: TransactionsCoins, tokenTo: TransactionsCoins, amount: number) {
        const user = await this.usersRepository.findUserById(userId);

        if(!user) {
            throw new BadRequestException('user not found');
        }

        let transaction;
        if(tokenFrom === 'TON') {
            if(Number(user.tonBalance) < Number(amount)) 
                throw new BadRequestException('balance to low')
            await this.usersRepository.decrementTonBalance(userId, amount)
            await this.usersRepository.incrementCoinBalance(userId, amount)
            transaction = await this.createTransaction('SWITCH_OUT', tokenFrom, amount, userId);
        }
        else {
            if(Number(user.coinBalance) < Number(amount)) 
                throw new BadRequestException('balance to low')
            await this.usersRepository.decrementCoinBalance(userId, amount)
            await this.usersRepository.incrementTonBalance(userId, amount)
            transaction = await this.createTransaction('SWITCH_IN', tokenTo, amount, userId);
        }

        await this.telegramService.sendMessage(userId, `Вы обменяли ${amount} ${tokenFrom} на ${amount} ${tokenTo}`);
        return transaction;
    }

    async topUp(userId: number, token: TransactionsCoins, amount: number) {
        const user = await this.usersRepository.findUserById(userId);

        if(!user) {
            throw new BadRequestException('user not found');
        }

        let transaction;
        if(token === 'TON') {
            await this.usersRepository.incrementTonBalance(userId, amount)
            transaction = await this.createTransaction('TOPUP', 'TON', amount, userId);
        }
        else {
            await this.usersRepository.incrementCoinBalance(userId, amount)
            transaction = await this.createTransaction('TOPUP', 'COIN', amount, userId);
        }
        return transaction;
    }

    async getTransactions(userId: number) {
        return await this.paymentRepository.findTransactionByUserId(userId);
    }
}