"use client";

import CategoryForm from "@/app/admin/categories/_components/category-form";
import PopoverForm from "@/components/ui/popover-form";
import React, { useState } from "react";

type Props = {
  trigger: React.ReactNode;
};

function CreateCategoryPopup({ trigger }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <PopoverForm
      title="New Category"
      trigger={trigger}
      open={open}
      setOpen={setOpen}
      width="400px"
      height="fit-content"
      showSuccess={false}
      showCloseButton
      popupClass="-bottom-20"
      openChild={<CategoryForm onCreate={() => setOpen(false)} />}
    />
  );
}

export default CreateCategoryPopup;
