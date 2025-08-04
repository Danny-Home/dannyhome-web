import KBar from "@/components/kbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { auth } from "@/server/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import AppSidebar from "./_components/app-sidebar";
import Header from "./_components/header";

export const metadata: Metadata = {
  title: "Danny Home - Admin",
  description: "Danny Home website - cms",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await auth();

  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  if (session) {
    if (session?.user.role !== Role.ADMIN) {
      return redirect("/");
    }
  } else {
    return redirect("/api/auth/signin");
  }

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
