/*
  Warnings:

  - You are about to drop the column `key` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `data` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Attachment_key_key";

-- AlterTable
ALTER TABLE "public"."Attachment" DROP COLUMN "key",
DROP COLUMN "url",
ADD COLUMN     "data" BYTEA NOT NULL,
ADD COLUMN     "filename" TEXT NOT NULL;
