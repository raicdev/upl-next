import { Loading } from "@/components/loading";
import "@repo/ui/styles/globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { Toaster } from "@repo/ui/components/sonner";
import 'katex/dist/katex.min.css'

import type { Metadata } from "next";
import { ChatSessionsProvider } from "@/hooks/use-chat-sessions";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { ChatSidebar } from "@/components/chat-sidebar";
import SonnerProvider from "@/components/SonnerProvider";

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
    <div className="w-full h-full">
      <script
        crossOrigin="anonymous"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <ChatSessionsProvider>
            <div className="w-full flex">
              <ChatSidebar />
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
          </ChatSessionsProvider>
        </SidebarProvider>{" "}
      </ThemeProvider>
    </div>
  );
}
