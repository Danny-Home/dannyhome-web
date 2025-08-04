/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import "server-only";

import { buildCrudService } from "@/server/services/base.service";
import { db } from "@/server/db";
import {
  storageService,
} from "@/server/services/storage.service";
import type {
  TCreateCategorySchema,
  TCreateSubCategorySchema,
  TUpdateCategorySchema,
  TUpdateSubCategorySchema,
} from "@/lib/schemas/category";
import type { Category, SubCategory } from "prisma/interfaces";
import type { Prisma } from "@prisma/client";
import type { Base64FileInput } from "@/lib/schemas/storage";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
const clean = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined),
  ) as Partial<T>;

async function maybeUpload(file?: Base64FileInput, uploaderId?: string) {
  if (!file) return undefined;
  const [uploaded] = await storageService.upload(db, [file], uploaderId ?? "");
  return uploaded?.id; // <-- use row id
}

/* ------------------------------------------------------------------ */
/*  CategoryService (top-level)                                       */
/* ------------------------------------------------------------------ */
export const CategoryService = {
  ...buildCrudService<TCreateCategorySchema>("category"),

  async create(
    data: TCreateCategorySchema,
    uploaderId?: string,
  ): Promise<Category> {
    const { image, name, slug, description } = data;
    const attachmentId = await maybeUpload(image[0], uploaderId);

    const prismaData: Prisma.CategoryCreateInput = {
      name,
      slug,
      description,
      attachments: {
        connect: {
          id: attachmentId
        }
      }
      // attachments: attachmentId ? { connect: { id: attachmentId } } : undefined,
    };

    return db.category.create({
      data: prismaData,
      include: { subcategories: true },
    });
  },

  async update(
    id: string,
    data: TUpdateCategorySchema & {
      imageFile?: Base64FileInput;
      removeImage?: boolean;
    },
    uploaderId?: string,
  ): Promise<Category> {
    const { imageFile, removeImage, ...fields } = data;
    const newId = await maybeUpload(imageFile, uploaderId);

    if (removeImage) {
      const existing = await db.category.findUnique({
        where: { id },
        select: { attachments: { select: { id: true } } },
      });
      if (existing?.attachments?.id)
        await storageService.remove(db, existing.attachments.id);
    }

    const prismaData: Prisma.CategoryUpdateInput = {
      ...clean(fields),
      attachments: removeImage
        ? { disconnect: true }
        : newId
          ? { connect: { id: newId } }
          : undefined,
    };

    return db.category.update({
      where: { id },
      data: prismaData,
      include: { subcategories: true },
    });
  },

  /* For mega-menu */
  listWithSubcategories(): Promise<
    (Category & { subcategories: SubCategory[] })[]
  > {
    return db.category.findMany({
      orderBy: { name: "asc" },
      include: { subcategories: { orderBy: { name: "asc" } } },
    });
  },
};

export const SubCategoryService = {
  ...buildCrudService<TCreateSubCategorySchema>("subCategory"),

  async create(
    data: {
      name: string;
      slug: string;
      categoryId: string;
      description?: string | null;
      metaTitle?: string | null;
      metaDescription?: string | null;
      imageFile?: Base64FileInput;
    },
    uploaderId?: string,
  ): Promise<SubCategory> {
    const { imageFile, categoryId, name, slug, ...fields } = data;
    const attachmentId = await maybeUpload(imageFile, uploaderId);

    return db.subCategory.create({
      data: {
        name,
        slug,
        ...clean(fields),
        category: { connect: { id: categoryId } },
        attachments: attachmentId
          ? { connect: { id: attachmentId } }
          : undefined,
      },
    });
  },

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      metaTitle?: string | null;
      metaDescription?: string | null;
      imageFile?: Base64FileInput;
      removeImage?: boolean;
      categoryId?: string;
    },
    uploaderId?: string,
  ): Promise<SubCategory> {
    const { imageFile, removeImage, categoryId, ...fields } = data;
    const newId = await maybeUpload(imageFile, uploaderId);

    if (removeImage) {
      const existing = await db.subCategory.findUnique({
        where: { id },
        select: { attachments: { select: { id: true } } },
      });
      if (existing?.attachments?.id)
        await storageService.remove(db, existing.attachments.id);
    }

    return db.subCategory.update({
      where: { id },
      data: {
        ...clean(fields),
        category:
          categoryId !== undefined
            ? { connect: { id: categoryId } }
            : undefined,
        attachments: removeImage
          ? { disconnect: true }
          : newId
            ? { connect: { id: newId } }
            : undefined,
      },
    });
  },

  listByCategory(categoryId: string): Promise<SubCategory[]> {
    return db.subCategory.findMany({
      where: { categoryId },
      orderBy: { name: "asc" },
    });
  },
};
