import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { storageService } from "@/server/services/storage.service";

export const storageRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(z.object({
      files: z.array(z.object({
        name: z.string(),
        type: z.string(),
        data: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      return storageService.upload(
        ctx.db,
        input.files,
        ctx.session.user.id
      );
    }),

  delete: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return storageService.remove(ctx.db, input.key);
    }),
});
