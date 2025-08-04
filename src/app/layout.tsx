import "@/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { fontVariables } from "@/lib/font";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next";
import Providers from "@/app/_components/providers";
import ThemeProvider from "@/app/_components/ThemeToggle/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/server/auth";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { AppFileRouter } from "@/app/api/uploadthing/core";
import Header from "@/app/_components/header";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata: Metadata = {
  title: "Danny Home",
  description: "Danny Home",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "bg-background overflow-hidden overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables,
        )}
      >
        <NextTopLoader showSpinner={false} />
        <NextSSRPlugin routerConfig={extractRouterConfig(AppFileRouter)} />

        <SessionProvider session={session}>
          <TRPCReactProvider>
            <NuqsAdapter>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                enableColorScheme
              >
                <Providers activeThemeValue={activeThemeValue!}>
                  <Toaster />
                  <Header />
                  {children}
                </Providers>
              </ThemeProvider>
            </NuqsAdapter>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
