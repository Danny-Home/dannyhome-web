import { z } from "zod";
import { CurrencyEnum } from "./enums";
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;


/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
export const base64FileInput = z.object({
  name: z.string(),
  type: z.string(),
  data: z.string(),       // Base64 from FileReader
});
export type Base64FileInput = z.infer<typeof base64FileInput>;

/* ------------------------------------------------------------------ */
/*  Variant                                                            */
/* ------------------------------------------------------------------ */
export const productVariantInput = z.object({
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  ean: z.string().optional(),

  price: z.preprocess(
    (v) => (typeof v === "string" ? parseFloat(v) : v),
    z.number().positive()
  ),
  currency: CurrencyEnum.default("BRL"),

  stock: z.preprocess(
    (v) => (typeof v === "string" ? parseInt(v) : v),
    z.number().int().nonnegative()
  ).default(0),

  attributes: z.record(z.string()).optional(),

  weightGrams: z.number().int().positive().optional(),
  widthMm:     z.number().int().positive().optional(),
  heightMm:    z.number().int().positive().optional(),
  lengthMm:    z.number().int().positive().optional(),
  active:      z.boolean().default(true),
}).strict();

/* ------------------------------------------------------------------ */
/*  CREATE / UPDATE PRODUCT                                            */
/* ------------------------------------------------------------------ */
export const createProductSchema = z.object({
  name:  z.string().min(2),
  slug:  z.string().regex(slugRegex),
  description:     z.string().optional(),
  richDesc:        z.any().optional(),
  brand:           z.string().optional(),
  metaTitle:       z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  taxable:         z.boolean().default(true),

  /* NEW: product belongs to a sub-category */
  subCategoryId: z.string().uuid({ message: "Invalid sub-category id" }),

  /* Pricing */
  defaultPrice: z.preprocess(
    (v) => (typeof v === "string" ? parseFloat(v) : v),
    z.number().positive()
  ),
  currency: CurrencyEnum.default("BRL"),
  active:   z.boolean().default(true),

  /* Attachments (image uploads) */
  attachments: z.array(base64FileInput).optional(),

  /* Variants */
  variants: z.array(productVariantInput).optional(),
}).strict();

export const updateProductSchema = createProductSchema.partial().extend({
  /* for PATCH we allow these convenience props */
  newAttachments: z.array(base64FileInput).optional(),
  removeKeys:     z.array(z.string()).optional(),
});

export const productIdSchema = z.object({ id: z.string().uuid() });

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
export type TCreateProductSchema   = z.infer<typeof createProductSchema>;
export type TUpdateProductSchema   = z.infer<typeof updateProductSchema>;
export type TProductVariantSchema  = z.infer<typeof productVariantInput>;
export type TBase64FileInput       = Base64FileInput;
