/*
  Warnings:

  - Made the column `booster` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `booster` VARCHAR(191) NOT NULL DEFAULT '0';