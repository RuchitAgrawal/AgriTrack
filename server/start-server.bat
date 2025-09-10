@echo off
echo Starting AgriTrack Backend Server...
cd /d "%~dp0"
npm install
echo.
echo Backend server starting on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
npm run dev
