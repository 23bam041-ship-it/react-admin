-- Create Database
-- CREATE DATABASE admin_panel_db;

-- Table 1: Menus
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Modules
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, menu_id)
);

-- Table 3: Groups
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: Group Permissions (Menu-Module linking with CRUD access)
CREATE TABLE IF NOT EXISTS group_permissions (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
    can_add BOOLEAN DEFAULT FALSE,
    can_view BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, menu_id, module_id)
);

-- Table 5: Employees
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    language VARCHAR(50),
    group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample menus (5 menus)
INSERT INTO menus (name) VALUES 
    ('Menu 1'),
    ('Menu 2'),
    ('Menu 3'),
    ('Menu 4'),
    ('Menu 5')
ON CONFLICT (name) DO NOTHING;

-- Insert sample modules (5 modules per menu = 25 total)
INSERT INTO modules (name, menu_id) VALUES 
    -- Menu 1 modules
    ('Module 1-1', 1),
    ('Module 1-2', 1),
    ('Module 1-3', 1),
    ('Module 1-4', 1),
    ('Module 1-5', 1),
    -- Menu 2 modules
    ('Module 2-1', 2),
    ('Module 2-2', 2),
    ('Module 2-3', 2),
    ('Module 2-4', 2),
    ('Module 2-5', 2),
    -- Menu 3 modules
    ('Module 3-1', 3),
    ('Module 3-2', 3),
    ('Module 3-3', 3),
    ('Module 3-4', 3),
    ('Module 3-5', 3),
    -- Menu 4 modules
    ('Module 4-1', 4),
    ('Module 4-2', 4),
    ('Module 4-3', 4),
    ('Module 4-4', 4),
    ('Module 4-5', 4),
    -- Menu 5 modules
    ('Module 5-1', 5),
    ('Module 5-2', 5),
    ('Module 5-3', 5),
    ('Module 5-4', 5),
    ('Module 5-5', 5)
ON CONFLICT (name, menu_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_modules_menu_id ON modules(menu_id);
CREATE INDEX IF NOT EXISTS idx_group_permissions_group_id ON group_permissions(group_id);
CREATE INDEX IF NOT EXISTS idx_employees_group_id ON employees(group_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
