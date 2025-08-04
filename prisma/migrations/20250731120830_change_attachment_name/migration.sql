-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "attachmentId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "public"."Attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
