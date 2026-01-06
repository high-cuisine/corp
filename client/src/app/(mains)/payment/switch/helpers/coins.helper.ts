export const COINS = [
    { name: 'ton' },
    { name: 'coin' }
] as const;

export type CoinName = typeof COINS[number]['name'];

