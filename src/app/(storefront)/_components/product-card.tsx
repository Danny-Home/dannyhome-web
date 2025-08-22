'use client'

import Link from "next/link";
import Image from "next/image";
import { IconHeart } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

type Attachment = { id: string; url: string; width?: number; height?: number; mimeType?: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  attachments?: Attachment[];
};

function fmtPrice(v: number) {
  try {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(v);
  } catch {
    return `$${v.toFixed(2)}`;
  }
}


import { api } from '@/trpc/react'
import { toast } from 'sonner'
export default function ProductCard({ product }: { product: Product }) {
  const img = product.attachments?.[0]?.url ?? "/placeholder.svg";
  return (
    <div className="group relative">
      <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
        <Image
          src={img}
          alt={product.name}
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          unoptimized
        />
        <Button variant="secondary"
          aria-label="Wishlist"
          className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-background"
        >
          <IconHeart className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/product/${product.slug}`} className="block truncate text-sm font-medium hover:underline">
            {product.name}
          </Link>
          <p className="text-sm text-muted-foreground">Disponible</p>
        </div>
        <div className="text-sm font-semibold">{fmtPrice(product.price)}</div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Link href={`/product/${product.slug}`} className="rounded-md border px-3 py-2 text-center text-sm hover:bg-accent">
          Ver
        </Link>
        <Button variant="secondary" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
          Añadir
        </Button>
      </div>
    </div>
  );
}
