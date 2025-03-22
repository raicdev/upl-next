import { Loading } from "@/components/loading";
import "@repo/ui/styles/globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { Toaster } from "@repo/ui/components/sonner";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deni AI",
  description:
    "Deni AI は、o1やClaude 3.5 Sonnet などのAIモデルを利用できる完全無料のチャットアプリです。",
  openGraph: {
    title: "Deni AI",
    description:
      "Deni AI は、o1やClaude 3.5 Sonnet などのAIモデルを利用できる完全無料のチャットアプリです。",
    url: "https://ai.raic.dev/",
    siteName: "Deni AI",
    images: [
      {
        url: "https://ai.raic.dev/banner.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="theme-slate">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </ThemeProvider>

        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
