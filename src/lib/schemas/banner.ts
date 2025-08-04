import z from "zod";
import { BannerPosEnum } from "./enums";
import { base64FileInput } from "./product";

export const createBannerSchema = z.object({
  title: z.string().optional(),
  image: z.array(base64FileInput),
  linkUrl: z.string().url().optional(),
  position: BannerPosEnum.default("HERO"),
  order: z.number().int().nonnegative().default(0),
  startsAt: z.date().optional(),
  endsAt: z.date().optional(),
  active: z.boolean().default(true),
});
export const updateBannerSchema = createBannerSchema.partial();
export const bannerIdSchema = z.object({ id: z.string().uuid() });

export type TCreateBannerSchema = z.infer<typeof createBannerSchema>;
export type TUpdateBannerSchema = z.infer<typeof updateBannerSchema>;
