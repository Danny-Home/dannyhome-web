'use client';

import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import FiltersSidebar, { type CatalogFilters } from "./filters-sidebar";
import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Category = { id: string; name: string; slug: string };

export default function CatalogClient({ initialProducts, categories }: { initialProducts: any[]; categories: Category[] }) {
  const [filters, setFilters] = useState<CatalogFilters>({ categoryIds: [], minPrice: 0, maxPrice: 3000, inStock: false });
  const [sort, setSort] = useState<"newest" | "priceAsc" | "priceDesc" | "rating">("newest");

  const queryInput = useMemo(() => ({
    page: 1, perPage: 48,
    categoryIds: filters.categoryIds.length ? filters.categoryIds : undefined,
    minPrice: filters.minPrice, maxPrice: filters.maxPrice,
    inStock: filters.inStock,
    sort
  }), [filters, sort]);

  const q = api.products.search.useQuery(queryInput, {
    placeholderData: { products: initialProducts, page: 1, perPage: 48, total: initialProducts.length },

  });

  const products = q.data?.products ?? initialProducts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Desktop sidebar */}
      <div className="hidden md:block md:col-span-3">
        <FiltersSidebar categories={categories} value={filters} onChange={setFilters} />
      </div>

      <div className="md:col-span-9">
        {/* Controls row */}
        <div className="mb-4 flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">Filtros</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[420px]">
              <SheetHeader><SheetTitle>Filtros</SheetTitle></SheetHeader>
              <div className="mt-4">
                <FiltersSidebar categories={categories} value={filters} onChange={setFilters} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Ordenar</span>
            <Select value={sort} onValueChange={(v) => setSort(v as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Novedades</SelectItem>
                <SelectItem value="priceAsc">Precio: menor a mayor</SelectItem>
                <SelectItem value="priceDesc">Precio: mayor a menor</SelectItem>
                <SelectItem value="rating">Mejor valorados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
