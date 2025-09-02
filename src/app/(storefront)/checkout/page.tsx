'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { api } from "@/trpc/react"
import { toast } from "sonner"

export default function CheckoutPage(){
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <form className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Nombre" />
            <Input placeholder="Apellido" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Teléfono" />
            <Input placeholder="Dirección" className="md:col-span-2" />
            <Input placeholder="Ciudad" />
            <Input placeholder="Código postal" />
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Método de pago</h3>
            <p className="text-sm text-muted-foreground">Stripe se integra aquí.</p>
          </div>
          <Button type="submit">Pagar</Button>
        </form>
        <div className="md:col-span-1">
          <div className="rounded-xl border p-4">
            <h2 className="font-medium">Resumen</h2>
            <p className="text-sm text-muted-foreground">Se calcula desde el carrito.</p>
          </div>
          <Button asChild variant="ghost" className="w-full mt-3"><Link href="/cart">Volver al carrito</Link></Button>
        
          <Button type="button" className="w-full mt-3" onClick={async ()=>{
            try{
              const res = await api.orders.buildWhatsappLink.fetch({});
              if (!res.phoneSet) { toast("Configura NEXT_PUBLIC_WHATSAPP_PHONE"); }
              window.open(res.url,'_blank');
            }catch(e){ toast("No se pudo generar el enlace"); }
          }}>Enviar pedido por WhatsApp</Button>
    
        </div>
      </div>
    </div>
  )
}
