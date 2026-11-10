@echo off
title Arena Auctions - Seed MongoDB Database
echo ========================================================
echo   Seeding MongoDB with Tournaments, Teams & Athletes...
echo ========================================================
cd server
npm run seed
echo.
pause

