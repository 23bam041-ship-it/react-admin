# Troubleshooting & FAQs

## Common Issues & Solutions

### ❌ Issue: Database Connection Error

**Error Message:**
```
Error connecting to the database: error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. **Check PostgreSQL is Running**
   ```bash
   # Windows
   pg_isready -h localhost
   
   # Should return: accepting connections
   ```

2. **Start PostgreSQL Service**
   ```bash
   # Windows Services
   services.msc -> PostgreSQL -> Start
   
   # Or via command line
   net start postgresql-x64-14
   ```

3. **Verify Database Exists**
   ```bash
   psql -U postgres -l
   # Look for admin_panel_db in the list
   ```

4. **Check .env Credentials**
   ```env
   DB_HOST=localhost          # Verify this is correct
   DB_PORT=5432              # Default PostgreSQL port
   DB_NAME=admin_panel_db     # Check spelling
   DB_USER=postgres           # Default user
   DB_PASSWORD=your_password  # Must match your password
   ```

5. **Reset PostgreSQL Password**
   ```bash
   # Windows
   # Control Panel -> Services -> PostgreSQL
   # Stop the service
   # Restart with password reset
   
   # Or connect without password and set new one
   psql -U postgres
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```

---

### ❌ Issue: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID 1234 /F

# Or use different port
# Edit .env: PORT=5001
```

---

### ❌ Issue: CORS Error in Browser

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**

1. **Verify Backend is Running**
   ```bash
   curl http://localhost:5000/api/menus
   # Should fail with 401 (expected - no auth token)
   ```

2. **Check CORS Configuration**
   - Edit `server/server.js`
   - Ensure `app.use(cors())` is present

3. **Verify API URL in Frontend**
   ```javascript
   // Check in components
   const API_URL = 'http://localhost:5000/api';
   // Should match your backend URL
   ```

4. **Browser Console Issues**
   - F12 -> Network tab
   - Check full error message
   - Verify response headers

---

### ❌ Issue: Login Not Working

**Possible Causes:**

1. **Admin User Not Created**
   ```bash
   # Create admin user
   cd server
   node generateAdminPassword.js
   # Copy SQL and run in PostgreSQL
   ```

2. **Wrong Credentials**
   - Email: `admin@example.com` (exact match)
   - Password: `admin123`
   - Check for typos

3. **Password Hash Issue**
   ```bash
   # Generate new hash
   node
   > const bcrypt = require('bcryptjs');
   > bcrypt.hashSync('admin123', 10);
   
   # Copy hash to database
   UPDATE employees SET password = '$2a$10...' WHERE email = 'admin@example.com';
   ```

4. **Database Query Issue**
   ```sql
   -- Verify admin user exists
   SELECT id, email, name FROM employees WHERE email = 'admin@example.com';
   
   -- Should return 1 row
   ```

---

### ❌ Issue: Frontend Won't Start

**Error Message:**
```
VITE v7.0.0 ready in X ms

Port 5173 is in use, trying another port...
```

**Solutions:**

```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID 1234 /F

# Or use different port
cd client
npm run dev -- --port 5174
```

---

### ❌ Issue: Dependencies Installation Failed

**Error Message:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules package-lock.json
# Windows: rmdir /s /q node_modules

# Reinstall
npm install

# Or force resolution
npm install --legacy-peer-deps
```

---

### ❌ Issue: "Cannot find module" Error

**Error Message:**
```
Error: Cannot find module 'axios'
```

**Solutions:**

```bash
# Reinstall dependencies
npm install

# Or install specific package
npm install axios

# Verify in node_modules
ls node_modules/axios
# Windows: dir node_modules\axios
```

---

### ❌ Issue: Employee Not Showing in List

**Solutions:**

1. **Verify Employee Was Created**
   ```sql
   SELECT * FROM employees;
   ```

2. **Check API Response**
   - Open browser DevTools (F12)
   - Network tab -> GET /api/employees
   - Check Status (should be 200)
   - Check Response body

3. **Check Token Validity**
   ```javascript
   // Console
   localStorage.getItem('token')
   // Should return a token starting with "eyJ"
   ```

---

### ❌ Issue: Group Creation Failed

**Error Message:**
```
Group name already exists
```

**Solutions:**

1. **Use Different Name**
   ```javascript
   // Append number or date
   "Sales Team 2"
   "Finance Team - " + new Date().toISOString()
   ```

2. **Check Existing Groups**
   ```sql
   SELECT * FROM groups;
   ```

3. **Delete Duplicate Group**
   ```sql
   DELETE FROM groups WHERE name = 'Duplicate Name';
   ```

---

### ❌ Issue: Module Access Not Saving

**Solutions:**

1. **Select Group First**
   - Ensure you select a group from dropdown
   - Group must exist

2. **Check Permissions**
   ```sql
   SELECT * FROM group_permissions WHERE group_id = 1;
   ```

3. **Clear Browser Cache**
   - F12 -> Application -> Clear all
   - Refresh page

---

## ❓ FAQs

### Q: How do I change the default admin password?

**A:** Update in the database:
```sql
-- Generate new hash first using: bcrypt.hashSync('newpassword', 10)
UPDATE employees 
SET password = '$2a$10$YourNewHashHere' 
WHERE email = 'admin@example.com';
```

---

### Q: Can I add more menus and modules?

**A:** Yes, modify `server/database.sql`:
```sql
INSERT INTO menus (name) VALUES ('Menu 6');
INSERT INTO modules (name, menu_id) VALUES 
  ('Module 6-1', 6),
  ('Module 6-2', 6),
  -- etc
;
```

Then restart backend.

---

### Q: How do I backup my database?

**A:** 
```bash
# Backup
pg_dump admin_panel_db > backup.sql

# Restore
psql admin_panel_db < backup.sql
```

---

### Q: Can I run the application on different ports?

**A:** Yes, modify configuration:

**Backend:**
```env
# server/.env
PORT=3000  # Changed from 5000
```

**Frontend:**
```bash
cd client
npm run dev -- --port 3173
```

Then update `API_URL` in components.

---

### Q: How do I add new employees via SQL?

**A:** First generate password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('password123', 10))"
```

Then:
```sql
INSERT INTO employees 
(employee_id, name, email, password, phone_number, language, group_id)
VALUES 
('EMP004', 'New Employee', 'new@example.com', '$2a$10$hash', '5551234567', 'English', 1);
```

---

### Q: How do I reset all data?

**A:** 
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE admin_panel_db;"
psql -U postgres -c "CREATE DATABASE admin_panel_db;"
psql -U postgres -d admin_panel_db -f server/database.sql

# Create admin user again
cd server
node generateAdminPassword.js
```

---

### Q: Can I use a different database?

**A:** The code uses PostgreSQL. To use MySQL/MariaDB:

1. Install `mysql2` instead of `pg`
2. Change `db.js` connection code
3. Modify SQL syntax in `database.sql`
4. Update `.env` credentials

---

### Q: How do I enable HTTPS in development?

**A:** For production-like testing:
```bash
npm install -g mkcert
mkcert localhost

# Use certificates when starting
```

For production, use a reverse proxy (Nginx) or cloud provider.

---

### Q: What's the maximum number of employees?

**A:** No hard limit, but performance considerations:
- Database: Can handle millions of records
- Frontend: Pagination recommended for 1000+ employees
- Consider adding pagination to employee list

---

### Q: How do I reset a password?

**A:** Admin must update in database (no password reset feature):
```sql
-- Generate new hash
UPDATE employees 
SET password = '$2a$10$new_hash' 
WHERE id = 1;
```

---

### Q: Can multiple users login simultaneously?

**A:** Yes, each gets their own JWT token. Tokens are independent.

---

### Q: How often should I backup?

**A:** Recommended:
- Development: Daily
- Production: Multiple times per day
- Critical data: Hourly or per transaction

---

### Q: How do I monitor application logs?

**A:** 

```bash
# View server logs
npm start
# Logs displayed in terminal

# For production with PM2
pm2 logs AdminPanelBackend
pm2 logs -f AdminPanelBackend  # Follow logs

# View frontend errors
# Browser console (F12)
```

---

### Q: What happens if I delete a group?

**A:** 
- Group is deleted
- Associated permissions are deleted (CASCADE)
- Employees assigned to that group: group_id set to NULL

---

### Q: Can I export employee data?

**A:** Currently not in UI, but via SQL:
```bash
# Export to CSV
psql admin_panel_db -c "COPY employees TO STDOUT WITH CSV HEADER" > employees.csv
```

---

### Q: How do I handle forgotten admin password?

**A:** Access database directly and reset:
```sql
-- Generate new hash using generateAdminPassword.js
UPDATE employees 
SET password = 'new_hash_here' 
WHERE email = 'admin@example.com';
```

---

### Q: Is this application secure?

**A:** Yes, includes:
- Password hashing with bcrypt
- JWT authentication
- SQL parameterized queries
- CORS protection
- Environment variable security

**However, for production:**
- Change all default secrets
- Use HTTPS only
- Enable WAF
- Regular security audits
- Keep dependencies updated

---

## Performance Tips

1. **Database:**
   - Add indexes for frequently queried fields
   - Archive old data periodically
   - Run VACUUM ANALYZE regularly

2. **Frontend:**
   - Enable gzip compression
   - Use lazy loading for routes
   - Implement pagination

3. **Backend:**
   - Use connection pooling (already configured)
   - Cache API responses
   - Use database transactions

---

## Getting Help

1. Check this file first
2. Review [README.md](README.md)
3. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. Verify .env configuration
5. Check application logs
6. Verify database connection

---

**Last Updated:** February 2024
**Version:** 1.0.0
