import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../lib/infrastructere/prisma/prisma.service';
import { UserLoginInterface } from '../interfaces/user-login.interface';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findUserByTelegramId(telegramId: string): Promise<User | null> {
        return (await this.prisma.user.findUnique({
            where: {
                telegramId,
            },
        }));
    }

    async createUser(user: UserLoginInterface): Promise<User> {
        return (await this.prisma.user.create({
            data: { 
                telegramId: user.telegramId, 
                username: user.username, 
                photoUrl: user.photoUrl,
            },
        }));
    }

    async changeUsername(id:number, username: string): Promise<User> {
        return (await this.prisma.user.update({
            where: { id },
            data: { username: username },
        }));
    }

    async incrementCoinBalance(id: number, amount: number): Promise<User> {
        return (await this.prisma.user.update({
            where: { id },
            data: {
                coinBalance: { increment: amount },
            },
        }));
    }

    async decrementCoinBalance(id: number, amount: number): Promise<User> {
        return (await this.prisma.user.update({
            where: { id },
            data: {
                coinBalance: { decrement: amount },
            },
        }));
    }

    async incrementTonBalance(id: number, amount: number): Promise<User> {
        return (await this.prisma.user.update({
            where: { id },
            data: {
                tonBalance: { increment: amount },
            },
        }));
    }

    async decrementTonBalance(id: number, amount: number): Promise<User> {
        return (await this.prisma.user.update({
            where: { id },
            data: {
                tonBalance: { decrement: amount },
            },
        }));
    }
    async findUserById(id: number): Promise<User | null> {
        return (await this.prisma.user.findUnique({
            where: { id },
        }));
    }

    async findUserByUsername(username: string): Promise<User | null> {
        return (await this.prisma.user.findFirst({
            where: { username },
        }));
    }

}