export const AVAILABLE_COINS = [
    { name: 'ton' },
    { name: 'coin' }
] as const;

export type CoinName = typeof AVAILABLE_COINS[number]['name'];

