
import PageContainer from "@/app/(admin-group)/admin/_components/page-container";
import CategoryViewPage from "@/app/(admin-group)/admin/categories/_components/category-view-page";
import FormCardSkeleton from "@/components/form-card-skeleton";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard : Category View",
};

type PageProps = { params: Promise<{ categoryId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <CategoryViewPage categoryId={params.categoryId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
