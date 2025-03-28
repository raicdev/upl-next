import "@repo/ui/styles/globals.css";
import Sidebar from "@/components/sidebar";
import { ReactNode, Suspense } from "react";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Toaster } from "@repo/ui/components/sonner";
import SidebarRight from "@/components/RightSidebar";
import { Noto_Sans_JP } from "next/font/google";

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Rai Chat",
  description: "Rai Chat は、基本無料でとても平和なチャットアプリです。",
  keywords: ["Rai Chat", "チャット", "チャットアプリ", "チャットサービス"],
  authors: [{ name: "Rai", url: "https://raic.dev/" }],
  metadataBase: new URL("https://chat.raic.dev/"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Rai Chat",
    description: "Rai Chat は、基本無料でとても平和なチャットアプリです。",
    url: "https://chat.raic.dev/",
    siteName: "Rai Chat",
    images: [
      {
        url: "https://chat.raic.dev/images/banner.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};

const notoSansJP = Noto_Sans_JP({
  weight: ["300", "700"],
  subsets: ["cyrillic"],
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <body className={`${notoSansJP.className}`}>
      <SidebarProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            <div className="flex w-full justify-between">
              <Suspense
                fallback={
                  <div className="flex h-screen items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }
              >
                <Sidebar />
                <main className="w-full md:w-1/2 mx-auto">{children}</main>
                <SidebarRight />
              </Suspense>
            </div>
          </Suspense>
        </ThemeProvider>
      </SidebarProvider>

      <Toaster />
    </body>
  );
};

export default Layout;
