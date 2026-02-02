# Start both backend and frontend servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting React Admin Panel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Write-Host "Starting Frontend Server (Port 5173)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host ""
Write-Host "Both servers started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open your browser to http://localhost:5173" -ForegroundColor Green
Write-Host ""
