# LINE Link Finder - Render デプロイガイド

## 📋 デプロイ前チェックリスト

✅ 以下のファイルが存在することを確認：
- `Dockerfile.render` - Playwright対応のDocker設定
- `render.yaml` - Renderの設定ファイル
- `package.json` - 依存関係
- `app/` - Next.jsアプリケーション

## 🚀 Renderへのデプロイ手順

### ステップ 1: GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. "New repository"をクリック
3. リポジトリ名: `linelink-finder`
4. Public/Privateどちらでも可
5. "Create repository"をクリック

### ステップ 2: コードをGitHubにプッシュ

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/linelink-finder.git

# mainブランチに切り替え
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

### ステップ 3: Renderでデプロイ

1. [Render.com](https://render.com)にアクセス
2. サインアップ/ログイン（GitHubアカウントで可能）
3. ダッシュボードで「New +」→「Web Service」をクリック

### ステップ 4: サービス設定

1. **Connect a repository**:
   - GitHubを選択
   - `linelink-finder`リポジトリを選択

2. **設定項目**:
   ```
   Name: linelink-finder
   Region: Singapore (Southeast Asia) または Oregon (USA West)
   Branch: main
   Root Directory: （空白のまま）
   Runtime: Docker
   Dockerfile Path: ./Dockerfile.render
   Docker Build Context Directory: .
   ```

3. **プランを選択**:
   - `Free` を選択（月750時間無料）

### ステップ 5: 環境変数の追加

「Environment」タブで以下を追加：

| Key | Value |
|-----|-------|
| OPENAI_API_KEY | your-openai-api-key-here |
| NODE_ENV | production |
| PORT | 10000 |

### ステップ 6: デプロイ開始

1. 「Create Web Service」をクリック
2. ビルドが開始されます（10-15分かかります）
3. ビルドログを確認

## 📊 デプロイ状況の確認

### 成功の兆候：
- ✅ "Build successful"メッセージ
- ✅ "Your service is live"表示
- ✅ URLが表示される（例: https://linelink-finder.onrender.com）

### よくあるエラーと対処法：

**ビルドエラー**:
```
Error: Cannot find module 'playwright'
```
→ Dockerfile.renderを使用していることを確認

**メモリエラー**:
```
JavaScript heap out of memory
```
→ 無料プランの制限。コードを最適化するか有料プランへ

## 🧪 デプロイ後のテスト

### 1. アクセステスト
```bash
# あなたのRender URLに置き換えてください
curl https://linelink-finder.onrender.com
```

### 2. UIテスト
ブラウザでURLにアクセスし、以下を確認：
- ✅ ページが表示される
- ✅ "LINE Link Finder"タイトルが見える
- ✅ CSVアップロードボタンが機能する

### 3. 機能テスト

テスト用CSVファイル（test.csv）:
```csv
店舗名,URL
LINEビジネス公式,https://www.linebiz.com/jp/
Google,https://www.google.com
スターバックス,https://www.starbucks.co.jp/
```

1. CSVファイルをアップロード
2. 「スキャン開始」をクリック
3. 結果が表示されることを確認

## 🔧 トラブルシューティング

### サービスがスリープする
無料プランは非アクティブ時にスリープします。初回アクセスに30秒程度かかることがあります。

### ビルドが遅い
初回ビルドは15-20分かかることがあります。2回目以降はキャッシュにより高速化されます。

### Playwrightエラー
Dockerfile.renderには必要な依存関係がすべて含まれています。エラーが続く場合は、環境変数を確認してください。

## 📈 パフォーマンス最適化

### 推奨設定（有料プラン）:
- Instance Type: Starter ($7/月)
- Auto-scaling: 有効
- Health Check Path: /api/health

## 🎉 デプロイ成功！

デプロイが完了したら：
1. URLをブックマーク
2. チームメンバーと共有
3. 定期的に使用してスリープを防ぐ

## 📞 サポート

問題が発生した場合：
1. Renderのログを確認
2. 環境変数が正しく設定されているか確認
3. GitHubリポジトリが最新か確認

---

**準備完了！** 上記の手順に従ってRenderにデプロイしてください。