/*
  Warnings:

  - You are about to drop the column `attachmentId` on the `Banner` table. All the data in the column will be lost.
  - Added the required column `attachment` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Banner" DROP CONSTRAINT "Banner_attachmentId_fkey";

-- AlterTable
ALTER TABLE "public"."Banner" DROP COLUMN "attachmentId",
ADD COLUMN     "attachment" JSONB NOT NULL;
