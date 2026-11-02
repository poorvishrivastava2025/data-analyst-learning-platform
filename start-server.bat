@echo off
title AnalystPath AI - Learning Platform & Career Coach
cd /d "%~dp0"

echo ========================================================
echo       Starting AnalystPath AI Platform & Database       
echo ========================================================
echo.

set NODE_EXEC=
if exist "%APPDATA%\Antigravity\bin\agy-node.cmd" (
    set "NODE_EXEC=%APPDATA%\Antigravity\bin\agy-node.cmd"
) else (
    where node >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "NODE_EXEC=node"
    ) else if exist "%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe" (
        set "ELECTRON_RUN_AS_NODE=1"
        set "NODE_EXEC=%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe"
    )
)

if "%NODE_EXEC%"=="" (
    echo [ERROR] Node.js runtime not found.
    echo Please install Node.js from https://nodejs.org or run within Antigravity.
    pause
    exit /b 1
)

echo [INFO] Using runtime: %NODE_EXEC%
echo [INFO] Database: analystpath.db (SQLite with Node 24 node:sqlite)
echo [INFO] Opening http://localhost:3000 in your default browser...
echo.
echo ========================================================
echo   Demo Account Credentials:
echo   - Email:    learner@analystpath.ai
echo   - Password: password123
echo ========================================================
echo.

start "" "http://localhost:3000"
"%NODE_EXEC%" server.js
pause
