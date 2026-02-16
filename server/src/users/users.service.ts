import { Injectable, NotFoundException } from "@nestjs/common";
import { UserLoginInterface } from "./interfaces/user-login.interface";
import { JwtService } from "lib/shared/jwt/jwt.service";
import { UserRepository } from "./repositorys/user.repository";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {}

  
    async login(userData: UserLoginInterface): Promise<{ accessToken: string, refreshToken: string }> {
        let user = await this.userRepository.findUserByTelegramId(userData.telegramId);
    
        if(!user) {
          user = await this.userRepository.createUser(userData);
        }
    
        const { accessToken, refreshToken } = this.jwtService.generateTokens(user);
        
        return { accessToken, refreshToken };
      }

    async findUserByUsername(username: string): Promise<User | null> {
        const user = await this.userRepository.findUserByUsername(username);
        if(!user) {
            return null;
        }
        return user;
    }

    async findUserByTelegramId(telegramId: number): Promise<User | null> {
        const user = await this.userRepository.findUserByTelegramId(telegramId.toString());
        if(!user) {
            return null;
        }
        return user;
    }

    async createUser(userData: UserLoginInterface): Promise<User> {
        const user = await this.userRepository.createUser(userData);
        if(!user) {
            throw new NotFoundException('User not created');
        }
        return user;
    }

    /** Привязать реферала: пользователь referrerId пригласил пользователя referredId. */
    async addReferral(referrerId: number, referredId: number): Promise<void> {
        await this.userRepository.createReferral(referrerId, referredId);
    }

    /** Список приглашённых друзей для пользователя (кто пришёл по его реферальной ссылке). */
    async getFriends(userId: number): Promise<{ id: number; username: string | null; photoUrl: string | null; invitedAt: Date }[]> {
        return this.userRepository.findReferredFriends(userId);
    }
}   