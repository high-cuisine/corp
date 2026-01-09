import { IsEnum, IsNumber, Min } from 'class-validator';

export class TopupDTO {
    @IsEnum(['TON', 'COIN'])
    token: 'TON' | 'COIN';

    @IsNumber()
    @Min(0.01)
    amount: number;
}