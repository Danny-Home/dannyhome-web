'use client'

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function money(v: number, c = "BRL") {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: c }).format(v);
}

export default function CartPage() {
  const utils = api.useUtils();
  const { data: cart } = api.cart.get.useQuery(undefined, { refetchOnWindowFocus: false });
  const setQty = api.cart.updateQty.useMutation({ onSuccess: () => utils.cart.get.invalidate() });
  const remove = api.cart.removeItem.useMutation({ onSuccess: () => utils.cart.get.invalidate() });
  const clear = api.cart.clear.useMutation({ onSuccess: () => utils.cart.get.invalidate() });

  const [code, setCode] = useState("");
  const subtotal = useMemo(() => (cart?.items ?? []).reduce((s, i) => s + i.unitPrice * i.quantity, 0), [cart]);
  const discount = 0; // placeholder until promo wired to server
  const total = subtotal - discount;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold">Tu carrito</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {(cart?.items ?? []).map((it) => (
            <div key={it.variantId} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium text-sm">Producto {it.variantId.slice(0,8)}</div>
                <div className="text-xs text-muted-foreground">{money(it.unitPrice, it.currency)}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => setQty.mutate({ variantId: it.variantId, quantity: Math.max(1, it.quantity - 1) })}><IconMinus size={16} /></Button>
                <div className="w-8 text-center text-sm">{it.quantity}</div>
                <Button size="icon" variant="outline" onClick={() => setQty.mutate({ variantId: it.variantId, quantity: it.quantity + 1 })}><IconPlus size={16} /></Button>
                <Button size="icon" variant="destructive" onClick={() => remove.mutate({ variantId: it.variantId })}><IconTrash size={16} /></Button>
              </div>
            </div>
          ))}
          {(cart?.items?.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>}
          {cart && cart.items.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => clear.mutate()}>Vaciar carrito</Button>
            </div>
          )}
        </div>

        <div className="md:col-span-1 space-y-4">
          <div className="rounded-xl border p-4 space-y-3">
            <h2 className="font-medium">Resumen</h2>
            <div className="flex items-center justify-between text-sm"><span>Subtotal</span><span>{money(subtotal, cart?.currency)}</span></div>
            <div className="flex items-center justify-between text-sm"><span>Descuento</span><span>-{money(discount, cart?.currency)}</span></div>
            <Separator />
            <div className="flex items-center justify-between font-semibold"><span>Total</span><span>{money(total, cart?.currency)}</span></div>
            <Button asChild className="w-full mt-2"><Link href="/checkout">Proceder al pago</Link></Button>
          </div>

          <div className="rounded-xl border p-4 space-y-2">
            <h3 className="text-sm font-medium">Código promocional</h3>
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PROMO2025" />
              <Button variant="secondary">Aplicar</Button>
            </div>
            <p className="text-xs text-muted-foreground">Soporte del cupón se conectará a promociones.</p>

          <Button className="w-full" onClick={async () => {
            try {
              const res = await api.orders.buildWhatsappLink.fetch({});
              if (!res.phoneSet) {
                toast("Configura NEXT_PUBLIC_WHATSAPP_PHONE en el entorno");
              }
              window.open(res.url, '_blank');
            } catch (e) {
              toast("No se pudo generar el enlace de WhatsApp");
            }
          }}>Enviar pedido por WhatsApp</Button>

        </div>
      </div>
    </div>
  );
}
