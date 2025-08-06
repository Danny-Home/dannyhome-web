import { Switch } from "@/components/ui/switch";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { buildViewableUrl } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import Image from "next/image";
import type { Attachment, Banner } from "prisma/interfaces";

export const bannerColumns: ColumnDef<Banner>[] = [
  {
    accessorKey: "attachment",
    header: "Image",
    cell: ({ row }) => {
      const attachment: Attachment = row.getValue("attachment");
      const fileUrl = buildViewableUrl(
        {
          data: attachment.data.toString(),
          name: attachment.filename,
          type: "image/png",
        },
        {
          useBlob: false,
        },
      );

      return (
        <div className="relative aspect-square">
          <Image
            src={fileUrl}
            alt={attachment.filename}
            fill
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
    meta: {
      label: "Name",
      placeholder: "Search a banner",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "active",
    id: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active Status" />
    ),
    cell: ({ row }) => {
      const isActive: boolean = row.getValue("active");

      return <Switch defaultChecked={isActive} />;
    },
  },
];
