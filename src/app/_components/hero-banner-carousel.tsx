'use client'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type Banner = {
  id: string
  title?: string | null
  linkUrl?: string | null
  imageUrl?: string | null; attachments?: { id: string; url: string }[]
}

interface BannerCarouselProps {
  banners?: Banner[]
  height?: number
}

export default function HeroBannerCarousel({ banners = [], height = 520 }: BannerCarouselProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000)
    return () => clearInterval(t)
  }, [banners.length])

  const active = banners[index] ?? null
  console.log(banners);

  return (
    <div className="relative w-screen left-[calc(50%-50vw)] mt-4">
      <div className="relative h-[54dvh] min-h-[360px] md:h-[620px]">
        {banners.map((b, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          >

            <Image
              src={b?.attachments?.[0]?.url ?? '#'}
              alt={b?.title ?? "Banner"}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
              unoptimized
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        <div className="absolute inset-x-4 md:inset-x-8 bottom-8 flex max-w-7xl mx-auto">
          <div className="pointer-events-auto max-w-xl">
            <h2 className="text-2xl md:text-4xl font-semibold text-white">
              {active?.title ?? "Nueva colección para tu hogar"}
            </h2>
            <p className="mt-2 text-white/80 text-sm md:text-base">
              Piezas esenciales con diseño limpio. Calidad que se siente.
            </p>
            <div className="mt-4 flex gap-3">
              <Button asChild size="lg">
                <Link href={active?.linkUrl ?? "/shop"}>Comprar ahora</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Contáctanos</Link>
              </Button>
            </div>
          </div>
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/50"}`}
                aria-label={`Ir al banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
