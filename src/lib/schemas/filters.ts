import z from "zod";

export const paginationFilterSchema = z
  .object({
    page: z.number().min(1).default(1),
    perPage: z.number().min(1).max(100).default(20),
    showAll: z.boolean().optional().default(false)
  })

export type TPaginationFilter = z.infer<typeof paginationFilterSchema>;

export const defaultPagination = {
  page: 1,
  perPage: 20,
  showAll: false
}
