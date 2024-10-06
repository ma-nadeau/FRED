/*
  Warnings:

  - Added the required column `isActive` to the `RecurringCashFlow` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `frequency` on the `RecurringCashFlow` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "RecurringCashFlow" ADD COLUMN     "isActive" BOOLEAN NOT NULL,
DROP COLUMN "frequency",
ADD COLUMN     "frequency" "Frequency" NOT NULL;
