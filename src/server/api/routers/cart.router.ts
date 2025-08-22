import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CartService } from "@/server/services/cart.service";

function effectiveCartId(ctx: any): string {
  const uid = ctx.session?.user?.id;
  if (uid) return uid;
  const header = ctx.headers.get("x-cart-id") || "";
  if (!header) {
    throw new Error("MISSING_CART_ID");
  }
  return header;
}

export const cartRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const id = effectiveCartId(ctx);
    return CartService.get(id);
  }),

  addItem: publicProcedure.input(z.object({
    variantId: z.string().uuid(),
    quantity: z.number().int().positive().default(1),
    unitPrice: z.number().positive(),
    currency: z.string().default("BRL")
  })).mutation(async ({ ctx, input }) => {
    const id = effectiveCartId(ctx);
    return CartService.addItem(id, input);
  }),

  updateQty: publicProcedure.input(z.object({
    variantId: z.string().uuid(),
    quantity: z.number().int().positive()
  })).mutation(async ({ ctx, input }) => {
    const id = effectiveCartId(ctx);
    return CartService.updateQty(id, input.variantId, input.quantity);
  }),

  removeItem: publicProcedure.input(z.object({
    variantId: z.string().uuid()
  })).mutation(async ({ ctx, input }) => {
    const id = effectiveCartId(ctx);
    return CartService.removeItem(id, input.variantId);
  }),

  clear: publicProcedure.mutation(async ({ ctx }) => {
    const id = effectiveCartId(ctx);
    await CartService.clear(id);
    return { ok: true };
  }),
});
