@echo off
cd /d "%~dp0"
echo GIZA NEXUS Registration Workbench
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to start GIZA.
  pause
  exit /b 1
)
echo Open http://127.0.0.1:4174/workbench/ in your browser.
node scripts\workbench\server.mjs
pause
