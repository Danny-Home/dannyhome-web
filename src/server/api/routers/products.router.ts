import {
  includeAttachments,
  includeAttachmentsForEntity,
  STORAGE_KEYS,
} from "@/server/services/storage.service";
import { z } from "zod";
import { paginationFilterSchema } from "@/lib/schemas/filters";
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from "@/lib/schemas/product";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  searchProducts,
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
  publicList: publicProcedure
    .input(paginationFilterSchema)
    .query(({ ctx, input }) => listProducts(ctx.db, input ?? undefined)),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { slug: input.slug },
      });
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });
      const withImgs = await includeAttachmentsForEntity(
        ctx.db,
        STORAGE_KEYS.PRODUCT,
        product,
      );
      return withImgs;
    }),

  byCategorySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        page: z.number().optional(),
        perPage: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
      });
      if (!category) throw new TRPCError({ code: "NOT_FOUND" });
      const items = await ctx.db.product.findMany({
        where: { categoryId: category.id },
        orderBy: { createdAt: "desc" },
        take: input.perPage ?? 24,
        skip:
          input.page && input.perPage ? (input.page - 1) * input.perPage : 0,
      });
      const products = await includeAttachments(
        ctx.db,
        STORAGE_KEYS.PRODUCT,
        items,
      );
      return { products, page: input.page ?? 1, perPage: input.perPage ?? 24 };
    }),
  recomputeRating: adminProcedure
    .input(productIdSchema)
    .mutation(({ input }) => {
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "This feature was not implemented yet",
      });
    }),
  search: publicProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1).optional(),
          perPage: z.number().min(1).max(48).default(24).optional(),
          q: z.string().optional(),
          categoryIds: z.array(z.string()).optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          inStock: z.boolean().optional(),
          sort: z
            .enum(["newest", "priceAsc", "priceDesc", "rating"])
            .optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => searchProducts(ctx.db, input ?? {})),
});
