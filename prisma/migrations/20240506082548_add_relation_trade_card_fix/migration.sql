-- AddForeignKey
ALTER TABLE `TradeRequest` ADD CONSTRAINT `TradeRequest_receivedCardId_fkey` FOREIGN KEY (`receivedCardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
