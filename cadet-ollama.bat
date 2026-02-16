@echo off
title CADET with Ollama
color 0A

echo.
echo  ============================================
echo   CADET - Intelligence Autonome
echo   Mode: Ollama (Local AI)
echo  ============================================
echo.

:: Set Ollama configuration
set DEFAULT_MODEL=ollama/llama3.1
set OLLAMA_API_BASE=http://localhost:11434
set PORT=8420
set DEFAULT_LANGUAGE=fr
set REGION=qc

echo Configuration:
echo   Modele: %DEFAULT_MODEL%
echo   Ollama: %OLLAMA_API_BASE%
echo   Port: %PORT%
echo.

:: Check if Ollama is running
echo [1/3] Verification d'Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo.
    echo  ATTENTION: Ollama ne tourne pas!
    echo.
    echo  Pour demarrer Ollama:
    echo    1. Ouvrez un autre terminal
    echo    2. Tapez: ollama serve
    echo    3. Ou: ollama run llama3.1
    echo.
    choice /C CO /M "Continuer quand meme (sans IA) ou annuler"
    if errorlevel 2 exit /b 1
)
echo OK Ollama detecte
echo.

:: Check Python
echo [2/3] Verification de Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas installe
    pause
    exit /b 1
)
echo OK Python detecte
echo.

:: Check packages
echo [3/3] Verification des packages...
python -c "import litellm" 2>nul
if errorlevel 1 (
    echo Installation des packages...
    pip install -q -e packages\floguru-shared
    pip install -q -e packages\floguru-gurus
    pip install -q -e packages\floguru-api
)
echo OK Packages installes
echo.

echo  ============================================
echo   Demarrage de CADET...
echo   URL: http://localhost:%PORT%
echo   Appuyez sur Ctrl+C pour arreter
echo  ============================================
echo.

python floguru.py api

if errorlevel 1 (
    echo.
    echo ERREUR: CADET n'a pas pu demarrer
    pause
    exit /b 1
)
