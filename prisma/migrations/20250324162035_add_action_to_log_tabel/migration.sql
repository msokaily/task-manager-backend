/*
  Warnings:

  - Added the required column `action` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "action" TEXT NOT NULL;
