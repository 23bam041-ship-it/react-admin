# Deployment Guide - React Admin Panel

## 🚀 Deployment Options

This guide covers different deployment scenarios for the React Admin Panel application.

---

## Option 1: Local Development Deployment (Windows)

### Prerequisites
- Node.js v16+
- PostgreSQL 12+
- npm (comes with Node.js)

### Steps

1. **Clone/Setup Project**
   ```bash
   # Navigate to project directory
   cd react-admin
   ```

2. **Run Setup Script**
   ```bash
   # Run one of these:
   setup.bat              # For Command Prompt
   # or
   powershell setup.ps1   # For PowerShell
   ```

3. **Configure Database**
   ```bash
   # Create database
   createdb admin_panel_db
   
   # Import schema
   psql -U postgres -d admin_panel_db -f server/database.sql
   ```

4. **Setup Admin User**
   ```bash
   cd server
   node generateAdminPassword.js
   # Copy the SQL output and run in PostgreSQL
   ```

5. **Configure Environment**
   - Edit `server/.env`
   - Update database password and JWT secret

6. **Start Both Servers**
   ```bash
   # Option 1: Run both in background
   start.bat              # or start.ps1
   
   # Option 2: Run separately
   # Terminal 1:
   cd server && npm start
   
   # Terminal 2:
   cd client && npm run dev
   ```

7. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Login: admin@example.com / admin123

---

## Option 2: Production Deployment (Windows Server)

### Prerequisites
- Windows Server 2016+
- Node.js LTS
- PostgreSQL
- IIS or Nginx (optional, for reverse proxy)

### Steps

1. **Prepare Backend**
   ```bash
   cd server
   npm install --production
   ```

2. **Build Frontend**
   ```bash
   cd client
   npm install
   npm run build
   ```

3. **Configure Production Environment**
   ```env
   # server/.env
   PORT=5000
   DB_HOST=your_db_server
   DB_PORT=5432
   DB_NAME=admin_panel_db
   DB_USER=admin_user
   DB_PASSWORD=strong_password_here
   JWT_SECRET=very_long_random_secret_key_minimum_32_chars
   NODE_ENV=production
   ```

4. **Setup Windows Service (Optional)**
   
   Install `nssm` (Non-Sucking Service Manager):
   ```bash
   # Download nssm from https://nssm.cc/download
   # Extract and add to PATH
   
   # Install service
   nssm install AdminPanelBackend "C:\Path\to\node.exe" "C:\Path\to\server.js"
   nssm start AdminPanelBackend
   ```

5. **Configure IIS for Frontend**
   - Create new website in IIS
   - Point to `client/dist` directory
   - Add URL rewrite rule for React Router
   - Set up SSL certificate

6. **URL Rewrite for React Router**
   ```xml
   <rewrite>
     <rules>
       <rule name="React Routes" stopProcessing="true">
         <match url=".*" />
         <conditions>
           <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
           <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
           <add input="{REQUEST_URI}" pattern="^/api/" negate="true" />
         </conditions>
         <action type="Rewrite" url="/" />
       </rule>
     </rules>
   </rewrite>
   ```

7. **Setup Reverse Proxy (Nginx)**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     # Frontend
     location / {
       root /var/www/admin-panel/client/dist;
       try_files $uri $uri/ /index.html;
     }
     
     # Backend API
     location /api {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

---

## Option 3: Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --production

COPY server/ ./

EXPOSE 5000

CMD ["npm", "start"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: admin_panel_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: strong_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./server/database.sql:/docker-entrypoint-initdb.d/init.sql

  backend:
    build: ./server
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: admin_panel_db
      DB_USER: admin
      DB_PASSWORD: strong_password
      JWT_SECRET: your_secret_key
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Run with Docker Compose
```bash
docker-compose up -d
```

---

## Option 4: Cloud Deployment (Heroku)

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name-backend
   ```

3. **Add PostgreSQL Add-on**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev -a your-app-name-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_random_secret -a your-app-name-backend
   heroku config:set NODE_ENV=production -a your-app-name-backend
   ```

5. **Create Procfile**
   ```
   web: cd server && npm start
   ```

6. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

7. **Run Database Schema**
   ```bash
   heroku pg:psql -a your-app-name-backend < server/database.sql
   ```

### Frontend Deployment

1. **Create React Build**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

   Or use GitHub Actions for automatic deployment.

3. **Update API URL**
   - Update `API_URL` in components to use Heroku backend URL

---

## Option 5: AWS Deployment

### Backend (EC2)

1. **Launch EC2 Instance**
   - Select Ubuntu Server
   - t2.micro (free tier eligible)

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql postgresql-contrib
   ```

3. **Clone Repository**
   ```bash
   git clone your-repo
   cd react-admin/server
   ```

4. **Install & Setup**
   ```bash
   npm install
   # Configure .env
   npm start
   ```

5. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

### Frontend (S3 + CloudFront)

1. **Build Application**
   ```bash
   cd client
   npm run build
   ```

2. **Create S3 Bucket**
   - Upload `dist` folder contents
   - Enable public access
   - Enable static website hosting

3. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Behavior: Forward headers
   - SSL: Use AWS Certificate Manager

4. **Route53 DNS**
   - Point domain to CloudFront distribution

---

## Option 6: Azure Deployment

### Backend (App Service)

1. **Create App Service**
   ```bash
   az appservice plan create --name AdminPanelPlan --resource-group MyResourceGroup --sku F1
   az webapp create --name AdminPanelBackend --resource-group MyResourceGroup --plan AdminPanelPlan
   ```

2. **Deploy**
   ```bash
   az webapp up --name AdminPanelBackend
   ```

### Frontend (Static Web Apps)

1. **Deploy to Static Web Apps**
   ```bash
   az staticwebapp create --name AdminPanelFrontend --resource-group MyResourceGroup --source . --location westus2 --build-folder client/dist
   ```

---

## Security Checklist

### Before Production:
- [ ] Change all default passwords
- [ ] Update JWT_SECRET to random 32+ char string
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for specific domains
- [ ] Enable database backups
- [ ] Setup firewall rules
- [ ] Enable logging and monitoring
- [ ] Update database user permissions
- [ ] Configure rate limiting
- [ ] Setup environment-specific configs
- [ ] Review OWASP top 10 vulnerabilities
- [ ] Enable CSRF protection
- [ ] Setup monitoring alerts
- [ ] Create backup plan

### Database Security:
```sql
-- Create limited privilege user for application
CREATE ROLE app_user WITH LOGIN PASSWORD 'strong_password';

-- Grant specific permissions
GRANT CONNECT ON DATABASE admin_panel_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Set as default
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
```

---

## Monitoring & Logging

### Application Monitoring
```bash
npm install pm2 pm2-logrotate
pm2 install pm2-logrotate
pm2 logs
```

### Database Monitoring
```bash
# Check database size
SELECT pg_size_pretty(pg_database_size('admin_panel_db'));

# Check slow queries
SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 5;
```

---

## Backup Strategy

### Database Backup
```bash
# Daily backup
pg_dump admin_panel_db > backup_$(date +%Y%m%d).sql

# Scheduled backup (Linux cron)
0 2 * * * pg_dump admin_panel_db | gzip > /backups/admin_panel_$(date +\%Y\%m\%d).sql.gz
```

---

## Performance Optimization

### Frontend
- Enable gzip compression
- Minify CSS/JS
- Use CDN for static assets
- Enable browser caching

### Backend
- Enable response compression
- Use database connection pooling
- Cache frequently accessed data
- Add indexes to frequently queried columns

### Database
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_group_id ON employees(group_id);
CREATE INDEX idx_group_permissions_group_id ON group_permissions(group_id);
```

---

## Rollback Plan

### If Issues Occur:
1. Keep previous version ready
2. Database migration scripts for rollback
3. Blue-green deployment strategy
4. Keep backup of previous .env

---

**For specific cloud platform details, consult their official documentation.**
