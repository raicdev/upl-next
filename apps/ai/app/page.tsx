"use client";

import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { CircleDollarSign, LockIcon, Zap } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Header } from "@/components/header";
import Image from "next/image";
import Link from "next/link";

const ChatApp: React.FC = () => {
  return (
    <main>
      <Header />
      <div className={cn("w-full")}>
        <br />

        {/* Input Area */}
        <div className="flex items-center pt-20 animate-show flex-col w-full md:w-7/12 m-auto">
          <h1 className="px-1 text-center text-5xl font-medium pb-2 sm:text-7xl md:px-0">
            無料の代替 AI
            <br /> チャットサービス
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-muted-foreground">
            すべての人のために作られた、無制限・完全無料で安全な AI
            チャットサービス
          </p>
          <div className="mx-auto mt-8 w-full max-w-5xl overflow-hidden animate-up translate-y-[32px] px-4">
            <div className="relative items-center justify-center rounded-xl border border-muted bg-[#b4b2b21a] p-1 shadow-xl shadow-black backdrop-blur-lg md:flex md:animate-move-up md:p-5">
              <Image
                alt="ヒーロー"
                width="800"
                height="600"
                className="h-full w-full rounded-xl shadow-sm md:rounded-lg"
                src="/assets/hero.png"
                unoptimized={true}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              主な特徴
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              より良いAIチャット体験を
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              高度な機能と使いやすさを兼ね備えた、次世代のAIチャットサービス
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 mb-5 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 - Left */}
              <div className="flex flex-col bg-sidebar p-8 m-auto rounded-sm items-start">
                <div className="rounded-md bg-indigo-600/10 p-2 ring-1 ring-indigo-600/10">
                  <CircleDollarSign className="h-6 w-6 text-indigo-600" />
                </div>
                <dt className="mt-4 font-semibold">完全無料</dt>
                <dd className="mt-2 leading-7 text-muted-foreground">
                  サブスクリプションや隠れた料金は一切なし。すべての機能を無料で利用可能。
                </dd>
              </div>

              {/* Feature 2 - Right */}
              <div className="flex flex-col bg-sidebar p-8 m-auto rounded-sm items-start">
                <div className="rounded-md bg-indigo-600/10 p-2  ring-1 ring-indigo-600/10">
                  <LockIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <dt className="mt-4 font-semibold">プライバシー重視</dt>
                <dd className="mt-2 leading-7 text-muted-foreground">
                  個人情報は暗号化され、安全に保管。チャット履歴は完全に匿名化。
                </dd>
              </div>

              {/* Feature 3 - Center */}
              <div className="flex flex-col bg-sidebar p-8 m-auto rounded-sm items-start">
                <div className="rounded-md bg-indigo-600/10 p-2 ring-1 ring-indigo-600/10">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <dt className="mt-4 font-semibold">高速レスポンス</dt>
                <dd className="mt-2 leading-7 text-muted-foreground">
                  最適化された応答速度で、ストレスのないスムーズな会話を実現。
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mx-auto bg-sidebar mt-32 max-w-7xl mb-16 p-16 flex justify-between rounded-sm">
          <h1 className="text-5xl font-semibold">今すぐ始める</h1>
          <Button asChild size="lg">
            <Link href="/home">始める</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ChatApp;
