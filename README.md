# Rai Chat

日本人による日本人のためのシンプルで安全なチャットアプリケーション

## 🌟 特徴

- 🇯🇵 完全日本語対応
- 🔒 強力なセキュリティと不適切コンテンツの自動フィルタリング
- ⚡ リアルタイムメッセージング
- 📝 Rai Markdown記法対応
- 👥 ユーザー認証システム（スタッフ、政府機関、学生、一般）
- ❤️ いいね機能
- 🎨 メッセージの強調表示（プレミアム機能）

## 💻 技術スタック

- **フロントエンド**: Next.js, React, shadcn/ui
- **バックエンド**: Firebase
- **データベース**: Firestore, Realtime Database
- **認証**: Firebase Authentication
- **スタイリング**: Tailwind CSS
- **決済**: Stripe

## 🎯 プラン

### 無料プラン
- 基本的なチャット機能
- 基本的なRai Markdown
- 通常のサポート
- 基本的なAPI利用

### プレミアム
- Rai Markdown+
- メッセージの編集
- チェックマーク認証
- 優先サポート
- 詳細なAPI利用

### プレミアムプラス
- メッセージの強調表示
- 試験中の新機能へのアクセス
- ファイルの直接アップロード
- 最大限のサポート
- 無制限のAPI利用

## 🛡️ セキュリティ機能

- XSS対策
- 不適切なコンテンツの自動フィルタリング
- スタッフによるモデレーション
- ユーザーBAN機能
- メッセージの強制削除機能

## 🚀 開発者向け情報

このプロジェクトはpnpmワークスペースを使用したmonorepo構造です：

```
/
├── apps/
│   ├── chat/    # メインのチャットアプリケーション
│   └── web/     # ウェブサイト
└── packages/
    ├── ui/            # 共有UIコンポーネント
    ├── firebase/      # Firebase設定
    ├── eslint-config/ # ESLint設定
    └── typescript-config/ # TypeScript設定
```

## 📝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📜 ライセンス

MIT License

## 🔗 Links

- [公式サイト](https://chat.raic.dev)
- [ドキュメント](https://docs.raic.dev)
- [利用規約](https://docs.raic.dev/chat/tos)