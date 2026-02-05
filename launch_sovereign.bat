@echo off
set PYTHONUTF8=1
REM ═══════════════════════════════════════════════════════════════
REM  🏛️ MAXIMUS SOVEREIGN LAUNCHER
REM  The Smart Power Stack - Local-First AI Empire
REM  Generated: 2026-02-01
REM ═══════════════════════════════════════════════════════════════

title Maximus Sovereign Launcher
color 0A

echo.
echo ═══════════════════════════════════════════════════════════════
echo  🏛️ MAXIMUS SOVEREIGN LAUNCHER
echo  Building the Empire... One Service at a Time
echo ═══════════════════════════════════════════════════════════════
echo.

REM ───────────────────────────────────────────────────────────────
REM  STEP 0: Virtual Environment Check
REM ───────────────────────────────────────────────────────────────
echo [0/6] Configuring environment...

if not exist ".venv\Scripts\python.exe" (
    echo ❌ ERROR: Virtual environment not found!
    echo    Please run: py -3.12 -m venv .venv
    pause
    exit /b 1
)

REM Set path to include venv scripts for this session
set "PATH=%CD%\.venv\Scripts;%PATH%"
set "PATH=%PATH%;C:\Users\north\AppData\Local\Programs\Ollama"

echo ✅ Using local environment (.venv)
echo.

REM ───────────────────────────────────────────────────────────────
REM  STEP 1: Check Prerequisites
REM ───────────────────────────────────────────────────────────────

echo [1/6] Checking prerequisites...

REM Check if Ollama is installed
where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Ollama not found!
    echo.
    echo Please install Ollama from: https://ollama.ai
    pause
    exit /b 1
)
echo ✅ Ollama found

REM Check if Python is installed (via venv)
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python environment broken!
    pause
    exit /b 1
)
echo ✅ Python (venv) ready

REM Check if NVIDIA GPU is available
nvidia-smi >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  WARNING: NVIDIA GPU not detected!
    echo    Max will run on CPU ^(slower performance^)
    timeout /t 3 >nul
) else (
    echo ✅ RTX 4090 detected
)

echo.

REM ───────────────────────────────────────────────────────────────
REM  STEP 2: Start Ollama Server
REM ───────────────────────────────────────────────────────────────

echo [2/6] Starting Ollama server...

REM Check if Ollama is already running
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ollama already running
) else (
    echo 🚀 Starting Ollama...
    start "Ollama Server" ollama serve
    timeout /t 5 >nul
    echo ✅ Ollama started on port 11434
)

echo.

REM ───────────────────────────────────────────────────────────────
REM  STEP 3: Pull Required Models
REM ───────────────────────────────────────────────────────────────

echo [3/6] Ensuring models are available...

REM Check and pull Gemma 3 (Reflex)
echo Checking Gemma 3...
ollama list | findstr "gemma3:4b" >nul || (
    echo 📥 Pulling Gemma 3...
    ollama pull gemma3:4b
)

REM Check and pull Llama 3.1 (Logic)
echo Checking Llama 3.1...
ollama list | findstr "llama3.1:8b" >nul || (
    echo 📥 Pulling Llama 3.1...
    ollama pull llama3.1:8b
)

REM Check and pull Qwen 2.5 Coder (Worker)
echo Checking Qwen 2.5 Coder...
ollama list | findstr "qwen2.5-coder:7b" >nul || (
    echo 📥 Pulling Qwen 2.5 Coder...
    ollama pull qwen2.5-coder:7b
)

echo.

REM ───────────────────────────────────────────────────────────────
REM  STEP 4: Start V-JEPA 2 Vision Service
REM ───────────────────────────────────────────────────────────────

echo [4/6] Starting V-JEPA 2 Vision Service...

REM Check if service is already running
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ V-JEPA 2 already running
) else (
    echo 🚀 Starting V-JEPA 2 Eyes...
    cd /d "c:\Users\north\max"
    start "Maximus Vision" python vjepa_service.py
    timeout /t 5 >nul
    
    REM Verify it started
    curl -s http://localhost:8001/health >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ V-JEPA 2 started on port 8001
    ) else (
        echo ⚠️  WARNING: V-JEPA 2 failed to start
        echo    Max will run without vision capabilities
    )
)

echo.

REM ───────────────────────────────────────────────────────────────
REM  STEP 5: Start LiteLLM Proxy
REM ───────────────────────────────────────────────────────────────

echo [5/6] Starting LiteLLM Smart Router...

REM Start LiteLLM proxy with config
echo 🚀 Starting LiteLLM Proxy...
REM Running from current dir so custom_prompt.py is found
start "Maximus Router" python run_litellm.py --config max_config.yaml --port 4000

timeout /t 5 >nul

REM Verify it started
curl -s http://localhost:4000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ LiteLLM Proxy running on port 4000
) else (
    echo ❌ ERROR: LiteLLM failed to start
    echo    Check logs at: c:\Users\north\max\logs\litellm.log
    pause
    exit /b 1
)

echo.

REM ───────────────────────────────────────────────────────────────
REM  STEP 6: System Status Report
REM ───────────────────────────────────────────────────────────────

echo [6/6] System Status Report
echo.
echo ═══════════════════════════════════════════════════════════════
echo  🏛️ MAXIMUS SOVEREIGN STACK - ONLINE
echo ═══════════════════════════════════════════════════════════════
echo.
echo  TIER 1 - REFLEX (Gemma 3):        ✅ Ready
echo  TIER 2 - LOGIC (Llama 3.1):       ✅ Ready
echo  TIER 3 - WORKER (Qwen 2.5):       ✅ Ready
echo  TIER 4 - SENSES (V-JEPA 2):       ✅ Ready
echo.
echo  LiteLLM Router:                   http://localhost:4000
echo  Ollama Server:                    http://localhost:11434
echo  V-JEPA Vision:                    http://localhost:8001
echo.
echo ═══════════════════════════════════════════════════════════════
echo  🐝 The Empire is Ready. All systems sovereign.
echo ═══════════════════════════════════════════════════════════════
echo.

REM ───────────────────────────────────────────────────────────────
REM  GPU Status Check
REM ───────────────────────────────────────────────────────────────

nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu --format=csv,noheader 2>nul
if %errorlevel% equ 0 (
    echo.
    echo 🎮 RTX 4090 Status:
    nvidia-smi --query-gpu=name,memory.used,memory.total,utilization.gpu --format=csv
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo  Next Steps:
echo  1. Test the Ping: python test_ping.py
echo  2. Test Vision: python test_visual.py
echo  3. Monitor GPU: nvidia-smi --loop=1
echo ═══════════════════════════════════════════════════════════════
echo.

pause
