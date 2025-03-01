"use client";

import { Separator } from "@repo/ui/components/separator";
import {
  Check,
} from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { ChatSession, useChatSessions } from "@/hooks/use-chat-sessions";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@repo/ui/components/dropdown-menu";
import { useTheme } from "next-themes";
import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { toast, Toaster } from "sonner";
import Link from "next/link";

export default function SettingsPage() {
  const { sessions, deleteSession, addSession } = useChatSessions();

  const { setTheme, theme } = useTheme();

  const exportAllConversion = () => {
    const conversionsArray: ChatSession[] = [];
    if (sessions) {
      sessions.forEach((session) => {
        conversionsArray.push(session);
      });
      if (conversionsArray.length > 0) {
        const blob = new Blob([JSON.stringify(conversionsArray)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `deni-ai-conversions-${new Date().toISOString()}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        toast.error("エラーが発生しました", {
          description: "会話が1つも存在しないため、エクスポートできません。",
        });
      }
      toast.success("会話をエクスポートしました");
    } else {
      toast.error("エラーが発生しました", {
        description: "会話が1つも存在しないため、エクスポートできません。",
      });
    }
  };

  const importAllConversion = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const reader = new FileReader();
      reader.onload = (event) => {
        sessions.forEach((session) => {
          deleteSession(session.id);
        });

        const jsonData = JSON.parse(
          event.target?.result as string
        ) as ChatSession[];
        jsonData.forEach((session: ChatSession) => {
          console.log(session);
          const newSession: ChatSession = {
            id: session.id,
            title: session.title,
            createdAt: session.createdAt,
            messages: session.messages,
          };
          addSession(newSession);
        });
        toast.success("会話をインポートしました", {
          description: "ファイルにあるすべての会話をインポートしました",
        });
      };
      reader.readAsText(file);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AbortError") {
        return;
      }
      toast.error("エラーが発生しました", {
        description: "ファイルの読み込み中にエラーが発生しました",
      });
    }
  };

  const deleteAllConversion = () => {
    sessions.forEach((session) => {
      deleteSession(session.id);
    });
    toast.success("会話を削除しました", {
      description: "すべての会話を削除しました",
    });
  };

  return (
    <SidebarProvider className="m-auto">
      <ChatSidebar />

      <main className="w-full p-4">
        <h1 className="text-2xl font-bold mb-3">Deni AI の設定</h1>
        <Separator className="mb-3" />
        <div className="flex justify-center w-full">
          <Tabs defaultValue="general" className="w-full md:w-2/3 lg:w-1/2">
            <TabsList>
              <TabsTrigger asChild value="general">
                <Link href="/settings">一般</Link>
              </TabsTrigger>
              <TabsTrigger asChild value="account">
                <Link href="/settings/account">アカウント</Link>
              </TabsTrigger>
              <TabsTrigger asChild value="model">
                <Link href="/settings/model">モデル</Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <label className="block text-sm font-medium mb-2">会話</label>
              <div className="w-full bg-sidebar rounded-sm shadow mb-6">
                <div className="flex p-4 items-center gap-2">
                  <div>
                    <h3 className="text-lg font-bold">
                      会話のインポート / エクスポート
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      会話をインポートしたり、エクスポートします。
                      <br />
                      <span className="text-red-400">
                        ※注意:
                        インポートすると、すべての会話が削除され、上書きされます。
                      </span>{" "}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-2 items-center">
                    <Button onClick={importAllConversion}>インポート</Button>

                    <Button onClick={exportAllConversion}>エクスポート</Button>
                  </div>
                </div>
                <Separator className="w-[96%] mx-auto" />
                <div className="flex p-4 items-center gap-2 mb-1">
                  <div>
                    <h3 className="text-lg font-bold">
                      すべての会話を削除{" "}
                      <Badge variant={"destructive"}>破壊的</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      すべての会話を削除します。このアクションは取り戻すことはできません。
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Button
                      onClick={deleteAllConversion}
                      variant={"destructive"}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </div>

              <label className="block text-sm font-medium mb-2">設定</label>
              <div className="w-full bg-sidebar shadow rounded-sm pb-0 mb-3">
                <div className="flex p-4 items-center gap-2">
                  <div>
                    <h3 className="text-lg font-bold">外観テーマ</h3>
                    <p className="text-sm text-muted-foreground">
                      ライトテーマかダークテーマに変更します。
                    </p>
                  </div>
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button>テーマを変更</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          ライト{" "}
                          {theme === "light" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          ダーク{" "}
                          {theme === "dark" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          システム{" "}
                          {theme === "system" && <Check className="ml-auto" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>{" "}
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
