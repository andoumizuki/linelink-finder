# 🔧 Render CLI セットアップガイド

## Render CLIの認証設定

### ステップ1: Render APIキーを取得

1. [Render Dashboard](https://dashboard.render.com/)にログイン
2. 右上のアカウントメニューから **"Account Settings"** をクリック
3. 左メニューの **"API Keys"** をクリック
4. **"Create API Key"** をクリック
5. キーの名前を入力（例: `linelink-finder-cli`）
6. 生成されたAPIキーをコピー

### ステップ2: APIキーを設定

生成したAPIキーをコピーしたら、以下のコマンドを実行：

```bash
# APIキーを環境変数として設定
export RENDER_API_KEY="your-api-key-here"

# または、永続的に設定
echo 'export RENDER_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

### ステップ3: 認証確認

```bash
# サービス一覧を取得してテスト
render services
```

## 🎯 Render CLIでできること

### サービス状態の確認
```bash
# サービス一覧
render services

# 特定サービスの詳細
render services show linelink-finder

# ログの確認
render logs linelink-finder --tail
```

### デプロイ管理
```bash
# 手動デプロイ
render deploy linelink-finder

# デプロイ履歴
render deploys list linelink-finder

# ロールバック
render deploys rollback linelink-finder
```

### 環境変数管理
```bash
# 環境変数の一覧
render env linelink-finder

# 環境変数の設定
render env set OPENAI_API_KEY="sk-..." --service linelink-finder

# 環境変数の削除
render env unset VARIABLE_NAME --service linelink-finder
```

### サービス管理
```bash
# サービスの再起動
render restart linelink-finder

# サービスの一時停止
render suspend linelink-finder

# サービスの再開
render resume linelink-finder
```

## 📝 注意事項

- APIキーは秘密情報です。GitHubにコミットしないでください
- 無料プランのサービスは15分でスピンダウンします
- CLIからの操作もWeb UIと同じ制限が適用されます

---

**準備ができたら、Render APIキーを教えてください。**
私が代わりにログ確認やデプロイ管理を行います。