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
            <Sidebar />
            {children}
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  );
};

export default Layout;
