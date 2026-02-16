@echo off
chcp 65001 >nul
title Instalador CADET - Português (Brasil)
color 0A

:: ============================================
:: Instalador CADET para Windows - Português
:: Região: Brasil
:: ============================================

set INSTALLER_VERSION=1.0.0
set CADET_VERSION=2.5.0
set INSTALL_DIR=%LOCALAPPDATA%\CADET
set DESKTOP_SHORTCUT=%USERPROFILE%\Desktop\CADET.lnk
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\CADET

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                                                              ║
echo  ║   Bem-vindo ao CADET - Seu assistente de código com IA      ║
echo  ║   Versão %CADET_VERSION%                                        ║
echo  ║                                                              ║
echo  ║   Região: Brasil                                            ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.
echo  Este instalador vai configurar o CADET no seu computador.
echo.
pause

echo.
echo [1/5] Verificando requisitos do sistema...
echo.

:: Verificar versão do Windows
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
if "%version%" LSS "10.0" (
    echo ERRO: CADET requer Windows 10 ou superior.
    echo Sua versão: %version%
    pause
    exit /b 1
)

:: Verificar espaço em disco (precisa de pelo menos 15 GB)
for /f "usebackq tokens=3" %%a in (`dir /-c %SystemDrive%\ ^| find "bytes livres"`) do set FREE_SPACE=%%a
set FREE_SPACE=%FREE_SPACE:,=%
if %FREE_SPACE% LSS 16106127360 (
    echo AVISO: Você pode não ter espaço suficiente em disco.
    echo Requerido: 15 GB livres
    echo Disponível: %FREE_SPACE% bytes
    echo.
    choice /C SN /M "Continuar mesmo assim"
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
    echo AVISO: CADET funciona melhor com 8 GB+ de RAM. Você tem %RAM_GB% GB.
    echo.
    choice /C SN /M "Continuar mesmo assim"
    if errorlevel 2 exit /b 1
)

echo ✓ Verificação do sistema bem-sucedida!
echo.

echo [2/5] Preparando diretório de instalação...
if exist "%INSTALL_DIR%" (
    echo Removendo instalação anterior...
    rmdir /s /q "%INSTALL_DIR%"
)
mkdir "%INSTALL_DIR%"
echo ✓ Diretório pronto
echo.

echo [3/5] Baixando componentes do CADET...
echo Isso pode levar alguns minutos dependendo da sua velocidade de internet...
echo.

:: Baixar aplicativo principal
echo - Baixando aplicativo principal...
powershell -Command "Invoke-WebRequest -Uri 'https://cdn.cadet.ai/releases/%CADET_VERSION%/cadet-core-win-x64.exe' -OutFile '%INSTALL_DIR%\cadet.exe' -UseBasicP" 2>nul || (
    echo ERRO: Falha ao baixar o CADET.
    echo Verifique sua conexão com a internet e tente novamente.
    pause
    exit /b 1
)

echo - Baixando modelos de linguagem...
echo   ^(Este é um arquivo grande - 4.2 GB^)
powershell -Command "Invoke-WebRequest -Uri 'https://cdn.cadet.ai/models/cadet-base-v2.gguf' -OutFile '%INSTALL_DIR%\models\base.gguf' -UseBasicP" 2>nul || (
    echo AVISO: Não foi possível baixar o modelo de IA. Você precisará baixá-lo manualmente.
)

echo ✓ Download completo!
echo.

echo [4/5] Criando atalhos...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_SHORTCUT%'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\cadet.exe,0'; $Shortcut.Save()" 2>nul

if not exist "%START_MENU%" mkdir "%START_MENU%"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\CADET.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\cadet.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\cadet.exe,0'; $Shortcut.Save()" 2>nul

echo ✓ Atalhos criados
echo.

echo [5/5] Finalizando instalação...

:: Criar arquivo de configuração
echo {> "%INSTALL_DIR%\config.json"
echo   "version": "%CADET_VERSION%",>> "%INSTALL_DIR%\config.json"
echo   "region": "br",>> "%INSTALL_DIR%\config.json"
echo   "language": "pt-br",>> "%INSTALL_DIR%\config.json"
echo   "currency": "BRL",>> "%INSTALL_DIR%\config.json"
echo   "firstRun": true>> "%INSTALL_DIR%\config.json"
echo }>> "%INSTALL_DIR%\config.json"

:: Adicionar ao PATH
echo Adicionando CADET ao PATH do sistema...
setx PATH "%PATH%;%INSTALL_DIR%" >nul 2>&1

echo ✓ Instalação completa!
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  INSTALAÇÃO BEM-SUCEDIDA!                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo CADET foi instalado em: %INSTALL_DIR%
echo.
echo Para começar:
echo   1. Clique duas vezes no ícone do CADET na sua área de trabalho
echo   2. Ou abra o Menu Iniciar ^> CADET
echo   3. Digite 'cadet' em qualquer terminal
echo.
echo Precisa de ajuda? Visite: https://cadet.ai/ajuda
echo Email de suporte: ajuda@cadet.ai
echo.
echo Pressione qualquer tecla para iniciar o CADET...
pause >nul

start "" "%INSTALL_DIR%\cadet.exe"
exit /b 0
