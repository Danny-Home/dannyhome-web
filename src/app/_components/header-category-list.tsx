import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { IconChevronDown } from "@tabler/icons-react";
import React from "react";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "Utensilios de Cocina", href: "/utensilios-de-cocina" },
  { label: "Para Hornear", href: "/para-hornear" },
  { label: "Eletrodomésticos", href: "/eletrodomesticos" },
  { label: "Mesa", href: "/mesa" },
  { label: "Hogar", href: "/hogar" },
  { label: "Acessorios", href: "/acessorios" },
  { label: "Limpieza", href: "/limpieza" },
  { label: "Ofertas", href: "/ofertas" },
];

function HeaderCategoryList() {
  return (
    <div className="mx-auto flex w-4/5 items-center justify-center gap-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="default">
            Todas Categorias
            <IconChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent>Will do this later</PopoverContent>
      </Popover>
      <Separator orientation="vertical" />
      {navLinks.map((item) => (
        <Button key={item.label} variant="ghost-soft">
          {item.label}
        </Button>
      ))}

      <Button variant="link">Ofertas</Button>
    </div>
  );
}

export default HeaderCategoryList;
