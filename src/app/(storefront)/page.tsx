import Link from "next/link";
import { trpc } from "@/trpc/server";

import HeroBannerCarousel from "../_components/hero-banner-carousel";
import AboutSection from "@/app/(storefront)/_components/about";
import CategoryCard from "@/app/(storefront)/_components/category-card";
import CollectionCard from "@/app/(storefront)/_components/collection-card";
import FAQ from "@/app/(storefront)/_components/faq";
import ProductCarousel from "@/app/(storefront)/_components/product-carousel";

export default async function HomePage() {
  const [{ products }, { categories }, banners] = await Promise.all([
    trpc.products.publicList({ page: 1, perPage: 12, showAll: true }),
    trpc.categories.publicList({ showAll: true, page: 1, perPage: 12,  hideWithoutImages: true }),
    trpc.banner.listActive(),
  ]);

  return (
    <>
      <HeroBannerCarousel banners={banners} />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">Explora categorías</h2>
          <Link href="/shop" className="text-sm underline">Ver todo</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {(categories).slice(0, 6).map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
  <div className="flex items-center justify-between">
    <h2 className="text-xl md:text-2xl font-semibold">Colecciones</h2>
    <a href="/collections" className="text-sm underline">Ver todas</a>
  </div>
  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {(await trpc.collections.publicList({ showAll: true, page: 1, perPage: 6 })).collections.map((c: any) => (
      <CollectionCard key={c.id} collection={c} />
    ))}
  </div>
</section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <ProductCarousel title="Destacados" products={products.slice(0, 10) as any[]} />
      </section>

      <section className="w-screen left-[calc(50%-50vw)] relative my-6 md:my-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-background to-primary/10">
            <div className="px-6 md:px-10 py-10 md:py-14 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-semibold">Colección 2025</h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">Diseño atemporal y materiales de calidad.</p>
              <div className="mt-4">
                <Link href="/shop" className="inline-block rounded-md bg-primary px-5 py-2 text-sm text-primary-foreground">Comprar ahora</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
  <div className="flex items-center justify-between">
    <h2 className="text-xl md:text-2xl font-semibold">Colecciones</h2>
    <a href="/collections" className="text-sm underline">Ver todas</a>
  </div>
  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {(await trpc.collections.publicList({ showAll: true, page: 1, perPage: 6 })).collections.map((c: any) => (
      <CollectionCard key={c.id} collection={c} />
    ))}
  </div>
</section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <ProductCarousel title="Novedades" products={products.slice(0, 10) as any[]} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <AboutSection />
        <div className="mt-8">
          <FAQ />
        </div>
      </section>
    </>
  );
}
