"use client";

import { Avatar } from "@shadcn/avatar";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Toaster } from "@shadcn/toaster";
import { useState, useEffect } from "react";
import { Separator } from "@workspace/ui/components/separator";
import { MoveRight, User } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@shadcn/button";
import { useChatSessions } from "@/hooks/use-chat-sessions";

export default function SettingsPage() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const { toast } = useToast();
  const { sessions, deleteSession } = useChatSessions();

  useEffect(() => {
    const savedPrompt = localStorage.getItem("system-prompt");
    if (savedPrompt) {
      setSystemPrompt(savedPrompt);
    }
  }, []);

  const deleteAllConversion = () => {
    sessions.forEach((session) => {
      deleteSession(session.id);
    });
    toast({
      title: "会話を削除しました",
      description: "すべての会話を削除しました",
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem("system-prompt", systemPrompt);
      toast({
        title: "設定を保存しました",
        description: "システムプロンプトが更新されました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "設定の保存に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="w-full p-4">
      <h1 className="text-2xl font-bold mb-3">システム設定</h1>
      <Separator className="mb-3" />
      <div className="flex justify-center w-full">
        <div className="flex w-2/4 flex-col text-left">
          <label className="block text-sm font-medium mb-2">アカウント</label>
          <div className="w-full bg-secondary hover:bg-secondary/80 mb-6 cursor-pointer transition-all flex p-4 items-center rounded-sm gap-2">
            <Avatar className="bg-amber-500 flex items-center justify-center">
              <User />
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">Guest</h3>
              <p className="text-sm text-muted-foreground">
                ログインしていません
              </p>
            </div>
            <div className="ml-auto">
              <MoveRight />
            </div>
          </div>

          <label className="block text-sm font-medium mb-2">会話</label>
          <div className="w-full bg-secondary flex p-4 items-center rounded-sm gap-2">
            <div>
              <h3 className="text-lg font-semibold">
                すべての会話を削除 <Badge variant={"destructive"}>破壊的</Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                すべての会話を削除します。このアクションは取り戻すことはできません。
              </p>
            </div>
            <div className="ml-auto">
              <Button onClick={() => deleteAllConversion()} className="cursor-pointer" variant={"destructive"}>
                削除
              </Button>
            </div>
          </div>
        </div>
      </div>{" "}
      <Toaster />
    </main>
  );
}
