# りかナビ - 中学理科学習ナビゲーター

中学理科の学習を支援するWebアプリケーション

## 🎯 機能

- **カリキュラム管理**: 中学1-3年、全46章
- **学習進捗管理**: 完了チェック、進捗率表示
- **動画検索**: NHK for School API、YouTube、Web検索
- **確認テスト**: 4択問題230問、難易度3段階
- **学習ガイド**: AI チャットボットによる学習サポート

## 🚀 セットアップ

### 1. 必要なもの

- Node.js (v18以上推奨)
- Vercel CLI
- Anthropic API Key

### 2. インストール

```bash
# リポジトリをクローン（またはファイルをダウンロード）
cd rikanavi

# Vercel CLIをインストール（まだの場合）
npm install -g vercel

# Vercelにログイン
vercel login
```

### 3. 環境変数の設定

```bash
# .env.localファイルを作成
cp .env.example .env.local

# エディタで開いてAPIキーを設定
# ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

**Anthropic APIキーの取得方法:**
1. https://console.anthropic.com/ にアクセス
2. アカウント作成・ログイン
3. "API Keys" セクションで新しいキーを作成

### 4. ローカル開発

```bash
# 開発サーバーを起動
vercel dev

# ブラウザで開く
# http://localhost:3000
```

### 5. デプロイ

```bash
# 本番環境にデプロイ
vercel

# 環境変数を設定（初回のみ）
vercel env add ANTHROPIC_API_KEY
# APIキーを入力
# Production環境を選択
```

## 📁 ファイル構成

```
rikanavi/
├── index.html              # フロントエンド（メインアプリ）
├── api/
│   └── chat.js            # チャットボットAPI
├── vercel.json            # Vercel設定
├── .env.local             # 環境変数（Git除外）
├── .env.example           # 環境変数テンプレート
├── .gitignore             # Git除外設定
├── README.md              # このファイル
├── HANDOFF.md             # 引継ぎドキュメント
└── docs/
    └── development.md     # 開発履歴
```

## 🔧 技術スタック

- **フロントエンド**: HTML + React (CDN) + TailwindCSS (CDN)
- **バックエンド**: Vercel Serverless Functions
- **AI API**: Anthropic Claude (Sonnet 4)
- **データソース**:
  - 教科書LOD: https://jp-textbook.github.io/
  - 学習指導要領LOD: https://jp-cos.github.io/
  - NHK for School API

## 📝 使い方

### 学習の進め方

1. **学年を選択**: 1年生、2年生、3年生、または全学年
2. **章をクリック**: 学習方法を選択
   - NHK for School の動画
   - YouTube で検索
   - Web で検索
   - 確認テスト（5問の4択）
3. **進捗管理**: 完了したらチェックマーク
4. **学習ガイド**: 右下のチャットボットで質問

### チャットボットの活用例

- 「今週教科書P.20まで進んだ」→ 該当章を提案
- 「次は何を勉強すればいい？」→ 学習順序を提案
- 「光合成について教えて」→ 理科の質問に回答

## 🐛 トラブルシューティング

### ローカル開発でチャットボットが動かない

**原因**: 環境変数が設定されていない

**解決**:
```bash
# .env.localファイルを確認
cat .env.local

# APIキーが正しく設定されているか確認
# ANTHROPIC_API_KEY=sk-ant-...
```

### デプロイ後にチャットボットが動かない

**原因**: Vercelに環境変数が設定されていない

**解決**:
```bash
# Vercelの環境変数を設定
vercel env add ANTHROPIC_API_KEY

# 再デプロイ
vercel --prod
```

### NHK for School API が動かない

**原因**: APIキーがクライアントサイドに露出している（本番移行時の課題）

**注意**: 本番環境ではサーバーサイド経由に変更する必要があります

## 📊 データについて

### カリキュラムデータ

- **出典**: 教科書LOD + 学習指導要領LOD
- **教科書**: 新しい科学（東京書籍）2020年検定
- **章数**: 全46章（1年13章、2年15章、3年18章）

### 確認テストデータ

- **問題数**: 230問（46章 × 5問）
- **難易度**: 基礎2問、標準2問、応用1問
- **形式**: 4択問題 + 解説

## 🎓 開発履歴

詳細は `HANDOFF.md` を参照してください。

- v1.0-v1.13: 基本機能実装
- v1.14-v1.15: 確認テスト機能追加
- v1.16: チャットボット実装

## 📄 ライセンス

このプロジェクトは LODチャレンジ2025 応募作品です。

## 🙏 謝辞

- 教科書LODプロジェクト
- 学習指導要領LODプロジェクト
- NHK for School
