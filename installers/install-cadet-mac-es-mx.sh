#!/bin/bash
# ============================================
# Instalador CADET para macOS - Español
# Región: México
# ============================================

set -e

INSTALLER_VERSION="1.0.0"
CADET_VERSION="2.5.0"
INSTALL_DIR="$HOME/Applications/CADET"
APP_BUNDLE="CADET.app"
DOWNLOAD_URL="https://cdn.cadet.ai/releases/${CADET_VERSION}/cadet-macos-universal.dmg"
MODEL_URL="https://cdn.cadet.ai/models/cadet-base-v2.gguf"

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   ¡Bienvenido a CADET - Tu asistente de código con IA      ║"
echo "║   Versión ${CADET_VERSION}                                        ║"
echo "║                                                              ║"
echo "║   Región: México                                            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "Este instalador configurará CADET en tu Mac."
echo ""
read -p "Presiona Enter para continuar..."

echo ""
echo -e "${BLUE}[1/5] Verificando requisitos del sistema...${NC}"
echo ""

# Verificar versión de macOS
OS_VERSION=$(sw_vers -productVersion)
MAJOR_VERSION=$(echo "$OS_VERSION" | cut -d. -f1)
if [ "$MAJOR_VERSION" -lt 12 ]; then
    echo -e "${RED}ERROR: CADET requiere macOS 12 (Monterey) o posterior.${NC}"
    echo "Tu versión: $OS_VERSION"
    exit 1
fi

# Verificar espacio en disco disponible (necesita al menos 20 GB)
FREE_SPACE=$(df -k / | awk 'NR==2 {print $4}')
REQUIRED_SPACE=$((20 * 1024 * 1024)) # 20 GB en KB
if [ "$FREE_SPACE" -lt "$REQUIRED_SPACE" ]; then
    echo -e "${YELLOW}ADVERTENCIA: Puede que no tengas suficiente espacio en disco.${NC}"
    echo "Requerido: 20 GB libres"
    echo -e "Disponible: ${FREE_SPACE}KB"
    echo ""
    read -p "¿Continuar de todos modos? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Verificar RAM
RAM_GB=$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2}')
if [ "$RAM_GB" -lt 8 ]; then
    echo -e "${YELLOW}ADVERTENCIA: CADET funciona mejor con 8 GB+ de RAM. Tienes ${RAM_GB} GB.${NC}"
    echo ""
    read -p "¿Continuar de todos modos? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Verificar arquitectura
ARCH=$(uname -m)
if [ "$ARCH" != "x86_64" ] && [ "$ARCH" != "arm64" ]; then
    echo -e "${RED}ERROR: Arquitectura no soportada: $ARCH${NC}"
    echo "CADET soporta Macs Intel (x86_64) y Apple Silicon (arm64)."
    exit 1
fi

echo -e "${GREEN}✓ ¡Verificación del sistema exitosa!${NC}"
echo ""

echo -e "${BLUE}[2/5] Preparando directorio de instalación...${NC}"
if [ -d "$INSTALL_DIR" ]; then
    echo "Eliminando instalación anterior..."
    rm -rf "$INSTALL_DIR"
fi
mkdir -p "$INSTALL_DIR"
echo -e "${GREEN}✓ Directorio listo${NC}"
echo ""

echo -e "${BLUE}[3/5] Descargando componentes de CADET...${NC}"
echo "Esto puede tomar unos minutos dependiendo de tu velocidad de internet..."
echo ""

# Descargar aplicación principal
echo "- Descargando aplicación CADET..."
curl -L --progress-bar "$DOWNLOAD_URL" -o "/tmp/cadet-${CADET_VERSION}.dmg" || {
    echo -e "${RED}ERROR: No se pudo descargar CADET.${NC}"
    echo "Verifica tu conexión a internet e intenta de nuevo."
    exit 1
}

# Montar imagen de disco
echo "- Montando imagen de disco..."
hdiutil attach "/tmp/cadet-${CADET_VERSION}.dmg" -nobrowse -quiet

# Copiar aplicación
echo "- Instalando aplicación..."
cp -R "/Volumes/CADET ${CADET_VERSION}/CADET.app" "$INSTALL_DIR/"

# Desmontar imagen de disco
hdiutil detach "/Volumes/CADET ${CADET_VERSION}" -quiet
rm "/tmp/cadet-${CADET_VERSION}.dmg"

echo "- Descargando modelos de lenguaje..."
echo "  (Este es un archivo grande - 4.2 GB)"
mkdir -p "$INSTALL_DIR/models"
curl -L --progress-bar "$MODEL_URL" -o "$INSTALL_DIR/models/base.gguf" || {
    echo -e "${YELLOW}ADVERTENCIA: No se pudo descargar el modelo de IA. Necesitarás descargarlo manualmente.${NC}"
}

echo -e "${GREEN}✓ ¡Descarga completa!${NC}"
echo ""

echo -e "${BLUE}[4/5] Creando accesos directos...${NC}"

# Crear enlace simbólico en Applications si no existe
if [ ! -d "/Applications/CADET.app" ]; then
    ln -sf "$INSTALL_DIR/CADET.app" "/Applications/CADET.app"
fi

# Agregar al Dock (opcional)
read -p "¿Agregar CADET al Dock? (s/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    defaults write com.apple.dock persistent-apps -array-add "<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>$INSTALL_DIR/CADET.app</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>"
    killall Dock
fi

echo -e "${GREEN}✓ Accesos directos creados${NC}"
echo ""

echo -e "${BLUE}[5/5] Finalizando instalación...${NC}"

# Crear archivo de configuración
cat > "$INSTALL_DIR/config.json" << EOF
{
  "version": "${CADET_VERSION}",
  "region": "mx",
  "language": "es-mx",
  "currency": "MXN",
  "firstRun": true,
  "installPath": "${INSTALL_DIR}"
}
EOF

# Crear enlace simbólico CLI
CLI_DIR="/usr/local/bin"
if [ ! -d "$CLI_DIR" ]; then
    sudo mkdir -p "$CLI_DIR"
fi

if [ -w "$CLI_DIR" ]; then
    ln -sf "$INSTALL_DIR/CADET.app/Contents/MacOS/cadet" "$CLI_DIR/cadet"
else
    echo "Crear el enlace CLI requiere privilegios de administrador..."
    sudo ln -sf "$INSTALL_DIR/CADET.app/Contents/MacOS/cadet" "$CLI_DIR/cadet"
fi

# Eliminar atributos de cuarentena
echo "Eliminando atributos de cuarentena..."
xattr -dr com.apple.quarantine "$INSTALL_DIR/CADET.app" 2>/dev/null || true

echo -e "${GREEN}✓ ¡Instalación completa!${NC}"
echo ""

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    ¡INSTALACIÓN EXITOSA!                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "CADET ha sido instalado en: $INSTALL_DIR"
echo ""
echo "Para comenzar:"
echo "   1. Abre CADET desde tu carpeta Applications"
echo "   2. O usa Spotlight (⌘+Espacio) y escribe 'CADET'"
echo "   3. O escribe 'cadet' en cualquier ventana de Terminal"
echo ""
echo "¿Necesitas ayuda? Visita: https://cadet.ai/ayuda"
echo "Correo de soporte: ayuda@cadet.ai"
echo ""
read -p "Presiona Enter para iniciar CADET..."

open "$INSTALL_DIR/CADET.app"
exit 0
