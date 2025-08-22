
"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { type ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import { CellAction } from "./cell-action";
import type { Category } from "prisma/interfaces";



export const columns: ColumnDef<Category>[] = [
  { accessorKey: "name", id: 'name', header: "Name" },
  { accessorKey: "slug", id: 'slug',  header: "Slug" },
  { accessorKey: "metaTitle", id: 'metaTitle', header: "Meta Title" },
];
