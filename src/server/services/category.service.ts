/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TPaginationFilter } from "@/lib/schemas/filters";
import type { PrismaClient } from "@prisma/client";
import { addAttachmentsToEntity, STORAGE_KEYS } from "./storage.service";
import type { TCategorySchema, TCreateCategorySchema } from "@/lib/schemas/category";

export async function listCategories(
  prisma: PrismaClient,
  { page, perPage }: TPaginationFilter = { page: 1, perPage: 20 },
) {
  const categories = await prisma.category.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const categoryIds = categories.map((c) => c.id);

  if (categoryIds.length === 0) {
    return { products: [], total: 0, page, perPage };
  }

  const attachmentLinks = await prisma.attachmentEntityLink.findMany({
    where: {
      entityType: STORAGE_KEYS.PRODUCT,
      entityId: { in: categoryIds },
    },
    include: {
      attachment: true,
    },
  });

  const categoryMap = new Map<string, any>(
    categories.map((c) => [c.id, { ...c, attachments: [] }]),
  );

  for (const link of attachmentLinks) {
    const category = categoryMap.get(link.entityId);
    if (category) {
      category.attachments.push(link.attachment);
    }
  }

  const total = await prisma.category.count();

  return {
    categories: Array.from(categoryMap.values()),
    total,
    page,
    perPage,
  };
}


export async function getCategoryById(prisma: PrismaClient, filter: TCategorySchema) {
  const category = await prisma.category.findUnique({
    where: { id: filter.id },
  });

  if (!category) return null;

  const attachmentLinks = await prisma.attachmentEntityLink.findMany({
    where: {
      entityType: STORAGE_KEYS.CATEGORY,
      entityId: filter.id,
    },
    include: { attachment: true },
  });

  return {
    ...category,
    attachments: attachmentLinks.map((link) => link.attachment),
  };
}

export async function createCategory(
  prisma: PrismaClient,
  payload: TCreateCategorySchema,
) {
  const { image, ...data } = payload;

  const category = await prisma.category.create({
    data: {
      ...data,
    },
  });

  if (image?.length) {
    await addAttachmentsToEntity(prisma, image, STORAGE_KEYS.CATEGORY, category.id);
  }

  return category;
}
