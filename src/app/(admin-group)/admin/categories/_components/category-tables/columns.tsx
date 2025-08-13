
"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { type ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import { CellAction } from "./cell-action";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: string | Date;
};

export const columns: ColumnDef<CategoryRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NAME" />
    ),
    meta: {
      label: "name",
      variant: "text",
      icon: Text,
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLUG" />
    ),
    meta: {
      label: "slug",
      variant: "text",
      icon: Text,
    },
  },

  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => <CellAction data={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
