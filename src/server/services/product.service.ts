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


export async function searchProducts(prisma: PrismaClient, input: any) {
  const page = input?.page ?? 1;
  const perPage = input?.perPage ?? 24;

  const where: any = { active: true };

  if (input?.q) {
    where.OR = [
      { name: { contains: input.q, mode: "insensitive" } },
      { description: { contains: input.q, mode: "insensitive" } },
    ];
  }
  if (Array.isArray(input?.categoryIds) && input.categoryIds.length) {
    where.categoryId = { in: input.categoryIds };
  }
  if (typeof input?.minPrice === "number" || typeof input?.maxPrice === "number") {
    where.price = {};
    if (typeof input.minPrice === "number") where.price.gte = input.minPrice;
    if (typeof input.maxPrice === "number") where.price.lte = input.maxPrice;
  }
  if (input?.inStock) {
    where.stock = { gt: 0 };
  }

  let orderBy: any = { createdAt: "desc" };
  switch (input?.sort) {
    case "priceAsc":
      orderBy = { price: "asc" }; break;
    case "priceDesc":
      orderBy = { price: "desc" }; break;
    case "rating":
      orderBy = [{ ratingAvg: "desc" }, { ratingCount: "desc" }]; break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  const { items, total } = await maybePaginate(
    prisma,
    prisma.product,
    { page, perPage, showAll: false, where, orderBy }
  );

  const products = await includeAttachments(prisma, STORAGE_KEYS.PRODUCT, items);

  return { products, page, perPage, total };
}

