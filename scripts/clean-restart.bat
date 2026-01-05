@echo off
echo ===================================
echo   NETTOYAGE COMPLET NEXT.JS
echo ===================================
echo.

echo [1/3] Arret de tous les processus Node.js...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL%==0 (
    echo ✓ Processus Node.js arretes
) else (
    echo ✓ Aucun processus Node.js en cours
)

echo.
echo [2/3] Suppression du cache .next...
if exist ".next" (
    rmdir /S /Q ".next"
    echo ✓ Cache .next supprime
) else (
    echo ✓ Pas de cache .next
)

echo.
echo [3/3] Demarrage du serveur...
echo.
npm run dev
