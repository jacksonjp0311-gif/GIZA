@echo off
cd /d "%~dp0"
echo GIZA NEXUS - compile and launch
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to start GIZA.
  pause
  exit /b 1
)
node scripts\start.mjs
pause
