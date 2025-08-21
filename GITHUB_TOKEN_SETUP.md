# GitHub Personal Access Token 設定ガイド

## 🔑 Personal Access Tokenの作成

### ステップ1: GitHubでトークンを生成

1. **[GitHub Settings](https://github.com/settings/tokens)** にアクセス
2. **"Generate new token"** → **"Generate new token (classic)"** をクリック
3. 以下を設定:
   - **Note**: `linelink-finder-cli`
   - **Expiration**: 30 days（または任意）
   - **Select scopes**: 以下にチェック
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (Upload packages to GitHub Package Registry)
     - ✅ `delete_repo` (Delete repositories)

4. **"Generate token"** をクリック
5. **生成されたトークンをコピー** （`ghp_`で始まる文字列）

### ステップ2: トークンをCLIに設定

生成したトークンをコピーしたら、以下のコマンドを実行してください：

```bash
# 以下のコマンドを実行後、トークンを貼り付け
echo "YOUR_GITHUB_TOKEN" | ./gh_2.46.0_linux_amd64/bin/gh auth login --with-token
```

または対話形式で設定：

```bash
./gh_2.46.0_linux_amd64/bin/gh auth login
```

選択肢:
- GitHub.com
- HTTPS
- Paste an authentication token

## 🚀 トークン設定後の自動実行

トークンを設定したら、私が以下を自動実行します：

1. ✅ GitHubリポジトリの作成
2. ✅ コードのプッシュ
3. ✅ Render用の設定確認

## ⚠️ セキュリティ注意事項

- トークンは秘密情報です。他人と共有しないでください
- 使用後はトークンを削除することを推奨
- 最小限の権限のみを付与してください

## 📝 トークン例

```
ghp_1234567890abcdefghijklmnopqrstuvwxyz
```

---

**準備ができたら、生成したトークンを教えてください。**
私がGitHubへのアップロードを代行します。