#!/bin/bash

# Chronicle Deployment Script
# Builds and deploys the web app

set -e

echo "🚀 Deploying Chronicle..."
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

# Check if required tools are installed
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Install dependencies
echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
npm ci

# Build the application
echo -e "\n${BLUE}🔨 Building application...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Deploy to Vercel (if vercel CLI is available)
if command -v vercel &> /dev/null; then
    echo -e "\n${BLUE}🌐 Deploying to Vercel...${NC}"
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Deployment successful${NC}"
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    fi
else
    echo -e "\n${YELLOW}⚠️  Vercel CLI not found. Skipping deployment.${NC}"
    echo -e "${BLUE}To deploy manually:${NC}"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Run: vercel --prod"
    echo "3. Or upload the 'out' directory to your hosting provider"
fi

echo -e "\n${GREEN}🎉 Deployment process completed!${NC}"
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Test the deployed application"
echo "2. Update mobile apps if needed"
echo "3. Announce the update to users"