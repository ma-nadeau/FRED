/*
  Warnings:

  - The values [SAVINGS] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `subscriptionId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `TradingAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TradingAccountType" AS ENUM ('STOCK', 'CRYPTO');

-- CreateEnum
CREATE TYPE "RecurringCashFlowType" AS ENUM ('INCOME', 'SUBSCRIPTION');

-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('CHECKING', 'SAVINGS_TFSA', 'SAVINGS_RRSP', 'SAVINGS_TFSH', 'CREDIT');
ALTER TABLE "BankAccount" ALTER COLUMN "type" TYPE "AccountType_new" USING ("type"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "AccountType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "FinanceRecommendation" DROP CONSTRAINT "FinanceRecommendation_userId_fkey";

-- DropForeignKey
ALTER TABLE "MainAccount" DROP CONSTRAINT "MainAccount_bankAccount_fkey";

-- DropForeignKey
ALTER TABLE "MainAccount" DROP CONSTRAINT "MainAccount_tradingAccount_fkey";

-- DropForeignKey
ALTER TABLE "MainAccount" DROP CONSTRAINT "MainAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_accountId_fkey";

-- DropForeignKey
ALTER TABLE "TradeStockTransaction" DROP CONSTRAINT "TradeStockTransaction_tradingAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "interestRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "TradingAccount" ADD COLUMN     "type" "TradingAccountType" NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "subscriptionId",
ADD COLUMN     "recurringCashFlowId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Subscription";

-- CreateTable
CREATE TABLE "RecurringCashFlow" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "frequency" TEXT NOT NULL,

    CONSTRAINT "RecurringCashFlow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MainAccount" ADD CONSTRAINT "MainAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainAccount" ADD CONSTRAINT "MainAccount_bankAccount_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainAccount" ADD CONSTRAINT "MainAccount_tradingAccount_fkey" FOREIGN KEY ("accountId") REFERENCES "TradingAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recurringCashFlowId_fkey" FOREIGN KEY ("recurringCashFlowId") REFERENCES "RecurringCashFlow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringCashFlow" ADD CONSTRAINT "RecurringCashFlow_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeStockTransaction" ADD CONSTRAINT "TradeStockTransaction_tradingAccountId_fkey" FOREIGN KEY ("tradingAccountId") REFERENCES "TradingAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceRecommendation" ADD CONSTRAINT "FinanceRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
