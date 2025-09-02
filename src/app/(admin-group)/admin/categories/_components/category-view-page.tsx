import { notFound } from "next/navigation";
import CategoryForm from "./category-form";
import { trpc } from "@/trpc/server";
import type { Attachment, Category } from "prisma/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TProps = {
  categoryId: string;
};

export default async function CategoryViewPage({ categoryId }: TProps) {
  let category: (Category & { attachments: Attachment[] }) | null = null;
  let pageTitle = "Create New Category";

  if (categoryId !== "new") {
    const data = await trpc.categories.byId({ id: categoryId });
    category = data ?? null;
    if (!category) {
      notFound();
    }
    pageTitle = `Edit Category`;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <CategoryForm defaultValues={category} isModal={false} />
      </CardContent>
    </Card>
  );
}
