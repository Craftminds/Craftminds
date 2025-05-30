@echo off
:: Masquer la fenêtre du terminal
if not "%1"=="am_admin" (
    powershell -Command "Start-Process -Verb RunAs -FilePath '%0' -ArgumentList 'am_admin'"
    exit /b
)

:: Se déplacer dans le répertoire du script
cd /d "%~dp0"

:: Vérifier si Node.js est installé silencieusement
where node >nul 2>nul
if %errorlevel% neq 0 (
    start https://nodejs.org/
    exit /b 1
)

:: Trouver un port disponible
set PORT=5173
:check_port
netstat -ano | findstr ":%PORT%" >nul
if not errorlevel 1 (
    set /a PORT+=1
    goto check_port
)
echo Port %PORT% disponible

:: Installer les dépendances silencieusement
echo Installation en cours...
call npm install --silent

:: Lancer l'application en arrière-plan avec le port spécifié
echo Démarrage du serveur sur le port %PORT%...
start /b cmd /c "set PORT=%PORT% && npm run dev"

:: Attendre que le serveur soit prêt
set /a attempts=0
:wait_loop
timeout /t 2 /nobreak >nul
set /a attempts+=1
curl -s http://localhost:%PORT% >nul 2>&1
if not errorlevel 1 goto server_ready
if %attempts% gtr 30 (
    echo Le serveur n'a pas démarré après 60 secondes.
    pause
    exit /b 1
)
goto wait_loop

:server_ready
echo Serveur prêt sur le port %PORT% !
start http://localhost:%PORT% 