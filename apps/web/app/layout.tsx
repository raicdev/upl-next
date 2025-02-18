"use client";

import { Loading } from "@repo/ui/components/loading";
import "@repo/ui/styles/globals.css";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@repo/ui/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div id="root" className="min-h-screen">
            <Header />
            <Suspense fallback={<Loading />}>
              <main>{children}</main>
            </Suspense>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
