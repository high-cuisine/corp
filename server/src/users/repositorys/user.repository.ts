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

    async incrementLevel(id: number): Promise<User> {
        return await this.prisma.user.update({
            where: { id },
            data: {
                level: {
                    increment: 1,
                },
            },
        });
    }

    async findUserByUsername(username: string): Promise<User | null> {
        return (await this.prisma.user.findFirst({
            where: { username },
        }));
    }

    /** Количество приглашённых друзей (где пользователь — referrer). */
    async countFriendsAsReferrer(userId: number): Promise<number> {
        return this.prisma.friends.count({
            where: { referrerId: userId },
        });
    }

    /** Создать связь реферала: кто пригласил (referrerId) и кого пригласили (referredId). Идемпотентно. */
    async createReferral(referrerId: number, referredId: number): Promise<void> {
        await this.prisma.friends.upsert({
            where: {
                referrerId_referredId: { referrerId, referredId },
            },
            create: { referrerId, referredId },
            update: {},
        });
    }

    /** Список приглашённых друзей (referred) для пользователя userId. */
    async findReferredFriends(userId: number): Promise<{ id: number; username: string | null; photoUrl: string | null; invitedAt: Date }[]> {
        const rows = await this.prisma.friends.findMany({
            where: { referrerId: userId },
            orderBy: { createdAt: 'desc' },
            select: {
                referred: {
                    select: { id: true, username: true, photoUrl: true },
                },
                createdAt: true,
            },
        });
        return rows.map((r) => ({
            id: r.referred.id,
            username: r.referred.username,
            photoUrl: r.referred.photoUrl,
            invitedAt: r.createdAt,
        }));
    }
}