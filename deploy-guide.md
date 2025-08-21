# LINE Link Finder - 簡単デプロイガイド

## 🚀 最も簡単で安価なデプロイ方法

### オプション1: Vercel（推奨 - 無料）

1. **GitHub経由でデプロイ**
   ```bash
   # GitHubリポジトリを作成
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/linelink-finder.git
   git push -u origin main
   ```

2. **Vercelでデプロイ**
   - https://vercel.com にアクセス
   - "Import Git Repository"をクリック
   - GitHubリポジトリを選択
   - 環境変数を設定:
     - `OPENAI_API_KEY`: あなたのAPIキー

3. **デプロイ完了**
   - 自動的にビルド・デプロイされます
   - URLが提供されます（例: https://linelink-finder.vercel.app）

### オプション2: Netlify（無料）

1. **ビルドフォルダを準備**
   ```bash
   npm run build
   npm install -g netlify-cli
   ```

2. **デプロイ**
   ```bash
   netlify deploy --prod --dir=.next
   ```

3. **環境変数設定**
   - Netlifyダッシュボードで設定
   - Site settings > Environment variables

### オプション3: Railway（簡単・月$5から）

1. **Railway CLIインストール**
   ```bash
   npm install -g @railway/cli
   ```

2. **デプロイ**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **環境変数設定**
   ```bash
   railway variables set OPENAI_API_KEY="your-key"
   ```

## 💰 コスト比較

| サービス | 月額費用 | 特徴 |
|---------|---------|------|
| Vercel | **$0** | Next.js最適化、自動HTTPS、グローバルCDN |
| Netlify | **$0** | 簡単設定、フォーム機能付き |
| Railway | $5〜 | データベース統合、開発者向け |
| Render | $0〜 | 自動デプロイ、無料SSL |

## 🎯 今すぐデプロイする最速方法

### 1分でデプロイ（Vercel Button）

以下のボタンをREADMEに追加して、ワンクリックデプロイ：

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/linelink-finder&env=OPENAI_API_KEY)
```

## 📱 ローカルでの完全テスト

```bash
# 1. 環境変数設定
export OPENAI_API_KEY="your-key"

# 2. 開発サーバー起動
npm run dev

# 3. ブラウザでアクセス
open http://localhost:3000

# 4. テストCSV作成
cat > test.csv << EOF
店舗名,URL
テスト企業,https://www.linebiz.com/jp/
EOF

# 5. アップロードしてテスト
```

## ✅ デプロイ前チェックリスト

- [ ] 環境変数設定（OPENAI_API_KEY）
- [ ] package.jsonの依存関係確認
- [ ] ビルドテスト（`npm run build`）
- [ ] ローカル動作確認

## 🔗 デモURL

アプリケーションはローカルで完全動作しています：
- UI: ✅ 完成（モダンで使いやすいデザイン）
- API: ✅ 動作確認済み
- CSV処理: ✅ テスト済み
- LINE検出: ✅ AI統合済み

## 📞 サポート

問題が発生した場合：
1. `npm run build`でエラーチェック
2. 環境変数が正しく設定されているか確認
3. Node.js v20以上を使用しているか確認