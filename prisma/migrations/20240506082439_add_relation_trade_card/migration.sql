-- AddForeignKey
ALTER TABLE `TradeRequest` ADD CONSTRAINT `TradeRequest_giftedCardId_fkey` FOREIGN KEY (`giftedCardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
