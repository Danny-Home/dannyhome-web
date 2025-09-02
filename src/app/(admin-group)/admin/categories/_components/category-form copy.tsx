
"use client";

import { useEffect } from "react";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { api } from "@/trpc/react";
import {
  createCategorySchema,
  type TCreateCategorySchema,
} from "@/lib/schemas/category";

type FormValues = TCreateCategorySchema;

export default function CategoryForm({
  initialData,
  pageTitle,
}: {
  initialData: (Partial<FormValues> & { id?: string; attachments?: any[] }) | null;
  pageTitle: string;
}) {
  const utils = api.useUtils();
  const createCategory = api.categories.create.useMutation();
  const updateCategory = api.categories.update.useMutation();

  const form = useForm<FormValues, any, FormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      image: initialData?.image ?? [],
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      metaTitle: initialData?.metaTitle ?? "",
      metaDescription: initialData?.metaDescription ?? "",
    },
  });

  useEffect(() => {
    const sub = form.watch((v, { name }) => {
      if (name === "name") {
        const currentSlug = form.getValues("slug");
        if (!currentSlug) {
          form.setValue(
            "slug",
            slugify(v.name ?? "", { lower: true, strict: true }),
            { shouldValidate: true }
          );
        }
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  async function onSubmit(values: FormValues) {
    if (initialData?.id) {
      await updateCategory.mutateAsync(
        { id: initialData.id, data: values },
        {
          onSuccess: async () => {
            await utils.categories.list.invalidate();
          },
        }
      );
      return;
    }
    await createCategory.mutateAsync(values, {
      onSuccess: async () => {
        await utils.categories.list.invalidate();
        form.reset();
      },
    });
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Image(s)</FormLabel>
                    <FormControl>
                      <FileUploader
                        convertToBase64
                        valueBase64={field.value}
                        onValueBase64Change={field.onChange}
                        maxFiles={5}
                        maxSize={4 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Optional description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Max 60 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Max 160 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              isLoading={createCategory.isPending || updateCategory.isPending}
              className="w-full md:w-auto"
            >
              {initialData?.id ? "Save Changes" : "Create Category"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
