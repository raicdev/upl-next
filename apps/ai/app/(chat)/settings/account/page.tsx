"use client";

import { Separator } from "@repo/ui/components/separator";
import { Brain, CloudUpload, ExternalLink, Rocket, Zap } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Toaster } from "sonner";
import Link from "next/link";
import { Progress } from "@repo/ui/components/progress";
import { Button } from "@repo/ui/components/button";
import { useEffect, useState } from "react";
import { auth } from "@repo/firebase/config";
import { cn } from "@repo/ui/lib/utils";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";

export default function SettingsPage() {
  const [normalUses, setNormalUses] = useState(0);
  const [experimentalUses, setExperimentalUses] = useState(0);
  const [isLogged, setIsLogged] = useState(false);
  const [normalLimit, setNormalLimit] = useState(0);
  const [experimentalLimit, setExperimentalLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setNormalUses(Number(window.localStorage.getItem("normalUses") || "0"));
    setExperimentalUses(
      Number(window.localStorage.getItem("experimentalUses") || "0")
    );

    const event = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogged(true);
        setNormalLimit(10000);
        setExperimentalLimit(10000);
      } else {
        router.push("/"); 
      }

      setIsLoading(false);
    });
    return () => {
      event();
    };
  }, [router]);

  function handleLogout(): void {
    if (!isLogged) return;
    auth.signOut();

    router.push("/");
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="w-full p-4">
      <h1 className="text-2xl font-bold mb-3">Deni AI の設定</h1>
      <Separator className="mb-3" />
      <div className="flex justify-center w-full">
        <Tabs defaultValue="account" className="w-full md:w-2/3 lg:w-1/2">
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
          <TabsContent value="account">
            <div className={cn(isLogged ? "hidden" : "mb-2")}>
              <h2 className="text-2xl font-bold mb-2">サインインする</h2>
              <div className="flex gap-2 mb-2">
                <div className="border rounded-md w-1/3 p-4">
                  <div className="flex items-center gap-2">
                    <CloudUpload />
                    <p className="text-lg font-bold">メッセージの同期</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    他のデバイスでログインしても、同じチャットを利用できます。
                  </p>
                </div>

                <div className="border rounded-md w-1/3 p-4">
                  <div className="flex items-center gap-2">
                    <Rocket />
                    <p className="text-lg font-bold">無制限のメッセージ</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    サインインすると、無制限にメッセージを送信できます。
                    <span className="text-muted-foreground font-bold">*</span>
                  </p>
                </div>

                <div className="border rounded-md w-1/3 p-4">
                  <div className="flex items-center gap-2">
                    <Zap />
                    <p className="text-lg font-bold">サポート</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Discord でサポートを受けることができます。
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                モデルは、
                <Link
                  href="https://voids.top/"
                  className="text-bold hover:underline"
                >
                  voids.top
                </Link>{" "}
                によって提供されています。
                <br /> <br />
                <span className="text-muted-foreground font-bold">*</span>{" "}
                本来、非サインイン時には100メッセージ送信できますが、一時的に、サインインが必要になっています。
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-1">使用上限</h2>
            <p className="text-sm text-muted-foreground mb-2">
              レートリミットなどのAntibotが完成するまで、一時的に、サインインが必要になっています。
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <div className="w-full rounded-md border p-3 mb-2 md:w-[49%]">
                <div className="flex items-center gap-2">
                  <Brain size="16" />
                  <p className="font-bold">通常モデル</p>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  GPT-4o, GPT-4o mini などの通常モデル
                </p>

                <p className="text-sm text-muted-foreground mb-1 text-bold">
                  {normalUses} / {normalLimit} 回
                </p>
                <Progress value={normalUses} max={normalLimit ? normalLimit : 1} />
              </div>

              <div className="w-full rounded-md border p-3 mb-2 md:w-[49%]">
                <div className="flex items-center gap-2">
                  <Zap size="16" />
                  <p className="font-bold">試験的モデル</p>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  o1、o3-mini などの試験的モデル
                </p>

                <p className="text-sm text-muted-foreground mb-1 text-bold">
                  {experimentalUses} / {experimentalLimit} 回
                </p>
                <Progress
                  value={experimentalUses}
                  max={experimentalLimit == 0 ? 1 : experimentalLimit}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <Button asChild>
                <Link href="/">無料プランを利用する</Link>
              </Button>

              <Button asChild variant={"secondary"}>
                <Link target="_blank" href="https://patreon.com/raicdev">
                  雷へ寄付する <ExternalLink />
                </Link>
              </Button>
            </div>

            {isLogged && (
              <>
                <h2 className="text-2xl font-bold mb-1">ログアウト</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  あなたのサインインしているアカウントからログアウトします。
                </p>
                <Button variant={"destructive"} onClick={handleLogout}>
                  ログアウト
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>{" "}
      <Toaster />
    </main>
  );
}
