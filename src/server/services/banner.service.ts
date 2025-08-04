import type { TCreateBannerSchema } from "@/lib/schemas/banner";
import { buildCrudService } from "@/server/services/base.service";

export const BannerService = buildCrudService<TCreateBannerSchema>("banner");
