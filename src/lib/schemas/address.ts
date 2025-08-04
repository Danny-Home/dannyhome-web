import z from "zod";

export const createAddressSchema = z.object({
  userId: z.string().uuid().optional(),
  name: z.string().optional(),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});
export const updateAddressSchema = createAddressSchema.partial();
export const addressIdSchema = z.object({ id: z.string().uuid() });
