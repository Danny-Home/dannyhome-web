import { type Product } from "@/constants/data";
import { fakeProducts } from "@/constants/mock-api";
import { searchParamsCache } from "@/lib/searchparams";
import { ProductTable } from "./product-tables";
import { columns } from "./product-tables/columns";
import { trpc } from "@/trpc/server";

export default async function ProductListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const categories = searchParamsCache.get("category");

  const filters = {
    page,
    perPage: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories }),
  };

  const data = await trpc.products.list(filters);
  const totalProducts = data.products.length;
  const products = data.products;

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
