import PageContainer from '@/app/(admin-group)/admin/_components/page-container';
import { buttonVariants } from '@/components/ui/button';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { HydrateClient } from '@/trpc/server';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'lucide-react';
import type { SearchParams } from 'nuqs';
import React, { Suspense } from 'react'
// import { Separator } from 'react-aria-components';
import { Heading } from "@/components/ui/heading";
import CollectionListing from '@/app/(admin-group)/admin/collections/_components/collection-listing';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: "Dashboard: Collections",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

async function CollectionsPage(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <HydrateClient>
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Heading title="Products" description="Manage products" />
            <Link
              href="/admin/product/new"
              className={cn(buttonVariants(), "text-xs md:text-sm")}
            >
              <IconPlus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          <Separator />
          <Suspense
            fallback={
              <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
            }
          >
            {/* <ProductListingPage /> */}
            <CollectionListing />
          </Suspense>
        </div>
      </PageContainer>
    </HydrateClient>
  )
}

export default CollectionsPage
