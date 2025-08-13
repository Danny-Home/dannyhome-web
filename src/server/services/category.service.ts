/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  defaultPagination,
  type TPaginationFilter,
} from "@/lib/schemas/filters";
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

export async function listCategories(
  prisma: PrismaClient,
  filter: TPaginationFilter = {
    ...defaultPagination,
    showAll: true,
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

  console.log(categories);

  return { categories, total, page, perPage, showAll };
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

  if (image?.length) {
    const result = await addAttachmentsToEntity(
      prisma,
      image,
      STORAGE_KEYS.CATEGORY,
      category.id,
    );
    if (!(result.length > 0)) {
      throw new TRPCError({
        code: "UNPROCESSABLE_CONTENT",
        message: "Failed to upload images. Try again",
      });
    }
  }

  return category;
}

export async function updateCategory(
  prisma: PrismaClient,
  payload: TUpdateCategorySchema,
) {
  const {
    id,
    data: { image, ...data },
  } = payload;

  const category = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  if (!category) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Category not found",
    });
  }

  if (image && image.length > 0) {
    await deleteAttachmentsForEntity(
      prisma,
      STORAGE_KEYS.CATEGORY,
      category.id,
    );
    await addAttachmentsToEntity(
      prisma,
      image,
      STORAGE_KEYS.CATEGORY,
      category.id,
    );
  }

  return category;
}

export async function deleteCategory(
  prisma: PrismaClient,
  { id }: TCategorySchema,
) {
  await deleteAttachmentsForEntity(prisma, STORAGE_KEYS.CATEGORY, id);
  const category = await prisma.category.delete({
    where: { id },
  });

  return category;
}
