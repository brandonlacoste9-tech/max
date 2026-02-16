@echo off
chcp 65001 >nul
title Installateur CADET - Français (Québec)
color 0A

:: ============================================
:: Installateur CADET pour Windows - Français
:: Région: Québec, Canada
:: ============================================

set INSTALLER_VERSION=1.0.0
set CADET_VERSION=2.5.0
set INSTALL_DIR=%LOCALAPPDATA%\CADET
set DESKTOP_SHORTCUT=%USERPROFILE%\Desktop\CADET.lnk
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\CADET

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                                                              ║
echo  ║   Bienvenue dans CADET - Ton assistant de codage IA         ║
echo  ║   Version %CADET_VERSION%                                        ║
echo  ║                                                              ║
echo  ║   Région: Québec, Canada                                    ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.
echo  Cet installateur va configurer CADET sur ton ordinateur.
echo  On utilise le "tu" parce qu'on est entre nous ;)
echo.
pause

echo.
echo [1/5] Vérification de la configuration système...
echo.

:: Vérifier la version de Windows
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
if "%version%" LSS "10.0" (
    echo ERREUR: CADET nécessite Windows 10 ou plus récent.
    echo Ta version: %version%
    pause
    exit /b 1
)

:: Vérifier l'espace disque (besoin d'au moins 15 Go)
for /f "usebackq tokens=3" %%a in (`dir /-c %SystemDrive%\ ^| find "octets libres"`) do set FREE_SPACE=%%a
set FREE_SPACE=%FREE_SPACE:,=%
if %FREE_SPACE% LSS 16106127360 (
    echo ATTENTION: Tu n'as peut-être pas assez d'espace disque.
    echo Requis: 15 Go libres
    echo Disponible: %FREE_SPACE% octets
    echo.
    choice /C ON /M "Continuer quand même"
    if errorlevel 2 exit /b 1
)

:: Vérifier la RAM
for /f "skip=1" %%a in ('wmic computersystem get totalphysicalmemory') do (
    set RAM=%%a
    goto :ram_checked
)
:ram_checked
set RAM_GB=%RAM:~0,-9%
if %RAM_GB% LSS 8 (
    echo ATTENTION: CADET fonctionne mieux avec 8 Go+ de RAM. Tu as %RAM_GB% Go.
    echo.
    choice /C ON /M "Continuer quand même"
    if errorlevel 2 exit /b 1
)

echo ✓ Vérification système réussie!
echo.

echo [2/5] Préparation du répertoire d'installation...
if exist "%INSTALL_DIR%" (
    echo Suppression de l'installation précédente...
    rmdir /s /q "%INSTALL_DIR%"
)
mkdir "%INSTALL_DIR%"
echo ✓ Répertoire prêt
echo.

echo [3/5] Téléchargement des composants CADET...
echo Ça peut prendre quelques minutes selon ta connexion internet...
echo.

:: Télécharger l'application principale
echo - Téléchargement de l'application principale...
powershell -Command "Invoke-WebRequest -Uri 'https://cdn.cadet.ai/releases/%CADET_VERSION%/cadet-core-win-x64.exe' -OutFile '%INSTALL_DIR%\cadet.exe' -UseBasicP" 2>nul || (
    echo ERREUR: Impossible de télécharger CADET.
    echo Vérifie ta connexion internet et réessaie.
    pause
    exit /b 1
)

echo - Téléchargement des modèles de langue...
echo   ^(C'est un gros fichier - 4.2 Go^)
powershell -Command "Invoke-WebRequest -Uri 'https://cdn.cadet.ai/models/cadet-base-v2.gguf' -OutFile '%INSTALL_DIR%\models\base.gguf' -UseBasicP" 2>nul || (
    echo ATTENTION: Impossible de télécharger le modèle IA. Tu devras le télécharger manuellement.
)

echo ✓ Téléchargement terminé
echo.

echo [4/5] Création des raccourcis...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_SHORTCUT%'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\cadet.exe,0'; $Shortcut.Save()" 2>nul

if not exist "%START_MENU%" mkdir "%START_MENU%"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\CADET.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\cadet.exe,0'; $Shortcut.Save()" 2>nul

echo ✓ Raccourcis créés
echo.

echo [5/5] Finalisation de l'installation...

:: Créer le fichier de config
echo {> "%INSTALL_DIR%\config.json"
echo   "version": "%CADET_VERSION%",>> "%INSTALL_DIR%\config.json"
echo   "region": "ca-qc",>> "%INSTALL_DIR%\config.json"
echo   "language": "fr",>> "%INSTALL_DIR%\config.json"
echo   "currency": "CAD",>> "%INSTALL_DIR%\config.json"
echo   "firstRun": true>> "%INSTALL_DIR%\config.json"
echo }>> "%INSTALL_DIR%\config.json"

:: Ajouter au PATH
echo Ajout de CADET au PATH système...
setx PATH "%PATH%;%INSTALL_DIR%" >nul 2>&1

echo ✓ Installation terminée!
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  INSTALLATION RÉUSSIE!                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo CADET a été installé dans: %INSTALL_DIR%
echo.
echo Pour commencer:
echo   1. Double-clique sur l'icône CADET sur ton bureau
echo   2. Ou ouvre le Menu Démarrer ^> CADET
echo   3. Tape 'cadet' dans n'importe quel terminal
echo.
echo Besoin d'aide? Visite: https://cadet.ai/aide
echo Courriel support: aide@cadet.ai
echo.
echo Appuie sur une touche pour lancer CADET...
pause >nul

start "" "%INSTALL_DIR%\cadet.exe"
exit /b 0
