import {
  createCategorySchema,
  categoryIdSchema,
} from "@/lib/schemas/category";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { paginationInput } from "@/lib/schemas/common";
import {  createCategory, getCategoryById, listCategories } from "@/server/services/category.service";
import { TRPCError } from "@trpc/server";


export const categoryRouter = createTRPCRouter({
  list: adminProcedure
    .input(paginationInput.optional())
    .query(async ({ input, ctx }) =>{
      return await listCategories(ctx.db, input);
    }
    ),
  listOptions: adminProcedure.query(({ctx}) => {
    return ctx.db.category.findMany({
      include: {
        _count: true
      }
    })
  }),

  byId: adminProcedure
    .input(categoryIdSchema)
    .query(async ({ input, ctx }) => {
      const category = await getCategoryById(ctx.db, input);

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "Category Not found"
        });
      }

      return category;
    }),

  create: adminProcedure
    .input(createCategorySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await createCategory(ctx.db, input);
      } catch (error){
        console.error(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error?.message
        })
      }
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
