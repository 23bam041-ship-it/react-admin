@echo off
echo ========================================
echo React Admin Panel - Setup Script
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Step 2: Installing Frontend Dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo Step 3: Generating Admin Password...
cd ..\server
node generateAdminPassword.js
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Create PostgreSQL database: admin_panel_db
echo 2. Run: psql -U postgres -d admin_panel_db -f server/database.sql
echo 3. Copy the SQL above and run it in PostgreSQL to create admin user
echo 4. Update server/.env with your PostgreSQL password
echo 5. Start backend: cd server ^&^& npm start
echo 6. Start frontend: cd client ^&^& npm run dev
echo 7. Open http://localhost:5173 and login with admin@example.com / admin123
echo.
pause
