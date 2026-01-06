import { Controller } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserLoginInterface } from "./interfaces/user-login.interface";
import { UserRepository } from "./repositorys/user.repository";
import { JwtService } from "lib/shared/jwt/jwt.service";

@Controller('/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
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