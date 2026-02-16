@echo off
chcp 65001 >nul
title Instalador CADET - Español (México)
color 0A

:: ============================================
:: Instalador CADET para Windows - Español
:: Región: México
:: ============================================

set INSTALLER_VERSION=1.0.0
set CADET_VERSION=2.5.0
set INSTALL_DIR=%LOCALAPPDATA%\CADET
set DESKTOP_SHORTCUT=%USERPROFILE%\Desktop\CADET.lnk
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\CADET

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                                                              ║
echo  ║   ¡Bienvenido a CADET - Tu asistente de código con IA      ║
echo  ║   Versión %CADET_VERSION%                                        ║
echo  ║                                                              ║
echo  ║   Región: México                                            ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.
echo  Este instalador configurará CADET en tu computadora.
echo.
pause

echo.
echo [1/5] Verificando requisitos del sistema...
echo.

:: Verificar versión de Windows
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
if "%version%" LSS "10.0" (
    echo ERROR: CADET requiere Windows 10 o posterior.
    echo Tu versión: %version%
    pause
    exit /b 1
)

:: Verificar espacio en disco (necesita al menos 15 GB)
for /f "usebackq tokens=3" %%a in (`dir /-c %SystemDrive%\ ^| find "bytes libres"`) do set FREE_SPACE=%%a
set FREE_SPACE=%FREE_SPACE:,=%
if %FREE_SPACE% LSS 16106127360 (
    echo ADVERTENCIA: Puede que no tengas suficiente espacio en disco.
    echo Requerido: 15 GB libres
    echo Disponible: %FREE_SPACE% bytes
    echo.
    choice /C SN /M "¿Continuar de todos modos"
    if errorlevel 2 exit /b 1
)

:: Verificar RAM
for /f "skip=1" %%a in ('wmic computersystem get totalphysicalmemory') do (
    set RAM=%%a
    goto :ram_checked
)
:ram_checked
set RAM_GB=%RAM:~0,-9%
if %RAM_GB% LSS 8 (
    echo ADVERTENCIA: CADET funciona mejor con 8 GB+ de RAM. Tienes %RAM_GB% GB.
    echo.
    choice /C SN /M "¿Continuar de todos modos"
    if errorlevel 2 exit /b 1
)

echo ✓ ¡Verificación del sistema exitosa!
echo.

echo [2/5] Preparando directorio de instalación...
if exist "%INSTALL_DIR%" (
    echo Eliminando instalación anterior...
    rmdir /s /q "%INSTALL_DIR%"
)
mkdir "%INSTALL_DIR%"
echo ✓ Directorio listo
echo.

echo [3/5] Descargando componentes de CADET...
echo Esto puede tomar unos minutos dependiendo de tu velocidad de internet...
echo.

:: Descargar aplicación principal
echo - Descargando aplicación principal...
powershell -Command "Invoke-WebRequest -Uri 'https://cdn.cadet.ai/releases/%CADET_VERSION%/cadet-core-win-x64.exe' -OutFile '%INSTALL_DIR%\cadet.exe' -UseBasicP" 2>nul || (
    echo ERROR: No se pudo descargar CADET.
    echo Verifica tu conexión a internet e inténtalo de nuevo.
    pause
    exit /b 1
)

echo - Descargando modelos de lenguaje...
echo   ^(Este es un archivo grande - 4.2 GB^)
powershell -Command "Invoke-WebRequest -Uri 'https://cdn.cadet.ai/models/cadet-base-v2.gguf' -OutFile '%INSTALL_DIR%\models\base.gguf' -UseBasicP" 2>nul || (
    echo ADVERTENCIA: No se pudo descargar el modelo de IA. Necesitarás descargarlo manualmente.
)

echo ✓ ¡Descarga completa!
echo.

echo [4/5] Creando accesos directos...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_SHORTCUT%'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\cadet.exe,0'; $Shortcut.Save()" 2>nul

if not exist "%START_MENU%" mkdir "%START_MENU%"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\CADET.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\cadet.exe,0'; $Shortcut.Save()" 2>nul

echo ✓ Accesos directos creados
echo.

echo [5/5] Finalizando instalación...

:: Crear archivo de configuración
echo {> "%INSTALL_DIR%\config.json"
echo   "version": "%CADET_VERSION%",>> "%INSTALL_DIR%\config.json"
echo   "region": "mx",>> "%INSTALL_DIR%\config.json"
echo   "language": "es-mx",>> "%INSTALL_DIR%\config.json"
echo   "currency": "MXN",>> "%INSTALL_DIR%\config.json"
echo   "firstRun": true>> "%INSTALL_DIR%\config.json"
echo }>> "%INSTALL_DIR%\config.json"

:: Agregar al PATH
echo Agregando CADET al PATH del sistema...
setx PATH "%PATH%;%INSTALL_DIR%" >nul 2>&1

echo ✓ ¡Instalación completa!
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ¡INSTALACIÓN EXITOSA!                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo CADET ha sido instalado en: %INSTALL_DIR%
echo.
echo Para comenzar:
echo   1. Haz doble clic en el icono de CADET en tu escritorio
echo   2. O abre el Menú Inicio ^> CADET
echo   3. Escribe 'cadet' en cualquier terminal
echo.
echo ¿Necesitas ayuda? Visita: https://cadet.ai/ayuda
echo Correo de soporte: ayuda@cadet.ai
echo.
echo Presiona cualquier tecla para iniciar CADET...
pause >nul

start "" "%INSTALL_DIR%\cadet.exe"
exit /b 0
