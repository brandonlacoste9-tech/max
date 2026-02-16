#!/bin/bash
# ============================================
# Instalador CADET para macOS - Português
# Região: Brasil
# ============================================

set -e

INSTALLER_VERSION="1.0.0"
CADET_VERSION="2.5.0"
INSTALL_DIR="$HOME/Applications/CADET"
APP_BUNDLE="CADET.app"
DOWNLOAD_URL="https://cdn.cadet.ai/releases/${CADET_VERSION}/cadet-macos-universal.dmg"
MODEL_URL="https://cdn.cadet.ai/models/cadet-base-v2.gguf"

# Cores para a saída
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   Bem-vindo ao CADET - Seu assistente de código com IA      ║"
echo "║   Versão ${CADET_VERSION}                                        ║"
echo "║                                                              ║"
echo "║   Região: Brasil                                            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "Este instalador vai configurar o CADET no seu Mac."
echo ""
read -p "Pressione Enter para continuar..."

echo ""
echo -e "${BLUE}[1/5] Verificando requisitos do sistema...${NC}"
echo ""

# Verificar versão do macOS
OS_VERSION=$(sw_vers -productVersion)
MAJOR_VERSION=$(echo "$OS_VERSION" | cut -d. -f1)
if [ "$MAJOR_VERSION" -lt 12 ]; then
    echo -e "${RED}ERRO: CADET requer macOS 12 (Monterey) ou superior.${NC}"
    echo "Sua versão: $OS_VERSION"
    exit 1
fi

# Verificar espaço em disco disponível (precisa de pelo menos 20 GB)
FREE_SPACE=$(df -k / | awk 'NR==2 {print $4}')
REQUIRED_SPACE=$((20 * 1024 * 1024)) # 20 GB em KB
if [ "$FREE_SPACE" -lt "$REQUIRED_SPACE" ]; then
    echo -e "${YELLOW}AVISO: Você pode não ter espaço suficiente em disco.${NC}"
    echo "Requerido: 20 GB livres"
    echo -e "Disponível: ${FREE_SPACE}KB"
    echo ""
    read -p "Continuar mesmo assim? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Verificar RAM
RAM_GB=$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2}')
if [ "$RAM_GB" -lt 8 ]; then
    echo -e "${YELLOW}AVISO: CADET funciona melhor com 8 GB+ de RAM. Você tem ${RAM_GB} GB.${NC}"
    echo ""
    read -p "Continuar mesmo assim? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Verificar arquitetura
ARCH=$(uname -m)
if [ "$ARCH" != "x86_64" ] && [ "$ARCH" != "arm64" ]; then
    echo -e "${RED}ERRO: Arquitetura não suportada: $ARCH${NC}"
    echo "CADET suporta Macs Intel (x86_64) e Apple Silicon (arm64)."
    exit 1
fi

echo -e "${GREEN}✓ Verificação do sistema bem-sucedida!${NC}"
echo ""

echo -e "${BLUE}[2/5] Preparando diretório de instalação...${NC}"
if [ -d "$INSTALL_DIR" ]; then
    echo "Removendo instalação anterior..."
    rm -rf "$INSTALL_DIR"
fi
mkdir -p "$INSTALL_DIR"
echo -e "${GREEN}✓ Diretório pronto${NC}"
echo ""

echo -e "${BLUE}[3/5] Baixando componentes do CADET...${NC}"
echo "Isso pode levar alguns minutos dependendo da sua velocidade de internet..."
echo ""

# Baixar aplicativo principal
echo "- Baixando aplicativo CADET..."
curl -L --progress-bar "$DOWNLOAD_URL" -o "/tmp/cadet-${CADET_VERSION}.dmg" || {
    echo -e "${RED}ERRO: Falha ao baixar o CADET.${NC}"
    echo "Verifique sua conexão com a internet e tente novamente."
    exit 1
}

# Montar imagem de disco
echo "- Montando imagem de disco..."
hdiutil attach "/tmp/cadet-${CADET_VERSION}.dmg" -nobrowse -quiet

# Copiar aplicativo
echo "- Instalando aplicativo..."
cp -R "/Volumes/CADET ${CADET_VERSION}/CADET.app" "$INSTALL_DIR/"

# Desmontar imagem de disco
hdiutil detach "/Volumes/CADET ${CADET_VERSION}" -quiet
rm "/tmp/cadet-${CADET_VERSION}.dmg"

echo "- Baixando modelos de linguagem..."
echo "  (Este é um arquivo grande - 4.2 GB)"
mkdir -p "$INSTALL_DIR/models"
curl -L --progress-bar "$MODEL_URL" -o "$INSTALL_DIR/models/base.gguf" || {
    echo -e "${YELLOW}AVISO: Não foi possível baixar o modelo de IA. Você precisará baixá-lo manualmente.${NC}"
}

echo -e "${GREEN}✓ Download completo!${NC}"
echo ""

echo -e "${BLUE}[4/5] Criando atalhos...${NC}"

# Criar link simbólico em Applications se não existir
if [ ! -d "/Applications/CADET.app" ]; then
    ln -sf "$INSTALL_DIR/CADET.app" "/Applications/CADET.app"
fi

# Adicionar ao Dock (opcional)
read -p "Adicionar CADET ao Dock? (s/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    defaults write com.apple.dock persistent-apps -array-add "<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>$INSTALL_DIR/CADET.app</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>"
    killall Dock
fi

echo -e "${GREEN}✓ Atalhos criados${NC}"
echo ""

echo -e "${BLUE}[5/5] Finalizando instalação...${NC}"

# Criar arquivo de configuração
cat > "$INSTALL_DIR/config.json" << EOF
{
  "version": "${CADET_VERSION}",
  "region": "br",
  "language": "pt-br",
  "currency": "BRL",
  "firstRun": true,
  "installPath": "${INSTALL_DIR}"
}
EOF

# Criar link simbólico CLI
CLI_DIR="/usr/local/bin"
if [ ! -d "$CLI_DIR" ]; then
    sudo mkdir -p "$CLI_DIR"
fi

if [ -w "$CLI_DIR" ]; then
    ln -sf "$INSTALL_DIR/CADET.app/Contents/MacOS/cadet" "$CLI_DIR/cadet"
else
    echo "Criar o link CLI requer privilégios de administrador..."
    sudo ln -sf "$INSTALL_DIR/CADET.app/Contents/MacOS/cadet" "$CLI_DIR/cadet"
fi

# Remover atributos de quarentena
echo "Removendo atributos de quarentena..."
xattr -dr com.apple.quarantine "$INSTALL_DIR/CADET.app" 2>/dev/null || true

echo -e "${GREEN}✓ Instalação completa!${NC}"
echo ""

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  INSTALAÇÃO BEM-SUCEDIDA!                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "CADET foi instalado em: $INSTALL_DIR"
echo ""
echo "Para começar:"
echo "   1. Abra o CADET da sua pasta Applications"
echo "   2. Ou use o Spotlight (⌘+Espaço) e digite 'CADET'"
echo "   3. Ou digite 'cadet' em qualquer janela do Terminal"
echo ""
echo "Precisa de ajuda? Visite: https://cadet.ai/ajuda"
echo "Email de suporte: ajuda@cadet.ai"
echo ""
read -p "Pressione qualquer tecla para iniciar o CADET..."

open "$INSTALL_DIR/CADET.app"
exit 0
