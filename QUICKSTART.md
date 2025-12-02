# Claude Code クイックスタートガイド

このドキュメントは、Claude Codeでりかナビのチャットボット機能を完成させるための手順書です。

---

## 📦 プロジェクトの展開

### 1. アーカイブの展開

ダウンロードした `rikanavi_project.tar.gz` を展開：

```bash
# ダウンロードフォルダに移動
cd ~/Downloads

# 展開
tar -xzf rikanavi_project.tar.gz

# プロジェクトディレクトリに移動
cd rikanavi_project
```

---

## 🚀 Claude Codeでの作業

### 1. Claude Codeを起動

```bash
# プロジェクトディレクトリで実行
claude
```

### 2. Claude Codeに伝える内容

Claude Codeが起動したら、以下を伝えてください：

```
りかナビプロジェクトのチャットボット機能を完成させたいです。

【状況】
- HANDOFF.mdに全ての背景情報があります
- api/chat.js は実装済み
- index.html もバックエンドAPI対応済み
- あとは動作確認とデプロイです

【やってほしいこと】
1. 環境変数の設定（.env.local作成）
2. vercel devでローカルテスト
3. チャットボットが正常に動作するか確認
4. 問題があれば修正
5. vercelへデプロイ

HANDOFF.mdを読んでから作業を開始してください。
```

---

## 🔑 事前準備：APIキーの取得

Claude Codeでの作業前に、Anthropic APIキーを取得しておいてください：

1. https://console.anthropic.com/ にアクセス
2. アカウント作成・ログイン
3. 左メニュー「API Keys」をクリック
4. 「Create Key」ボタンをクリック
5. キー名を入力（例：rikanavi-dev）
6. 作成された `sk-ant-...` で始まるキーをコピー

**重要**: このキーは後で使うので、安全な場所に保存しておいてください。

---

## 📝 作業の流れ

Claude Codeが実行する手順：

### Step 1: 環境変数設定
```bash
cp .env.example .env.local
# .env.localを編集してAPIキーを設定
```

### Step 2: 依存関係のインストール（必要に応じて）
```bash
npm install -g vercel
```

### Step 3: ローカル開発サーバー起動
```bash
vercel dev
```

### Step 4: 動作確認
- ブラウザで http://localhost:3000 を開く
- チャットボタンをクリック
- メッセージを送信して応答を確認

### Step 5: デプロイ
```bash
vercel login
vercel

# 環境変数を設定
vercel env add ANTHROPIC_API_KEY
# APIキーを入力
# Production環境を選択

# 本番デプロイ
vercel --prod
```

---

## ✅ 確認ポイント

チャットボットが正常に動作しているか確認：

1. **チャットボタンが表示される**
   - 右下に紫色の丸ボタン
   - 「💬 学習ガイド」と表示

2. **チャット画面が開く**
   - ボタンクリックで380×500pxの画面
   - 「🤖 りかナビ先生」ヘッダー

3. **メッセージ送信ができる**
   - 入力欄にテキスト入力
   - 送信ボタンまたはEnterで送信

4. **AI応答が返ってくる**
   - ローディング表示（3つの点）
   - Claude からの返答が表示

5. **学習進捗が反映される**
   - いくつか章を完了状態にする
   - 「次は何を勉強すればいい？」と質問
   - 未完了の章が提案される

6. **会話履歴が保存される**
   - ブラウザをリロード
   - 会話が保持されている

7. **リセット機能が動く**
   - 「🗑️ 会話をリセット」ボタンクリック
   - 会話が消える

---

## 🐛 トラブルシューティング

### エラー: "ANTHROPIC_API_KEY is not set"

**原因**: 環境変数が設定されていない

**解決**:
```bash
# .env.localファイルを確認
cat .env.local

# 正しく設定されているか確認
# ANTHROPIC_API_KEY=sk-ant-...
```

### エラー: "Failed to fetch"

**原因**: ローカル開発サーバーが起動していない

**解決**:
```bash
# サーバーが起動しているか確認
# vercel dev を実行

# ブラウザで http://localhost:3000 を開く
```

### エラー: "API Error: 401"

**原因**: APIキーが無効

**解決**:
- Anthropic Consoleで新しいキーを作成
- .env.localを更新
- サーバーを再起動

### エラー: "API Error: 429"

**原因**: APIレート制限

**解決**:
- しばらく待つ
- Anthropic Consoleでプランを確認

---

## 📊 デプロイ後の確認

デプロイが成功したら：

1. **URLを確認**
   ```
   https://rikanavi-xxxx.vercel.app
   ```

2. **環境変数を確認**
   ```bash
   vercel env ls
   ```

3. **ログを確認**（エラーがある場合）
   ```bash
   vercel logs
   ```

---

## 🎉 完成！

全て正常に動作したら、りかナビは完成です！

次のステップ：
- URLを保存
- 友人や家族に試してもらう
- フィードバックを集める
- 必要に応じて機能追加

---

## 📞 困ったら

Claude Codeに質問してください。例：

```
チャットボットから応答が返ってきません。
ブラウザのコンソールには次のエラーが出ています：
[エラーメッセージをコピペ]

何が問題でしょうか？
```

Claude Codeは状況を分析して、解決策を提案してくれます。

---

**頑張ってください！ 🚀**
