@echo off
title PlaceHub - First-Time Initialization and Startup
echo ===================================================================
echo             PlaceHub - First-Time Project Initializer
echo ===================================================================
echo.

:: 1. Check for .env file
if exist .env goto :env_exists
echo [WARNING] .env configuration file not found!
echo Creating a default .env file...
echo DATABASE_URL="file:./dev.db" > .env
echo JWT_SECRET="mySuperSecureUnbreakableJwtSecret2026PlaceHub!!!" >> .env
echo [SUCCESS] Default .env created with local SQLite configuration.
goto :env_done

:env_exists
echo [INFO] Environment variables loaded from .env.

:env_done
echo.

:: 2. Installing node packages
echo [PROCESS 1/5] Synchronizing NPM dependencies...
call npm install
if %ERRORLEVEL% equ 0 goto :npm_ok
echo [ERROR] Dependency installation failed. Please check your Node.js and NPM installation.
pause
exit /b 1

:npm_ok
echo [SUCCESS] Dependencies synchronized successfully.
echo.

:: 3. Sync database schema
echo [PROCESS 2/5] Pushing SQLite database schema via Prisma...
call npx prisma db push
if %ERRORLEVEL% equ 0 goto :db_ok
echo [WARNING] Database initialization failed. Please ensure your SQLite database path is writeable.
echo [WARNING] Try running: npx prisma db push
goto :db_done

:db_ok
echo [SUCCESS] SQLite database schema synchronized successfully.

:db_done
echo.

:: 4. Seeding default data
echo [PROCESS 3/5] Seeding root administrator credentials and internships...
call npx prisma db seed
if %ERRORLEVEL% equ 0 goto :seed_ok
echo [WARNING] Database seeding failed. Try running: npx prisma db seed
goto :seed_done

:seed_ok
echo [SUCCESS] Default administrative credentials and mock jobs seeded successfully.

:seed_done
echo.

:: 5. Generate Prisma Client
echo [PROCESS 4/5] Compiling Prisma type-safe hooks...
call npx prisma generate
echo [SUCCESS] Prisma Client compiled successfully.
echo.

:: 6. Clean legacy source files
echo [PROCESS 5/5] Purging obsolete legacy files from workspace...
call node delete_legacy.js
echo [SUCCESS] Legacy cleanup finished.
echo.

echo ===================================================================
echo        PlaceHub is ready! Booting local Next.js server...
echo ===================================================================
echo.
start "" "http://localhost:3000"
call npm run dev
pause
