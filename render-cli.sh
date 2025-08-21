#!/bin/bash

# Render API Helper Script
# Usage: ./render-cli.sh [command]

API_KEY="rnd_cjbbP0uMyQr2FyvocBmupAIpf44B"
SERVICE_ID="srv-d2jievfdiees73c9h150"
BASE_URL="https://api.render.com/v1"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function status() {
    echo -e "${GREEN}📊 Checking service status...${NC}"
    curl -s -H "Authorization: Bearer $API_KEY" "$BASE_URL/services/$SERVICE_ID" | python3 -m json.tool
}

function deploy() {
    echo -e "${YELLOW}🚀 Starting new deployment...${NC}"
    curl -s -X POST -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" "$BASE_URL/services/$SERVICE_ID/deploys" | python3 -m json.tool
}

function deploys() {
    echo -e "${GREEN}📜 Recent deployments:${NC}"
    curl -s -H "Authorization: Bearer $API_KEY" "$BASE_URL/services/$SERVICE_ID/deploys?limit=5" | python3 -m json.tool
}

function logs() {
    echo -e "${GREEN}📝 Fetching logs...${NC}"
    DEPLOY_ID=$(curl -s -H "Authorization: Bearer $API_KEY" "$BASE_URL/services/$SERVICE_ID/deploys?limit=1" | python3 -c "import sys, json; print(json.load(sys.stdin)[0]['deploy']['id'])")
    echo "Deploy ID: $DEPLOY_ID"
    curl -s -H "Authorization: Bearer $API_KEY" "$BASE_URL/services/$SERVICE_ID/deploys/$DEPLOY_ID/logs" 
}

function env() {
    echo -e "${GREEN}🔐 Environment variables:${NC}"
    curl -s -H "Authorization: Bearer $API_KEY" "$BASE_URL/services/$SERVICE_ID/env-vars" | python3 -m json.tool
}

function set_env() {
    if [ -z "$2" ]; then
        echo -e "${RED}Usage: ./render-cli.sh set_env KEY VALUE${NC}"
        exit 1
    fi
    echo -e "${YELLOW}🔧 Setting environment variable $1...${NC}"
    curl -s -X PUT -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
        -d "[{\"key\":\"$1\",\"value\":\"$2\"}]" \
        "$BASE_URL/services/$SERVICE_ID/env-vars" | python3 -m json.tool
}

function restart() {
    echo -e "${YELLOW}🔄 Restarting service...${NC}"
    curl -s -X POST -H "Authorization: Bearer $API_KEY" "$BASE_URL/services/$SERVICE_ID/restart" | python3 -m json.tool
}

function watch() {
    echo -e "${GREEN}👀 Watching deployment status (press Ctrl+C to stop)...${NC}"
    while true; do
        clear
        echo -e "${GREEN}=== Deployment Status ===${NC}"
        curl -s -H "Authorization: Bearer $API_KEY" "$BASE_URL/services/$SERVICE_ID/deploys?limit=1" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data:
    deploy = data[0]['deploy']
    print(f\"ID: {deploy['id']}\")
    print(f\"Status: {deploy['status']}\")
    print(f\"Commit: {deploy['commit']['message']}\")
    print(f\"Started: {deploy.get('startedAt', 'N/A')}\")
    print(f\"Updated: {deploy.get('updatedAt', 'N/A')}\")
"
        sleep 5
    done
}

case "$1" in
    status) status ;;
    deploy) deploy ;;
    deploys) deploys ;;
    logs) logs ;;
    env) env ;;
    set_env) set_env "$2" "$3" ;;
    restart) restart ;;
    watch) watch ;;
    *)
        echo -e "${GREEN}Render CLI Helper${NC}"
        echo "Usage: ./render-cli.sh [command]"
        echo ""
        echo "Commands:"
        echo "  status   - Check service status"
        echo "  deploy   - Trigger new deployment"
        echo "  deploys  - List recent deployments"
        echo "  logs     - Show deployment logs"
        echo "  env      - List environment variables"
        echo "  set_env  - Set environment variable (KEY VALUE)"
        echo "  restart  - Restart service"
        echo "  watch    - Watch deployment status"
        ;;
esac