# Quick Setup Guide

Follow these steps to get your admin panel running:

## 1. Database Setup (PostgreSQL)

```bash
# Create the database
createdb admin_panel_db

# Or using psql:
psql -U postgres
CREATE DATABASE admin_panel_db;
\q

# Import the schema
psql -U postgres -d admin_panel_db -f server/database.sql
```

## 2. Generate Admin User

```bash
cd server
node generateAdminPassword.js
```

Copy the SQL output and run it in your PostgreSQL database.

## 3. Configure Backend

Edit `server/.env` with your PostgreSQL password:
```
DB_PASSWORD=your_postgres_password
```

## 4. Start Backend

```bash
cd server
npm start
```

Should see: "Database connected successfully" and "Server is running on port 5000"

## 5. Start Frontend

Open a new terminal:
```bash
cd client
npm run dev
```

Opens at: http://localhost:5173

## 6. Login

- Email: admin@example.com
- Password: admin123

## That's it! 🎉

Now you can:
- Add employees
- Create groups with menu/module access
- Manage module permissions (Add, View, Edit, Delete)
- Search and edit employees
