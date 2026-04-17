@echo off
echo Cleaning up previous sessions...
taskkill /f /im node.exe /t >nul 2>&1
taskkill /f /im java.exe /t >nul 2>&1

echo.
echo Starting SkillX Backend and Frontend...

:: Start Backend in a new window (IPv4 fix is now handled in Java code)
start "SkillX Backend" powershell -NoExit -Command "cd backend; .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"

:: Wait for backend to initialize
echo Waiting for backend to start (15s)...
timeout /t 15

:: Start Frontend dev server on port 3000
start "SkillX Frontend" powershell -NoExit -Command "npx serve frontend -l 3000"

echo.
echo ===================================================
echo Backend is starting in a separate window.
echo Frontend is starting in a separate window.
echo.
echo Once started, you can visit: http://localhost:3000
echo ===================================================
pause
