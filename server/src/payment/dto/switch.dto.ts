import { IsEnum, IsNumber, Min } from 'class-validator';

export class SwitchDTO {
    @IsEnum(['TON', 'COIN'])
    tokenFrom: 'TON' | 'COIN';

    @IsEnum(['TON', 'COIN'])
    tokenTo: 'TON' | 'COIN';

    @IsNumber()
    @Min(0.01)
    amount: number;
}