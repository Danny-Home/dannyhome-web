import Image from "next/image";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";
import ProductCarousel from "../../_components/product-carousel";
import AddToCart from "../../_components/add-to-cart";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await trpc.products.bySlug({ slug: params.slug }).catch(() => null);
  if (!product) return notFound();

  const imgs = (product as any).attachments ?? [];
  const img = imgs[0]?.url ?? "/placeholder.svg";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
            <Image src={img} alt={(product as any).name} width={900} height={900} className="h-full w-full object-cover" unoptimized />
          </div>
          {imgs.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {imgs.slice(0,8).map((a: any) => (
                <Image key={a.id} src={a.url} alt="" width={200} height={200} className="aspect-square rounded-md object-cover" unoptimized />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{(product as any).name}</h1>
            <p className="mt-2 text-xl font-bold">
              {new Intl.NumberFormat("es-ES", { style: "currency", currency: "BRL" }).format(Number((product as any).price))}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">{(product as any).description ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae nulla nec urna vulputate gravida."}</p>

          <div className="grid grid-cols-2 gap-3">
            {/* @ts-expect-error Server/Client boundary */}
            <AddToCart id={(product as any).id} price={Number((product as any).price)} />
            <button className="rounded-md border px-4 py-2 text-sm">Comprar ahora</button>
          </div>

          <Accordion type="single" collapsible className="w-full rounded-xl border p-2">
            <AccordionItem value="details">
              <AccordionTrigger>Detalles</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ac lectus magna. Suspendisse potenti.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="dimensions">
              <AccordionTrigger>Dimensiones</AccordionTrigger>
              <AccordionContent>
                Alto: 80cm, Ancho: 60cm, Profundidad: 40cm. Peso: 7kg. Materiales: madera y acero.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Envío y devoluciones</AccordionTrigger>
              <AccordionContent>
                Envíos en 24-72h. Devoluciones en 30 días. Lorem ipsum dolor sit amet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger>Cuidado del producto</AccordionTrigger>
              <AccordionContent>
                Limpiar con un paño húmedo. Evitar productos abrasivos. Lorem ipsum dolor sit amet.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="mt-12 space-y-10">
        <ProductCarousel title="También te puede gustar" products={[(await trpc.products.publicList({ page: 1, perPage: 10 })).products].flat() as any[]} />
        <ProductCarousel title="Vistos recientemente" products={[(await trpc.products.publicList({ page: 1, perPage: 10 })).products].flat() as any[]} />
      </div>
    </div>
  );
}
