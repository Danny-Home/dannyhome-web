'use client';
import { useState } from "react";

const items = [
  { q: "¿Cómo funcionan los envíos?", a: "Enviamos a todo el país con seguimiento." },
  { q: "¿Puedo devolver un producto?", a: "Sí, dentro de 7 días hábiles según políticas." },
  { q: "¿Qué métodos de pago aceptan?", a: "Tarjetas, transferencias y más." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y rounded-xl border">
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="font-medium">{it.q}</span>
            <span className="text-xl">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{it.a}</p>}
        </div>
      ))}
    </div>
  );
}