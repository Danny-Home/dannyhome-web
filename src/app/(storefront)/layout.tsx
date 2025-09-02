import type { ReactNode } from "react";
import Header from "@/app/_components/header";
import Footer from "./_components/footer";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <Header />
      {/* Main */}
      <main className="flex-1">{children}</main>
      {/* Footer */}
      <Footer />
    </div>
  );
}