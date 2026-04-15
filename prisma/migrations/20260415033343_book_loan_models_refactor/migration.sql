/*
  Warnings:

  - You are about to drop the column `availableStock` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `totalStock` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "availableStock",
DROP COLUMN "totalStock";
