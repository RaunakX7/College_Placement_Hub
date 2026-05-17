@echo off
title PlaceHub - Quick Dev Server Bootloader
echo ===================================================================
echo             PlaceHub - Quick Server Bootloader
echo ===================================================================
echo.

:: Check for .env file
if exist .env goto :env_ok
echo [ERROR] .env configuration file not found!
echo Please run run_server.bat first to initialize your workspace variables.
pause
exit /b 1

:env_ok
echo [INFO] Loading variables and compiling data hooks...
call npx prisma generate
if %ERRORLEVEL% equ 0 goto :generate_ok
echo [WARNING] Prisma compiler failed to run.

:generate_ok
echo.
echo [INFO] Booting local Next.js server...
echo ===================================================================
echo.
start "" "http://localhost:3000"
call npm run dev
pause
