#!/bin/bash

echo "📦 LINE Link Finder - GitHub Push Script"
echo "========================================"
echo ""
echo "📌 まず、GitHubでリポジトリを作成してください："
echo "1. https://github.com/new にアクセス"
echo "2. Repository name: linelink-finder"
echo "3. Description: LINE Link Finder - Find official LINE accounts"
echo "4. Public を選択"
echo "5. 'Create repository' をクリック"
echo ""
echo "✅ リポジトリを作成したら、Enterキーを押してください..."
read

# Git設定
echo "🔧 Git設定中..."
git config --global user.name "rikimaru63jp"
git config --global user.email "rikimaru63jp@gmail.com"

# リモートリポジトリを追加
echo "🔗 リモートリポジトリを設定中..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/rikimaru63jp/linelink-finder.git

# ブランチ名を確認
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "📝 ブランチをmainに切り替え中..."
    git branch -M main
fi

# プッシュ
echo "📤 GitHubにプッシュ中..."
echo "GitHubのユーザー名とパスワード（またはPersonal Access Token）を入力してください："
git push -u origin main

echo ""
echo "✅ 完了！"
echo ""
echo "🎯 次のステップ："
echo "1. Render.com にログイン"
echo "2. 'New +' → 'Web Service' をクリック"
echo "3. GitHubリポジトリ 'linelink-finder' を選択"
echo "4. 以下の設定を使用："
echo "   - Runtime: Docker"
echo "   - Dockerfile Path: ./Dockerfile.render"
echo "   - Instance Type: Starter ($7/月) または Free"
echo "5. 環境変数 OPENAI_API_KEY を設定"
echo "6. 'Create Web Service' をクリック"
echo ""
echo "📊 デプロイには15-20分かかります"