import { Injectable } from "@nestjs/common";
import { UserLoginInterface } from "./interfaces/user-login.interface";
import { JwtService } from "lib/shared/jwt/jwt.service";
import { UserRepository } from "./repositorys/user.repository";

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

    
}   