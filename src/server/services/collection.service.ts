/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PrismaClient } from "@prisma/client";
import {
  addAttachmentsToEntity,
  includeAttachments,
  includeAttachmentsForEntity,
  STORAGE_KEYS,
  deleteAttachmentsForEntity,
} from "./storage.service";
import type {
  TCreateCollection,
  TUpdateCollection,
  TCollectionId,
} from "@/lib/schemas/collection";
import { TRPCError } from "@trpc/server";
import type {
  Collection,
} from "prisma/interfaces";
import type { WithImages } from "@/types/entities";

export async function listCollections(
  prisma: PrismaClient,
  filter?: { active?: boolean } = { active: false },
) {

  const [items, total] = await Promise.all([
    prisma.collection.findMany({
      where: {
        active: filter.active ?? true,
      },
      orderBy: { createdAt: "desc" },
    }) as Promise<Collection[]>,
    prisma.collection.count({ where: { active: filter.active ?? true } }),
  ]);

  const collections = await includeAttachments<Collection>(
    prisma,
    STORAGE_KEYS.COLLECTION,
    items as Collection[],
  );

  return { collections, total};
}

export async function getCollectionBySlug(
  prisma: PrismaClient,
  slug: string,
): Promise<WithImages<Collection>> {
  const c = await prisma.collection.findUnique({
    where: { slug },
    include: { products: true },
  });
  if (!c) throw new TRPCError({ code: "NOT_FOUND" });

  const withImgs = (await includeAttachmentsForEntity(
    prisma,
    STORAGE_KEYS.COLLECTION,
    c,
  )) as WithImages<Collection>;

  return withImgs;
}

export async function createCollection(
  prisma: PrismaClient,
  input: TCreateCollection,
) {
  const { images, productIds = [], ...data } = input;
  const collection: Collection = await prisma.collection.create({ data });

  if (images?.length)
    await addAttachmentsToEntity(
      prisma,
      images,
      STORAGE_KEYS.COLLECTION,
      collection.id,
    );
  if (productIds.length) {
    await prisma.collectionProduct.createMany({
      data: productIds.map((pid, i) => ({
        collectionId: collection.id,
        productId: pid,
        position: i,
      })),
    });
  }

  return await includeAttachmentsForEntity(
    prisma,
    STORAGE_KEYS.COLLECTION,
    collection,
  );
}

export async function updateCollection(
  prisma: PrismaClient,
  input: TUpdateCollection,
): Promise<WithImages<Collection>> {
  const { id, data } = input;
  const { images, productIds, ...rest } = data ?? {};
  const c: Collection = await prisma.collection.update({
    where: { id },
    data: rest,
  });

  if (images) {
    await deleteAttachmentsForEntity(prisma, STORAGE_KEYS.COLLECTION, id);
    if (images.length)
      await addAttachmentsToEntity(prisma, images, STORAGE_KEYS.COLLECTION, id);
  }
  if (productIds) {
    await prisma.collectionProduct.deleteMany({ where: { collectionId: id } });
    if (productIds.length) {
      await prisma.collectionProduct.createMany({
        data: productIds.map((pid, i) => ({
          collectionId: id,
          productId: pid,
          position: i,
        })),
      });
    }
  }

  const withImgs = await includeAttachmentsForEntity<Collection>(
    prisma,
    STORAGE_KEYS.COLLECTION,
    c,
  );
  return withImgs;
}

export async function deleteCollection(
  prisma: PrismaClient,
  { id }: TCollectionId,
) {
  await deleteAttachmentsForEntity(prisma, STORAGE_KEYS.COLLECTION, id);
  await prisma.collectionProduct.deleteMany({ where: { collectionId: id } });

  const deleted: Collection|null = await prisma.collection.delete({
    where: { id },
  }).catch(() => null);

  if (!deleted) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Collection not found" });
  }

  return deleted;
}
