/*
  Warnings:

  - Added the required column `giftedCardId` to the `TradeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receivedCardId` to the `TradeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `traderequest` ADD COLUMN `giftedCardId` INTEGER NOT NULL,
    ADD COLUMN `receivedCardId` INTEGER NOT NULL;
