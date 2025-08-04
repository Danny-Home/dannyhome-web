import type { TProductVariantSchema } from "@/lib/schemas/product";
import { buildCrudService } from "@/server/services/base.service";

export const ProductVariantService = buildCrudService<TProductVariantSchema>("productVariant");
