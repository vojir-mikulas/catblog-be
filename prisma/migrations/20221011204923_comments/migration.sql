/*
  Warnings:

  - You are about to drop the column `parrentId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parrentId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "parrentId",
ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
