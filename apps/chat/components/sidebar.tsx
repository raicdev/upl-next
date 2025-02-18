"use client";

import Link from "next/link";
import { AuthStatusButton } from "@/components/AuthStatusButton";
import {
  Sidebar as SidebarRoot,
  SidebarContent as SidebarContentRoot,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@repo/ui/components/sidebar";
import { Badge } from "@repo/ui/components/badge";
import {
  CircleUser,
  ExternalLink,
  FlaskConical,
  Home,
  KeyRound,
  LinkIcon,
  Menu,
  MessageCircle,
  Monitor,
  Moon,
  NotepadText,
  PartyPopper,
  Settings,
  Shield,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { useTheme } from "next-themes";
import { Suspense } from "react";
import { useIsMobile } from "@repo/ui/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/drawer";

interface SidebarItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
}

interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

const mainMenuItems: SidebarItem[] = [
  {
    href: "/home",
    icon: <Home />,
    label: "ホーム",
  },
  {
    href: "/profile/me",
    icon: <User />,
    label: "プロフィール",
    badge: {
      text: "新機能",
      icon: <PartyPopper size="16" className="mr-1" />,
    },
  },
  {
    href: "/messages",
    icon: <MessageCircle />,
    label: "メッセージ",
    disabled: true,
    badge: {
      text: "近日登場",
    },
  },
  {
    href: "/settings",
    icon: <Settings />,
    label: "Rai Chat の設定",
  },
  {
    href: "/settings/experiment",
    icon: <FlaskConical />,
    label: "実験中の機能",
    badge: {
      text: "Beta",
    },
  },
];

const informationItems: SidebarSection = {
  label: "情報",
  items: [
    {
      href: "https://docs.raic.dev/chat/tos",
      icon: <NotepadText />,
      label: "利用規約",
      badge: {
        text: "外部リンク",
        icon: <ExternalLink size={16} className="mr-1" />,
      }
    },
    {
      href: "/pages/desktop",
      icon: <Monitor />,
      label: "デスクトップ アプリ",
    },
  ],
};

const accountItems: SidebarSection = {
  label: "アカウントの管理",
  items: [
    {
      href: "/account/",
      icon: <CircleUser />,
      label: "基本情報の管理",
    },
    {
      href: "/account/security",
      icon: <Shield />,
      label: "セキュリティ",
    },
    {
      href: "/account/subscriptions",
      icon: <ShoppingCart />,
      label: "サブスクリプション",
    },
    {
      href: "/account/credentials",
      icon: <KeyRound />,
      label: "API",
    },
  ],
};

const SidebarItems = ({ items }: { items: SidebarItem[] }) => {
  return items.map((item, index) => (
    <SidebarMenu key={index}>
      <SidebarMenuItem className={item.disabled ? "opacity-50 pointer-events-none" : ""}>
        <SidebarMenuButton asChild>
          <Link href={item.href}>
            {item.icon}
            {item.label}
            {item.badge && (
              <Badge>
                {item.badge.icon}
                {item.badge.text}
              </Badge>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  ));
};

const SidebarMainContent = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <SidebarRoot className="min-h-screen">
      <SidebarContentRoot>
        <div className="flex items-center gap-2 justify-between pr-3 mt-6">
          <h1 className="ml-3 text-2xl hover:underline">
            <Link href="/">Rai Chat</Link>
          </h1>

          <div className="flex gap-3">
            <Suspense
              fallback={
                <Button variant="secondary" size="icon" disabled>
                  <LinkIcon />
                </Button>
              }
            >
              <AuthStatusButton />
            </Suspense>

            <Button
              variant="secondary"
              size="icon"
              onClick={() =>
                handleThemeChange(theme === "light" ? "dark" : "light")
              }
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarItems items={mainMenuItems} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{informationItems.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarItems items={informationItems.items} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{accountItems.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarItems items={accountItems.items} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContentRoot>
    </SidebarRoot>
  );
};

const Sidebar = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="hidden">
            <DrawerTitle></DrawerTitle>
          </DrawerHeader>
          <div className="h-full pl-4 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="py-4">
                <div className="space-y-1">
                  <SidebarItems items={mainMenuItems} />
                </div>
              </div>

              <div className="py-4">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  {informationItems.label}
                </h2>
                <div className="space-y-1">
                  <SidebarItems items={informationItems.items} />
                </div>
              </div>

              <div className="py-4">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  {accountItems.label}
                </h2>
                <div className="space-y-1">
                  <SidebarItems items={accountItems.items} />
                </div>
              </div>
            </div>
          </div>{" "}
        </DrawerContent>
      </Drawer>
    );
  }

  return <SidebarMainContent />;
};

export default Sidebar;
