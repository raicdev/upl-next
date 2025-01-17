// PatchNote.tsx
import React from "react";

const PatchNote: React.FC = () => {
  return (
    <div className="min-h-screen mt-16 p-8">
      <h1 className="text-3xl font-bold mb-4">パッチノート</h1>
      <p className="mb-6 text-base leading-relaxed">パッチノートは、雷のサイトの更新履歴を記録しています。</p>
      <h3 className="text-xl font-bold mb-4">バージョン 1.1</h3>
      <p className="mb-6 text-base leading-relaxed">バージョン 1.1 では、修正・新しい機能の追加を行いました。</p>
      <span className="text-green-400 mb-6 text-base leading-relaxed">新機能</span>
      <ul className="list-disc list-inside mb-6 text-base leading-relaxed">
        <li>ロード中の画面を追加</li>
        <li>新しいサブスクリプションのページ</li>
        <li>ドメインをraic.devへ変更</li>
        <li>プライバシーポリシーのページを変更</li>
        <li>パッチノートを追加</li>
      </ul>
      <span className="text-red-400 mb-6 text-base leading-relaxed">修正</span>
      <ul className="list-disc list-inside mb-6 text-base leading-relaxed">
        <li>端末によって表示がおかしくなる問題をある程度修正（レスポンシブ）</li>
      </ul>
    </div>  );
};

export default PatchNote;
