@echo off
echo ========================================
echo Starting React Admin Panel
echo ========================================
echo.
echo Starting Backend Server (Port 5000)...
echo Starting Frontend Server (Port 5173)...
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

start "Backend Server" cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo Both servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
