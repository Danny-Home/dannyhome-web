import type { ColumnDef } from "@tanstack/react-table";
import React from "react";

interface BannerTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

function BannerTable<TData, TValue>({
  data,
  totalItems,
  columns,
}: BannerTableParams<TData, TValue>) {
  return <div>BannerTable</div>;
}

export default BannerTable;
