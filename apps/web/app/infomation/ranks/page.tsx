import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table";
import {
  BadgeCheck,
  BadgePlus,
  Check,
  CircleHelp,
  Code,
  FilePenLine,
  FlaskConical,
  Highlighter,
  MessageCircle,
  Scroll,
  ShoppingCart,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

const PatchNote: React.FC = () => {
  const invoices = [
    {
      feature: "基本的なチャット機能",
      free: true,
      premium: true,
      premiumPlus: true,
    },
    {
      feature: "Rai Markdown",
      free: true,
      premium: true,
      premiumText: "Markdown+",
      premiumPlus: true,
      premiumPlusText: "Markdown+",
    },
    {
      feature: "サポート",
      free: true,
      freeText: "基本のサポート",
      premium: true,
      premiumText: "優先サポート",
      premiumPlus: true,
      premiumPlusText: "最大限のサポート",
    },
    {
      feature: "API",
      free: true,
      freeText: "基本的な API",
      premium: true,
      premiumText: "詳細な API",
      premiumPlus: true,
      premiumPlusText: "無制限の API",
    },
    {
      feature: "お手紙の編集",
      free: false,
      premium: true,
      premiumPlus: true,
    },
    {
      feature: "認証される",
      free: false,
      premium: true,
      premiumPlus: true,
    },
    {
      feature: "登場予定の機能",
      free: false,
      premium: false,
      premiumPlus: true,
    },
    {
      feature: "メッセージの強調表示",
      free: false,
      premium: false,
      premiumPlus: true,
    },
    {
      feature: "新しい Rai Chat",
      free: false,
      premium: false,
      premiumPlus: true,
    },
    {
      feature: "ファイルのアップロード",
      free: false,
      premium: false,
      premiumPlus: true,
    },
  ];

  return (
    <div className="min-h-screen mt-16 p-8">
      <h1 className="text-3xl font-bold mb-4">サブスクリプション</h1>
      <p className="mb-6 text-base leading-relaxed">
        {" "}
        雷のサブスクリプションは、
        <a href="https://github.com/sponsors/raidesuuu">GitHub Sponsors</a>
        とStripeで購入することができます。
        <br />
        サブスクリプションへ入ると、⇩の報酬を入手することができます。
        <br />
        <br />
        サブスクリプションを購入すると、
        <a href="/category/infomation/purchaser-tos.html">購入者の利用規約</a>
        に同意したことになります。
      </p>

      <div className="flex w-2/3 mb-3">
        <section className="w-1/3 pt-8 pb-8 border">
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

            <div className="px-8 pb-8 mt-auto">
              <Button asChild className="w-full">
                <Link href="/login">今すぐ開始</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-1/3 pt-8 pb-8 border">
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
                    <Scroll className="text-yellow-500 mr-1" />
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

            <div className="px-8 pb-8 mt-auto">
              <Button asChild className="w-full">
                <Link href="/account/subscriptions">
                  <ShoppingCart />
                  購入 (raic.dev へ)
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-1/3 pt-8 pb-8 border">
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

            <div className="px-8 pb-8 mt-auto">
              <Button asChild className="w-full">
                <Link href="/account/subscriptions">
                  <ShoppingCart />
                  購入 (raic.dev へ)
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Table className="size-2/3 text-base">
        <TableCaption>サブスクリプションの特典</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ランク</TableHead>
            <TableHead>無料</TableHead>
            <TableHead>プレミアム</TableHead>
            <TableHead>プレミアム+</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.feature}>
              <TableCell className="font-medium w-1/4">
                {invoice.feature}
              </TableCell>
              <TableCell className="w-1/4">
                {invoice.free ? (
                  <p className="flex">
                    <Check className="text-green-400 mr-1"></Check>{" "}
                    {invoice.freeText}
                  </p>
                ) : (
                  <X className="text-red-400"></X>
                )}
              </TableCell>
              <TableCell className="w-1/4">
                {invoice.premium ? (
                  <p className="flex">
                    <Check className="text-green-400 mr-1"></Check>{" "}
                    {invoice.premiumText}
                  </p>
                ) : (
                  <X className="text-red-400"></X>
                )}
              </TableCell>
              <TableCell className="w-1/4">
                {invoice.premiumPlus && (
                  <p className="flex">
                    <Check className="text-green-400 mr-1"></Check>{" "}
                    {invoice.premiumPlusText}
                  </p>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>価格</TableCell>
            <TableCell>無料</TableCell>
            <TableCell>¥250 (¥2,000/年)</TableCell>
            <TableCell>¥350 (¥3,000/年)</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default PatchNote;
