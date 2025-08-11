/*
  Warnings:

  - You are about to drop the column `data` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `attachment` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `attachmentId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `InventoryStock` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `defaultPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `attachmentId` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `avatarId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductAttachments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ean]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storageKey` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `InventoryStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."StorageProvider" AS ENUM ('S3', 'CLOUDINARY', 'LOCAL');

-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_attachmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InventoryStock" DROP CONSTRAINT "InventoryStock_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubCategory" DROP CONSTRAINT "SubCategory_attachmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_avatarId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProductAttachments" DROP CONSTRAINT "_ProductAttachments_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProductAttachments" DROP CONSTRAINT "_ProductAttachments_B_fkey";

-- DropIndex
DROP INDEX "public"."Banner_position_active_idx";

-- DropIndex
DROP INDEX "public"."Category_slug_idx";

-- DropIndex
DROP INDEX "public"."Product_slug_idx";

-- DropIndex
DROP INDEX "public"."SubCategory_slug_idx";

-- AlterTable
ALTER TABLE "public"."Attachment" DROP COLUMN "data",
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "storageKey" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "public"."Banner" DROP COLUMN "attachment";

-- AlterTable
ALTER TABLE "public"."CartItem" DROP COLUMN "productVariantId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "attachmentId";

-- AlterTable
ALTER TABLE "public"."InventoryStock" DROP COLUMN "productVariantId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "productVariantId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "defaultPrice",
ADD COLUMN     "attributes" JSONB,
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "ean" TEXT,
ADD COLUMN     "heightMm" INTEGER,
ADD COLUMN     "lengthMm" INTEGER,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weightGrams" INTEGER,
ADD COLUMN     "widthMm" INTEGER;

-- AlterTable
ALTER TABLE "public"."SubCategory" DROP COLUMN "attachmentId";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "avatarId",
DROP COLUMN "image";

-- DropTable
DROP TABLE "public"."ProductVariant";

-- DropTable
DROP TABLE "public"."_ProductAttachments";

-- CreateTable
CREATE TABLE "public"."AttachmentEntityLink" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "attachmentId" TEXT NOT NULL,
    "position" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttachmentEntityLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttachmentEntityLink_entityType_entityId_idx" ON "public"."AttachmentEntityLink"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "public"."Product"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Product_ean_key" ON "public"."Product"("ean");

-- AddForeignKey
ALTER TABLE "public"."AttachmentEntityLink" ADD CONSTRAINT "AttachmentEntityLink_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "public"."Attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryStock" ADD CONSTRAINT "InventoryStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
