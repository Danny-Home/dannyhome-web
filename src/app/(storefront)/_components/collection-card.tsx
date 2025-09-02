import Link from "next/link";
import Image from "next/image";

type Attachment = { id: string; url: string };
type Collection = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  attachments?: Attachment[];
};

export default function CollectionCard({ collection }: { collection: Collection }) {
  const img = collection.attachments?.[0]?.url ?? "/placeholder.svg";
  return (
    <Link href={`/collection/${collection.slug}`} className="group block overflow-hidden rounded-xl border">
      <div className="relative aspect-[3/2] w-full">
        <Image src={img} alt={collection.name} fill className="object-cover transition-transform group-hover:scale-105" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute left-4 bottom-4 text-white">
          <h3 className="text-lg font-semibold">{collection.name}</h3>
          {collection.description && <p className="text-xs text-white/80 line-clamp-2">{collection.description}</p>}
        </div>
      </div>
    </Link>
  );
}
