# 🚀 LINE Link Finder - 今すぐデプロイする方法

## 方法1: Render（無料・Playwright対応）👍推奨

### ステップ1: GitHubにプッシュ
```bash
git init
git add .
git commit -m "LINE Link Finder with Playwright support"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/linelink-finder.git
git push -u origin main
```

### ステップ2: Renderでデプロイ
1. [Render](https://render.com)にアクセス
2. "New +" → "Web Service"をクリック
3. GitHubリポジトリを連携
4. 以下を設定:
   - **Name**: linelink-finder
   - **Docker**: Yes（Dockerfile.renderを選択）
   - **Plan**: Free
5. 環境変数を追加:
   - `OPENAI_API_KEY`: your-openai-api-key-here
6. "Create Web Service"をクリック

**デプロイ時間**: 約10-15分
**URL**: https://linelink-finder.onrender.com

## 方法2: Railway（簡単・月$5）

### ワンコマンドデプロイ
```bash
# Railway CLIインストール
npm install -g @railway/cli

# デプロイ
railway login
railway init
railway up

# 環境変数設定
railway variables set OPENAI_API_KEY="your-openai-api-key-here"

# URLを取得
railway open
```

## 方法3: Heroku（月$5-7）

### Heroku CLIでデプロイ
```bash
# Heroku CLIインストール済みの場合
heroku create linelink-finder
heroku config:set OPENAI_API_KEY="your-openai-api-key-here"
git push heroku main
```

## 方法4: ローカルDockerで今すぐ使用

```bash
# Dockerビルド
docker build -f Dockerfile.render -t linelink-finder .

# 実行
docker run -p 3000:10000 \
  -e OPENAI_API_KEY="your-openai-api-key-here" \
  linelink-finder

# ブラウザでアクセス
open http://localhost:3000
```

## 🎯 最速デプロイ（5分以内）

### Renderボタンを使用
READMEに以下を追加してワンクリックデプロイ：

```markdown
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/linelink-finder)
```

## ✅ デプロイ後のテスト

1. デプロイされたURLにアクセス
2. テストCSVをアップロード:
```csv
店舗名,URL
LINEビジネス,https://www.linebiz.com/jp/
テスト企業,https://example.com
```
3. "スキャン開始"をクリック
4. 結果を確認

## 📊 機能確認リスト

- ✅ Playwright対応（動的サイトもスクレイピング可能）
- ✅ OpenAI GPT-4o-mini統合
- ✅ CSV一括処理
- ✅ 結果エクスポート
- ✅ 信頼度スコア表示

## 🆘 トラブルシューティング

### Renderでビルドが遅い場合
無料プランは初回ビルドに15-20分かかることがあります。

### Playwrightエラーが出る場合
Dockerfile.renderを使用していることを確認してください。

### APIキーエラー
環境変数 `OPENAI_API_KEY` が正しく設定されているか確認。

## 💡 推奨事項

**Render**が最もおすすめです：
- 無料プラン利用可能
- Playwright完全サポート
- 自動HTTPS
- GitHub連携で自動デプロイ

---

**準備完了！** GitHubにプッシュして、Renderでデプロイするだけです。