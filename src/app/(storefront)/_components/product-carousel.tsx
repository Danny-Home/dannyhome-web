'use client';

import { useRef } from "react";
import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type Props = {
  title: string;
  products: any[];
};

export default function ProductCarousel({ title, products }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  function slide(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * (w - 120), behavior: "smooth" });
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <div className="hidden sm:flex gap-2">
          <Button variant="outline" size="icon" onClick={() => slide(-1)} aria-label="Anterior">
            <IconChevronLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={() => slide(1)} aria-label="Siguiente">
            <IconChevronRight />
          </Button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-4 sm:gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          <div key={p.id} className="w-[240px] sm:w-[260px] md:w-[280px] shrink-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
