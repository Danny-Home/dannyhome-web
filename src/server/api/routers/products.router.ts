import { paginationInput } from "@/lib/schemas/common";
import {
  createProductSchema,
  productIdSchema,
  productVariantInput,
  updateProductSchema,
} from "@/lib/schemas/product";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { ProductVariantService } from "@/server/services/product-variant.service";
import { ProductService } from "@/server/services/product.service";
import z from "zod";

export const productsRouter = createTRPCRouter({
  list: adminProcedure
    .input(paginationInput.optional())
    .query(({ input }) =>
      ProductService.list(input ?? { page: 1, perPage: 20 }),
    ),

  byId: adminProcedure
    .input(productIdSchema)
    .query(({ input }) => ProductService.byId(input.id)),

  create: adminProcedure
    .input(createProductSchema)
    .mutation(({ input }) => ProductService.create(input)),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: updateProductSchema,
      }),
    )
    .mutation(({ input }) => ProductService.update(input.id, input.data)),

  delete: adminProcedure
    .input(productIdSchema)
    .mutation(({ input }) => ProductService.delete(input.id)),

  recomputeRating: adminProcedure
    .input(productIdSchema)
    .mutation(({ input }) => ProductService.recomputeRating(input.id)),

  addVariant: adminProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        variant: productVariantInput,
      }),
    )
    .mutation(({ input }) =>
      ProductVariantService.create({
        ...input.variant,
        productId: input.productId,
      }),
    ),

  updateVariant: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: productVariantInput.partial(),
      }),
    )
    .mutation(({ input }) =>
      ProductVariantService.update(input.id, input.data),
    ),

  deleteVariant: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ input }) => ProductVariantService.delete(input.id)),
});
