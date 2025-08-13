
import PageContainer from "@/app/(admin-group)/admin/_components/page-container";
import CategoryListingPage from "@/app/(admin-group)/admin/categories/_components/category-listing";
// import CategoryListingPage from "@/app/(admin-group)/admin/category/_components/category-listing";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache } from "@/lib/searchparams";
import { cn } from "@/lib/utils";
import { HydrateClient } from "@/trpc/server";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard: Categories",
  description: "Manage categories",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <HydrateClient>
      <PageContainer>
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <Heading title="Categories" description="Manage categories" />
            <Link
              href="/admin/categories/new"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              <IconPlus className="mr-2 h-4 w-4" /> New Category
            </Link>
          </div>
          <Separator />
          <Suspense
            fallback={
              <DataTableSkeleton columnCount={4} rowCount={8} filterCount={2} />
            }
          >
            <CategoryListingPage />
          </Suspense>
        </div>
      </PageContainer>
    </HydrateClient>
  );
}
