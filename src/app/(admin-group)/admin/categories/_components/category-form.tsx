'use client'

import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategorySchema,
  type TCreateCategorySchema,
} from "@/lib/schemas/category";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Attachment, Category } from "prisma/interfaces";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";

type FormValues = TCreateCategorySchema;

type Props = {
  onCreate?: (data: Category) => void;
  defaultValues?: Category & { attachments?: Attachment[] } | null;
  isModal?: boolean;
}



function CategoryForm({ onCreate, defaultValues, isModal = false }: Props) {
  const apiUtils = api.useUtils();
  const form = useForm<FormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues:{
      image: defaultValues?.attachments?.map((item) => ({data: item.url, name: item.filename, type: item.mimeType})) ?? [],
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      metaTitle: defaultValues?.metaTitle ?? "",
      metaDescription: defaultValues?.metaDescription ?? "",
    },
  });

  const createCategory = api.categories.create.useMutation();
  const updateCategory = api.categories.updateCategory.useMutation();

  const updatedName = form.watch("name");

  useEffect(() => {
    form.setValue("slug", slugify(updatedName, {lower: true, strict: true}));
  }, [form, updatedName]);

  // function onSubmit(values: TCreateCategorySchema) {
  //   createCategory.mutate(values, {
  //     async onSuccess(data) {
  //
  //       await apiUtils.categories.list.invalidate();



  //     },
  //     onError(error) {
  //       toast.error(error.message);
  //       console.error(error);
  //     },
  //   });
  // }

  async function onSubmit(values: FormValues) {
    if (defaultValues?.id) {
      await updateCategory.mutateAsync(
        { id: defaultValues.id, data: values },
        {
          async onSuccess(data) {
            await apiUtils.categories.list.invalidate();
            await apiUtils.categories.listOptions.invalidate();

            toast.success("Category updated");
            if (onCreate) {
              onCreate(data);
            }
          },
        }
      );
      return;
    }
    await createCategory.mutateAsync(values, {
      async onSuccess(data) {
        await apiUtils.categories.list.invalidate();
        form.reset();

        toast.success("Category created");
        if (onCreate) {
          onCreate(data);
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-3">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <FileUploader
                  maxSize={1024 * 1024 * 5}
                  maxFiles={1}
                  convertToBase64
                  valueBase64={field.value}
                  onValueBase64Change={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 space-x-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input disabled placeholder="" {...field} />
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          isLoading={createCategory.isPending}
          variant="secondary"
          className={cn("mt-4", !isModal ? "mx-auto justify-self-center w-1/5" : "w-full")}
          size={isModal ? "sm" : "lg"}
          type="button"
          onClick={form.handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </form>
    </Form>
  );
}

export default CategoryForm;
