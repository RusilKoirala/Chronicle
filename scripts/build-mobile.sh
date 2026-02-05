#!/bin/bash

# Chronicle Mobile App Builder
# This script builds APK and prepares for iOS build

set -e  # Exit on any error

echo "🚀 Building Chronicle Mobile Apps..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Step 1: Build the web app
echo -e "\n${BLUE}📦 Building web app...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Web app built successfully${NC}"
else
    echo -e "${RED}❌ Web app build failed${NC}"
    exit 1
fi

# Step 2: Sync with Capacitor
echo -e "\n${BLUE}🔄 Syncing with Capacitor...${NC}"
npx cap sync

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Capacitor sync completed${NC}"
else
    echo -e "${RED}❌ Capacitor sync failed${NC}"
    exit 1
fi

# Step 3: Create downloads directory
echo -e "\n${BLUE}📁 Creating downloads directory...${NC}"
mkdir -p public/downloads

# Step 4: Build Android APK
echo -e "\n${BLUE}🤖 Building Android APK...${NC}"

if [ -d "android" ]; then
    cd android
    
    # Check if gradlew exists and is executable
    if [ -f "./gradlew" ]; then
        chmod +x ./gradlew
        
        echo -e "${YELLOW}Building debug APK...${NC}"
        ./gradlew assembleDebug
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Android APK built successfully${NC}"
            
            # Copy APK to downloads
            if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
                cp app/build/outputs/apk/debug/app-debug.apk ../public/downloads/chronicle-android.apk
                echo -e "${GREEN}✅ APK copied to public/downloads/chronicle-android.apk${NC}"
                
                # Get APK size
                APK_SIZE=$(du -h ../public/downloads/chronicle-android.apk | cut -f1)
                echo -e "${BLUE}📱 APK size: ${APK_SIZE}${NC}"
            else
                echo -e "${RED}❌ APK file not found${NC}"
            fi
        else
            echo -e "${RED}❌ Android build failed${NC}"
        fi
    else
        echo -e "${RED}❌ gradlew not found in android directory${NC}"
    fi
    
    cd ..
else
    echo -e "${YELLOW}⚠️  Android directory not found. Run 'npx cap add android' first${NC}"
fi

# Step 5: iOS Instructions
echo -e "\n${BLUE}🍎 iOS Build Instructions:${NC}"
echo -e "${YELLOW}For iOS app (.ipa file):${NC}"
echo "1. Open Xcode"
echo "2. Open ios/App/App.xcworkspace"
echo "3. Select your development team"
echo "4. Product → Archive"
echo "5. Distribute App → Development"
echo "6. Export and save as chronicle-ios.ipa"
echo "7. Copy to public/downloads/chronicle-ios.ipa"

# Step 6: Summary
echo -e "\n${GREEN}🎉 Build Summary:${NC}"
echo "=================================="

if [ -f "public/downloads/chronicle-android.apk" ]; then
    echo -e "${GREEN}✅ Android APK: public/downloads/chronicle-android.apk${NC}"
else
    echo -e "${RED}❌ Android APK: Not built${NC}"
fi

if [ -f "public/downloads/chronicle-ios.ipa" ]; then
    echo -e "${GREEN}✅ iOS IPA: public/downloads/chronicle-ios.ipa${NC}"
else
    echo -e "${YELLOW}⏳ iOS IPA: Build manually using Xcode${NC}"
fi

echo -e "\n${BLUE}📝 Next Steps:${NC}"
echo "1. Test the APK: adb install public/downloads/chronicle-android.apk"
echo "2. Build iOS app using Xcode (see instructions above)"
echo "3. Test download links on your website"
echo "4. Deploy your website with the new download files"

echo -e "\n${GREEN}✨ Done! Your mobile apps are ready for download.${NC}"