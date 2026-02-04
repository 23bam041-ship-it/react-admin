import pool from './db.js';

async function createGroupMenusTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS group_menus (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(group_id, menu_id)
      );
    `;
    await pool.query(query);
    console.log('group_menus table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
}

createGroupMenusTable();
