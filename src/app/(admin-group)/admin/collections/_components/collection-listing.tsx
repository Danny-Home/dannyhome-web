import CollectionCard from "@/app/(admin-group)/admin/collections/_components/collection-card";
import { searchParamsCache } from "@/lib/searchparams";
import { trpc } from "@/trpc/server";
import React from "react";

async function CollectionListing() {
  const isActive = searchParamsCache.get("active") ?? undefined;
  const search = searchParamsCache.get("name");

  const collectionsData = await trpc.collections.list({
    active: isActive,
  });

  const count = collectionsData.total;

  return (
    <div className="flex w-full flex-wrap items-center justify-start gap-4">
      {collectionsData.collections.map((c) => (
        <CollectionCard key={c.id} collection={c} />
      ))}
      {count === 0 && <div>No collections found</div>}
    </div>
  );
}

export default CollectionListing;
