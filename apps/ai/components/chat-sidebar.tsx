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
} from "@workspace/ui/components/sidebar";
import { MessageCircleMore, Plus, Settings } from "lucide-react";
import { ChatContextMenu } from "./context-menu";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import { useParams } from "next/navigation";

export function ChatSidebar() {
  const { sessions, getSession, createSession, selectSession, deleteSession } = useChatSessions();
  const params = useParams<{ id: string }>();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="pt-6 pl-4 pb-0">
          <div className="flex items-center gap-2">
            <Link
              href="/home"
              className="text-xl font-semibold transition-all hover:text-muted-foreground"
            >
              Deni AI
            </Link>
            <Badge>v1.2</Badge>
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
                      onClick={() => selectSession(session.id)}
                      asChild
                    >
                      <div>
                        <MessageCircleMore className="mr-2" />
                        {session.title}
                      </div>
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
