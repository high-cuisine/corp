import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UserRepository } from "./repositorys/user.repository";
import { ValidateTelegramInitDataPipe } from "./pipes/initData.pipe";
import { JWTModule } from "lib/shared/jwt/jwt.module";

@Module({
    imports: [JWTModule],
    controllers: [UsersController],
    providers: [UsersService, UserRepository, ValidateTelegramInitDataPipe],
    exports: [UsersService, UserRepository]
})
export class UsersModule {}