import type { PrismaClient } from "@prisma/client";
import { cloudinary, uploadImageBase64 } from "@/server/cloudinary";
import type { z } from "zod";
import { base64FileInput } from "@/lib/schemas/product";

export type Base64File = z.infer<typeof base64FileInput>;

/**
 * Uploads multiple base64 images, creates attachments and links them to an entity.
 * @param prisma Prisma client instance
 * @param files Array of base64 files from frontend
 * @param entityType The string name of the entity (e.g. "Product")
 * @param entityId The entity's id to link attachments to
 */
export async function addAttachmentsToEntity(
  prisma: PrismaClient,
  files: Base64File[],
  entityType: string,
  entityId: string,
) {
  for (const file of files) {
    const imgData = await uploadImageBase64(
      file.data,
      entityType.toLowerCase() + "s",
      file.name,
    );
    // imgData should include publicId, url, mimeType, size, width, height, etc.

    const attachment = await prisma.attachment.create({
      data: { ...imgData, storageKey: imgData.publicId },
    });

    await prisma.attachmentEntityLink.create({
      data: {
        entityType,
        entityId,
        attachmentId: attachment.id,
      },
    });
  }
}

/**
 * Deletes all attachments linked to an entity, including Cloudinary files and links.
 * @param prisma Prisma client instance
 * @param entityType The string name of the entity (e.g. "Product")
 * @param entityId The entity's id to delete attachments for
 */
export async function deleteAttachmentsForEntity(
  prisma: PrismaClient,
  entityType: string,
  entityId: string,
) {
  const links = await prisma.attachmentEntityLink.findMany({
    where: { entityType, entityId },
    include: { attachment: true },
  });

  for (const link of links) {
    if (link.attachment.storageKey) {
      await cloudinary.uploader.destroy(link.attachment.storageKey);
    }
  }

  await prisma.attachmentEntityLink.deleteMany({
    where: { entityType, entityId },
  });
}

export const STORAGE_KEYS = {
  PRODUCT: "Product",
  CATEGORY: "Category",
};

/*

import {
  addAttachmentsToEntity,
  deleteAttachmentsForEntity,
} from "@/server/services/attachment.service";

// In create mutation:
if (input.images?.length) {
  await addAttachmentsToEntity(ctx.db, input.images, "Product", product.id);
}

// In update mutation:
if (input.data.images?.length) {
  await deleteAttachmentsForEntity(ctx.db, "Product", product.id);
  await addAttachmentsToEntity(ctx.db, input.data.images, "Product", product.id);
}

// In delete mutation:
await deleteAttachmentsForEntity(ctx.db, "Product", input.id);
await ctx.db.product.delete({ where: { id: input.id } });


*/
