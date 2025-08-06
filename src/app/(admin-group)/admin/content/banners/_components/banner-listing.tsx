import { searchParamsCache } from "@/lib/searchparams";
import { trpc } from "@/trpc/server";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function BannerListing() {
  //   const page = searchParamsCache.get("page");
  //   const search = searchParamsCache.get("name");
  //   const pageLimit = searchParamsCache.get("perPage");
  //   const active = searchParamsCache.get("active");

  //   const filters = {
  //     page,
  //     limit: pageLimit,
  //     ...(search && { search }),
  //     ...(active && { active }),
  //   };

  const banners = await trpc.banner.list();
  //   const bannerListSize = banners.length;

  return (
    <Tabs defaultValue="full-banner">
      <TabsList className="h-10">
        <TabsTrigger value="full-banner">Full Slides</TabsTrigger>
        <TabsTrigger value="promos">Promos</TabsTrigger>
      </TabsList>
      <TabsContent value="full-banner">Banners</TabsContent>
      <TabsContent value="promos">Promotions</TabsContent>
    </Tabs>
  );
}

export default BannerListing;
