import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM employees WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const employee = result.rows[0];
    const validPassword = await bcrypt.compare(password, employee.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: employee.id, email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        employee_id: employee.employee_id,
        group_id: employee.group_id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== MENU ROUTES ====================

// Get all menus
app.get('/api/menus', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menus ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== MODULE ROUTES ====================

// Get all modules
app.get('/api/modules', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, mn.name as menu_name 
       FROM modules m 
       JOIN menus mn ON m.menu_id = mn.id 
       ORDER BY m.menu_id, m.id`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get modules by menu
app.get('/api/modules/menu/:menuId', authenticateToken, async (req, res) => {
  try {
    const { menuId } = req.params;
    const result = await pool.query(
      'SELECT * FROM modules WHERE menu_id = $1 ORDER BY id',
      [menuId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== GROUP ROUTES ====================

// Get all groups
app.get('/api/groups', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create group with permissions
app.post('/api/groups', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, permissions } = req.body;

    await client.query('BEGIN');

    // Create group
    const groupResult = await client.query(
      'INSERT INTO groups (name) VALUES ($1) RETURNING *',
      [name]
    );
    const group = groupResult.rows[0];

    // Insert permissions
    if (permissions && permissions.length > 0) {
      for (const perm of permissions) {
        await client.query(
          `INSERT INTO group_permissions (group_id, menu_id, module_id, can_add, can_view, can_edit, can_delete) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [group.id, perm.menu_id, perm.module_id, perm.can_add || false, perm.can_view || false, perm.can_edit || false, perm.can_delete || false]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(group);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Group name already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  } finally {
    client.release();
  }
});

// Get group permissions
app.get('/api/groups/:id/permissions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT gp.*, m.name as menu_name, md.name as module_name 
       FROM group_permissions gp
       JOIN menus m ON gp.menu_id = m.id
       JOIN modules md ON gp.module_id = md.id
       WHERE gp.group_id = $1
       ORDER BY m.id, md.id`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update group permissions
app.put('/api/groups/:id/permissions', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    await client.query('BEGIN');

    // Delete existing permissions
    await client.query('DELETE FROM group_permissions WHERE group_id = $1', [id]);

    // Insert new permissions
    if (permissions && permissions.length > 0) {
      for (const perm of permissions) {
        await client.query(
          `INSERT INTO group_permissions (group_id, menu_id, module_id, can_add, can_view, can_edit, can_delete) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [id, perm.menu_id, perm.module_id, perm.can_add || false, perm.can_view || false, perm.can_edit || false, perm.can_delete || false]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Permissions updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// ==================== EMPLOYEE ROUTES ====================

// Get all employees
app.get('/api/employees', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id, e.employee_id, e.name, e.email, e.phone_number, e.language, 
              e.group_id, g.name as group_name, e.created_at, e.updated_at
       FROM employees e
       LEFT JOIN groups g ON e.group_id = g.id
       ORDER BY e.id`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get employee by id
app.get('/api/employees/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT e.id, e.employee_id, e.name, e.email, e.phone_number, e.language, 
              e.group_id, g.name as group_name, e.created_at, e.updated_at
       FROM employees e
       LEFT JOIN groups g ON e.group_id = g.id
       WHERE e.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create employee
app.post('/api/employees', authenticateToken, async (req, res) => {
  try {
    const { employee_id, name, email, password, phone_number, language, group_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO employees (employee_id, name, email, password, phone_number, language, group_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [employee_id, name, email, hashedPassword, phone_number, language, group_id]
    );

    const employee = result.rows[0];
    delete employee.password;
    res.status(201).json(employee);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Employee ID or email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Update employee
app.put('/api/employees/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, name, email, password, phone_number, language, group_id } = req.body;

    let query, params;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `UPDATE employees 
               SET employee_id = $1, name = $2, email = $3, password = $4, 
                   phone_number = $5, language = $6, group_id = $7, updated_at = CURRENT_TIMESTAMP
               WHERE id = $8 RETURNING *`;
      params = [employee_id, name, email, hashedPassword, phone_number, language, group_id, id];
    } else {
      query = `UPDATE employees 
               SET employee_id = $1, name = $2, email = $3, phone_number = $4, 
                   language = $5, group_id = $6, updated_at = CURRENT_TIMESTAMP
               WHERE id = $7 RETURNING *`;
      params = [employee_id, name, email, phone_number, language, group_id, id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const employee = result.rows[0];
    delete employee.password;
    res.json(employee);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'Employee ID or email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Delete employee
app.delete('/api/employees/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== DASHBOARD ROUTES ====================

// Get dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const employeeCount = await pool.query('SELECT COUNT(*) FROM employees');
    const groupCount = await pool.query('SELECT COUNT(*) FROM groups');
    const menuCount = await pool.query('SELECT COUNT(*) FROM menus');
    const moduleCount = await pool.query('SELECT COUNT(*) FROM modules');

    res.json({
      employees: parseInt(employeeCount.rows[0].count),
      groups: parseInt(groupCount.rows[0].count),
      menus: parseInt(menuCount.rows[0].count),
      modules: parseInt(moduleCount.rows[0].count)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
