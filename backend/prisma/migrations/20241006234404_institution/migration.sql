/*
  Warnings:

  - Added the required column `institution` to the `MainAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MainAccount" ADD COLUMN     "institution" TEXT NOT NULL;
