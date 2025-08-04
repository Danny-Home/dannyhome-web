import z from "zod";

export const cartItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  currency: z.string(),
});
export type ICartItem = z.infer<typeof cartItemSchema>;

export interface ICart {
  userId: string;
  currency: string;
  items: ICartItem[];
  updatedAt: number;
}
