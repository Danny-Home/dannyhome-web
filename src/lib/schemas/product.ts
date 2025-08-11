import { z } from "zod";

export const base64FileInput = z.object({
  name: z.string(),
  type: z.string(),
  data: z.string(), // Base64 from FileReader
});
export type Base64FileInput = z.infer<typeof base64FileInput>;

export const createProductSchema = z
  .object({
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    stock: z.number().default(0),
    subCategoryId: z.string().uuid(),
    sku: z.string(),
    images: z.array(base64FileInput).optional(),
  })
  .strict();

export const updateProductSchema = z.object({
  id: z.string().uuid(),
  data: createProductSchema.partial(),
});

export const productIdSchema = z.object({ id: z.string().uuid() });

export type TCreateProductSchema = z.infer<typeof createProductSchema>;
export type TUpdateProductSchema = z.infer<typeof updateProductSchema>;
export type TProductId = z.infer<typeof productIdSchema>;
export type TBase64FileInput = Base64FileInput;
