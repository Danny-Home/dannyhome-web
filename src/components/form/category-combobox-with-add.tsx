"use client";

import { useId, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateCategoryPopup from "@/app/admin/categories/_components/create-category-popup";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

const CategoryComboxBoxWithAdd = ({ value, onValueChange }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data: categories, isLoading } = api.categories.listOptions.useQuery(
    undefined,
    {
      enabled: !!open,
    },
  );

  return (
    <div className="w-full max-w-xs space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {categories?.length && value ? (
                categories?.find((category) => category.id === value)?.name
              ) : (
                <span className="text-muted-foreground">Select Category</span>
              )}
            </span>
            <ChevronsUpDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Find category" />
            <CommandList>
              {isLoading ? (
                <CommandGroup>
                  <Spinner />
                </CommandGroup>
              ) : (
                <>
                  <CommandEmpty>No categories found.</CommandEmpty>
                  <CommandGroup>
                    {categories?.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.id}
                        onSelect={(currentValue) => {
                          onValueChange(
                            currentValue === value ? "" : currentValue,
                          );
                          setOpen(false);
                        }}
                      >
                        {category.name}
                        <Tooltip  >
                          <TooltipTrigger asChild>
                            <Badge variant="outline">
                              {category._count.subcategories}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="">Sub-categories</TooltipContent>
                        </Tooltip>
                        {value === category.id && (
                          <CheckIcon size={16} className="ml-auto" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <CreateCategoryPopup
                      trigger={
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-normal"
                        >
                          <PlusIcon
                            size={16}
                            className="-ms-2 opacity-60"
                            aria-hidden="true"
                          />
                          New Category
                        </Button>
                      }
                    />
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CategoryComboxBoxWithAdd;
