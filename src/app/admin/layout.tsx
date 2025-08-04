// import AppSidebar fro@/app/admin/_components/app-sidebarbar';
// import Header from '@/app/_components/header';
import KBar from '@/components/kbar';
// import AppSidebar from '@/components/layout/app-sidebar';
// import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { auth } from '@/server/auth';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';
import type { User } from 'prisma/interfaces';
import AppSidebar from '@/app/admin/_components/app-sidebar';
import Header from '@/app/admin/_components/header';

export const metadata: Metadata = {
  title: 'Danny Home - Admin',
  description: 'Danny Home website - cms'
};

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await auth();

  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  if (session) {
    if (session?.user.role !== Role.ADMIN) {
      return redirect('/')
    }
  } else {
    return redirect('/api/auth/signin');
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
