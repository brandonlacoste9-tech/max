#!/bin/bash
# ============================================
# CADET Installer for macOS - English
# Region: US / International
# ============================================

set -e

INSTALLER_VERSION="1.0.0"
CADET_VERSION="2.5.0"
INSTALL_DIR="$HOME/Applications/CADET"
APP_BUNDLE="CADET.app"
DOWNLOAD_URL="https://cdn.cadet.ai/releases/${CADET_VERSION}/cadet-macos-universal.dmg"
MODEL_URL="https://cdn.cadet.ai/models/cadet-base-v2.gguf"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   Welcome to CADET - Your AI Coding Assistant               ║"
echo "║   Version ${CADET_VERSION}                                        ║"
echo "║                                                              ║"
echo "║   Region: United States / International                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "This installer will set up CADET on your Mac."
echo ""
read -p "Press Enter to continue..."

echo ""
echo -e "${BLUE}[1/5] Checking system requirements...${NC}"
echo ""

# Check macOS version
OS_VERSION=$(sw_vers -productVersion)
MAJOR_VERSION=$(echo "$OS_VERSION" | cut -d. -f1)
if [ "$MAJOR_VERSION" -lt 12 ]; then
    echo -e "${RED}ERROR: CADET requires macOS 12 (Monterey) or later.${NC}"
    echo "Your version: $OS_VERSION"
    exit 1
fi

# Check available disk space (need at least 20GB)
FREE_SPACE=$(df -k / | awk 'NR==2 {print $4}')
REQUIRED_SPACE=$((20 * 1024 * 1024)) # 20GB in KB
if [ "$FREE_SPACE" -lt "$REQUIRED_SPACE" ]; then
    echo -e "${YELLOW}WARNING: You may not have enough disk space.${NC}"
    echo "Required: 20 GB free"
    echo -e "Available: ${FREE_SPACE}KB"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check RAM
RAM_GB=$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2}')
if [ "$RAM_GB" -lt 8 ]; then
    echo -e "${YELLOW}WARNING: CADET works best with 8GB+ RAM. You have ${RAM_GB}GB.${NC}"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check architecture
ARCH=$(uname -m)
if [ "$ARCH" != "x86_64" ] && [ "$ARCH" != "arm64" ]; then
    echo -e "${RED}ERROR: Unsupported architecture: $ARCH${NC}"
    echo "CADET supports Intel (x86_64) and Apple Silicon (arm64) Macs."
    exit 1
fi

echo -e "${GREEN}✓ System check passed!${NC}"
echo ""

echo -e "${BLUE}[2/5] Preparing installation directory...${NC}"
if [ -d "$INSTALL_DIR" ]; then
    echo "Removing previous installation..."
    rm -rf "$INSTALL_DIR"
fi
mkdir -p "$INSTALL_DIR"
echo -e "${GREEN}✓ Directory ready${NC}"
echo ""

echo -e "${BLUE}[3/5] Downloading CADET components...${NC}"
echo "This may take a few minutes depending on your internet speed..."
echo ""

# Download main application
echo "- Downloading CADET application..."
curl -L --progress-bar "$DOWNLOAD_URL" -o "/tmp/cadet-${CADET_VERSION}.dmg" || {
    echo -e "${RED}ERROR: Failed to download CADET.${NC}"
    echo "Please check your internet connection and try again."
    exit 1
}

# Mount DMG
echo "- Mounting disk image..."
hdiutil attach "/tmp/cadet-${CADET_VERSION}.dmg" -nobrowse -quiet

# Copy application
echo "- Installing application..."
cp -R "/Volumes/CADET ${CADET_VERSION}/CADET.app" "$INSTALL_DIR/"

# Unmount DMG
hdiutil detach "/Volumes/CADET ${CADET_VERSION}" -quiet
rm "/tmp/cadet-${CADET_VERSION}.dmg"

echo "- Downloading language models..."
echo "  (This is a large file - 4.2 GB)"
mkdir -p "$INSTALL_DIR/models"
curl -L --progress-bar "$MODEL_URL" -o "$INSTALL_DIR/models/base.gguf" || {
    echo -e "${YELLOW}WARNING: Could not download AI model. You'll need to download it manually.${NC}"
}

echo -e "${GREEN}✓ Download complete${NC}"
echo ""

echo -e "${BLUE}[4/5] Creating shortcuts...${NC}"

# Create Applications symlink if not exists
if [ ! -d "/Applications/CADET.app" ]; then
    ln -sf "$INSTALL_DIR/CADET.app" "/Applications/CADET.app"
fi

# Add to Dock (optional)
read -p "Add CADET to Dock? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    defaults write com.apple.dock persistent-apps -array-add "<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>$INSTALL_DIR/CADET.app</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>"
    killall Dock
fi

echo -e "${GREEN}✓ Shortcuts created${NC}"
echo ""

echo -e "${BLUE}[5/5] Finalizing installation...${NC}"

# Create config file
cat > "$INSTALL_DIR/config.json" << EOF
{
  "version": "${CADET_VERSION}",
  "region": "us",
  "language": "en",
  "currency": "USD",
  "firstRun": true,
  "installPath": "${INSTALL_DIR}"
}
EOF

# Create CLI symlink
CLI_DIR="/usr/local/bin"
if [ ! -d "$CLI_DIR" ]; then
    sudo mkdir -p "$CLI_DIR"
fi

if [ -w "$CLI_DIR" ]; then
    ln -sf "$INSTALL_DIR/CADET.app/Contents/MacOS/cadet" "$CLI_DIR/cadet"
else
    echo "Creating CLI symlink requires admin privileges..."
    sudo ln -sf "$INSTALL_DIR/CADET.app/Contents/MacOS/cadet" "$CLI_DIR/cadet"
fi

# Quarantine workaround
echo "Removing quarantine attributes..."
xattr -dr com.apple.quarantine "$INSTALL_DIR/CADET.app" 2>/dev/null || true

echo -e "${GREEN}✓ Installation complete!${NC}"
echo ""

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                      INSTALLATION SUCCESSFUL                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "CADET has been installed to: $INSTALL_DIR"
echo ""
echo "Getting Started:"
echo "   1. Open CADET from your Applications folder"
echo "   2. Or use Spotlight (⌘+Space) and type 'CADET'"
echo "   3. Or type 'cadet' in any Terminal window"
echo ""
echo "Need help? Visit: https://cadet.ai/help"
echo "Support email: support@cadet.ai"
echo ""
read -p "Press Enter to launch CADET..."

open "$INSTALL_DIR/CADET.app"
exit 0
