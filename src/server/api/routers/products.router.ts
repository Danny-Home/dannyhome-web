import { paginationFilterSchema } from "@/lib/schemas/filters";
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from "@/lib/schemas/product";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "@/server/services/product.service";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  list: adminProcedure
    .input(paginationFilterSchema)
    .query(async ({ input, ctx }) => {
      try {
        return await listProducts(ctx.db, input);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch products",
        });
      }
    }),

  byId: adminProcedure.input(productIdSchema).query(async ({ input, ctx }) => {
    try {
      const product = await getProductById(ctx.db, input);

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return product;
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch product",
      });
    }
  }),

  create: adminProcedure
    .input(createProductSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await createProduct(ctx.db, input);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product",
        });
      }
    }),

  update: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await updateProduct(ctx.db, input);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update",
        });
      }
    }),

  delete: adminProcedure
    .input(productIdSchema)
    .mutation(async ({ input, ctx }) => {
      const product = await deleteProduct(ctx.db, input);

      if (!product)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });

      return product;
    }),

  recomputeRating: adminProcedure
    .input(productIdSchema)
    .mutation(({ input }) => {
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "This feature was not implemented yet",
      });
    }),
});
