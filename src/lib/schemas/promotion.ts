import { z } from "zod";
import { PromoTypeEnum, DiscountTypeEnum } from "./enums";

export const createPromotionSchema = z.object({
  name: z.string().min(2),
  code: z.string().max(32).optional(),
  type: PromoTypeEnum,
  discountType: DiscountTypeEnum.default("PERCENT"),
  value: z.preprocess((v) => parseFloat(v as string), z.number().positive()),
  maxUses: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().optional(),
  startsAt: z.date(),
  endsAt: z.date(),
  active: z.boolean().default(true),
  productIds: z.array(z.string().uuid()).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});
export const updatePromotionSchema = createPromotionSchema.partial();
export const promotionIdSchema = z.object({ id: z.string().uuid() });


export type TCreatePromotionSchema = z.infer<typeof createPromotionSchema>;
export type TUpdatePromotionSchema = z.infer<typeof updatePromotionSchema>
