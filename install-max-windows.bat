@echo off
chcp 65001 >nul
title MAX AI Launcher - Installation
cls

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                                                              ║
echo  ║              🤖 MAX - Your Free AI Assistant                 ║
echo  ║                                                              ║
echo  ║         No API keys. No subscriptions. 100%% Private.         ║
echo  ║                                                              ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

:: Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  Please right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

set "MAX_DIR=%USERPROFILE%\MAX-AI"
set "OLLAMA_URL=https://ollama.com/download/OllamaSetup.exe"

echo 📁 Creating MAX directory...
if not exist "%MAX_DIR%" mkdir "%MAX_DIR%"

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
echo ║  STEP 2: Downloading AI Models                               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Pull essential models
echo 🧠 Downloading Llama 3.1 (General AI)...
ollama pull llama3.1

echo 🧠 Downloading Gemma 3 (Fast Responses)...
ollama pull gemma3:4b

echo 🧠 Downloading Qwen Coder (Programming)...
ollama pull qwen2.5-coder:7b

echo ✅ All AI models ready!

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  STEP 3: Installing FloGuru                                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%MAX_DIR%"

:: Check if already cloned
if exist "%MAX_DIR%\.git" (
    echo 🔄 Updating FloGuru...
    git pull
) else (
    echo 📥 Downloading FloGuru...
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

echo 📦 Installing FloGuru packages...
pip install -e packages/floguru-shared --quiet
pip install -e packages/floguru-api --quiet

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  ✅ INSTALLATION COMPLETE!                                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Create desktop shortcut
echo 🖥️  Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\MAX AI.lnk'); $Shortcut.TargetPath = '%MAX_DIR%\start-max.bat'; $Shortcut.IconLocation = '%SystemRoot%\System32\shell32.dll,14'; $Shortcut.Save()"

:: Create the start script
echo @echo off > "%MAX_DIR%\start-max.bat"
echo chcp 65001 ^>nul >> "%MAX_DIR%\start-max.bat"
echo title MAX AI - Running >> "%MAX_DIR%\start-max.bat"
echo cd /d "%MAX_DIR%" >> "%MAX_DIR%\start-max.bat"
echo echo Starting MAX AI... >> "%MAX_DIR%\start-max.bat"
echo echo. >> "%MAX_DIR%\start-max.bat"
echo echo 🚀 Launching your AI assistant... >> "%MAX_DIR%\start-max.bat"
echo echo    This window will stay open while MAX is running >> "%MAX_DIR%\start-max.bat"
echo echo    Close this window to stop MAX >> "%MAX_DIR%\start-max.bat"
echo echo. >> "%MAX_DIR%\start-max.bat"
echo start http://localhost:8420 >> "%MAX_DIR%\start-max.bat"
echo python floguru.py api >> "%MAX_DIR%\start-max.bat"
echo pause >> "%MAX_DIR%\start-max.bat"

echo.
echo 🎉 MAX is ready to use!
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo   📍 Installation location: %MAX_DIR%
echo   🖥️  Desktop shortcut: MAX AI
echo   🌐 Web interface: http://localhost:8420
echo.
echo   To start MAX in the future:
echo   • Double-click "MAX AI" on your desktop, OR
echo   • Run: %MAX_DIR%\start-max.bat
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

:: Start MAX now?
echo 🚀 Would you like to start MAX now? (Y/N)
set /p START_NOW=
if /I "%START_NOW%"=="Y" (
    echo.
    echo Starting MAX...
    start http://localhost:8420
    python floguru.py api
) else (
    echo.
    echo 👍 You can start MAX anytime by double-clicking the desktop shortcut!
)

echo.
pause
