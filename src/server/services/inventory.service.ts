import { db } from "@/server/db";
import { buildCrudService } from "@/server/services/base.service";
import type { InventoryStock } from "prisma/interfaces";

export const InventoryStockService = {
  ...buildCrudService<InventoryStock>("inventoryStock"),
  adjustStock: async (
    variantId: string,
    change: number,
    reason: "MANUAL" | "SALE" | "RESTOCK" | "RETURN" | "ADJUSTMENT",
    note?: string,
    userId?: string,
  ) =>
    db.$transaction(async (tx) => {
      const variant = await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: { increment: change } },
      });
      return tx.inventoryStock.create({
        data: {
          productVariantId: variantId,
          change,
          reason,
          snapshotAfter: variant.stock,
          note,
          createdByUserId: userId ?? undefined,
        },
      });
    }),
};
