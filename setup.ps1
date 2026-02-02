# React Admin Panel - PowerShell Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "React Admin Panel - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Backend Dependencies
Write-Host "Step 1: Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install backend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Frontend Dependencies
Write-Host "Step 2: Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location ..\client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install frontend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Generate Admin Password
Write-Host "Step 3: Generating Admin Password..." -ForegroundColor Yellow
Set-Location ..\server
node generateAdminPassword.js
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Create PostgreSQL database: admin_panel_db"
Write-Host "2. Run: psql -U postgres -d admin_panel_db -f server/database.sql"
Write-Host "3. Copy the SQL above and run it in PostgreSQL to create admin user"
Write-Host "4. Update server/.env with your PostgreSQL password"
Write-Host "5. Start backend: cd server && npm start"
Write-Host "6. Start frontend: cd client && npm run dev"
Write-Host "7. Open http://localhost:5173 and login with admin@example.com / admin123"
Write-Host ""
Read-Host "Press Enter to exit"
