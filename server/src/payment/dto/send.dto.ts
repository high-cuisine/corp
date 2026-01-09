import { IsEnum, IsNumber, Min } from 'class-validator';

export class SendDTO {

    @IsNumber()
    toId: number;

    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsEnum(['TON', 'COIN'])
    token: 'TON' | 'COIN';
}