import { trpc } from "@/trpc/server";
import ProductCard from "../../_components/product-card";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await trpc.categories.bySlug({ slug: params.slug });
  const { products } = await trpc.products.byCategorySlug({ slug: params.slug, page: 1, perPage: 48 });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 rounded-xl bg-muted/40 p-6 text-center">
        <h1 className="text-2xl font-semibold">{(category as any).name}</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
