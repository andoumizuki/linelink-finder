# デプロイメントガイド

## Google Cloud Runへのデプロイ手順

### 前提条件

1. Google Cloudアカウントの作成
2. プロジェクトの作成
3. Cloud Run APIの有効化
4. gcloud CLIのインストール

### ステップ1: Google Cloud CLIの設定

```bash
# ログイン
gcloud auth login

# プロジェクトの設定
gcloud config set project YOUR_PROJECT_ID

# リージョンの設定
gcloud config set run/region asia-northeast1
```

### ステップ2: Artifact Registryの設定

```bash
# Artifact Registry APIを有効化
gcloud services enable artifactregistry.googleapis.com

# リポジトリの作成
gcloud artifacts repositories create linelink-repo \
    --repository-format=docker \
    --location=asia-northeast1 \
    --description="LINE Link Finder Docker repository"

# Docker認証設定
gcloud auth configure-docker asia-northeast1-docker.pkg.dev
```

### ステップ3: 環境変数の設定

`deploy.sh`ファイルを編集：

```bash
PROJECT_ID="your-actual-project-id"  # ここを変更
OPENAI_API_KEY="your-openai-api-key"  # ここを変更
```

### ステップ4: デプロイの実行

```bash
# 実行権限を付与
chmod +x deploy.sh

# デプロイ実行
./deploy.sh
```

### ステップ5: 確認

デプロイ完了後、表示されたURLにアクセスして動作確認

## 環境変数の管理

### Cloud Runでの環境変数設定

```bash
gcloud run services update linelink-finder \
    --update-env-vars OPENAI_API_KEY=your-key \
    --region asia-northeast1
```

### Secret Managerの使用（推奨）

```bash
# シークレットの作成
echo -n "your-openai-api-key" | gcloud secrets create openai-api-key --data-file=-

# Cloud Runサービスへの権限付与
gcloud secrets add-iam-policy-binding openai-api-key \
    --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor"

# シークレットを使用してデプロイ
gcloud run deploy linelink-finder \
    --image asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/linelink-repo/linelink-finder \
    --update-secrets=OPENAI_API_KEY=openai-api-key:latest
```

## CI/CDパイプライン

### GitHub Actionsの設定

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - id: 'auth'
      uses: 'google-github-actions/auth@v1'
      with:
        credentials_json: '${{ secrets.GCP_SA_KEY }}'
    
    - name: 'Set up Cloud SDK'
      uses: 'google-github-actions/setup-gcloud@v1'
    
    - name: 'Configure Docker'
      run: gcloud auth configure-docker asia-northeast1-docker.pkg.dev
    
    - name: 'Build and Push'
      run: |
        docker build -t asia-northeast1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/linelink-repo/linelink-finder:${{ github.sha }} .
        docker push asia-northeast1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/linelink-repo/linelink-finder:${{ github.sha }}
    
    - name: 'Deploy to Cloud Run'
      run: |
        gcloud run deploy linelink-finder \
          --image asia-northeast1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/linelink-repo/linelink-finder:${{ github.sha }} \
          --region asia-northeast1 \
          --platform managed \
          --allow-unauthenticated
```

## モニタリング

### Cloud Loggingの確認

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=linelink-finder" --limit 50
```

### メトリクスの確認

Google Cloud Consoleから:
1. Cloud Run > linelink-finder
2. メトリクスタブ
3. リクエスト数、レイテンシ、エラー率を確認

## トラブルシューティング

### デプロイが失敗する場合

1. **ビルドエラー**:
```bash
# ローカルでビルドテスト
docker build -t test .
```

2. **メモリ不足**:
```bash
# メモリを増やす
gcloud run deploy linelink-finder --memory 4Gi
```

3. **タイムアウト**:
```bash
# タイムアウトを延長
gcloud run deploy linelink-finder --timeout 600
```

### パフォーマンス最適化

1. **コールドスタート対策**:
```bash
# 最小インスタンス数を設定
gcloud run services update linelink-finder --min-instances 1
```

2. **同時実行数の調整**:
```bash
# 同時実行数を制限
gcloud run services update linelink-finder --concurrency 50
```

## コスト最適化

### 使用量の確認

```bash
gcloud billing accounts list
gcloud billing projects describe YOUR_PROJECT_ID
```

### コスト削減のヒント

1. **適切なリソース設定**:
   - CPU: 1-2
   - メモリ: 2Gi
   - 最大インスタンス数: 10

2. **リージョンの選択**:
   - asia-northeast1（東京）が日本国内では最速

3. **キャッシュの活用**:
   - CDNを使用して静的アセットをキャッシュ

## セキュリティ

### IAMの設定

```bash
# サービスアカウントの作成
gcloud iam service-accounts create linelink-runner

# 必要な権限の付与
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:linelink-runner@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.invoker"
```

### ネットワークセキュリティ

```bash
# VPCコネクタの作成（プライベートアクセス用）
gcloud compute networks vpc-access connectors create linelink-connector \
    --region=asia-northeast1 \
    --subnet=default \
    --subnet-project=YOUR_PROJECT_ID
```

## バックアップとリカバリ

### イメージのバックアップ

```bash
# タグ付けしてバックアップ
docker tag asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/linelink-repo/linelink-finder:latest \
           asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/linelink-repo/linelink-finder:backup-$(date +%Y%m%d)

docker push asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/linelink-repo/linelink-finder:backup-$(date +%Y%m%d)
```

### ロールバック

```bash
# 前のリビジョンにロールバック
gcloud run services update-traffic linelink-finder --to-revisions=PREV=100
```