import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { WithImages } from "@/types/entities";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import type { Collection } from "prisma/interfaces";
import React from "react";

type Props = {
  collection: WithImages<Collection>;
};

function CollectionCard({ collection }: Props) {
  return (
    <Card className="w-full max-w-xs hover:shadow-lg">
      <CardContent>
        <div className="relative aspect-[4/5] w-full">
          <div className="absolute top-0 right-0">
            <Badge variant="outline">
              {collection.products?.length ?? 0} products
            </Badge>
            <Badge
              variant={collection.active ? "secondary" : "destructive"}
              className="ml-2"
            >
              {collection.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <Image
            src={collection.attachments?.[0]?.url ?? "/placeholder-image.png"}
            alt={collection.name}
            fill
            sizes="(min-width: 1024px) 16vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" /> */}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col justify-start items-start p-0 space-y-2">
        <h3 className="text-sm font-medium md:text-base">{collection.name}</h3>
        <p className="text-muted-foreground mt-1 text-xs md:text-sm">
          {collection.description
            ? collection.description.length > 100
              ? collection.description.substring(0, 100) + "..."
              : collection.description
            : "No description"}
        </p>
        <div className="flex w-full items-center justify-between">
          <Button variant="soft">
            <IconPencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <IconTrash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CollectionCard;
