@echo off
title Arena Auctions - Multi-Game Live Platform
echo ========================================================
echo   Starting Arena Auctions Full-Stack Platform...
echo ========================================================

echo [1/2] Launching Backend Server on Port 5000...
start "Arena Auctions - Backend Server (Port 5000)" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Frontend Application on Port 5173...
start "Arena Auctions - React Frontend (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo Both services are now running in their own windows!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:5000/api/health
echo.
pause

