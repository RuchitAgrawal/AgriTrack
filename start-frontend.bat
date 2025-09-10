@echo off
echo Starting AgriTrack Frontend...
cd /d "%~dp0"
npm install
echo.
echo Frontend starting on http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
npm run dev
