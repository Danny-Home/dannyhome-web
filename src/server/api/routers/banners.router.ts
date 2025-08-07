import { createBannerSchema, updateBannerSchema } from "@/lib/schemas/banner";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { storageService } from "@/server/services/storage.service";

import { TRPCError } from "@trpc/server";
import type { Base64FileInput, UploadedFileMeta } from "@/lib/schemas/storage";
import type { PrismaClient } from "@prisma/client";
import z from "zod";

async function maybeUpload(
  db: PrismaClient,
  file?: Base64FileInput,
  uploaderId?: string,
) {
  if (!file) return undefined;
  const [uploaded] = await storageService.upload(db, [file], uploaderId ?? "");
  return uploaded?.id; // <-- use row id
}

export const bannersRouter = createTRPCRouter({
  list: adminProcedure
  .input(z.object({ type: z.enum(['HERO', 'PROMO']).optional() }))
  .query(async ({ ctx, input }) => {
    return await ctx.db.banner.findMany({
      where: {
        position: input.type
      }
    });
  }),
  listActive: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.banner.findMany({
      include: {
        attachment: true,
      },
      where: {
        active: true,
      },
    });
  }),
  update: adminProcedure
    .input(updateBannerSchema)
    .mutation(async ({ ctx, input }) => {
      const { image, ...data } = input;
      const [uploadedImage] = await maybeUpload(ctx.db, [image]);
    }),
  createBanner: adminProcedure
    .input(createBannerSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.image)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Image is missing...",
        });

      const { image, ...values} = input;

      return await ctx.db.banner.create({
        data: {
          ...values,
          attachment: JSON.stringify(image[0])
        },
      });
    }),
});
