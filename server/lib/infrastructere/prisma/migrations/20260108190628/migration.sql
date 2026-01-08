-- CreateEnum
CREATE TYPE "TransactionsCoins" AS ENUM ('TON', 'COIN');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "token" "TransactionsCoins" NOT NULL DEFAULT 'TON';
