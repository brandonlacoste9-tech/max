#!/bin/bash

# MAX AI Launcher - macOS Installation Script
# One-click installer for non-technical users

set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CADET_DIR="$HOME/Cadet-AI"
REQUIRED_GB=15
REQUIRED_BYTES=$((REQUIRED_GB * 1024 * 1024 * 1024))

# Function to print colored output
print_header() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                              ║${NC}"
    echo -e "${BLUE}║${NC}              🤖 CADET - Autonomous Intelligence              ${BLUE}║${NC}"
    echo -e "${BLUE}║                                                              ║${NC}"
    echo -e "${BLUE}║${NC}         No API keys. No subscriptions. 100% Private.         ${BLUE}║${NC}"
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
    echo "For Windows, please use install-max-windows.bat"
    echo "For Linux, please install manually following the README."
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

# Check available disk space
print_step "Checking available disk space..."
FREE_BYTES=$(df -b "$HOME" | awk 'NR==2 {print $4}')
FREE_GB=$((FREE_BYTES / 1024 / 1024 / 1024))

if [[ "$FREE_BYTES" -lt "$REQUIRED_BYTES" ]]; then
    print_error "Not enough disk space!"
    echo "Required: ~$REQUIRED_GB GB free"
    echo "Available: ~$FREE_GB GB"
    echo ""
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

# Clone or update FloGuru
print_step "Installing FloGuru..."
if [[ -d ".git" ]]; then
    print_info "Updating FloGuru..."
    git pull
else
    print_info "Downloading FloGuru..."
    git clone https://github.com/brandonlacoste9-tech/max.git .
fi
print_success "FloGuru ready"
echo ""

# Install Python packages
print_step "Installing Python packages..."
pip3 install -e packages/floguru-shared --quiet
pip3 install -e packages/floguru-api --quiet
print_success "Packages installed"
echo ""

# Download AI models
print_step "Downloading AI models (this may take 10-20 minutes)..."
echo ""

print_info "Downloading Llama 3.1 (~4.7 GB) - General purpose AI..."
ollama pull llama3.1
print_success "Llama 3.1 ready"

print_info "Downloading Gemma 3 (~2.5 GB) - Fast responses..."
ollama pull gemma3:4b
print_success "Gemma 3 ready"

print_info "Downloading Qwen Coder (~4.4 GB) - Programming assistant..."
ollama pull qwen2.5-coder:7b
print_success "Qwen Coder ready"

echo ""
print_success "All AI models downloaded!"
echo ""

# Create launch script
cat > "$CADET_DIR/start-cadet.command" << 'EOF'
#!/bin/bash
cd "$HOME/Cadet-AI"
echo "🚀 Starting CADET..."
echo "   This window will stay open while CADET is running"
echo "   Close this window to stop CADET"
echo ""
python3 floguru.py api
EOF

chmod +x "$CADET_DIR/start-cadet.command"

# Create an app launcher using Automator/AppleScript
cat > "$MAX_DIR/MAX AI.app.command" << 'EOF'
#!/bin/bash
# Double-clickable launcher for MAX AI
osascript <<'APPLESCRIPT'
tell application "Terminal"
    do script "cd $HOME/MAX-AI && echo '🚀 Starting MAX AI...' && echo 'Opening browser in 5 seconds...' && (sleep 5 && open http://localhost:8420) & python3 floguru.py api"
    activate
end tell
APPLESCRIPT
EOF

chmod +x "$MAX_DIR/MAX AI.app.command"

# Create desktop shortcut
DESKTOP_SHORTCUT="$HOME/Desktop/Cadet AI.command"
cp "$CADET_DIR/start-cadet.command" "$DESKTOP_SHORTCUT"
chmod +x "$DESKTOP_SHORTCUT"

# Create application in Applications folder
APP_DIR="$HOME/Applications/Cadet AI.app/Contents/MacOS"
mkdir -p "$APP_DIR"

cat > "$APP_DIR/Cadet AI" << 'EOF'
#!/bin/bash
cd "$HOME/Cadet-AI"
osascript <<'APPLESCRIPT'
tell application "Terminal"
    do script "cd $HOME/Cadet-AI && clear && echo '🤖 CADET - Autonomous Intelligence' && echo '' && echo 'Starting your AI assistant...' && echo '' && python3 floguru.py api"
    activate
end tell
APPLESCRIPT
EOF

chmod +x "$APP_DIR/Cadet AI"

# Create Info.plist for the app
cat > "$HOME/Applications/Cadet AI.app/Contents/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>Cadet AI</string>
    <key>CFBundleIdentifier</key>
    <string>com.floguru.cadet</string>
    <key>CFBundleName</key>
    <string>Cadet AI</string>
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
print_success "INSTALLATION COMPLETE!"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "   📍 Installation location: $CADET_DIR"
echo "   🖥️  Desktop shortcut: Cadet AI (on your Desktop)"
echo "   🚀 Applications folder: Cadet AI.app"
echo "   🌐 Web interface: http://localhost:8420"
echo ""
echo "   To start CADET in the future:"
echo "   • Double-click 'Cadet AI' on your desktop, OR"
echo "   • Open 'Cadet AI' from your Applications folder"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Ask if user wants to start now
read -p "🚀 Would you like to start CADET now? (y/N): " START_NOW
if [[ "$START_NOW" =~ ^[Yy]$ ]]; then
    echo ""
    print_step "Starting CADET..."
    open http://localhost:8420
    python3 floguru.py api
else
    echo ""
    print_info "You can start CADET anytime by double-clicking the desktop shortcut!"
    echo ""
    read -p "Press Enter to exit..."
fi
