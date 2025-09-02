export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <header className="rounded-xl bg-muted/40 p-8 text-center">
        <h1 className="text-2xl font-semibold">Contacto</h1>
        <p className="mt-2 text-muted-foreground">Estamos para ayudarte</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h3 className="font-medium">Email</h3>
          <p className="mt-1 text-sm text-muted-foreground">soporte@dannyhome.co</p>
        </div>
        <div className="rounded-xl border p-6">
          <h3 className="font-medium">Teléfono</h3>
          <p className="mt-1 text-sm text-muted-foreground">+34 600 000 000</p>
        </div>
        <div className="rounded-xl border p-6">
          <h3 className="font-medium">Horario</h3>
          <p className="mt-1 text-sm text-muted-foreground">Lun a Vie 9:00 a 18:00</p>
        </div>
      </div>

      <div className="rounded-xl border p-2 md:p-4">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
          <iframe
            className="h-full w-full"
            src="https://maps.google.com/maps?q=Barcelona&t=&z=13&ie=UTF8&iwloc=&output=embed"
          />
        </div>
      </div>
    </div>
  );
}