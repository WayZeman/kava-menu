#!/bin/bash

# Automatic Vercel Environment Setup Script
# This script sets up the TELEGRAM_BOT_TOKEN in Vercel

set -e

TELEGRAM_BOT_TOKEN="8994978328:AAF-ORLZ804iPFMLc7PWJOEDW_MHkaQgzyA"
PROJECT_NAME="kava-menu"

# Check if VERCEL_TOKEN is set
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Error: VERCEL_TOKEN environment variable is not set"
    echo ""
    echo "To get your Vercel token:"
    echo "1. Go to https://vercel.com/account/tokens"
    echo "2. Click 'Create Token'"
    echo "3. Give it a name (e.g., 'Cloud Agent Setup')"
    echo "4. Copy the token"
    echo ""
    echo "Then run:"
    echo "  export VERCEL_TOKEN='your_token_here'"
    echo "  bash $0"
    exit 1
fi

echo "🔍 Finding Vercel project..."

# Get project ID using Vercel API
PROJECT_RESPONSE=$(curl -s \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/$PROJECT_NAME")

PROJECT_ID=$(echo "$PROJECT_RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('id', ''))" 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Could not find project '$PROJECT_NAME'"
    echo "Response: $PROJECT_RESPONSE"
    echo ""
    echo "Please check:"
    echo "1. Project name is correct"
    echo "2. VERCEL_TOKEN has correct permissions"
    echo "3. You have access to the project"
    exit 1
fi

echo "✅ Found project: $PROJECT_NAME (ID: $PROJECT_ID)"
echo ""

# Check if environment variable already exists
echo "🔍 Checking existing environment variables..."
EXISTING_VARS=$(curl -s \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/$PROJECT_ID/env")

HAS_TOKEN=$(echo "$EXISTING_VARS" | python3 -c "import sys, json; data = json.load(sys.stdin); print('yes' if any(v.get('key') == 'TELEGRAM_BOT_TOKEN' for v in data.get('envs', [])) else 'no')" 2>/dev/null || echo "no")

if [ "$HAS_TOKEN" = "yes" ]; then
    echo "⚠️  TELEGRAM_BOT_TOKEN already exists. Updating..."
    
    # Get the env var ID
    ENV_ID=$(echo "$EXISTING_VARS" | python3 -c "import sys, json; data = json.load(sys.stdin); print(next((v['id'] for v in data.get('envs', []) if v.get('key') == 'TELEGRAM_BOT_TOKEN'), ''))" 2>/dev/null || echo "")
    
    if [ -n "$ENV_ID" ]; then
        # Delete the old one
        curl -s -X DELETE \
          -H "Authorization: Bearer $VERCEL_TOKEN" \
          "https://api.vercel.com/v9/projects/$PROJECT_ID/env/$ENV_ID" > /dev/null
        echo "✅ Removed old TELEGRAM_BOT_TOKEN"
    fi
fi

# Add new environment variable
echo "📝 Adding TELEGRAM_BOT_TOKEN to Vercel..."
ADD_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"key\": \"TELEGRAM_BOT_TOKEN\",
    \"value\": \"$TELEGRAM_BOT_TOKEN\",
    \"type\": \"encrypted\",
    \"target\": [\"production\", \"preview\", \"development\"]
  }" \
  "https://api.vercel.com/v10/projects/$PROJECT_ID/env")

if echo "$ADD_RESPONSE" | grep -q '"created"'; then
    echo "✅ TELEGRAM_BOT_TOKEN added successfully!"
else
    echo "❌ Failed to add environment variable"
    echo "Response: $ADD_RESPONSE"
    exit 1
fi

echo ""
echo "🚀 Triggering new deployment..."

# Trigger a new deployment by creating a hook or using CLI
DEPLOY_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$PROJECT_NAME\",
    \"gitSource\": {
      \"type\": \"github\",
      \"ref\": \"main\",
      \"repoId\": \"WayZeman/kava-menu\"
    }
  }" \
  "https://api.vercel.com/v13/deployments")

DEPLOY_URL=$(echo "$DEPLOY_RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('url', ''))" 2>/dev/null || echo "")

if [ -n "$DEPLOY_URL" ]; then
    echo "✅ Deployment started!"
    echo "📍 URL: https://$DEPLOY_URL"
else
    echo "⚠️  Could not trigger automatic deployment"
    echo "Please manually redeploy from Vercel dashboard"
    echo "Response: $DEPLOY_RESPONSE"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Wait for deployment to complete (~2 minutes)"
echo "2. Test your bot by making an order"
echo "3. Check that notifications arrive in Telegram"
echo ""
echo "Monitor deployment at: https://vercel.com/dashboard"
