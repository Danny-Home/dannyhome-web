// import type { ProductReview } from "@prisma/client";

import { db } from "@/server/db";
import { buildCrudService } from "@/server/services/base.service";
import { ProductService } from "@/server/services/product.service";
import type { ProductReview } from "prisma/interfaces";

export const ProductReviewService = {
  ...buildCrudService<ProductReview>("productReview"),
  approve: async (id: string) => {
    const review = await db.productReview.update({ where: { id }, data: { approved: true } });
    await ProductService.recomputeRating(review.productId as string);
    return review;
  },
};
