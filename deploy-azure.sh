#!/bin/bash

# Azure Deploy Script for Static Web App
# Usage: ./deploy-azure.sh

set -e

echo "🚀 Starting Azure deployment..."

# Configuration - ปรับค่าเหล่านี้ตามของคุณ
RESOURCE_GROUP="your-resource-group"
STORAGE_ACCOUNT="yourappname123"  # ต้องเป็นตัวเล็กและไม่มี - หรือ _
LOCATION="southeastasia"  # หรือ "eastasia" สำหรับ Hong Kong

echo "📦 Building application..."
npm run build

echo "☁️  Checking Azure CLI..."
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Please install it first:"
    echo "   brew install azure-cli"
    exit 1
fi

echo "🔐 Logging in to Azure..."
az login

echo "📂 Creating resource group (if not exists)..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --output none || true

echo "💾 Creating storage account (if not exists)..."
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --output none || true

echo "🌐 Enabling static website hosting..."
az storage blob service-properties update \
  --account-name $STORAGE_ACCOUNT \
  --static-website \
  --index-document index.html \
  --404-document index.html

echo "📤 Uploading files to Azure..."
az storage blob upload-batch \
  --account-name $STORAGE_ACCOUNT \
  --source ./dist \
  --destination '$web' \
  --overwrite

echo "🔗 Getting website URL..."
WEBSITE_URL=$(az storage account show \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query "primaryEndpoints.web" \
  --output tsv)

echo ""
echo "✅ Deployment completed successfully!"
echo "🌍 Your website is live at: $WEBSITE_URL"
echo ""
echo "💡 Tips:"
echo "   - To update: just run this script again"
echo "   - To add custom domain: use Azure Portal"
echo "   - To enable CDN: add Azure CDN in Portal"
