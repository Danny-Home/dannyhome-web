'use client'
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";

type Props = {};

type Banner = {
  id: string;
  src: string;
  alt?: string;
  href?: string;
};

interface BannerCarouselProps {
  banners: Banner[];
  height?: number; // px
}


function HeroBannerCarousel({ banners, height = 330 }: BannerCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!api) return;
    setTotal(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const cb = () => setCurrent(api.selectedScrollSnap());
    api.on('select', cb);

    return () => {
      api.off('select', cb);
    };
  }, [api]);

  return (
    <div className="relative w-full overflow-hidden h-[75vh]" >
      <Carousel setApi={setApi} className="h-full">
        <CarouselContent className="h-full">
          {Array.from({length: 3}, (b, idx) => (
            <CarouselItem key={idx} className="relative h-full basis-full">
              {idx}
              {/* {b.href ? (
                <a href={b.href} className="block h-full w-full">
                  <Image src={b.src} alt={b.alt ?? ''} fill sizes="100vw" className="object-cover" />
                </a>
              ) : (
                <Image src={b.src} alt={b.alt ?? ''} fill sizes="100vw" className="object-cover" />
              )} */}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* arrow buttons */}
        <CarouselPrevious className="-translate-y-1/2 left-4 top-1/2" />
        <CarouselNext className="-translate-y-1/2 right-4 top-1/2" />
      </Carousel>

      {/* dot indicators using api state */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-3 w-3 rounded-full transition-colors ${
              current === i ? 'bg-primary' : 'bg-neutral-400/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBannerCarousel;
