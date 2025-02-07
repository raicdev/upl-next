"use client";

import React, { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@shadcn/alert-dialog";
import { SidebarProvider } from "@shadcn/sidebar";
import { Brain, Loader } from "lucide-react";
import { Button } from "@shadcn/button";
import Compare from "@/components/compare";
import { useChatSessions } from "@/hooks/use-chat-sessions";
import { modelDescriptions } from "@/lib/modelDescriptions";
import { ModelSelector } from "@/components/input-area";
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/navigation";
import { create } from "lodash";

const ChatApp: React.FC = () => {
  const { createSession } = useChatSessions();
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleNewSession = () => {
    setCreating(true);
    setTimeout(() => {
      const session = createSession();

      router.push(`/chat/${session.id}`);
    }, 1000);
  };

  return (
    <SidebarProvider className="m-auto">
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
            新しいチャットを作成して、会話を始めましょう！
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
        <p className="text-xs text-center text-zinc-500 mt-2">
          AI の回答は必ずしも正しいとは限りません。すべての AI
          が無制限に利用できます。
          <br />
          <small>
            <a href="https://voids.top/">Powered by voids.top</a>
            <Link href="/notes" className="ml-4">
              利用に関する質問
            </Link>
          </small>
        </p>
      </div>
    </SidebarProvider>
  );
};

export default ChatApp;
