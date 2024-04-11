/*
  Warnings:

  - Added the required column `dateOfBirth` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `species` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `card` ADD COLUMN `dateOfBirth` VARCHAR(191) NOT NULL,
    ADD COLUMN `species` VARCHAR(191) NOT NULL;
