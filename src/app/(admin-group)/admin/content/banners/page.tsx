import React, { Suspense } from "react";
import BannerListing from "./_components/banner-listing";
import { HydrateClient, trpc } from "@/trpc/server";
import PageContainer from "../../_components/page-container";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconAppWindow, IconLiveView, IconPlus } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import BannerForm from "./_components/banner-form";
import { searchParamsCache } from "@/lib/searchparams";

type Props = {
  params: Promise<{
    type?: 'HERO' | 'PROMO'
  }>
}

async function BannersPage({ params }: Props) {
  const { type } = await params;
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

  const banners = await trpc.banner.list({
    type,
  });

  return (
    <HydrateClient>
      <PageContainer scrollable>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading title="Banners" description="Manage products" />

            <div className="flex items-center gap-x-2">
              <BannerForm />
              <Button variant="outline">
                <IconLiveView />
                Preview
              </Button>
            </div>
          </div>
          <Separator />
          <Suspense
            fallback={
              <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
            }
          >
            <BannerListing banners={banners} />
          </Suspense>
        </div>
      </PageContainer>
    </HydrateClient>
  );
}

export default BannersPage;
