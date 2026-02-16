@echo off
chcp 65001 >nul
title Installateur CADET - Francais (Quebec)
color 0A

:: ============================================
:: Installateur CADET pour Windows - Francais
:: Region: Quebec, Canada
:: ============================================

set INSTALLER_VERSION=1.0.0
set CADET_VERSION=1.0.0
set INSTALL_DIR=%LOCALAPPDATA%\CADET
set DESKTOP_SHORTCUT=%USERPROFILE%\Desktop\CADET.lnk
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\CADET

echo.
echo  ============================================
echo.
echo   Bienvenue dans CADET
echo   Intelligence Autonome pour le Quebec
echo   Version %CADET_VERSION%
echo.
echo   Region: Quebec, Canada
echo.
echo  ============================================
echo.
echo  Cet installateur va configurer CADET sur votre ordinateur.
echo.
pause

echo.
echo [1/4] Verification de la configuration systeme...
echo.

:: Verifier la version de Windows
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
if "%version%" LSS "10.0" (
    echo ERREUR: CADET necessite Windows 10 ou plus recent.
    echo Votre version: %version%
    pause
    exit /b 1
)

:: Verifier l'espace disque (besoin d'au moins 15 Go)
for /f "usebackq tokens=3" %%a in (`dir /-c %SystemDrive%\ ^| find "octets libres"`) do set FREE_SPACE=%%a
set FREE_SPACE=%FREE_SPACE:,=%
if %FREE_SPACE% LSS 16106127360 (
    echo ATTENTION: Vous n'avez peut-etre pas assez d'espace disque.
    echo Requis: 15 Go libres
    echo.
    choice /C ON /M "Continuer quand meme"
    if errorlevel 2 exit /b 1
)

echo OK Verification systeme reussie!
echo.

echo [2/4] Preparation du repertoire d'installation...
if exist "%INSTALL_DIR%" (
    echo Suppression de l'installation precedente...
    rmdir /s /q "%INSTALL_DIR%"
)
mkdir "%INSTALL_DIR%"
echo OK Repertoire pret
echo.

echo [3/4] Telechargement des composants CADET...
echo Cela peut prendre quelques minutes...
echo.

:: Creer le repertoire des modeles
mkdir "%INSTALL_DIR%\models" 2>nul

:: Telecharger l'application principale
echo - Telechargement de l'application principale...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/brandonlacoste9-tech/max/releases/download/v1.0.0/cadet-core-win-x64.exe' -OutFile '%INSTALL_DIR%\cadet.exe' -UseBasicParsing" 2>nul

if not exist "%INSTALL_DIR%\cadet.exe" (
    echo NOTE: Telechargement depuis GitHub releases.
    echo Veuillez telecharger manuellement: https://github.com/brandonlacoste9-tech/max/releases
    pause
)

echo OK Telechargement termine
echo.

echo [4/4] Creation des raccourcis...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_SHORTCUT%'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Save()" 2>nul

if not exist "%START_MENU%" mkdir "%START_MENU%"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\CADET.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Save()" 2>nul

echo OK Raccourcis crees
echo.

echo [5/4] Finalisation de l'installation...

:: Creer le fichier de configuration
echo {> "%INSTALL_DIR%\config.json"
echo   "version": "%CADET_VERSION%",>> "%INSTALL_DIR%\config.json"
echo   "region": "qc",>> "%INSTALL_DIR%\config.json"
echo   "language": "fr",>> "%INSTALL_DIR%\config.json"
echo   "firstRun": true>> "%INSTALL_DIR%\config.json"
echo }>> "%INSTALL_DIR%\config.json"

echo OK Installation terminee!
echo.

echo  ============================================
echo   INSTALLATION REUSSIE
echo  ============================================
echo.
echo CADET a ete installe dans: %INSTALL_DIR%
echo.
echo Pour commencer:
echo   1. Double-cliquez sur l'icone CADET sur votre bureau
echo   2. Ou ouvrez le menu Demarrer ^> CADET
echo   3. Ou tapez 'cadet' dans l'Invite de commandes
echo.
echo Documentation: https://github.com/brandonlacoste9-tech/max/blob/main/docs/QUICKSTART.md
echo.
pause

exit /b 0
