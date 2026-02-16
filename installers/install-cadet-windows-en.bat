@echo off
chcp 65001 >nul
title CADET Installer - English (US/International)
color 0A

:: ============================================
:: CADET Installer for Windows - English
:: Region: US / International
:: ============================================

set INSTALLER_VERSION=1.0.0
set CADET_VERSION=2.5.0
set INSTALL_DIR=%LOCALAPPDATA%\CADET
set DESKTOP_SHORTCUT=%USERPROFILE%\Desktop\CADET.lnk
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\CADET

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                                                              ║
echo  ║   Welcome to CADET - Your AI Coding Assistant               ║
echo  ║   Version %CADET_VERSION%                                        ║
echo  ║                                                              ║
echo  ║   Region: United States / International                     ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.
echo  This installer will set up CADET on your Windows computer.
echo.
pause

echo.
echo [1/5] Checking system requirements...
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
    echo Available: %FREE_SPACE% bytes
    echo.
    choice /C YN /M "Continue anyway"
    if errorlevel 2 exit /b 1
)

:: Check RAM
for /f "skip=1" %%a in ('wmic computersystem get totalphysicalmemory') do (
    set RAM=%%a
    goto :ram_checked
)
:ram_checked
set RAM_GB=%RAM:~0,-9%
if %RAM_GB% LSS 8 (
    echo WARNING: CADET works best with 8GB+ RAM. You have %RAM_GB%GB.
    echo.
    choice /C YN /M "Continue anyway"
    if errorlevel 2 exit /b 1
)

echo ✓ System check passed!
echo.

echo [2/5] Preparing installation directory...
if exist "%INSTALL_DIR%" (
    echo Removing previous installation...
    rmdir /s /q "%INSTALL_DIR%"
)
mkdir "%INSTALL_DIR%"
echo ✓ Directory ready
echo.

echo [3/5] Downloading CADET components...
echo This may take a few minutes depending on your internet speed...
echo.

:: Download main application
echo - Downloading core application...
powershell -Command "Invoke-WebRequest -Uri 'https://cdn.cadet.ai/releases/%CADET_VERSION%/cadet-core-win-x64.exe' -OutFile '%INSTALL_DIR%\cadet.exe' -UseBasicP" 2>nul || (
    echo ERROR: Failed to download CADET.
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo - Downloading language models...
echo   ^(This is a large file - 4.2 GB^)
powershell -Command "Invoke-WebRequest -Uri 'https://cdn.cadet.ai/models/cadet-base-v2.gguf' -OutFile '%INSTALL_DIR%\models\base.gguf' -UseBasicP" 2>nul || (
    echo WARNING: Could not download AI model. You'll need to download it manually.
)

echo ✓ Download complete
echo.

echo [4/5] Creating shortcuts...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_SHORTCUT%'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\cadet.exe,0'; $Shortcut.Save()" 2>nul

if not exist "%START_MENU%" mkdir "%START_MENU%"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\CADET.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\cadet.exe,0'; $Shortcut.Save()" 2>nul

echo ✓ Shortcuts created
echo.

echo [5/5] Finalizing installation...

:: Create config file
echo {> "%INSTALL_DIR%\config.json"
echo   "version": "%CADET_VERSION%",>> "%INSTALL_DIR%\config.json"
echo   "region": "us",>> "%INSTALL_DIR%\config.json"
echo   "language": "en",>> "%INSTALL_DIR%\config.json"
echo   "currency": "USD",>> "%INSTALL_DIR%\config.json"
echo   "firstRun": true>> "%INSTALL_DIR%\config.json"
echo }>> "%INSTALL_DIR%\config.json"

:: Add to PATH
echo Adding CADET to system PATH...
setx PATH "%PATH%;%INSTALL_DIR%" >nul 2>&1

echo ✓ Installation complete!
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      INSTALLATION SUCCESSFUL                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo CADET has been installed to: %INSTALL_DIR%
echo.
echo Getting Started:
echo   1. Double-click the CADET icon on your desktop
echo   2. Or open Start Menu ^> CADET
echo   3. Type 'cadet' in any terminal/command prompt
echo.
echo Need help? Visit: https://cadet.ai/help
echo Support email: support@cadet.ai
echo.
echo Press any key to launch CADET...
pause >nul

start "" "%INSTALL_DIR%\cadet.exe"
exit /b 0
