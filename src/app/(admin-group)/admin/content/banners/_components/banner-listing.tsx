'use client'

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Banner } from "prisma/interfaces";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { buildViewableUrl } from "@/lib/utils";
import type { Base64FileInput } from "@/lib/schemas/storage";

type Props = {
  banners: Banner[];
}

 function BannerListing({ banners }: Props) {
  return (
    <Tabs defaultValue="full-banner">
      <TabsList className="h-10">
        <TabsTrigger value="full-banner">Full Slides</TabsTrigger>
        <TabsTrigger value="promos">Promos</TabsTrigger>
      </TabsList>
      <TabsContent value="full-banner">
          <HoverEffect  items={banners} Content={(banner) => (
            <Card key={banner.id} className="z-10">
              <CardHeader>
                hello
              </CardHeader>
              <CardContent>
                <Image width={200} height={200} src={banner.attachments?.[0].url} alt="hello" className="w-full h-[300px] object-cover mx-auto" />
              </CardContent>
            </Card>
          )} />
      </TabsContent>
      <TabsContent value="promos">Promotions</TabsContent>
    </Tabs>
  );
}

export default BannerListing;
