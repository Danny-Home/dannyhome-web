import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { CartService } from "@/server/services/cart.service";

function effectiveCartId(ctx: any): string {
  const uid = ctx.session?.user?.id;
  if (uid) return uid;
  const header = ctx.headers.get("x-cart-id") || "";
  if (!header) throw new Error("MISSING_CART_ID");
  return header;
}

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? process.env.WHATSAPP_PHONE ?? "";

/** Build a WhatsApp order link from current cart. No prices included. */
export const ordersRouter = createTRPCRouter({
  buildWhatsappLink: publicProcedure
    .input(z.object({
      customerName: z.string().optional(),
      note: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const id = effectiveCartId(ctx);
      const cart = await CartService.get(id);

      // Fetch product names for each variantId; current implementation uses product.id as variantId
      const ids = [...new Set(cart.items.map(i => i.variantId))];
      const products = await ctx.db.product.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, slug: true } });
      const map = new Map(products.map(p => [p.id, p]));

      const lines = cart.items.map(i => {
        const p = map.get(i.variantId);
        const name = p?.name ?? `Producto ${i.variantId.slice(0,8)}`;
        return `• ${name} x${i.quantity}`;
      });

      const head = `Nuevo pedido vía web`;
      const who = input?.customerName ? `
Cliente: ${input.customerName}` : "";
      const note = input?.note ? `
Nota: ${input.note}` : "";
      const body = lines.length ? `

Items:
${lines.join("\n")}` : `

Items: (vacío)`;
      const msg = `${head}${who}${note}${body}`;

      const phone = PHONE;
      const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;

      return { message: msg, url, phoneSet: !!phone };
    }),
});
