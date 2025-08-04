// import type { Order, OrderItem } from "@prisma/client";

import { db } from "@/server/db";
import { buildCrudService } from "@/server/services/base.service";
import type { Order, OrderItem } from "prisma/interfaces";

export const OrderService = {
  ...buildCrudService<Order>("order"),
  createWithItems: async (
    data: Omit<Order, "id" | "createdAt" | "updatedAt"> & {
      items: Omit<OrderItem, "id" | "orderId">[];
    },
  ) =>
    db.$transaction(async (tx) => {
      const { items, ...orderData } = data;
      const order = await tx.order.create({ data: {...orderData} });
      await tx.orderItem.createMany({
        data: items.map((i) => ({ ...i, orderId: order.id })),
      });
      await Promise.all(
        items.map((i) =>
          tx.productVariant.update({
            where: { id: i.productVariantId },
            data: { stock: { decrement: i.quantity } },
          }),
        ),
      );
      return order;
    }),
};
