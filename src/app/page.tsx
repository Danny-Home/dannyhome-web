import { HydrateClient } from "@/trpc/server";
import HeroBannerCarousel from "./_components/hero-banner-carousel";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <HeroBannerCarousel />
      </main>
    </HydrateClient>
  );
}
