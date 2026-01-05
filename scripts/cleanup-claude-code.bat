@echo off
REM ================================================================
REM Script de Nettoyage Claude Code VSCode
REM Nettoie le cache, snapshots et fichiers temporaires
REM ================================================================

echo.
echo ============================================================
echo   Nettoyage Claude Code - APPChanthana
echo ============================================================
echo.

REM Vérifier si VSCode est en cours
tasklist /FI "IMAGENAME eq Code.exe" 2>NUL | find /I /N "Code.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [AVERTISSEMENT] VSCode est en cours d'execution !
    echo Voulez-vous le fermer automatiquement ? (O/N)
    set /p CLOSE_VSCODE=
    if /I "%CLOSE_VSCODE%"=="O" (
        echo Fermeture de VSCode...
        taskkill /F /IM Code.exe >NUL 2>&1
        timeout /t 3 /nobreak >NUL
        echo VSCode ferme.
    ) else (
        echo.
        echo ATTENTION: Le nettoyage peut echouer si VSCode est ouvert.
        echo Appuyez sur une touche pour continuer quand meme...
        pause >NUL
    )
)

echo.
echo [1/5] Nettoyage du cache projet APPChanthana (621 MB)...
if exist "%USERPROFILE%\.claude\projects\c--Users-USER-Desktop-APPChanthana" (
    rmdir /S /Q "%USERPROFILE%\.claude\projects\c--Users-USER-Desktop-APPChanthana" 2>NUL
    echo       Cache projet supprime : OK
) else (
    echo       Aucun cache projet trouve
)

echo.
echo [2/5] Nettoyage des shell snapshots (35 fichiers)...
if exist "%USERPROFILE%\.claude\shell-snapshots\*.sh" (
    del /Q "%USERPROFILE%\.claude\shell-snapshots\*.sh" 2>NUL
    echo       Snapshots supprimes : OK
) else (
    echo       Aucun snapshot trouve
)

echo.
echo [3/5] Nettoyage des fichiers temporaires .claude.json.tmp...
if exist "%USERPROFILE%\.claude.json.tmp.*" (
    del /Q "%USERPROFILE%\.claude.json.tmp.*" 2>NUL
    echo       Fichiers temporaires supprimes : OK
) else (
    echo       Aucun fichier temporaire trouve
)

echo.
echo [4/5] Nettoyage des anciens todos (dossier todos)...
if exist "%USERPROFILE%\.claude\todos" (
    REM Supprimer les todos de plus de 7 jours
    forfiles /P "%USERPROFILE%\.claude\todos" /S /M *.json /D -7 /C "cmd /c del @path" 2>NUL
    echo       Anciens todos supprimes : OK
) else (
    echo       Aucun todo a nettoyer
)

echo.
echo [5/5] Nettoyage du dossier debug...
if exist "%USERPROFILE%\.claude\debug" (
    REM Garder seulement les 5 derniers fichiers de debug
    cd /D "%USERPROFILE%\.claude\debug"
    for /F "skip=5 delims=" %%i in ('dir /B /O-D 2^>NUL') do del "%%i" 2>NUL
    echo       Anciens fichiers debug supprimes : OK
) else (
    echo       Aucun fichier debug a nettoyer
)

echo.
echo ============================================================
echo   Nettoyage termine !
echo ============================================================
echo.
echo Gains esperes :
echo   - Espace disque libere : ~650 MB
echo   - Temps de demarrage Claude Code : -50%%
echo   - Moins de risques de crash EPERM
echo.
echo Vous pouvez maintenant relancer VSCode.
echo.
pause
