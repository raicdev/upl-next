"use client";

import { Alert, AlertTitle, AlertDescription } from "@shadcn/alert";
import { Button } from "@shadcn/button";
import { Separator } from "@shadcn/separator";
import { useTitle } from "@/hooks/use-title";
import {
  BadgeCheck,
  BadgePlus,
  Ban,
  Check,
  CircleHelp,
  Code,
  Eye,
  FilePenLine,
  FlagIcon,
  FlaskConical,
  Highlighter,
  HistoryIcon,
  MessageCircle,
  Plus,
  RotateCw,
  Scroll,
  ShoppingCart,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  useTitle("ホーム");

  return (
    <main>
      <div className="flex-grow flex h-screen flex-col justify-center md:items-center w-full">
        <h1 className="text-6xl font-bold mb-4 bold-h1">Rai Chat</h1>
        <p className="text-xl mb-8 max-w-xl">
          Rai Chat は、平和で、シンプルで、日本産のチャットアプリです。
        </p>

        <div className="flex space-x-4">
          <Button className="pt-6 pb-6" asChild>
            <Link href="/home"> 今すぐ開始</Link>
          </Button>
          <Button asChild className="p-4 pt-6 pb-6" variant={"secondary"}>
            <Link href="https://docs.raic.dev/chat/tos">利用規約</Link>
          </Button>
        </div>
      </div>

      <div className="w-full md:w-2/3 m-auto">
        <div>
          <section className="w-full pt-12 pb-12 md:pt-24 md:pb-24 lg:pt-32 lg:pb-32 border">
            <div className="container">
              <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
                <div>
                  <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                    日本人が開発
                    <br />
                    日本人が運営
                  </h1>
                </div>
                <div className="flex flex-col items-start space-y-4">
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    日本人が開発・運営しているチャットアプリのため、安全してチャットを利用することができます。もちろん、サポート・アプリもすべて日本語でできています。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row">
            <section className="md:w-1/2 pt-8 pb-8 border">
              <div className="container">
                <div className="p-16">
                  <div>
                    <h1 className="lg:leading-tighter inline-flex items-center text-3xl font-bold tracking-tighter">
                      <User className="mr-2" />
                      ユーザーの意見を重視
                    </h1>
                  </div>
                  <div className="flex flex-col items-start space-y-4 mb-4">
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      日本人が開発・運営しているチャットアプリのため、安全してチャットを利用することができます。もちろん、サポート・アプリもすべて日本語でできています。
                    </p>
                  </div>

                  <div className="border rounded-xl p-2">
                    <p>opinion lists:</p>
                    <ul className="list-disc ml-5">
                      <li>
                        新しい機能追加して！{" "}
                        <small className="opacity-50">
                          ( . . . . . . . . . . . . . . . )
                        </small>
                      </li>
                      <li>
                        ここにバグがあるから修正して！
                        <small className="opacity-50">
                          ( . . . . . . . . . . . . . . . )
                        </small>
                      </li>
                      <li>
                        これ使いにくいから改善して！
                        <small className="opacity-50">
                          ( . . . . . . . . . . . . . . . . )
                        </small>
                      </li>
                      <li>
                        脆弱性あるから今すぐ直して！
                        <small className="opacity-50">
                          ( . . . . . . . . . . . . . . . )
                        </small>
                      </li>
                      <li>
                        ここのデザインダサい！
                        <small className="opacity-50">
                          ( . . . . . . . . . . . . . . . )
                        </small>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="md:w-1/2 pt-8 pb-8 border">
              <div className="container">
                <div className="p-16">
                  <div>
                    <h1 className="lg:leading-tighter inline-flex items-center text-3xl font-bold tracking-tighter">
                      <FlagIcon className="mr-2" />
                      平和なチャット
                    </h1>
                  </div>
                  <div className="flex flex-col items-start space-y-4 mb-4">
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      一部の不適切ワードを入力した場合は<b>即時</b>
                      BANされます。気持ちを害するような言葉は許可されていません。また、運営による監視も頻繁にされています。
                    </p>
                  </div>

                  <div className="border rounded-xl p-2">
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                    <p className="inline-flex">
                      <Eye className="mr-2" />
                      3:00 PM Hello! [BAN]
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="w-full pt-12 pb-12 md:pt-24 md:pb-24 lg:pt-32 lg:pb-32 border">
            <div className="container">
              <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
                <div>
                  <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                    リアルタイムで
                    <br />
                    すぐに共有を。
                  </h1>
                </div>
                <div className="flex flex-col items-start space-y-4">
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    タイムラインは、Rai Chat
                    を開いている限り、リアルタイムで更新されます。画像、動画、テキストなどをリアルタイムで共有できます。他のものもリアルタイムで更新できるように今後なります。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex text-xl m-auto items-center justify-center gap-1 mt-3 mb-3 font-semibold">
            <Plus /> 新しい Rai Chat の機能
          </div>

          <section className="w-full  pt-12 pb-12 md:pt-24 md:pb-24 lg:pt-32 lg:pb-32 border">
            <div className="container">
              <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
                <div>
                  <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                    新しい技術
                  </h1>
                </div>
                <div className="flex flex-col items-start space-y-4">
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    新しい Rai Chat
                    では、Next.jsとReact、shadcn/uiなどの最新のテクノロジーを使用することで、デザイン・バグ・使いやすさが向上します。{" "}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row">
            <section className="md:w-1/2 pt-8 pb-8 border">
              <div className="container">
                <div className="p-16">
                  <div>
                    <h1 className="lg:leading-tighter inline-flex items-center text-3xl font-bold tracking-tighter">
                      <HistoryIcon className="mr-2" />
                      新しいコード、新しい経験
                    </h1>
                  </div>
                  <div className="flex flex-col items-start space-y-4 mb-4">
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Rai Chat
                      が新しくなるにつれて、すべてのコードを1から書き直しました。そのことにより、バグが修正されたりします。
                    </p>
                  </div>

                  <div className="border rounded-xl p-2 pl-3">
                    <p>rewrited codes:</p>
                    <ul className="list-disc">
                      <li className="flex items-center before:content-['•'] before:mr-2">
                        <Check className="mr-1" /> Profile features
                      </li>
                      <li className="flex items-center ml-3 before:content-['•'] before:mr-2">
                        <Check className="mr-1" /> View
                      </li>
                      <li className="flex items-center ml-3 before:content-['•'] before:mr-2">
                        <Check className="mr-1" /> Messages
                      </li>
                      <li className="flex items-center before:content-['•'] before:mr-2">
                        <Check className="mr-1" /> Message features
                      </li>
                      <li className="flex items-center ml-3 before:content-['•'] before:mr-2">
                        <Check className="mr-1" /> Send
                      </li>
                      <li className="flex items-center ml-3 before:content-['•'] before:mr-2">
                        <Check className="mr-1" /> Reply
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="md:w-1/2 pt-8 pb-8 border">
              <div className="container">
                <div className="p-16">
                  <div>
                    <h1 className="lg:leading-tighter inline-flex items-center text-3xl font-bold tracking-tighter">
                      <RotateCw className="mr-2" />
                      常に最新
                    </h1>
                  </div>
                  <div className="flex flex-col items-start space-y-4 mb-4">
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Rai Chat
                      は、常にアップデートされ続けています。バグ修正や、新機能。これらの機能がすぐに追加されます。
                    </p>
                  </div>

                  <div className="border rounded-xl p-2">
                    <p>
                      $ git push
                      <br />
                      <br />
                      [main 1a2b3c4] feat: Add new features
                      <br />
                      10 files changed, 342 insertions(+), 12 deletions(-)
                      <br />
                      Enumerating objects: 24, done.
                      <br />
                      Counting objects: 100% (24/24), done.
                      <br />
                      Writing objects: 100% (14/14), 2.05 KiB | 1.02 MiB/s,
                      done.
                      <br />
                      Total 14 (delta 10), reused 0 (delta 0)
                      <br />
                      remote: Resolving deltas: 100% (10/10), completed with 8
                      local objects.
                      <br />
                      To github.com:raidesuuu/rai-chat.git
                      <br />
                      e4f5g6h..1a2b3c4 main &gt; main
                      <br />
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="w-full pt-8 pb-8 mb-4 border">
            <div className="text-center">
              <h1 className="lg:leading-tighter text-4xl mb-4 font-semibold tracking-tighter">
                Rai Chat でチャットの体験を向上しよう
              </h1>
              <Button asChild>
                <Link href="/login">今すぐ開始</Link>
              </Button>
            </div>
          </section>

          <Separator className="my-8" />

          <h1 className="text-4xl font-bold text-center mb-4">プランの価格</h1>

          <div className="flex flex-col md:flex-row w-full">
            <section className="md:w-1/3 pt-8 pb-8 border">
              <div className="container h-full flex flex-col">
                <div className="p-16">
                  <div>
                    <h1 className="lg:leading-tighter inline-flex items-center text-3xl font-bold tracking-tighter">
                      無料
                    </h1>
                  </div>
                  <div className="flex flex-col items-start space-y-4 mb-4">
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Rai Chat はこれから始めましょう。
                    </p>

                    <ul className="list-none">
                      <li className="flex items-center mb-2">
                        <MessageCircle className="mr-1" />
                        基本的なチャット機能
                      </li>
                      <li className="flex items-center mb-2">
                        <Scroll className="mr-1" />
                        Rai Markdown
                      </li>
                      <li className="flex items-center mb-2">
                        <CircleHelp className="mr-1" />
                        通常のサポート
                      </li>
                      <li className="flex items-center mb-2">
                        <Code className="mr-1" />
                        基本的な API
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="px-16 pb-16 mt-auto">
                  <Button asChild className="w-full">
                    <Link href="/login">今すぐ開始</Link>
                  </Button>
                </div>
              </div>
            </section>

            <section className="md:w-1/3 pt-8 pb-8 border">
              <div className="container h-full flex flex-col">
                <div className="p-16">
                  <div>
                    <h1 className="lg:leading-tighter inline-flex items-center text-3xl font-bold gap-2 tracking-tighter">
                      プレミアム
                    </h1>
                  </div>
                  <div className="flex flex-col items-start space-y-4 mb-4">
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      次のレベルに進むためのもっともよい方法です。
                    </p>

                    <ul className="list-none">
                      <li className="flex items-center mb-1">
                        無料プランのすべてと
                      </li>
                      <li className="flex items-center mb-2">
                        <Scroll className="mr-1" />
                        Rai Markdown +
                      </li>
                      <li className="flex items-center mb-2">
                        <FilePenLine className="mr-1" />
                        メッセージの編集
                      </li>
                      <li className="flex items-center mb-2">
                        <BadgeCheck className="mr-1" />
                        チェックマーク
                      </li>
                      <li className="flex items-center mb-2">
                        <CircleHelp className="text-green-500 mr-1" />
                        優先サポート
                      </li>
                      <li className="flex items-center mb-2">
                        <Code className="text-green-500 mr-1" />
                        詳細な API
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="px-16 pb-16 mt-auto">
                  <Button asChild className="w-full">
                    <Link href="/account/subscriptions">
                      <ShoppingCart />
                      購入 (パネルへ)
                    </Link>
                  </Button>
                </div>
              </div>
            </section>

            <section className="md:w-1/3 pt-8 pb-8 border">
              <div className="container h-full flex flex-col">
                <div className="p-16">
                  <div>
                    <h1 className="lg:leading-tighter inline-flex items-center text-3xl font-bold tracking-tighter">
                      プレミアムプラス
                    </h1>
                  </div>
                  <div className="flex flex-col items-start space-y-4 mb-4">
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      さらに多くの機能をお楽しみください。
                    </p>

                    <ul className="list-none">
                      <li className="flex items-center mb-1">
                        プレミアムのすべてと
                      </li>
                      <li className="flex items-center mb-2">
                        <Highlighter className="mr-1" />
                        メッセージの強調表示
                      </li>
                      <li className="flex items-center mb-2">
                        <FlaskConical className="mr-1" />
                        試験中の機能
                      </li>
                      <li className="flex items-center mb-2">
                        <BadgePlus className="mr-1" />
                        新しい Rai Chat
                      </li>
                      <li className="flex items-center mb-2">
                        <Upload className="mr-1" />
                        ファイルの直接アップロード
                      </li>
                      <li className="flex items-center mb-2">
                        <CircleHelp className="text-yellow-500 mr-1" />
                        最大限のサポート
                      </li>
                      <li className="flex items-center mb-2">
                        <Code className="text-yellow-500 mr-1" />
                        無制限の API
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="px-16 pb-16 mt-auto">
                  <Button asChild className="w-full">
                    <Link href="/account/subscriptions">
                      <ShoppingCart />
                      購入 (パネルへ)
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>

          <section className="w-full pt-8 pb-4 mb-4 border">
            <div className="text-center flex justify-between pl-5 pr-5 items-center">
              <h1 className="lg:leading-tighter text-4xl mb-4 font-semibold tracking-tighter">
                無料プランから始めよう
              </h1>
              <Button asChild>
                <Link href="/login">今すぐ開始</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
