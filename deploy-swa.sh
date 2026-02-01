#!/bin/bash

# Azure Static Web Apps Deploy Script
# Usage: ./deploy-swa.sh

set -e

echo "🚀 Starting deployment to Azure Static Web App..."

# ตรวจสอบว่าติดตั้ง SWA CLI หรือยัง
if ! command -v swa &> /dev/null; then
    echo "📦 Installing Azure Static Web Apps CLI..."
    npm install -g @azure/static-web-apps-cli
fi

echo "📦 Building application..."
npm run build

echo "📤 Deploying to Azure Static Web App..."
echo ""
echo "⚠️  You need a deployment token from Azure Portal:"
echo "   1. Go to: https://portal.azure.com"
echo "   2. Open your Static Web App"
echo "   3. Go to: Settings > Configuration"
echo "   4. Copy the 'Deployment token'"
echo ""
read -p "Enter your deployment token: " DEPLOYMENT_TOKEN

swa deploy ./dist \
  --deployment-token "$DEPLOYMENT_TOKEN" \
  --app-name "your-swa-name" \
  --env production

echo ""
echo "✅ Deployment completed!"
echo "🌍 Check your website at your Static Web App URL"
