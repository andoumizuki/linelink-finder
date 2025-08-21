# 🚀 Renderデプロイ - 簡単3ステップ

## ステップ1: GitHubにコードをアップロード

### オプションA: GitHub.comで直接作成（簡単）

1. [GitHub.com](https://github.com)にログイン
2. 右上の「+」→「New repository」
3. Repository name: `linelink-finder`
4. 「Create repository」をクリック
5. 「uploading an existing file」をクリック
6. すべてのファイルをドラッグ&ドロップ
7. 「Commit changes」をクリック

### オプションB: コマンドライン（開発者向け）

```bash
# すでに実行済みの場合はスキップ
git remote add origin https://github.com/YOUR_USERNAME/linelink-finder.git
git branch -M main
git push -u origin main
```

## ステップ2: Renderでサービスを作成

### 2.1 Renderにログイン
1. [Render.com](https://dashboard.render.com/)にアクセス
2. GitHubアカウントでサインイン（推奨）

### 2.2 新しいWebサービスを作成
1. ダッシュボードで「**New +**」ボタンをクリック
2. 「**Web Service**」を選択

### 2.3 GitHubリポジトリを接続
1. 「**Connect GitHub**」をクリック（初回のみ）
2. `linelink-finder`リポジトリを選択
3. 「**Connect**」をクリック

## ステップ3: サービス設定

### 必須設定項目

| 項目 | 設定値 |
|------|--------|
| **Name** | linelink-finder |
| **Region** | Singapore (Southeast Asia) |
| **Branch** | main |
| **Runtime** | Docker |
| **Dockerfile Path** | ./Dockerfile.render |
| **Instance Type** | Free |

### 環境変数の追加

「**Environment**」セクションで「**Add Environment Variable**」をクリック：

```
Key: OPENAI_API_KEY
Value: [あなたのOpenAI APIキーをここに入力]
```

### デプロイ開始

「**Create Web Service**」ボタンをクリック！

## 📊 デプロイ進行状況

### タイムライン（目安）
- 0-2分: ソースコード取得
- 2-10分: Dockerイメージビルド
- 10-15分: Playwrightインストール
- 15-17分: デプロイ完了

### 成功のサイン
✅ "Your service is live 🎉"メッセージ
✅ URLが表示される（例: https://linelink-finder.onrender.com）

## 🧪 動作テスト

### 1. ブラウザでアクセス
デプロイ完了後に表示されるURLをクリック

### 2. CSVファイルでテスト
1. `test-companies.csv`をダウンロード
2. アプリでアップロード
3. 「スキャン開始」をクリック
4. 結果を確認

### 期待される結果
- LINEビジネス公式サイト: LINE URLが検出される
- スターバックス等: 公式LINEアカウント情報が見つかる可能性

## ⚠️ 注意事項

### 初回アクセスが遅い場合
無料プランは15分間アクセスがないとスリープします。初回は30秒程度かかることがあります。

### ビルドが失敗した場合
1. Dockerfile.renderが存在することを確認
2. render.yamlが正しく設定されているか確認
3. 「Manual Deploy」→「Clear build cache & deploy」を試す

## 💡 Tips

### パフォーマンスを上げたい場合
- 有料プラン（$7/月）にアップグレード
- インスタンスが常時起動
- メモリ増加（512MB → 2GB）

### カスタムドメインを使いたい場合
1. Settings → Custom Domains
2. あなたのドメインを追加
3. DNSを設定

## 🎉 完了！

デプロイが成功したら：
1. URLをブックマーク
2. チームメンバーと共有
3. 実際の企業データでテスト

## 📞 ヘルプ

問題が発生した場合：
1. Renderのログを確認（Logs タブ）
2. 環境変数が正しく設定されているか確認
3. GitHubリポジトリが公開されているか確認

---

**所要時間: 約20分**
**コスト: $0（無料プラン）**