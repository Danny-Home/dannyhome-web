import { createTRPCRouter, adminProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { createCollection, deleteCollection, getCollectionBySlug, listCollections, updateCollection } from "@/server/services/collection.service";
import { paginationFilterSchema } from "@/lib/schemas/filters";
import { createCollectionSchema, updateCollectionSchema } from "@/lib/schemas/collection";

export const collectionsRouter = createTRPCRouter({
  publicList: publicProcedure.input(paginationFilterSchema).query(({ ctx, input }) => listCollections(ctx.db, input ?? undefined)),
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const c = await getCollectionBySlug(ctx.db, input.slug);
    if (!c) throw new Error("NOT_FOUND");
    return c;
  }),

  create: adminProcedure.input(createCollectionSchema).mutation(({ ctx, input }) => createCollection(ctx.db, input)),
  update: adminProcedure.input(updateCollectionSchema).mutation(({ ctx, input }) => updateCollection(ctx.db, input)),
  delete: adminProcedure.input(z.object({ id: z.string().uuid() })).mutation(({ ctx, input }) => deleteCollection(ctx.db, input)),
});
