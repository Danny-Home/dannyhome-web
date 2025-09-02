import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Tienda</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/shop" className="hover:underline">Catálogo</Link></li>
            <li><Link href="/contact" className="hover:underline">Contacto</Link></li>
            <li><Link href="/account" className="hover:underline">Mi cuenta</Link></li>
            <li><Link href="/wishlist" className="hover:underline">Favoritos</Link></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Soporte</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Envíos y devoluciones</li>
            <li>Preguntas frecuentes</li>
            <li>Términos y condiciones</li>
            <li>Privacidad</li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Síguenos</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">TikTok</a></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Boletín</h3>
          <p className="mt-4 text-sm text-muted-foreground">Recibe novedades y ofertas.</p>
          <form className="mt-4 flex gap-2">
            <input type="email" className="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="tu@email.com" />
            <button type="submit" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Unirme</button>
          </form>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} Danny Home. Todos los derechos reservados.</p>
          <p>Diseño renovado.</p>
        </div>
      </div>
    </footer>
  )
}