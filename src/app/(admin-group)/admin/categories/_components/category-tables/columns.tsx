
"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { type ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import { CellAction } from "./cell-action";
import type { Category } from "prisma/interfaces";



export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NAME" />
    ),

    // meta: {
    //   label: "name",
    //   variant: "text",
    //   icon: Text,
    // },
  },
  {
    accessorKey: "slug",
    id: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLUG" />
    ),
    // meta: {
    //   label: "slug",
    //   variant: "text",
    //   icon: Text,
    // },
  },

  // {
  //   id: "actions",

  //   header: "ACTIONS",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
];
