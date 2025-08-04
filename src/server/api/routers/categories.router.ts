import { z } from "zod";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  // paginationInput,
} from "@/lib/schemas/category";
// import { CategoryService } from "@/server/services";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { paginationInput } from "@/lib/schemas/common";
import { CategoryService } from "@/server/services/category.service";


export const categoryRouter = createTRPCRouter({
  list: adminProcedure
    .input(paginationInput.optional())
    .query(({ input }) =>
      CategoryService.list(input ?? { page: 1, perPage: 20 }),
    ),

  tree: adminProcedure.query(() => CategoryService.listWithChildren()),
  listOptions: adminProcedure.query(({ctx}) => {
    return ctx.db.category.findMany({
      include: {
        _count: true
      }
    })
  }),

  byId: adminProcedure
    .input(categoryIdSchema)
    .query(({ input }) => CategoryService.byId(input.id)),

  create: adminProcedure
    .input(createCategorySchema)
    .mutation(({ input }) => CategoryService.create(input)),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: updateCategorySchema,
      }),
    )
    .mutation(({ input }) => CategoryService.update(input.id, input.data)),
  delete: adminProcedure
    .input(categoryIdSchema)
    .mutation(({ input }) => CategoryService.delete(input.id)),
});
