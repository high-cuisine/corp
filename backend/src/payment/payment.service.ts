import { BadRequestException, Injectable } from '@nestjs/common';
import { TelegramService } from 'lib/infrastructere/telegram/telegram.service';
import { UserRepository } from 'src/users/repositorys/user.repository';

@Injectable()
export class PaymentService {

    constructor(
        private readonly usersRepository: UserRepository,
        private readonly telegramService: TelegramService
    ) {

    }
    async send(fromId: string, toId: string, token: string, amount: number) {
        const user = await this.usersRepository.findUserById(Number(fromId));

        if(!user) {
            throw new BadRequestException('user not found');
        }

        try {
            if(token === 'ton') {
                if(Number(user.tonBalance) < Number(amount)) 
                    throw new BadRequestException('balance to low') 
                await this.usersRepository.incrementTonBalance(Number(toId), amount)
                await this.usersRepository.decrementTonBalance(Number(fromId), amount)

                await this.telegramService.sendMessage(Number(toId), `Вы получили ${amount} TON от ${user.username}`);
            }
            else {
                if(Number(user.coinBalance) < Number(amount)) 
                    throw new BadRequestException('balance to low')
                await this.usersRepository.incrementCoinBalance(Number(toId), amount)
                await this.usersRepository.decrementCoinBalance(Number(fromId), amount)

                await this.telegramService.sendMessage(Number(toId), `Вы получили ${amount} ${token} от ${user.username}`);
            }
        }

        catch(e) {
            console.error(e);
        }
    }
}