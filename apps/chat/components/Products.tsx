import React from "react";
import Card from "@/components/Card";
import { Flame } from "lucide-react";

const Products: React.FC = () => {
  return (
    <div className="p-8 text-left" id="products">
      <h1 className="text-5xl font-bold mb-5 bold-h1">
        製品
      </h1>

      <div className="flex flex-wrap space-x-4 mb-10">
        <Card title="VistaUpdater" subtitle="VistaUpdaterは、Windows Vistaを更新できるようにするソフトウェア" from="2023/05" badge={<span className="inline-flex items-center"><Flame size="16"  className="mr-1" /> 人気</span>} href="https://vistaupdater.net/" />
        <Card title="Bolt+" subtitle="完全無料で、様々なモデルに対応して、日本語用の最適化がされたBolt" from="2024/10" badge={<span className="inline-flex items-center"><Flame size="16" className="mr-1" /> すべて無料</span>} href="https://bolt.raic.dev/" />
        <Card title="VS Code RPC" subtitle="DiscordにVisual Studio Codeのステータスを表示するVS Codeのプラグイン" from="2023/09" href="https://marketplace.visualstudio.com/items?itemName=theuplauncher.vscoderpc" />
      </div>

      <div className="flex flex-wrap space-x-4">
        <Card title="Purble" subtitle="Visual Studio Codeの青と紫のテーマ (Rehemeの後継)" from="2023/07" href="https://marketplace.visualstudio.com/items?itemName=theuplauncher.purble" />
        <Card title="Bridder" subtitle="Xを改善するための拡張機能。XをTwitterに変える機能も搭載" from="2023/07" badge={<span className="inline-flex items-center"><Flame size="16"  className="mr-1" /> すべて無料</span>} href="https://github.com/UpLauncher/Bridder" />
      </div>
    </div>
  );
};

export default Products;
