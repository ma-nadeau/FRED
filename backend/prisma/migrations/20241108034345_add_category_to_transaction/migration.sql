/*
  Warnings:

  - Added the required column `category` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GROCERIES', 'ENTERTAINMENT', 'TRANSPORTATION', 'UTILITIES', 'HEALTH', 'EDUCATION', 'OTHER');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "category" "Category" NOT NULL;
