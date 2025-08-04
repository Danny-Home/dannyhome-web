import "server-only";

import { buildCrudService } from "@/server/services/base.service";
import { db } from "@/server/db";
import {
  storageService,
  type UploadedFileMeta,
} from "@/server/services/storage.service";
import type {
  TCreateProductSchema,
  TProductVariantSchema,
  TUpdateProductSchema,
} from "@/lib/schemas/product";
import type { Product } from "prisma/interfaces";


const clean = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as
    T;

export const ProductService = {
  ...buildCrudService<TCreateProductSchema>("product"),

  async create(
    data: TCreateProductSchema,
    uploaderId: string,
  ): Promise<Product> {
    const { attachments, variants, ...scalar } = data;

    const uploaded =
      attachments?.length
        ? await storageService.upload(db, attachments, uploaderId)
        : [];

    const product = await db.product.create({
      data: clean({ ...scalar }),
    });

    if (uploaded.length) {
      await db.product.update({
        where: { id: product.id },
        data: {
          attachments: {
            connect: uploaded.map(({ key }) => ({ key })),
          },
        },
      });
    }

    if (variants?.length) {
      await db.productVariant.createMany({
        data: variants.map((v) => ({ ...v, productId: product.id })),
      });
    }

    return product;
  },

  async update(
    productId: string,
    data: TUpdateProductSchema,
    userId: string,
  ): Promise<Product> {
    const {
      newAttachments,
      removeKeys,
      variants,
      ...scalar
    } = data;

    const uploaded =
      newAttachments?.length
        ? await storageService.upload(db, newAttachments, userId)
        : [];

    if (removeKeys?.length) {
      await db.product.update({
        where: { id: productId },
        data: {
          attachments: {
            disconnect: removeKeys.map((key) => ({ key })),
          },
        },
      });
      await Promise.all(
        removeKeys.map((key) => storageService.remove(db, key)),
      );
    }

    const cleanedScalar = Object.fromEntries(
      Object.entries(scalar).filter(([, v]) => v !== undefined)
    );
    const product = await db.product.update({
      where: { id: productId },
      data: cleanedScalar,
    });

    if (uploaded.length) {
      await db.product.update({
        where: { id: productId },
        data: {
          attachments: {
            connect: uploaded.map(({ key }) => ({ key })),
          },
        },
      });
    }


    return product;
  },

  addVariants(productId: string, variants: TProductVariantSchema[]) {
    return db.productVariant.createMany({
      data: variants.map((v) => ({ ...v, productId })),
    });
  },

  removeVariant(variantId: string) {
    return db.productVariant.delete({ where: { id: variantId } });
  },

  async recomputeRating(productId: string): Promise<Product> {
    const agg = await db.productReview.aggregate({
      where: { productId, approved: true },
      _avg:   { rating: true },
      _count: { rating: true },
    });

    return db.product.update({
      where: { id: productId },
      data: {
        ratingAvg:   agg._avg.rating   ?? 0,
        ratingCount: agg._count.rating,
      },
    });
  },

  async deleteWithMedia(productId: string) {
    const product = await db.product.findUnique({
      where:  { id: productId },
      select: { attachments: { select: { key: true, url: true, mimeType: true, size: true } } },
    });
    if (!product) throw new Error("Product not found");

    await db.product.delete({ where: { id: productId } });

    await Promise.all(
      product.attachments.map((a: UploadedFileMeta) =>
        storageService.remove(db, a.key),
      ),
    );

    return { deleted: true, id: productId } as const;
  },
};
