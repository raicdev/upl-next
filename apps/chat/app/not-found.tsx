"use client";

import { Button } from "@workspace/ui/components/button";
import { useTitle } from "@/hooks/use-title";
import Link from "next/link";

export default function NotFound() {
  useTitle("ページが見つかりません");

  return (
    <main className="flex-grow flex h-screen flex-col items-center justify-center m-auto w-full">
      <h1 className="text-6xl font-bold mb-4 bold-h1">404</h1>
      <p className="text-xl mb-8 max-w-xl">
        お探しのページが見つかりませんでした。
      </p>

      <Button className="pt-6 pb-6" asChild>
        <Link href="/">ホームに戻る</Link>
      </Button>
    </main>
  );
}
