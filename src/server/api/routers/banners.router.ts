import { createBannerSchema, updateBannerSchema } from "@/lib/schemas/banner";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { storageService } from "@/server/services/storage.service";

import { TRPCError } from "@trpc/server";
import type { Base64FileInput } from "@/lib/schemas/storage";
import type { PrismaClient } from "@prisma/client";

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
  list: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.banner.findMany({
      include: {
        attachment: true,
      },
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
      const attachment = await storageService.upload(ctx.db, input.image);

      if (!attachment?.[0])
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Failed to load image",
        });

      return await ctx.db.banner.create({
        data: {
          ...input,
          attachment: {
            connect: {
              id: attachment[0].id,
            },
          },
        },
      });
    }),
});
