"use client";

import { Button } from "@uplui/react"
import { Header } from "@/components/header";

export default function SettingsPage() {
  return (
    <main>
      <Header></Header>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">
          Deni AI のアップデート (v1.1)
        </h1>
        <p>Deni AI v1.1 のアップデート内容について説明します。</p>
        <h2 className="text-xl font-bold mt-6">新機能</h2>
        <ul className="list-disc pl-6">
          <li>AI Playground &gt; Deni AI へのブランド変更</li>
          <li>デザインの大幅変更 (shadcn/ui の使用など)</li>
          <li>Web 検索機能の追加</li>
        </ul>
        <h2 className="text-xl font-bold bg-gray-500 mt-6">バグ修正</h2>
        <ul className="list-disc pl-6">
          <li></li>
        </ul>
          <Button variant={"outlined"}>aaa25s</Button>
      </div>
    </main>
  );
}
