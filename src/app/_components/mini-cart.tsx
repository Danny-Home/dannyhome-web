'use client'

import { api } from "@/trpc/react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { IconShoppingCart, IconTrash, IconPlus, IconMinus } from "@tabler/icons-react"
import Link from "next/link"
import { useMemo, useState } from "react"

function total(items: { quantity: number; unitPrice: number }[]) {
  return items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
}

export default function MiniCart() {
  const utils = api.useUtils()
  const { data: cart } = api.cart.get.useQuery(undefined, { refetchOnWindowFocus: false })
  const [open, setOpen] = useState(false)

  const subtotal = useMemo(() => total(cart?.items ?? []), [cart])

  const add = api.cart.addItem.useMutation({ onSuccess: () => utils.cart.get.invalidate() })
  const setQty = api.cart.updateQty.useMutation({ onSuccess: () => utils.cart.get.invalidate() })
  const remove = api.cart.removeItem.useMutation({ onSuccess: () => utils.cart.get.invalidate() })
  const clear = api.cart.clear.useMutation({ onSuccess: () => utils.cart.get.invalidate() })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open cart">
          <IconShoppingCart />
          {cart && cart.items.length > 0 && (
            <span className="ml-1 rounded bg-primary px-1.5 text-xs text-primary-foreground">{cart.items.length}</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[420px] p-0">
        <SheetHeader className="p-4">
          <SheetTitle>Tu carrito</SheetTitle>
        </SheetHeader>
        <Separator />
        <ScrollArea className="h-[calc(100dvh-220px)] p-4">
          <div className="space-y-4">
            {(cart?.items ?? []).map((it) => (
              <div key={it.variantId} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <div className="font-medium text-sm">{it.variantId.slice(0,8)}</div>
                  <div className="text-xs text-muted-foreground">{new Intl.NumberFormat('es-ES',{style:'currency',currency:it.currency}).format(it.unitPrice)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" onClick={() => setQty.mutate({ variantId: it.variantId, quantity: Math.max(1, it.quantity - 1) })}><IconMinus size={16} /></Button>
                  <div className="w-8 text-center text-sm">{it.quantity}</div>
                  <Button size="icon" variant="outline" onClick={() => setQty.mutate({ variantId: it.variantId, quantity: it.quantity + 1 })}><IconPlus size={16} /></Button>
                  <Button size="icon" variant="destructive" onClick={() => remove.mutate({ variantId: it.variantId })}><IconTrash size={16} /></Button>
                </div>
              </div>
            ))}
            {cart?.items?.length === 0 && <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>}
          </div>
        </ScrollArea>
        <Separator />
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">{new Intl.NumberFormat('es-ES',{style:'currency',currency:cart?.currency ?? 'BRL'}).format(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" onClick={() => clear.mutate()}>Vaciar</Button>
            <Button asChild className="flex-1" onClick={() => setOpen(false)}>
              <Link href="/cart">Ir al carrito</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
