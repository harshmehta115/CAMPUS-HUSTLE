@echo off
title Campus Hustle Launcher
echo ===================================================
echo           STARTING CAMPUS HUSTLE
echo ===================================================
echo.
echo [1/3] Launching Backend API & WebSocket Server (:5000)...
start "Campus Hustle - Backend Server (:5000)" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Launching Frontend Vite App (:5173)...
start "Campus Hustle - Frontend App (:5173)" cmd /k "cd /d %~dp0client && npm run dev"

timeout /t 4 /nobreak >nul

echo [3/3] Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ===================================================
echo   Campus Hustle is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ===================================================
echo.
echo Keep the backend and frontend terminal windows open.
pause