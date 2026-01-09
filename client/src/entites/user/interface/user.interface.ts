export interface User {
    userId: number | string;
    telegramId?: string;
    balance?: number;
    level?: number;
    username?: string | null;
    photoUrl?: string | null;
    tonBalance: number | string;
    coinBalance: number | string;
}