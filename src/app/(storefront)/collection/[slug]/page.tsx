import { trpc } from "@/trpc/server";
import Image from "next/image";
import ProductCard from "../../_components/product-card";

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = await trpc.collections.bySlug({ slug: params.slug });

  const heroImg = (collection as any).attachments?.[0]?.url ?? "/placeholder.svg";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative h-56 sm:h-72 md:h-96">
          <Image src={heroImg} alt={(collection as any).name} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-6 left-6 text-white max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-semibold">{(collection as any).heroTitle ?? (collection as any).name}</h1>
            {(collection as any).heroSubtitle && (
              <p className="mt-2 text-white/80">{(collection as any).heroSubtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {(collection as any).products?.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
