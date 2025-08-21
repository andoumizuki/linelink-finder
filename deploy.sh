#!/bin/bash

# Google Cloud設定
PROJECT_ID="your-project-id"
REGION="asia-northeast1"
SERVICE_NAME="linelink-finder"

# 環境変数の設定
OPENAI_API_KEY="your-openai-api-key-here"

echo "🚀 Starting deployment to Google Cloud Run..."

# プロジェクトの設定
gcloud config set project $PROJECT_ID

# Artifact Registryリポジトリの作成（初回のみ）
gcloud artifacts repositories create linelink-repo \
    --repository-format=docker \
    --location=$REGION \
    --description="LINE Link Finder Docker repository" 2>/dev/null || true

# Docker認証設定
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# イメージのビルド
echo "📦 Building Docker image..."
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/linelink-repo/${SERVICE_NAME}:latest .

# イメージのプッシュ
echo "⬆️ Pushing image to Artifact Registry..."
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/linelink-repo/${SERVICE_NAME}:latest

# Cloud Runへのデプロイ
echo "🌐 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
    --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/linelink-repo/${SERVICE_NAME}:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --timeout 300 \
    --concurrency 100 \
    --max-instances 10 \
    --set-env-vars="OPENAI_API_KEY=${OPENAI_API_KEY},NODE_ENV=production"

# サービスURLの取得
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --platform managed --region $REGION --format 'value(status.url)')

echo "✅ Deployment complete!"
echo "🔗 Service URL: ${SERVICE_URL}"