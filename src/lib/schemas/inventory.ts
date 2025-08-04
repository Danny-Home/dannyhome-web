import z from "zod";
import { StockReasonEnum } from "./enums";
export const adjustStockSchema = z.object({
  variantId: z.string().uuid(),
  change: z.number().int(),
  reason: StockReasonEnum,
  note: z.string().optional(),
  userId: z.string().uuid().optional(),
});

export type TAdjustStockSchema = z.infer<typeof adjustStockSchema>
