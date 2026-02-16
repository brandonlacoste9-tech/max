#!/bin/bash
# ============================================
# Installateur CADET pour macOS - Français
# Région: Québec, Canada
# ============================================

set -e

INSTALLER_VERSION="1.0.0"
CADET_VERSION="2.5.0"
INSTALL_DIR="$HOME/Applications/CADET"
APP_BUNDLE="CADET.app"
DOWNLOAD_URL="https://cdn.cadet.ai/releases/${CADET_VERSION}/cadet-macos-universal.dmg"
MODEL_URL="https://cdn.cadet.ai/models/cadet-base-v2.gguf"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Aucune couleur

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   Bienvenue dans CADET - Ton assistant de codage IA         ║"
echo "║   Version ${CADET_VERSION}                                        ║"
echo "║                                                              ║"
echo "║   Région: Québec, Canada                                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "Cet installateur va configurer CADET sur ton Mac."
echo "On utilise le 'tu' parce qu'on est entre nous ;)"
echo ""
read -p "Appuie sur Entrée pour continuer..."

echo ""
echo -e "${BLUE}[1/5] Vérification de la configuration système...${NC}"
echo ""

# Vérifier la version de macOS
OS_VERSION=$(sw_vers -productVersion)
MAJOR_VERSION=$(echo "$OS_VERSION" | cut -d. -f1)
if [ "$MAJOR_VERSION" -lt 12 ]; then
    echo -e "${RED}ERREUR: CADET nécessite macOS 12 (Monterey) ou plus récent.${NC}"
    echo "Ta version: $OS_VERSION"
    exit 1
fi

# Vérifier l'espace disque disponible (besoin d'au moins 20 Go)
FREE_SPACE=$(df -k / | awk 'NR==2 {print $4}')
REQUIRED_SPACE=$((20 * 1024 * 1024)) # 20 Go en Ko
if [ "$FREE_SPACE" -lt "$REQUIRED_SPACE" ]; then
    echo -e "${YELLOW}ATTENTION: Tu n'as peut-être pas assez d'espace disque.${NC}"
    echo "Requis: 20 Go libres"
    echo -e "Disponible: ${FREE_SPACE}Ko"
    echo ""
    read -p "Continuer quand même? (o/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        exit 1
    fi
fi

# Vérifier la RAM
RAM_GB=$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2}')
if [ "$RAM_GB" -lt 8 ]; then
    echo -e "${YELLOW}ATTENTION: CADET fonctionne mieux avec 8 Go+ de RAM. Tu as ${RAM_GB} Go.${NC}"
    echo ""
    read -p "Continuer quand même? (o/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        exit 1
    fi
fi

# Vérifier l'architecture
ARCH=$(uname -m)
if [ "$ARCH" != "x86_64" ] && [ "$ARCH" != "arm64" ]; then
    echo -e "${RED}ERREUR: Architecture non supportée: $ARCH${NC}"
    echo "CADET supporte les Mac Intel (x86_64) et Apple Silicon (arm64)."
    exit 1
fi

echo -e "${GREEN}✓ Vérification système réussie!${NC}"
echo ""

echo -e "${BLUE}[2/5] Préparation du répertoire d'installation...${NC}"
if [ -d "$INSTALL_DIR" ]; then
    echo "Suppression de l'installation précédente..."
    rm -rf "$INSTALL_DIR"
fi
mkdir -p "$INSTALL_DIR"
echo -e "${GREEN}✓ Répertoire prêt${NC}"
echo ""

echo -e "${BLUE}[3/5] Téléchargement des composants CADET...${NC}"
echo "Ça peut prendre quelques minutes selon ta connexion internet..."
echo ""

# Télécharger l'application principale
echo "- Téléchargement de l'application CADET..."
curl -L --progress-bar "$DOWNLOAD_URL" -o "/tmp/cadet-${CADET_VERSION}.dmg" || {
    echo -e "${RED}ERREUR: Impossible de télécharger CADET.${NC}"
    echo "Vérifie ta connexion internet et réessaie."
    exit 1
}

# Monter l'image disque
echo "- Montage de l'image disque..."
hdiutil attach "/tmp/cadet-${CADET_VERSION}.dmg" -nobrowse -quiet

# Copier l'application
echo "- Installation de l'application..."
cp -R "/Volumes/CADET ${CADET_VERSION}/CADET.app" "$INSTALL_DIR/"

# Démonter l'image disque
hdiutil detach "/Volumes/CADET ${CADET_VERSION}" -quiet
rm "/tmp/cadet-${CADET_VERSION}.dmg"

echo "- Téléchargement des modèles de langue..."
echo "  (C'est un gros fichier - 4.2 Go)"
mkdir -p "$INSTALL_DIR/models"
curl -L --progress-bar "$MODEL_URL" -o "$INSTALL_DIR/models/base.gguf" || {
    echo -e "${YELLOW}ATTENTION: Impossible de télécharger le modèle IA. Tu devras le télécharger manuellement.${NC}"
}

echo -e "${GREEN}✓ Téléchargement terminé${NC}"
echo ""

echo -e "${BLUE}[4/5] Création des raccourcis...${NC}"

# Créer le lien symbolique Applications si inexistant
if [ ! -d "/Applications/CADET.app" ]; then
    ln -sf "$INSTALL_DIR/CADET.app" "/Applications/CADET.app"
fi

# Ajouter au Dock (optionnel)
read -p "Ajouter CADET au Dock? (o/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    defaults write com.apple.dock persistent-apps -array-add "<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>$INSTALL_DIR/CADET.app</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>"
    killall Dock
fi

echo -e "${GREEN}✓ Raccourcis créés${NC}"
echo ""

echo -e "${BLUE}[5/5] Finalisation de l'installation...${NC}"

# Créer le fichier de config
cat > "$INSTALL_DIR/config.json" << EOF
{
  "version": "${CADET_VERSION}",
  "region": "ca-qc",
  "language": "fr",
  "currency": "CAD",
  "firstRun": true,
  "installPath": "${INSTALL_DIR}"
}
EOF

# Créer le lien symbolique CLI
CLI_DIR="/usr/local/bin"
if [ ! -d "$CLI_DIR" ]; then
    sudo mkdir -p "$CLI_DIR"
fi

if [ -w "$CLI_DIR" ]; then
    ln -sf "$INSTALL_DIR/CADET.app/Contents/MacOS/cadet" "$CLI_DIR/cadet"
else
    echo "Créer le lien CLI nécessite les droits admin..."
    sudo ln -sf "$INSTALL_DIR/CADET.app/Contents/MacOS/cadet" "$CLI_DIR/cadet"
fi

# Supprimer les attributs de quarantaine
echo "Suppression des attributs de quarantaine..."
xattr -dr com.apple.quarantine "$INSTALL_DIR/CADET.app" 2>/dev/null || true

echo -e "${GREEN}✓ Installation terminée!${NC}"
echo ""

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  INSTALLATION RÉUSSIE!                        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "CADET a été installé dans: $INSTALL_DIR"
echo ""
echo "Pour commencer:"
echo "   1. Ouvre CADET depuis ton dossier Applications"
echo "   2. Ou utilise Spotlight (⌘+Espace) et tape 'CADET'"
echo "   3. Ou tape 'cadet' dans n'importe quelle fenêtre Terminal"
echo ""
echo "Besoin d'aide? Visite: https://cadet.ai/aide"
echo "Courriel support: aide@cadet.ai"
echo ""
read -p "Appuie sur Entrée pour lancer CADET..."

open "$INSTALL_DIR/CADET.app"
exit 0
