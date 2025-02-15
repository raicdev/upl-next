"use client";

import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { useTitle } from "@/hooks/use-title";
import {
  Airplay,
  Chrome,
  Earth,
  MessageCircle,
  Monitor,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  useTitle("ホーム");

  return (
    <main className="w-2/3 mx-auto">
      <section className="w-full mt-16 pt-12 pb-12 border">
        <div className="container text-center">
          <div className="gap-4 px-10">
            <h1 className="lg:leading-tighter mb-3 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              デスクトップアプリ
            </h1>
            <p className="text-gray-500 md:text-xl mb-3 dark:text-gray-400">
              Rai Chat のデスクトップアプリをダウンロードする
            </p>

            <Button>
              <Link href="https://github.com/raidesuuu/RaiChatDesktop/releases/download/latest/RCD-Setup.exe">
                ダウンロード
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="flex">
        <section className="w-1/2 pt-8 pb-8 border">
          <div className="container">
            <div className="p-8">
              <div>
                <h1 className="lg:leading-tighter inline-flex items-center text-3xl font-bold tracking-tighter">
                  <Monitor className="mr-2" />
                  すぐにチャットを始めれる
                </h1>
              </div>
              <div className="flex flex-col items-start space-y-4 mb-4">
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  デスクトップアプリをインストールすると、もう Rai Chat
                  をブラウザで開くことはありません。
                </p>
              </div>

              <div className="border flex rounded-xl p-2 h-72 flex-col justify-between">
                <div className="h-full w-full p-6">
                  <div className="border w-full h-full flex rounded-xl p-2 flex-col justify-between">
                    <div className="mb-2 flex">
                      <MessageCircle className="mr-2" /> Rai Chat
                    </div>
                    <Separator />
                    <div className="m-auto p-2 w-full text-center">
                      <p className="text-2xl mb-2">Rai Chat</p>
                      <p>Rai Chat は、日本産のチャットアプリです。</p>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <Airplay className="mr-2" />
                  <Separator orientation="vertical" className="h-6 mr-2" />
                  <Earth className="mr-2" />
                  <MessageCircle />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-1/2 pt-8 pb-8 border">
          <div className="container">
            <div className="p-8">
              <div>
                <h1 className="lg:leading-tighter inline-flex items-center text-3xl font-bold tracking-tighter">
                  <Chrome className="mr-2" /> Chrome ベース
                </h1>
              </div>
              <div className="flex flex-col items-start space-y-4 mb-4">
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  ChromeベースのElectronを使用しているため、ブラウザと同じようにRai
                  Chatを利用できます。
                </p>
              </div>
              <div className="border flex rounded-xl p-2 h-72 flex-col justify-between">
                <div className="w-full h-full flex rounded-xl p-2 flex-col justify-between">
                  <div className="m-auto p-2 w-full font-semibold text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Chrome size="64" className="mt-1 mr-2" />
                      <p className="text-5xl">Chrome Based</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full pt-8 pb-4 mb-4 border">
        <div className="text-center flex justify-between pl-5 pr-5 items-center">
          <h1 className="lg:leading-tighter text-4xl mb-4 font-semibold tracking-tighter">
            デスクトップアプリをインストール
          </h1>
          <Button asChild>
            <Link href="https://github.com/raidesuuu/RaiChatDesktop/releases/download/latest/RCD-Setup.exe">ダウンロード</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
