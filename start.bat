@echo off
REM Threaded Comment System Startup Script for Windows
echo 🚀 Starting Threaded Comment System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

echo.
echo 📦 Installing dependencies...

REM Install server dependencies
echo Installing server dependencies...
cd server
if not exist "node_modules" (
    npm install
)

REM Install client dependencies
echo Installing client dependencies...
cd ..\client
if not exist "node_modules" (
    npm install
)

echo.
echo 🎯 Starting servers...

REM Start server in background
echo Starting backend server on port 5000...
cd ..\server
start "Backend Server" cmd /k "npm run dev"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Start client
echo Starting frontend development server on port 5173...
cd ..\client
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting up!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:5000
echo 🏥 Health:   http://localhost:5000/health
echo.
echo Press any key to exit...
pause >nul


