import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "./users.service";
import { UserLoginInterface } from "./interfaces/user-login.interface";
import { UserRepository } from "./repositorys/user.repository";
import { JwtService } from "lib/shared/jwt/jwt.service";
import { ValidateTelegramInitDataPipe } from "./pipes/initData.pipe";

@Controller('/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService

    ) {}

    @Post('login')
  async login(
    @Body(ValidateTelegramInitDataPipe) userData: UserLoginInterface,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.usersService.login(userData);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    });

    return { accessToken: tokens.accessToken };
  } 
}