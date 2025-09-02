import Link from "next/link";
import Image from "next/image";
import type { Category } from "prisma/interfaces";
import type { WithImages } from "@/types/entities";

type Props = {
  category: WithImages<Category>;
}

export default function CategoryCard({ category }: Props) {
  const img = category.attachments?.[0]?.url ?? '/placeholder-image.png';

  return (
    <Link href={`/category/${category.slug}`} className="group relative block overflow-hidden rounded-lg">
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={img}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 16vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-white">
          <h3 className="text-sm md:text-base font-medium">{category.name}</h3>
          <span className="text-xs text-white/80">Ver</span>
        </div>
      </div>
    </Link>
  );
}
