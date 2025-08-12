/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TPaginationFilter } from "@/lib/schemas/filters";
import type { PrismaClient } from "@prisma/client";
import { addAttachmentsToEntity, includeAttachments, includeAttachmentsForEntity, STORAGE_KEYS } from "./storage.service";
import type {
  TCategorySchema,
  TCreateCategorySchema,
} from "@/lib/schemas/category";
import { TRPCError } from "@trpc/server";
import { maybePaginate } from "@/server/services/base.service";

export async function listCategories(
  prisma: PrismaClient,
  filter: TPaginationFilter = {
    page: 1,
    perPage: 20,
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
