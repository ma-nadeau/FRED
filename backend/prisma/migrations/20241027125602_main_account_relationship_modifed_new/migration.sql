/*
  Warnings:

  - You are about to drop the column `bankAccountId` on the `MainAccount` table. All the data in the column will be lost.
  - You are about to drop the column `tradingAccountId` on the `MainAccount` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `MainAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MainAccount" DROP CONSTRAINT "MainAccount_bankAccountId_fkey";

-- DropForeignKey
ALTER TABLE "MainAccount" DROP CONSTRAINT "MainAccount_tradingAccountId_fkey";

-- AlterTable
ALTER TABLE "MainAccount" DROP COLUMN "bankAccountId",
DROP COLUMN "tradingAccountId",
ADD COLUMN     "accountId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MainAccount" ADD CONSTRAINT "MainAccount_bankAccount_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainAccount" ADD CONSTRAINT "MainAccount_tradingAccount_fkey" FOREIGN KEY ("accountId") REFERENCES "TradingAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
