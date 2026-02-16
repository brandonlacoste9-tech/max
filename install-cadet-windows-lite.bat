@echo off
chcp 65001 >nul
title CADET Lite - Installation
cls

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                                                              ║
echo  ║              🤖 CADET Lite - Autonomous Intelligence         ║
echo  ║                                                              ║
echo  ║         ⚡ LIGHT VERSION - Only 5 GB Required!               ║
echo  ║                                                              ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.
echo  📦 Required: ~5 GB free space (Lite version)
echo  💻 Windows 10/11 64-bit required
echo  ⚠️  Note: This installs only Llama 3.1 (recommended model)
echo.
echo  💡 For maximum benefits (3 AI models), use the full installer:
echo     https://github.com/brandonlacoste9-tech/max/raw/main/install-max-windows.bat
echo.

:: Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  Please right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

:: Check available disk space (5GB = 5,000,000,000 bytes)
for /f "tokens=3" %%a in ('dir /-c %SystemDrive%\ ^| find "bytes free"') do set "FREE_SPACE=%%a"
set "FREE_SPACE=%FREE_SPACE:,=%"
if %FREE_SPACE% LSS 5000000000 (
    echo ❌ Not enough disk space!
    echo    Required: ~5 GB free
    echo    Available: %FREE_SPACE% bytes
    echo.
    echo    The Lite version needs at least 5 GB.
    echo    Please free up some space or consider using CADET Cloud.
    pause
    exit /b 1
)

echo ✅ Sufficient disk space detected (%FREE_SPACE% bytes free)
echo.

set "CADET_DIR=%USERPROFILE%\Cadet-AI"
set "OLLAMA_URL=https://ollama.com/download/OllamaSetup.exe"

echo 📁 Creating CADET directory...
if not exist "%CADET_DIR%" mkdir "%CADET_DIR%"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  STEP 1: Installing Ollama (Free AI Engine)                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Check if Ollama is already installed
where ollama >nul 2>&1
if %errorLevel% equ 0 (
    echo ✅ Ollama is already installed!
    ollama --version
) else (
    echo 📥 Downloading Ollama installer...
    echo    This may take a few minutes depending on your internet...
    echo.
    
    :: Download Ollama using PowerShell
    powershell -Command "Invoke-WebRequest -Uri '%OLLAMA_URL%' -OutFile '%TEMP%\OllamaSetup.exe' -ProgressPreference Continue"
    
    if exist "%TEMP%\OllamaSetup.exe" (
        echo 🚀 Installing Ollama (this will open an installer window)...
        start /wait "" "%TEMP%\OllamaSetup.exe"
        echo ✅ Ollama installation complete!
    ) else (
        echo ❌ Failed to download Ollama
        echo    Please manually download from: https://ollama.com/download
        pause
        exit /b 1
    )
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  STEP 2: Downloading AI Model (Lite Version)                 ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Pull only Llama 3.1 (Lite version)
echo 🧠 Downloading Llama 3.1 (~4.7 GB) - General purpose AI...
echo    This is the RECOMMENDED model for most users.
echo.
ollama pull llama3.1

echo ✅ Llama 3.1 ready!
echo.
echo 💡 Tip: You can add more models later by running:
echo    ollama pull gemma3:4b    (Fast responses, ~2.5 GB)
echo    ollama pull qwen2.5-coder:7b    (Programming, ~4.4 GB)
echo.

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  STEP 3: Installing CADET                                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%CADET_DIR%"

:: Check if already cloned
if exist "%CADET_DIR%\.git" (
    echo 🔄 Updating CADET...
    git pull
) else (
    echo 📥 Downloading CADET...
    git clone https://github.com/brandonlacoste9-tech/max.git .
)

:: Check if Python is installed
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo 🐍 Python not found. Installing Python...
    echo    Please download Python from https://python.org/downloads
    echo    IMPORTANT: Check "Add Python to PATH" during installation!
    start https://python.org/downloads
    pause
    exit /b 1
)

echo 📦 Installing CADET packages...
pip install -e packages/floguru-shared --quiet
pip install -e packages/floguru-api --quiet

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  ✅ INSTALLATION COMPLETE! (Lite Version)                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo  ⚡ You installed the LIGHT version (1 AI model)
echo  💡 For maximum benefits (3 models, better performance):
echo     Download the full installer from:
echo     https://github.com/brandonlacoste9-tech/max

echo.

:: Create desktop shortcut
echo 🖥️  Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Cadet AI Lite.lnk'); $Shortcut.TargetPath = '%CADET_DIR%\start-cadet-lite.bat'; $Shortcut.IconLocation = '%SystemRoot%\System32\shell32.dll,14'; $Shortcut.Save()"

:: Create the start script
echo @echo off > "%CADET_DIR%\start-cadet-lite.bat"
echo chcp 65001 ^>nul >> "%CADET_DIR%\start-cadet-lite.bat"
echo title CADET Lite - Autonomous Intelligence >> "%CADET_DIR%\start-cadet-lite.bat"
echo cd /d "%CADET_DIR%" >> "%CADET_DIR%\start-cadet-lite.bat"
echo echo Starting CADET Lite... >> "%CADET_DIR%\start-cadet-lite.bat"
echo echo. >> "%CADET_DIR%\start-cadet-lite.bat"
echo echo 🚀 Launching your AI assistant... >> "%CADET_DIR%\start-cadet-lite.bat"
echo echo    Version: LITE ^(1 model - Llama 3.1^) >> "%CADET_DIR%\start-cadet-lite.bat"
echo echo    For 3 models, upgrade to full version >> "%CADET_DIR%\start-cadet-lite.bat"
echo echo. >> "%CADET_DIR%\start-cadet-lite.bat"
echo start http://localhost:8420 >> "%CADET_DIR%\start-cadet-lite.bat"
echo python floguru.py api >> "%CADET_DIR%\start-cadet-lite.bat"
echo pause >> "%CADET_DIR%\start-cadet-lite.bat"

echo.
echo 🎉 CADET Lite is ready to use!
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo   📍 Installation location: %CADET_DIR%
echo   🖥️  Desktop shortcut: Cadet AI Lite
echo   🌐 Web interface: http://localhost:8420
echo.
echo   ✓ Installed: Llama 3.1 (General AI, ~4.7 GB)
echo   ⏳ Optional: Gemma 3, Qwen Coder (install later)
echo.
echo   To upgrade to full version (3 models):
echo   Visit: https://github.com/brandonlacoste9-tech/max

echo.
echo ═══════════════════════════════════════════════════════════════
echo.

:: Start CADET now?
echo 🚀 Would you like to start CADET Lite now? (Y/N)
set /p START_NOW=
if /I "%START_NOW%"=="Y" (
    echo.
    echo Starting CADET Lite...
    start http://localhost:8420
    python floguru.py api
) else (
    echo.
    echo 👍 You can start CADET Lite anytime by double-clicking the desktop shortcut!
)

echo.
pause
