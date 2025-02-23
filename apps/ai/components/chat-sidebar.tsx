"use client";

import { useChatSessions } from "@/hooks/use-chat-sessions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import {
  MessageCircleMore,
  MoreHorizontal,
  Plus,
  Settings,
} from "lucide-react";
import { ChatContextMenu } from "./context-menu";
import Link from "next/link";
import { Badge } from "@repo/ui/components/badge";
import { useParams } from "next/navigation";
import { useIsMobile } from "@repo/ui/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/drawer";
import { Button } from "@repo/ui/components/button";

export function ChatSidebar() {
  const { sessions, getSession, createSession } =
    useChatSessions();
  const isMobile = useIsMobile();
  const params = useParams<{ id: string }>();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="fixed top-2 left-2">
            <MoreHorizontal />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="text-center">
          <DrawerTitle className="inline-flex mt-3 justify-center">
            Deni AI
            <Badge className="ml-2" variant="secondary">
              v1.3.1
            </Badge>
          </DrawerTitle>
          <DrawerDescription>チャット</DrawerDescription>

          <SidebarMenu>
            {Object.entries(sessions).map(([sessionId, session]) => (
              <SidebarMenuItem key={sessionId}>
                <ChatContextMenu session={session}>
                  <SidebarMenuButton
                    className="flex"
                    isActive={getSession(params.id)?.id === session.id}
                    asChild
                  >
                    <Link href={`/chat/${session.id}`}>
                      <MessageCircleMore className="mr-2" />
                      {session.title}
                    </Link>
                  </SidebarMenuButton>
                </ChatContextMenu>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={createSession} asChild>
                <Plus className="mr-2" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu className="mt-auto mb-3">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings">
                  <Settings />
                  設定
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="pt-6 pl-4 pb-0">
          <div className="flex items-center gap-2">
            <Link
              href="/home"
              className="text-xl font-bold transition-all hover:text-muted-foreground"
            >
              Deni AI
            </Link>
            <Badge>v1.3.1</Badge>
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>チャット</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(sessions).map(([sessionId, session]) => (
                <SidebarMenuItem key={sessionId}>
                  <ChatContextMenu session={session}>
                    <SidebarMenuButton
                      className="flex"
                      isActive={getSession(params.id)?.id === session.id}
                      asChild
                    >
                      <Link href={`/chat/${session.id}`}>
                        <MessageCircleMore className="mr-2" />
                        {session.title}
                      </Link>
                    </SidebarMenuButton>
                  </ChatContextMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={createSession} asChild>
                  <Plus className="mr-2" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings />
                設定
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
