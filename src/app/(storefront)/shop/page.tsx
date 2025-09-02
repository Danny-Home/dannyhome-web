import CatalogClient from "../_components/catalog-client";
import { trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { storefrontSearchParamsCache, storefrontSerialize } from "@/lib/storefront-searchparams";
import Link from "next/link";

function mergeAndSerialize(searchParams: Record<string, any>, patch: Record<string, any>) {
  const next = { ...searchParams, ...patch };
  // unset undefined to avoid stray keys
  Object.keys(next).forEach((k) => next[k] === undefined && delete next[k]);
  return "?" + storefrontSerialize(next);
}

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const parsed = storefrontSearchParamsCache.parse(searchParams);
  const input = {
    page: parsed.page,
    perPage: parsed.perPage,
    q: parsed.q,
    categoryIds: parsed.category ? parsed.category : undefined,
    minPrice: parsed.min,
    maxPrice: parsed.max,
    inStock: parsed.stock,
    sort: parsed.sort,
  };

  const [{ products, total, page, perPage }, { categories }] = await Promise.all([
    trpc.products.search(input),
    trpc.categories.publicList({ showAll: true, page: 1, perPage: 40 }),
  ]);

  const pageCount = Math.max(1, Math.ceil((total || 0) / perPage));
  const prevHref = page > 1 ? mergeAndSerialize(searchParams as any, { page: page - 1 }) : null;
  const nextHref = page < pageCount ? mergeAndSerialize(searchParams as any, { page: page + 1 }) : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 rounded-xl bg-muted/40 p-6 text-center">
        <h1 className="text-2xl font-semibold">Catálogo</h1>
        <p className="mt-2 text-muted-foreground">Encuentra tu próximo favorito</p>
      </div>

      <CatalogClient
        initialProducts={products as any[]}
        categories={categories as any[]}
        initialTotal={total}
        initialPage={page}
        initialPerPage={perPage}
      />

      {/* Server-side pagination */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <Link
          href={prevHref ?? "#"}
          aria-disabled={!prevHref}
          className={`px-3 py-1.5 rounded-md border text-sm ${prevHref ? "hover:bg-muted" : "opacity-50 pointer-events-none"}`}
        >
          Anterior
        </Link>
        <span className="text-sm">Página {page} de {pageCount}</span>
        <Link
          href={nextHref ?? "#"}
          aria-disabled={!nextHref}
          className={`px-3 py-1.5 rounded-md border text-sm ${nextHref ? "hover:bg-muted" : "opacity-50 pointer-events-none"}`}
        >
          Siguiente
        </Link>
      </div>
    </div>
  );
}
