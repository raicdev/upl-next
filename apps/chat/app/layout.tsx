import "@workspace/ui/styles/globals.css";
import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";
import { SidebarProvider } from "@shadcn/sidebar";
import { ThemeProvider } from "@shadcn/theme-provider";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="ja">
      <body>
        <SidebarProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen">
              <div className="">
                <Sidebar />
              </div>
              <main className="flex-1 p-4 ml-4 md:ml-0">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  );
};

export default Layout;
