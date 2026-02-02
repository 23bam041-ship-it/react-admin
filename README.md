# React Admin Panel with PostgreSQL

A full-stack admin panel application built with React (Vite), Node.js (Express), and PostgreSQL. This application provides comprehensive employee management with role-based access control, group management, and module permissions.

## 🚀 Features

### Frontend (React + Vite)
- **Login Page** - Secure authentication system
- **Dashboard** - Overview with statistics and navigation
- **Employee Management** - Add, edit, delete, and search employees
- **Group Management** - Create groups with menu and module permissions
- **Module Access Control** - Fine-grained CRUD permissions (Add, View, Edit, Delete)
- **Responsive Design** - Works on all screen sizes

### Backend (Node.js + Express)
- RESTful API with JWT authentication
- PostgreSQL database integration
- CRUD operations for employees, groups, and permissions
- Secure password hashing with bcrypt

### Database (PostgreSQL)
- 5 tables: employees, menus, modules, groups, group_permissions
- Pre-populated with 5 menus and 25 modules (5 per menu)
- Audit timestamps (created_at, updated_at)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## 🛠️ Installation & Setup

### Step 1: PostgreSQL Database Setup

1. **Install PostgreSQL** if you haven't already

2. **Create Database**
   ```bash
   # Open PostgreSQL command line or pgAdmin
   # Run the following command:
   CREATE DATABASE admin_panel_db;
   ```

3. **Execute Database Schema**
   ```bash
   # Option 1: Using psql command line
   psql -U postgres -d admin_panel_db -f server/database.sql

   # Option 2: Using pgAdmin
   # - Open pgAdmin
   # - Navigate to admin_panel_db
   # - Open Query Tool
   # - Copy contents of server/database.sql
   # - Execute the script
   ```

4. **Verify Tables Created**
   ```sql
   -- Run this in PostgreSQL to verify
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   
   -- You should see: employees, menus, modules, groups, group_permissions
   ```

### Step 2: Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Configure Environment Variables**
   - Edit the `.env` file with your PostgreSQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=admin_panel_db
   DB_USER=postgres
   DB_PASSWORD=your_actual_password_here
   JWT_SECRET=your_secret_key_change_this_in_production
   ```

3. **Dependencies are already installed**, but if needed:
   ```bash
   npm install
   ```

4. **Start the Backend Server**
   ```bash
   npm start
   
   # Or for development with auto-reload:
   npm run dev
   ```

   You should see:
   ```
   Database connected successfully
   Server is running on port 5000
   ```

### Step 3: Frontend Setup

1. **Open a new terminal** and navigate to client directory
   ```bash
   cd client
   ```

2. **Dependencies are already installed**, but if needed:
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

   The application will open at: `http://localhost:5173`

### Step 4: Create First Admin User

Since this is a fresh installation, you need to create an admin user directly in the database:

```sql
-- Connect to your database and run:
INSERT INTO employees (employee_id, name, email, password, phone_number, language, group_id)
VALUES (
    'ADMIN001',
    'Admin User',
    'admin@example.com',
    '$2a$10$YourHashedPasswordHere',  -- See note below
    '1234567890',
    'English',
    NULL
);
```

**To generate a hashed password:**
```bash
# Run this in Node.js console or create a small script:
node
> const bcrypt = require('bcryptjs');
> bcrypt.hashSync('admin123', 10);
# Copy the output and use it in the SQL above
```

**Or use this pre-hashed password for testing:**
- Password: `admin123`
- Hash: `$2a$10$rJ7qZNJ3c2x0hK8VnT1Kh.FVFgvX0aXq0WqP7YK5iM0F5Y0nK5Y0K`

```sql
INSERT INTO employees (employee_id, name, email, password, phone_number, language, group_id)
VALUES (
    'ADMIN001',
    'Admin User',
    'admin@example.com',
    '$2a$10$rJ7qZNJ3c2x0hK8VnT1Kh.FVFgvX0aXq0WqP7YK5iM0F5Y0nK5Y0K',
    '1234567890',
    'English',
    NULL
);
```

## 🎯 Usage Guide

### 1. Login
- Open `http://localhost:5173`
- Enter credentials:
  - Email: `admin@example.com`
  - Password: `admin123`
- Click "Login"

### 2. Dashboard
- View statistics (Total Employees, Groups, Menus, Modules)
- Access three-dot menu (⋮) in top-right corner:
  - Return to Dashboard
  - 5 Menus (each expandable to show 5 modules)
  - Setup
  - Logout

### 3. Setup Page
Click "Setup" from the menu to access employee management.

#### Add Employee
1. Click "Add Employee" button
2. Fill in the form:
   - Employee ID (unique identifier)
   - Name
   - Email
   - Password
   - Phone Number (optional)
   - Language (optional)
   - Group (optional - assign to existing group)
3. Click "Add"

#### Create Group
1. Click "Create Group" button
2. Enter group name
3. Select menus and modules by checking boxes
4. Click "Create Group"
5. Employees assigned to this group will only access selected menus/modules

#### Module Access
1. Click "Module Access" button
2. Select a group from dropdown
3. For each module, set CRUD permissions:
   - ☑ Add - Can create new records
   - ☑ View - Can view records
   - ☑ Edit - Can modify records
   - ☑ Delete - Can delete records
4. Click "Save Permissions"

#### Edit Employee
1. Find employee in the list
2. Click "Edit" button
3. Modify details (leave password blank to keep current)
4. Click "Update"

#### Delete Employee
1. Find employee in the list
2. Click "Delete" button
3. Confirm deletion

#### Search Employees
- Type in search bar to filter by:
  - Employee ID
  - Name
  - Email
- Click "Clear" to reset search

## 📁 Project Structure

```
react-admin/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Dashboard.jsx   # Dashboard with stats
│   │   │   ├── Setup.jsx       # Employee management
│   │   │   ├── AddEmployeeModal.jsx      # Add/Edit employee form
│   │   │   ├── CreateGroupModal.jsx      # Create group form
│   │   │   └── ModuleAccessModal.jsx     # Module permissions form
│   │   ├── App.jsx             # Main app component with routing
│   │   ├── App.css             # Global styles
│   │   └── main.jsx            # Entry point
│   └── package.json
│
└── server/                      # Node.js Backend
    ├── server.js               # Express API server
    ├── db.js                   # PostgreSQL connection
    ├── database.sql            # Database schema
    ├── .env                    # Environment variables
    └── package.json
```

## 🔐 Database Schema

### Tables

1. **menus** - 5 main menus
   - id, name, created_at, updated_at

2. **modules** - 25 modules (5 per menu)
   - id, name, menu_id, created_at, updated_at

3. **groups** - User groups with permissions
   - id, name, created_at, updated_at

4. **group_permissions** - Menu/Module access for groups
   - id, group_id, menu_id, module_id
   - can_add, can_view, can_edit, can_delete
   - created_at, updated_at

5. **employees** - User accounts
   - id, employee_id, name, email, password
   - phone_number, language, group_id
   - created_at, updated_at

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group with permissions
- `GET /api/groups/:id/permissions` - Get group permissions
- `PUT /api/groups/:id/permissions` - Update group permissions

### Menus & Modules
- `GET /api/menus` - Get all menus
- `GET /api/modules` - Get all modules
- `GET /api/modules/menu/:menuId` - Get modules by menu

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

## 🚀 Running in Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
# Serve the dist folder with a static server
```

## 🔒 Security Notes

- **Change JWT_SECRET** in production to a strong random string
- **Use HTTPS** in production
- **Update CORS settings** for production domains
- **Use environment-specific** database credentials
- **Implement rate limiting** for API endpoints
- **Add input validation** and sanitization

## 🐛 Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use
```bash
# Backend (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### CORS Errors
- Ensure backend is running on port 5000
- Check API_URL in React components

### Login Not Working
- Verify admin user exists in database
- Check password hash is correct
- Ensure JWT_SECRET is set

## 📝 Additional Features to Implement

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Activity logs
- [ ] Export employees to CSV/Excel
- [ ] Bulk employee import
- [ ] Advanced filtering and sorting
- [ ] Dashboard charts and graphs
- [ ] Notification system
- [ ] Two-factor authentication

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Support

For issues or questions, please check:
1. Database connection is successful
2. All dependencies are installed
3. Environment variables are correct
4. Both servers are running

---

**Built with ❤️ using React, Node.js, Express, and PostgreSQL**
