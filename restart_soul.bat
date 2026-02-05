@echo off
REM -------------------------------------------------------------------------
REM SOUL RESTART SCRIPT - COLONY OS
REM -------------------------------------------------------------------------

REM [CRITICAL] Force UTF-8 Encoding for Python on Windows
set PYTHONUTF8=1

REM [CRITICAL] Set Console to UTF-8
chcp 65001 > NUL

REM Unbuffered output for real-time logging
set PYTHONUNBUFFERED=1

REM Set PYTHONPATH so custom_prompt.py is found
set PYTHONPATH=%CD%
set LITELLM_LOG_LEVEL=DEBUG

echo [SOUL] 👑 Restarting Soul Sequence (Python Wrapper Mode)...

echo 📦 Installing dependencies (pyyaml)...
.\.venv\Scripts\python -m pip install pyyaml >nul 2>&1

echo 🛑 Killing old proxy on port 4000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":4000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🚀 Starting Maximus Router (LiteLLM via Wrapper)...
.\.venv\Scripts\python run_litellm.py --config max_config.yaml --port 4000
