'use client'
import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AddToCart({ id, price }: { id: string; price: number }){
  const m = api.cart.addItem.useMutation({ onSuccess(){ toast('Añadido al carrito') }})
  return (
    <Button onClick={() => m.mutate({ variantId: id as any, quantity: 1, unitPrice: price, currency: 'BRL' })} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
      Añadir al carrito
    </Button>
  )
}
