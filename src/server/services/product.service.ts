/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  TCreateProductSchema,
  TProductId,
  TUpdateProductSchema,
} from "@/lib/schemas/product";
import type { PrismaClient } from "@prisma/client";
import {
  addAttachmentsToEntity,
  deleteAttachmentsForEntity,
  STORAGE_KEYS,
} from "./storage.service";
import type { TPaginationFilter } from "@/lib/schemas/filters";

export async function listProducts(
  prisma: PrismaClient,
  { page, perPage }: TPaginationFilter = { page: 1, perPage: 20 },
) {
  const products = await prisma.product.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const productIds = products.map((p) => p.id);

  if (productIds.length === 0) {
    return { products: [], total: 0, page, perPage };
  }

  const attachmentLinks = await prisma.attachmentEntityLink.findMany({
    where: {
      entityType: STORAGE_KEYS.PRODUCT,
      entityId: { in: productIds },
    },
    include: {
      attachment: true,
    },
  });

  const productMap = new Map<string, any>(
    products.map((p) => [p.id, { ...p, attachments: [] }]),
  );

  for (const link of attachmentLinks) {
    const product = productMap.get(link.entityId);
    if (product) {
      product.attachments.push(link.attachment);
    }
  }

  const total = await prisma.product.count();

  return {
    products: Array.from(productMap.values()),
    total,
    page,
    perPage,
  };
}

export async function getProductById(prisma: PrismaClient, filter: TProductId) {
  const product = await prisma.product.findUnique({
    where: { id: filter.id },
  });

  if (!product) return null;

  const attachmentLinks = await prisma.attachmentEntityLink.findMany({
    where: {
      entityType: STORAGE_KEYS.PRODUCT,
      entityId: filter.id,
    },
    include: { attachment: true },
  });

  return {
    ...product,
    attachments: attachmentLinks.map((link) => link.attachment),
  };
}

export async function createProduct(
  prisma: PrismaClient,
  payload: TCreateProductSchema,
) {
  const { images, ...data } = payload;

  const product = await prisma.product.create({
    data: {
      ...data,
      defaultPrice: data.price,
    },
  });

  if (images?.length) {
    await addAttachmentsToEntity(prisma, images, "Product", product.id);
  }

  return product;
}

export async function updateProduct(
  prisma: PrismaClient,
  payload: TUpdateProductSchema,
) {
  const {
    id,
    data: { images, ...data },
  } = payload;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      defaultPrice: data?.price,
    },
  });

  if (images?.length) {
    await deleteAttachmentsForEntity(prisma, STORAGE_KEYS.PRODUCT, product.id);
    await addAttachmentsToEntity(prisma, images, "Product", product.id);
  }

  return product;
}

export async function deleteProduct(prisma: PrismaClient, { id }: TProductId) {
  await deleteAttachmentsForEntity(prisma, STORAGE_KEYS.PRODUCT, id);
  const product = await prisma.product.delete({ where: { id } });

  return product;
}
