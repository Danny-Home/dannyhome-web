/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TPaginationFilter } from "@/lib/schemas/filters";
import type { PrismaClient } from "@prisma/client";
import {
  addAttachmentsToEntity,
  deleteAttachmentsForEntity,
  includeAttachments,
  includeAttachmentsForEntity,
  STORAGE_KEYS,
} from "./storage.service";
import type {
  TCategorySchema,
  TCreateCategorySchema,
  TUpdateCategorySchema,
} from "@/lib/schemas/category";
import { TRPCError } from "@trpc/server";
import { maybePaginate } from "@/server/services/base.service";

export type TListCategoriesFilter = {
  hideWithoutImages?: boolean;
};

export async function listCategories(
  prisma: PrismaClient,
  {
    hideWithoutImages,
    ...filter
  }: TPaginationFilter & TListCategoriesFilter = {
    ...defaultPagination,
    showAll: true,
    hideWithoutImages: false,
  },
) {
  const { items, total, page, perPage, showAll } = await maybePaginate(
    prisma,
    prisma.category,
    filter,
  );

  const categories = await includeAttachments(
    prisma,
    STORAGE_KEYS.CATEGORY,
    items,
  );

  const filteredCategories = hideWithoutImages
    ? categories.filter((c) => c.attachments.length > 0)
    : categories;

  return { categories: filteredCategories, total, page, perPage, showAll };
}

export async function getCategoryById(
  prisma: PrismaClient,
  filter: TCategorySchema,
) {
  const category = await prisma.category.findUnique({
    where: { id: filter.id },
  });

  if (!category) return null;

  return includeAttachmentsForEntity(prisma, STORAGE_KEYS.CATEGORY, category);
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
