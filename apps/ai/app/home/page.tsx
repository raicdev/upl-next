"use client";

import React, { useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { Loader } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { useChatSessions } from "@/hooks/use-chat-sessions";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { ChatSidebar } from "@/components/chat-sidebar";

const ChatApp: React.FC = () => {
  const { createSession } = useChatSessions();
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleNewSession = () => {
    setCreating(true);

    const randomNumber = Math.floor(Math.random() * (750 - 350 + 1)) + 350;

    setTimeout(() => {
      const session = createSession();

      router.push(`/chat/${session.id}`);
    }, randomNumber);
  };

  return (
    <SidebarProvider className="m-auto">
      <ChatSidebar />
      
      {/* Main Chat Area */}
      <div
        className={cn(
          "flex flex-col flex-1 w-full md:w-9/12 mr-0 md:mr-16 ml-3 p-4 h-screen"
        )}
      >
        <br />

        {/* Input Area */}
        <div className="flex items-center flex-col w-full md:w-7/12 m-auto">
          <h1 className="m-auto text-xl lg:text-3xl mb-1 font-semibold">
            お手伝いできることはありますか？
          </h1>
          <p className="text-muted-foreground mb-2">
            新しいチャットを作成するか、左のサイドバーで会話を選択して、会話を始めましょう！
          </p>

          <Button onClick={handleNewSession} size="lg">
            {creating ? (
              <>
                <Loader className="animate-spin" /> 作成中...
              </>
            ) : (
              "新しいチャットを作成"
            )}
          </Button>
        </div>

        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default ChatApp;
