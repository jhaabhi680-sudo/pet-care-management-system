@echo off
title Pet Care System - Launcher
echo ====================================================
echo Launching Pet Care Management System...
echo ====================================================

start "PetCare - Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak > nul
start "PetCare - Frontend Client" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate terminal windows!
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:3000/
echo.
pause
