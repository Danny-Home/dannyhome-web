"use client";

import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputWithEndButtons from "@/components/ui/input-end-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createBannerSchema,
  type TCreateBannerSchema,
} from "@/lib/schemas/banner";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Button as AriaButton } from "react-aria-components";

type Props = {
  id?: string;
};

function BannerForm({}: Props) {
  const apiUtils = api.useUtils();
  const form = useForm({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      active: true,
      title: "",
      startsAt: new Date(),
      image: [],
      position: "HERO",
    },
  });

  return (
    <Drawer direction="right" dismissible>
      <DrawerTrigger asChild>
        <Button>
          <IconPlus />
          Add New
        </Button>
      </DrawerTrigger>
      <DrawerContent className="md:!max-w-lg">
        {/* <div> */}
        <DrawerHeader>
          <DrawerTitle>New Banner</DrawerTitle>
        </DrawerHeader>
        <div className="h-full px-4 py-6">
          <Form {...form}>
            <form className="flex h-full flex-col space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Banner title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HERO">
                            Full Screen (hero)
                          </SelectItem>
                          <SelectItem value="PROMO">
                            Promotion (Center)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <InputWithEndButtons
                        {...field}
                        className="w-full max-w-full"
                        EndButtons={
                          <>
                            <AriaButton
                              slot="decrement"
                              className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] cursor-pointer items-center justify-center border px-2 text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              First
                            </AriaButton>
                            <AriaButton
                              slot="increment"
                              className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground -me-px flex aspect-square h-[inherit] cursor-pointer items-center justify-center border px-2 text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Last
                            </AriaButton>
                          </>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-auto w-full">
                <Button variant="default" className="w-full">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default BannerForm;
