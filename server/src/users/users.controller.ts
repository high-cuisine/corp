import { Body, Controller, Get, NotFoundException, Post, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "./users.service";
import { UserLoginInterface } from "./interfaces/user-login.interface";
import { UserRepository } from "./repositorys/user.repository";
import { JwtService } from "lib/shared/jwt/jwt.service";
import { ValidateTelegramInitDataPipe } from "./pipes/initData.pipe";
import { JwtAuthGuard } from "lib/shared/jwt/guard/jwt-guard.guard";

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

  @Get('/get-user-by-name')
  @UseGuards(JwtAuthGuard)
  async getUserByName(@Query('name') name: string) {
    const user = await this.userRepository.findUserByUsername(name);
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      photoUrl: user.photoUrl,
    };
  }
}