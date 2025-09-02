import z from "zod";
import { base64FileInput } from "./product";

export const collectionIdSchema = z.object({ id: z.string().uuid() });
export type TCollectionId = z.infer<typeof collectionIdSchema>;

export const createCollectionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  active: z.boolean().default(true),
  images: z.array(base64FileInput).optional(),
  productIds: z.array(z.string().uuid()).optional(),
});
export type TCreateCollection = z.infer<typeof createCollectionSchema>;

export const updateCollectionSchema = z.object({
  id: z.string().uuid(),
  data: createCollectionSchema.partial(),
});
export type TUpdateCollection = z.infer<typeof updateCollectionSchema>;
