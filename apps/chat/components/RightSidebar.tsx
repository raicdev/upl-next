"use client";

import {
  Sidebar as SidebarRoot,
  SidebarContent as SidebarContentRoot,
} from "@repo/ui/components/sidebar";
import { Search } from "lucide-react";
import { raiChatBuildInfo } from "@repo/firebase/types";
import { Badge } from "@repo/ui/components/badge";

interface News {
  title: string;
  description: string;
  tag: string;
}

export const NewsList: News[] = [
  {
      title: "メッセージ機能が近日登場",
      description: "ダイレクトメッセージがRai Chatで利用できるようになります！グループを作って話したり、特定のユーザーにメッセージを送れます！",
      tag: "アップデート"
  },
  {
      title: "Rai Chat が 1.0 (正式版) になりました！",
      description: "プレミアムプラス+の制限を解除し、デザインをアップデートし、より安定、軽くしました！",
      tag: "アップデート"
  },
  {
      title: "Rai Chat の利用規約が更新されました！",
      description: "Rai Chat の利用規約が更新されました！Rai Chat Docsから見れます。",
      tag: "重要"
  }
]

const SidebarMainContent = () => {
  return (
    <SidebarRoot side="right" className="min-h-screen w-[20%]">
      <SidebarContentRoot>
        <div className="mx-6 mt-10 flex items-center justify-between gap-2 border rounded-md p-2">
          <Search />
          <input
            placeholder="検索"
            disabled
            className="w-full outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="border m-2 p-2 rounded-md">
          <h1 className="text-xl font-bold">ニュース</h1>
          {NewsList.map((news, index) => (
            <div key={index} className="bg-secondary mt-2 p-2 rounded-md">
              <Badge>{news.tag}</Badge>
              <h2 className="font-bold">{news.title}</h2>
              <p className="text-sm text-muted-foreground">
                {news.description}
              </p>
            </div>
          ))}{" "}
        </div>

        <div className="m-2 p-2 mt-auto rounded-md">
          <p className="text-muted-foreground text-sm">{`${raiChatBuildInfo.fullInfo} (${raiChatBuildInfo.environment})`}</p>
        </div>
      </SidebarContentRoot>
    </SidebarRoot>
  );
};

const SidebarRight = () => {
  return <SidebarMainContent />;
};

export default SidebarRight;
