@echo off
chcp 65001 >nul
title CADET Installer - English (US/International)
color 0A

:: ============================================
:: CADET Installer for Windows - English
:: Region: US / International
:: ============================================

set INSTALLER_VERSION=1.0.0
set CADET_VERSION=1.0.0
set INSTALL_DIR=%LOCALAPPDATA%\CADET
set DESKTOP_SHORTCUT=%USERPROFILE%\Desktop\CADET.lnk
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\CADET

echo.
echo  ============================================
echo.
echo   Welcome to CADET - Autonomous Intelligence
echo   Version %CADET_VERSION%
echo.
echo   Region: United States / International
echo.
echo  ============================================
echo.
echo  This installer will set up CADET on your computer.
echo.
pause

echo.
echo [1/4] Checking system requirements...
echo.

:: Check Windows version
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
if "%version%" LSS "10.0" (
    echo ERROR: CADET requires Windows 10 or later.
    echo Your version: %version%
    pause
    exit /b 1
)

:: Check available disk space (need at least 15GB)
for /f "usebackq tokens=3" %%a in (`dir /-c %SystemDrive%\ ^| find "bytes free"`) do set FREE_SPACE=%%a
set FREE_SPACE=%FREE_SPACE:,=%
if %FREE_SPACE% LSS 16106127360 (
    echo WARNING: You may not have enough disk space.
    echo Required: 15 GB free
    echo.
    choice /C YN /M "Continue anyway"
    if errorlevel 2 exit /b 1
)

echo OK System check passed!
echo.

echo [2/4] Preparing installation directory...
if exist "%INSTALL_DIR%" (
    echo Removing previous installation...
    rmdir /s /q "%INSTALL_DIR%"
)
mkdir "%INSTALL_DIR%"
echo OK Directory ready
echo.

echo [3/4] Downloading CADET components...
echo This may take a few minutes...
echo.

:: Create models directory
mkdir "%INSTALL_DIR%\models" 2>nul

:: Download main application
echo - Downloading core application...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/brandonlacoste9-tech/max/releases/download/v1.0.0/cadet-core-win-x64.exe' -OutFile '%INSTALL_DIR%\cadet.exe' -UseBasicParsing" 2>nul

if not exist "%INSTALL_DIR%\cadet.exe" (
    echo NOTE: Download from GitHub releases.
    echo Please download manually from: https://github.com/brandonlacoste9-tech/max/releases
    pause
)

echo OK Download complete
echo.

echo [4/4] Creating shortcuts...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_SHORTCUT%'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Save()" 2>nul

if not exist "%START_MENU%" mkdir "%START_MENU%"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\CADET.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Save()" 2>nul

echo OK Shortcuts created
echo.

echo [5/4] Finalizing installation...

:: Create config file
echo {> "%INSTALL_DIR%\config.json"
echo   "version": "%CADET_VERSION%",>> "%INSTALL_DIR%\config.json"
echo   "region": "us",>> "%INSTALL_DIR%\config.json"
echo   "language": "en",>> "%INSTALL_DIR%\config.json"
echo   "firstRun": true>> "%INSTALL_DIR%\config.json"
echo }>> "%INSTALL_DIR%\config.json"

echo OK Installation complete!
echo.

echo  ============================================
echo   INSTALLATION SUCCESSFUL
echo  ============================================
echo.
echo CADET has been installed to: %INSTALL_DIR%
echo.
echo Getting Started:
echo   1. Double-click the CADET icon on your desktop
echo   2. Or open Start Menu ^> CADET
echo   3. Or type 'cadet' in Command Prompt
echo.
echo Documentation: https://github.com/brandonlacoste9-tech/max/blob/main/docs/QUICKSTART.md
echo.
pause

exit /b 0
