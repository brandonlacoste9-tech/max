#!/bin/bash

# CADET Lite - macOS Installation Script
# Lightweight version with only Llama 3.1 (~5 GB instead of ~15 GB)

set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CADET_DIR="$HOME/Cadet-AI"
REQUIRED_GB=5
REQUIRED_BYTES=$((REQUIRED_GB * 1024 * 1024 * 1024))

# Function to print colored output
print_header() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                              ║${NC}"
    echo -e "${BLUE}║${NC}              🤖 CADET Lite - Autonomous Intelligence         ${BLUE}║${NC}"
    echo -e "${BLUE}║                                                              ║${NC}"
    echo -e "${BLUE}║${NC}              ⚡ LIGHT VERSION - Only 5 GB Required!          ${BLUE}║${NC}"
    echo -e "${BLUE}║                                                              ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This installer is for macOS only."
    echo "For Windows, please use install-cadet-windows-lite.bat"
    exit 1
fi

# Check macOS version (12+ required)
MACOS_VERSION=$(sw_vers -productVersion)
MAJOR_VERSION=$(echo "$MACOS_VERSION" | cut -d. -f1)
if [[ "$MAJOR_VERSION" -lt 12 ]]; then
    print_error "macOS 12 (Monterey) or later is required."
    echo "Your version: macOS $MACOS_VERSION"
    exit 1
fi

print_header

print_info "This is the LITE version (1 AI model, ~5 GB)"
print_info "For maximum benefits (3 models, ~15 GB), use the full installer:"
echo "    https://github.com/brandonlacoste9-tech/max/raw/main/install-cadet-mac.sh"
echo ""

# Check available disk space
print_step "Checking available disk space..."
FREE_BYTES=$(df -b "$HOME" | awk 'NR==2 {print $4}')
FREE_GB=$((FREE_BYTES / 1024 / 1024 / 1024))

if [[ "$FREE_BYTES" -lt "$REQUIRED_BYTES" ]]; then
    print_error "Not enough disk space!"
    echo "Required: ~$REQUIRED_GB GB free (Lite version)"
    echo "Available: ~$FREE_GB GB"
    echo ""
    echo "The Lite version needs at least 5 GB."
    echo "Please free up some space and try again."
    exit 1
fi
print_success "Sufficient disk space detected (~$FREE_GB GB free)"
echo ""

# Check if Homebrew is installed
print_step "Checking for Homebrew..."
if ! command -v brew &> /dev/null; then
    print_info "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ -f /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    print_success "Homebrew installed"
else
    print_success "Homebrew is already installed"
fi
echo ""

# Check if Ollama is installed
print_step "Checking for Ollama..."
if ! command -v ollama &> /dev/null; then
    print_info "Installing Ollama..."
    brew install --cask ollama
    
    # Wait for Ollama to be available
    print_info "Waiting for Ollama to start..."
    sleep 5
    
    # Start Ollama service
    brew services start ollama
    sleep 3
    
    print_success "Ollama installed and started"
else
    print_success "Ollama is already installed"
    
    # Make sure Ollama service is running
    if ! pgrep -x "ollama" > /dev/null; then
        print_info "Starting Ollama service..."
        brew services start ollama
        sleep 3
    fi
fi
echo ""

# Check if Python 3 is installed
print_step "Checking for Python 3..."
if ! command -v python3 &> /dev/null; then
    print_info "Installing Python 3..."
    brew install python
    print_success "Python 3 installed"
else
    print_success "Python 3 is already installed ($(python3 --version))"
fi
echo ""

# Check if Git is installed
print_step "Checking for Git..."
if ! command -v git &> /dev/null; then
    print_info "Installing Git..."
    brew install git
    print_success "Git installed"
else
    print_success "Git is already installed"
fi
echo ""

# Create CADET directory
print_step "Creating CADET directory..."
mkdir -p "$CADET_DIR"
cd "$CADET_DIR"
print_success "Directory ready: $CADET_DIR"
echo ""

# Clone or update CADET
print_step "Installing CADET..."
if [[ -d ".git" ]]; then
    print_info "Updating CADET..."
    git pull
else
    print_info "Downloading CADET..."
    git clone https://github.com/brandonlacoste9-tech/max.git .
fi
print_success "CADET ready"
echo ""

# Install Python packages
print_step "Installing Python packages..."
pip3 install -e packages/floguru-shared --quiet
pip3 install -e packages/floguru-api --quiet
print_success "Packages installed"
echo ""

# Download only Llama 3.1 (Lite version)
print_step "Downloading AI Model (Lite Version - Llama 3.1 only)..."
print_info "This is the RECOMMENDED model for most users."
echo ""

print_info "Downloading Llama 3.1 (~4.7 GB) - General purpose AI..."
ollama pull llama3.1
print_success "Llama 3.1 ready!"

echo ""
print_info "💡 Tip: You can add more models later by running:"
echo "    ollama pull gemma3:4b       # Fast responses (~2.5 GB)"
echo "    ollama pull qwen2.5-coder:7b # Programming (~4.4 GB)"
echo ""

# Create launch script
cat > "$CADET_DIR/start-cadet-lite.command" << 'EOF'
#!/bin/bash
cd "$HOME/Cadet-AI"
echo "🚀 Starting CADET Lite..."
echo "   Version: LITE (1 model - Llama 3.1)"
echo "   For 3 models, upgrade to full version"
echo ""
python3 floguru.py api
EOF

chmod +x "$CADET_DIR/start-cadet-lite.command"

# Create desktop shortcut
DESKTOP_SHORTCUT="$HOME/Desktop/Cadet AI Lite.command"
cp "$CADET_DIR/start-cadet-lite.command" "$DESKTOP_SHORTCUT"
chmod +x "$DESKTOP_SHORTCUT"

# Create application in Applications folder
APP_DIR="$HOME/Applications/Cadet AI Lite.app/Contents/MacOS"
mkdir -p "$APP_DIR"

cat > "$APP_DIR/Cadet AI Lite" << 'EOF'
#!/bin/bash
cd "$HOME/Cadet-AI"
osascript <<'APPLESCRIPT'
tell application "Terminal"
    do script "cd $HOME/Cadet-AI && clear && echo '🤖 CADET Lite - Autonomous Intelligence' && echo 'Version: LITE (1 model)' && echo '' && echo 'Starting your AI assistant...' && echo '' && python3 floguru.py api"
    activate
end tell
APPLESCRIPT
EOF

chmod +x "$APP_DIR/Cadet AI Lite"

# Create Info.plist for the app
cat > "$HOME/Applications/Cadet AI Lite.app/Contents/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>Cadet AI Lite</string>
    <key>CFBundleIdentifier</key>
    <string>com.floguru.cadet-lite</string>
    <key>CFBundleName</key>
    <string>Cadet AI Lite</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>12.0</string>
</dict>
</plist>
EOF

# Installation complete
print_header
print_success "INSTALLATION COMPLETE! (Lite Version)"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "   📍 Installation location: $CADET_DIR"
echo "   🖥️  Desktop shortcut: Cadet AI Lite"
echo "   🚀 Applications folder: Cadet AI Lite.app"
echo "   🌐 Web interface: http://localhost:8420"
echo ""
echo "   ✓ Installed: Llama 3.1 (General AI, ~4.7 GB)"
echo "   ⏳ Optional: Gemma 3, Qwen Coder (install later)"
echo ""
echo "   ⚡ You installed the LIGHT version (1 model)"
echo "   💡 For maximum benefits (3 models, better performance):"
echo "      Visit: https://github.com/brandonlacoste9-tech/max"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Ask if user wants to start now
read -p "🚀 Would you like to start CADET Lite now? (y/N): " START_NOW
if [[ "$START_NOW" =~ ^[Yy]$ ]]; then
    echo ""
    print_step "Starting CADET Lite..."
    open http://localhost:8420
    python3 floguru.py api
else
    echo ""
    print_info "You can start CADET Lite anytime by double-clicking the desktop shortcut!"
    echo ""
    read -p "Press Enter to exit..."
fi
