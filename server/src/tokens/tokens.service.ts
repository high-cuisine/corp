import { Injectable } from "@nestjs/common";
import { TokenInterface } from "./interfaces/token.interface";


@Injectable()
export class TokensService {
    constructor() {}

    
    async buyToken(userId: string, amount: number, walletAddress: string) {}

    async swapToken(userId: string, fromToken: TokenInterface, toToken: TokenInterface) {}

    async sendToken(userId: string, toUserId: string, token: TokenInterface) {}

    async generateLink(userId: string, token: TokenInterface) {}

    async getTokens() {}
}    