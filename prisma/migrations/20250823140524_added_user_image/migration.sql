/*
  Warnings:

  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "public"."SubCategory";
