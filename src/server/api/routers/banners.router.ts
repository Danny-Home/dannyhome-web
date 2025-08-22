import { createBannerSchema, updateBannerSchema } from "@/lib/schemas/banner";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { addAttachmentsToEntity, deleteAttachmentsForEntity, includeAttachments, STORAGE_KEYS } from "@/server/services/storage.service";

export const bannersRouter = createTRPCRouter({
  list: adminProcedure
    .input(z.object({
      page: z.number().optional(),
      perPage: z.number().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { page = 1, perPage = 10 } = input;
      const banners = await ctx.db.banner.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { order: "asc" },
      });
      return includeAttachments(ctx.db, STORAGE_KEYS.BANNER, banners);
    }),
  update: adminProcedure
    .input(updateBannerSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, image, ...data } = input;
      const banner = await ctx.db.banner.update({
        where: { id },
        data,
      });

      if (image && image.length > 0) {
        await deleteAttachmentsForEntity(ctx.db, STORAGE_KEYS.BANNER, banner.id);
        await addAttachmentsToEntity(ctx.db, image, STORAGE_KEYS.BANNER, banner.id);
      }

      return banner;
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const banner = await ctx.db.banner.findUnique({ where: { id } });
      if (!banner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Banner not found",
        });
      }
      await deleteAttachmentsForEntity(ctx.db, STORAGE_KEYS.BANNER, id);
      return ctx.db.banner.delete({ where: { id } });
    }),
  createBanner: adminProcedure
    .input(createBannerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { image, ...data } = input;
        const banner = await ctx.db.banner.create({
          data,
        });

        if (image) {
          const result = await addAttachmentsToEntity(ctx.db, image, STORAGE_KEYS.BANNER, banner.id);

          if (!(result.length > 0)) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to attach image to banner",
            });
          }
        }

        return banner;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create banner",
        });
      }
    }),
  listActive: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const banners = await ctx.db.banner.findMany({
      where: {
        active: true,

      },
      orderBy: { order: "asc" },
    });

    return await includeAttachments(ctx.db, STORAGE_KEYS.BANNER, banners);
  }),
});
