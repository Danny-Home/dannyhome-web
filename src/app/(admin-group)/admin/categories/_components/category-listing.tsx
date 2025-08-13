
import { searchParamsCache } from "@/lib/searchparams";
import { CategoryTable } from "./category-tables";
import { columns } from "./category-tables/columns";
import { trpc } from "@/trpc/server";
import type { TPaginationFilter } from "@/lib/schemas/filters";

export default async function CategoryListingPage() {
  const page = searchParamsCache.get("page") || 1;
  const pageLimit = searchParamsCache.get("perPage") || 10;

  const filters: TPaginationFilter = {
    page,
    perPage: pageLimit,
    showAll: false,
  };

  const data = await trpc.categories.list(filters);
  const total = data?.total ?? 0;
  const categories = data?.categories;

  return (
    <CategoryTable
      data={categories}
      totalItems={total}
      columns={columns}
    />
  );
}
