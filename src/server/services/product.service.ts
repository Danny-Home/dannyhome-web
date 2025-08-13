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
  includeAttachments,
  includeAttachmentsForEntity,
  STORAGE_KEYS,
} from "./storage.service";
import {
  defaultPagination,
  type TPaginationFilter,
} from "@/lib/schemas/filters";
import { maybePaginate } from "@/server/services/base.service";
import { TRPCError } from "@trpc/server";

export async function listProducts(
  prisma: PrismaClient,
  filters: TPaginationFilter = defaultPagination,
) {
  const { items, ...meta } = await maybePaginate(
    prisma,
    prisma.product,
    filters,
  );

  const products = await includeAttachments(
    prisma,
    STORAGE_KEYS.PRODUCT,
    items,
  );

  return {
    ...meta,
    products,
  };
}

export async function getProductById(prisma: PrismaClient, filter: TProductId) {
  const product = await prisma.product.findUnique({
    where: { id: filter.id },
  });

  if (!product) return null;

  return includeAttachmentsForEntity(prisma, STORAGE_KEYS.PRODUCT, product);
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

  if (!product) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product not found",
    });
  }

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
