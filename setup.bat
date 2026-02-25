@echo off
REM PSU Agro Food - Quick Setup Script for Windows
REM This script automates the project setup process

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     PSU Agro Food - Automated Setup Script (Windows)          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MySQL is installed
where mysql >nul 2>nul
if errorlevel 1 (
    echo ❌ MySQL is not installed. Please install MySQL first.
    echo    Or ensure MySQL is in your PATH environment variable.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: !NODE_VERSION!
echo ✅ MySQL is installed
echo.

REM Step 1: Install backend dependencies
echo 📦 Step 1: Installing backend dependencies...
cd backend
if not exist node_modules (
    call npm install --quiet
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed
) else (
    echo ⚠️  Backend modules already exist
)

REM Step 2: Setup .env if it doesn't exist
echo.
echo ⚙️  Step 2: Configuring environment...
if not exist .env (
    copy .env.example .env >nul
    echo ✅ Created .env file from .env.example
    echo    ⚠️  Please edit .env with your MySQL credentials:
    echo    1. Open backend\.env in a text editor
    echo    2. Update DB_PASSWORD with your MySQL password
    echo    3. Run: npm run setup-db
    pause
    exit /b 0
) else (
    echo ✅ .env file already exists
)

REM Step 3: Initialize database
echo.
echo 🗄️  Step 3: Initializing database...
call node setup-database.js
if errorlevel 1 (
    echo ❌ Database initialization failed
    pause
    exit /b 1
)

REM Step 4: Install frontend dependencies
echo.
echo 📦 Step 4: Installing frontend dependencies...
cd ..\frontend
if not exist node_modules (
    call npm install --quiet
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
) else (
    echo ⚠️  Frontend modules already exist
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  ✅ SETUP COMPLETED                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 To start the application:
echo.
echo    Command Prompt 1 (Backend):
echo    ^> cd backend
echo    ^> npm run dev
echo.
echo    Command Prompt 2 (Frontend):
echo    ^> cd frontend
echo    ^> npm run dev
echo.
echo 📱 Access the application:
echo    Frontend: http://localhost:5173/
echo    Backend:  http://localhost:5000/
echo    Admin:    http://localhost:5173/admin (admin / admin123)
echo.
pause
