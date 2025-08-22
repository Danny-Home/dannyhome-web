import { Button } from "@/components/ui/button";
import { HydrateClient } from "@/trpc/server";
import {
  IconHeart,
  IconLayoutDashboard,
  IconSearch,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import React from "react";
import HeaderCategoryList from "./header-category-list";
import { auth } from "@/server/auth";
import Link from "next/link";
import MiniCart from "./mini-cart";

const Header = async () => {
  const session = await auth();

  const isAdmin = session?.user && session.user.role === 'ADMIN';

  return (
    <HydrateClient>
      <header className="top-0 right-0 left-0 z-20 flex flex-col items-center space-y-3 py-0">
        <div className="mx-auto flex w-5/6 items-end justify-center border-b border-neutral-200 py-2">
          <div className="ml-auto flex w-3/5 items-center justify-between">
            <Image
              src="/logo-main.png"
              width={200}
              height={200}
              alt="Danny Home Logo"
              className="object-contain"
            />
            <div className="ml-auto flex items-center">
              <Button variant="ghost" size="icon">
                <IconSearch size={100} width={100} height={100} />
              </Button>
              <Button variant="ghost" size="icon">
                <IconUser />
              </Button>
              <Button variant="ghost" size="icon">
                <IconHeart />
              </Button>
              <MiniCart />
              {isAdmin && (
                <Button variant='soft' asChild className="ml-4">
                <Link href="/admin">
                <IconLayoutDashboard />
                  Dashboard
                </Link>
              </Button>
              )}
            </div>
          </div>
        </div>
        <HeaderCategoryList />
      </header>
    </HydrateClient>
  );
};

export default Header;
