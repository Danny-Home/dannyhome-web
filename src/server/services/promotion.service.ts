import type { TCreatePromotionSchema } from "@/lib/schemas/promotion";
import { db } from "@/server/db";
import { buildCrudService } from "@/server/services/base.service";

export const PromotionService = {
  ...buildCrudService<TCreatePromotionSchema>("promotion"),
  incrementUsage: (id: string, by = 1) => db.promotion.update({ where: { id }, data: { usageCount: { increment: by } } }),
};
