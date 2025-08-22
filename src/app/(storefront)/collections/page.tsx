import { trpc } from "@/trpc/server";
import CollectionCard from "../_components/collection-card";

export default async function CollectionsPage() {
  const { collections } = await trpc.collections.publicList({ showAll: true, page: 1, perPage: 50 });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Colecciones</h1>
        <p className="text-sm text-muted-foreground">Explora selecciones curadas</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c: any) => (
          <CollectionCard key={c.id} collection={c} />
        ))}
      </div>
    </div>
  );
}
