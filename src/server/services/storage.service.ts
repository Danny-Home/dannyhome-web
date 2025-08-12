/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PrismaClient } from "@prisma/client";
import {  uploadImageBase64 } from "@/server/cloudinary";
import type { z } from "zod";
import { type base64FileInput } from "@/lib/schemas/product";
import {v2 as cloudinary} from 'cloudinary'
import type { Attachment } from "prisma/interfaces";

export type Base64File = z.infer<typeof base64FileInput>;

export async function includeAttachments<T extends { id: string }>(
  prisma: PrismaClient,
  entityType: string,
  entities: T[]
): Promise<(T & { attachments: any[] })[]> {
  if (entities.length === 0) return [];

  const links = await prisma.attachmentEntityLink.findMany({
    where: {
      entityType,
      entityId: { in: entities.map(e => e.id) },
    },
    include: { attachment: true },
  });

  const map = new Map<string, T & { attachments: any[] }>(
    entities.map(e => [e.id, { ...e, attachments: [] }])
  );

  for (const link of links) {
    const target = map.get(link.entityId);
    if (target) target.attachments.push(link.attachment);
  }

  return Array.from(map.values());
}

export async function includeAttachmentsForEntity<T extends { id: string }>(
  prisma: PrismaClient,
  entityType: string,
  entity: T | null
): Promise<(T & { attachments: Attachment[] }) | null> {
  if (!entity) return null;

  const links = await prisma.attachmentEntityLink.findMany({
    where: { entityType, entityId: entity.id },
    include: { attachment: true },
  });

  return { ...entity, attachments: links.map(l => l.attachment) };
}

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
  const uploaded = [];

  for (const file of files) {
    const {publicId, ...imgData} = await uploadImageBase64(
      file.data,
      entityType.toLowerCase() + "s",
      file.name,
    );

    const attachment = await prisma.attachment.create({
      data: { ...imgData, storageKey: publicId },
    });

    const link = await prisma.attachmentEntityLink.create({
      data: {
        entityType,
        entityId,
        attachmentId: attachment.id,
      },
    });

    uploaded.push(link);
  }

  return uploaded;
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
