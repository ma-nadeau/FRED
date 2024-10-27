/*
  Warnings:

  - You are about to drop the column `accountId` on the `MainAccount` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MainAccount" DROP CONSTRAINT "MainAccount_bankAccount_fkey";

-- DropForeignKey
ALTER TABLE "MainAccount" DROP CONSTRAINT "MainAccount_tradingAccount_fkey";

-- AlterTable
ALTER TABLE "MainAccount" DROP COLUMN "accountId",
ADD COLUMN     "bankAccountId" INTEGER,
ADD COLUMN     "tradingAccountId" INTEGER;

-- AddForeignKey
ALTER TABLE "MainAccount" ADD CONSTRAINT "MainAccount_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainAccount" ADD CONSTRAINT "MainAccount_tradingAccountId_fkey" FOREIGN KEY ("tradingAccountId") REFERENCES "TradingAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
