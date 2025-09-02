import {
  includeAttachmentsForEntity,
  STORAGE_KEYS,
} from "@/server/services/storage.service";
import { z } from "zod";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  // paginationInput,
} from "@/lib/schemas/category";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from "@/server/services/category.service";
import { TRPCError } from "@trpc/server";
import { paginationFilterSchema } from "@/lib/schemas/filters";
import { updateProductSchema } from "@/lib/schemas/product";

export const categoryRouter = createTRPCRouter({
  list: adminProcedure
    .input(paginationFilterSchema)
    .query(async ({ input, ctx }) => {
      const data = await listCategories(ctx.db, input);
      return data;
    }),
  listOptions: adminProcedure.query(({ ctx }) => {
    return ctx.db.category.findMany({
      include: {
        _count: true,
      },
    });
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
    .mutation(async ({ input, ctx }) => {
      try {
        const deletedCategory = await deleteCategory(ctx.db, input);

        if (!deletedCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }

        return deletedCategory;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error has occurred",
        });
      }
    }),
  publicList: publicProcedure
    .input(
      paginationFilterSchema.merge(
        z.object({
          hideWithoutImages: z.boolean().optional(),
        }),
      ),
    )
    .query(({ ctx, input }) => listCategories(ctx.db, input ?? undefined)),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
      });
      if (!category) throw new TRPCError({ code: "NOT_FOUND" });
      const withImgs = await includeAttachmentsForEntity(
        ctx.db,
        STORAGE_KEYS.CATEGORY,
        category,
      );
      return withImgs;
    }),

  // update: adminProcedure
  //   .input(
  //     z.object({
  //       id: z.string().uuid(),
  //       data: updateCategorySchema,
  //     }),
  //   )
  //   .mutation(({ input }) => CategoryService.update(input.id, input.data)),
  // delete: adminProcedure
  //   .input(categoryIdSchema)
  //   .mutation(({ input }) => CategoryService.delete(input.id)),
});
