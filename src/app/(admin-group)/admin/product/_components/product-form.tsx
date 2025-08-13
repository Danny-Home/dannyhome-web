"use client";

import { useEffect } from "react";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { FileUploader } from "@/components/file-uploader";
import CategoryComboxBoxWithAdd from "@/components/form/category-combobox-with-add";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  createProductSchema,
  type TCreateProductSchema,
} from "@/lib/schemas/product";
import { api } from "../../../../../trpc/react";
import type { Product } from "prisma/interfaces";

type FormValues = TCreateProductSchema;

export default function ProductForm({
  initialData,
  pageTitle,
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const createProduct = api.products.create.useMutation();
  const updateProduct = api.products.update.useMutation();
  const utils = api.useUtils();

  const defaultValues: FormValues = {
    images: [],
    name: initialData?.name ?? "",
    price: initialData?.price ?? 0,
    description: initialData?.description ?? "",
    categoryId: initialData?.categoryId ?? "",
    sku: initialData?.sku ?? "",
    slug: initialData?.slug ?? "",
    stock: initialData?.stock ?? 0,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  });

  useEffect(() => {
    const sub = form.watch((v, { name }) => {
      if (name === "name") {
        const currentSlug = form.getValues("slug");
        if (!currentSlug || currentSlug.trim() === "") {
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
      await updateProduct.mutateAsync(
        { id: initialData.id, data: values },
        {
          async onSuccess(){
            await utils.products.list.invalidate();
          },
        }
      );
      return;
    }

    await createProduct.mutateAsync(values, {
      async onSuccess(){
        await utils.products.list.invalidate();
        form.reset(defaultValues);
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
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
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
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* categoryId (not subcategories) */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <CategoryComboxBoxWithAdd
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="product-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SKU */}
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Stock Keeping Unit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stock */}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter stock"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      value={value ?? ""}
                      {...field}

                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              isLoading={createProduct.isPending || updateProduct.isPending}
            >
              {initialData?.id ? "Save Changes" : "Add Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
