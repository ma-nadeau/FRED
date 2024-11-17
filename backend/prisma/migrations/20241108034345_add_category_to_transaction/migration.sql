/*
  Warnings:

  - Added the required column `category` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('GROCERIES', 'CAR', 'RENT', 'TUITION', 'BILLS', 'HEALTH', 'MISCELLANEOUS', 'OUTINGS', 'SALARY');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "category" "TransactionCategory" NOT NULL;
