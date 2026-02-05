@echo off
setlocal
REM ═══════════════════════════════════════════════════════════════
REM  🧪 MAXIMUS TEST RUNNER
REM  Run validation tests with correct environment configuration
REM ═══════════════════════════════════════════════════════════════

echo.
echo [1/3] Configuring environment...

REM Add Ollama and Local Venv to PATH
set "PATH=%CD%\.venv\Scripts;%PATH%"
set "PATH=%PATH%;C:\Users\north\AppData\Local\Programs\Ollama"

REM Verify Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python not found in venv.
    echo    Please ensure .venv exists.
    pause
    exit /b 1
) else (
    echo ✅ Python ^(venv^) detected
)

echo.
echo [2/3] Running Ping Test (LiteLLM + Gemma)...
echo ---------------------------------------------------------------
python test_ping.py
echo ---------------------------------------------------------------
echo.

echo [3/3] Running Visual Test (V-JEPA 2)...
echo ---------------------------------------------------------------
python test_visual.py
echo ---------------------------------------------------------------
echo.

echo ═══════════════════════════════════════════════════════════════
echo  🎉 Testing Complete
echo ═══════════════════════════════════════════════════════════════
pause
endlocal
