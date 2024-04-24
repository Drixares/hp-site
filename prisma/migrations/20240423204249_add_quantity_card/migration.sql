/*
  Warnings:

  - The values [CANCELLED,DELETED] on the enum `FriendRequest_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `friendrequest` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `usercard` ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;
