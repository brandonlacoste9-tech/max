@echo off
title CADET Diagnostic Tool
color 0E

echo.
echo  ============================================
echo   CADET Diagnostic Tool
echo  ============================================
echo.

echo [1/5] Checking Python installation...
python --version 2>nul
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python 3.10 or later from:
    echo https://python.org/downloads
    echo.
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)
echo OK Python found
echo.

echo [2/5] Checking if running from CADET directory...
if not exist "floguru.py" (
    echo ERROR: Cannot find floguru.py
    echo Please run this script from the CADET installation folder
    echo Current folder: %CD%
    pause
    exit /b 1
)
echo OK In CADET directory
echo.

echo [3/5] Checking required packages...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo WARNING: FastAPI not installed
    echo Installing required packages...
    pip install -e packages\floguru-shared
    pip install -e packages\floguru-gurus
    pip install -e packages\floguru-api
)
echo OK Packages check complete
echo.

echo [4/5] Checking port 8420...
netstat -an | find "8420" | find "LISTENING" >nul
if not errorlevel 1 (
    echo WARNING: Port 8420 is already in use
    echo Another CADET instance may be running
    echo.
    choice /C KO /M "Kill existing process and continue"
    if errorlevel 2 exit /b 1
    taskkill /f /im python.exe 2>nul
)
echo OK Port 8420 available
echo.

echo [5/5] Starting CADET...
echo.
echo  ============================================
echo   Starting CADET Server
echo   Press Ctrl+C to stop
echo  ============================================
echo.

python floguru.py api

if errorlevel 1 (
    echo.
    echo ERROR: CADET failed to start
    echo Check the error message above
    pause
    exit /b 1
)

pause
