import { Loading } from "@shadcn/loading";
import "@workspace/ui/styles/globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@shadcn/theme-provider";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { ChatSidebar } from "@/components/chat-sidebar";

import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Deni AI',
  description: 'Deni AI は、o1やClaude 3.5 Sonnet などのAIモデルを利用できる完全無料のチャットアプリです。',
  openGraph: {
    title: 'Deni AI',
    description: 'Deni AI は、o1やClaude 3.5 Sonnet などのAIモデルを利用できる完全無料のチャットアプリです。',
    url: 'https://ai.raic.dev/',
    siteName: 'Deni AI',
    images: [
      {
        url: 'https://ai.raic.dev/banner.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head> */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <ChatSidebar />
            <Suspense fallback={<Loading />}>
              <main className="w-full">{children}</main>
            </Suspense>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
