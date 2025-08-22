/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PrismaClient } from "@prisma/client";
import { defaultPagination, type TPaginationFilter } from "@/lib/schemas/filters";
import { addAttachmentsToEntity, includeAttachments, includeAttachmentsForEntity, STORAGE_KEYS, deleteAttachmentsForEntity } from "./storage.service";
import type { TCreateCollection, TUpdateCollection, TCollectionId } from "@/lib/schemas/collection";

export async function listCollections(prisma: PrismaClient, filter: TPaginationFilter = { ...defaultPagination, showAll: true }) {
  const page = filter?.page ?? 1;
  const perPage = filter?.perPage ?? 20;
  const where = filter?.showAll ? {} : { active: true };

  const [items, total] = await Promise.all([
    prisma.collection.findMany({
      where, orderBy: { createdAt: "desc" }, take: perPage, skip: (page - 1) * perPage
    }),
    prisma.collection.count({ where })
  ]);

  const collections = await includeAttachments(prisma, STORAGE_KEYS.COLLECTION, items);
  return { collections, total, page, perPage, showAll: !!filter?.showAll };
}

export async function getCollectionBySlug(prisma: PrismaClient, slug: string) {
  const c = await prisma.collection.findUnique({ where: { slug } });
  if (!c) return null;
  const withImgs = await includeAttachmentsForEntity(prisma, STORAGE_KEYS.COLLECTION, c);
  const links = await prisma.collectionProduct.findMany({ where: { collectionId: c.id }, orderBy: { position: "asc" } });
  const productIds = links.map(l => l.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  return { ...withImgs, products };
}

export async function createCollection(prisma: PrismaClient, input: TCreateCollection) {
  const { images, productIds = [], ...data } = input;
  const collection = await prisma.collection.create({ data });
  if (images?.length) await addAttachmentsToEntity(prisma, images, "Collection", collection.id);
  if (productIds.length) {
    await prisma.collectionProduct.createMany({
      data: productIds.map((pid, i) => ({ collectionId: collection.id, productId: pid, position: i }))
    });
  }
  return includeAttachmentsForEntity(prisma, STORAGE_KEYS.COLLECTION, collection);
}

export async function updateCollection(prisma: PrismaClient, input: TUpdateCollection) {
  const { id, data } = input;
  const { images, productIds, ...rest } = data ?? {};
  const c = await prisma.collection.update({ where: { id }, data: rest });
  if (images) {
    await deleteAttachmentsForEntity(prisma, STORAGE_KEYS.COLLECTION, id);
    if (images.length) await addAttachmentsToEntity(prisma, images, "Collection", id);
  }
  if (productIds) {
    await prisma.collectionProduct.deleteMany({ where: { collectionId: id } });
    if (productIds.length) {
      await prisma.collectionProduct.createMany({
        data: productIds.map((pid, i) => ({ collectionId: id, productId: pid, position: i }))
      });
    }
  }
  return includeAttachmentsForEntity(prisma, STORAGE_KEYS.COLLECTION, c);
}

export async function deleteCollection(prisma: PrismaClient, { id }: TCollectionId) {
  await deleteAttachmentsForEntity(prisma, STORAGE_KEYS.COLLECTION, id);
  await prisma.collectionProduct.deleteMany({ where: { collectionId: id } });
  return prisma.collection.delete({ where: { id } });
}
