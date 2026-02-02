# API Documentation - React Admin Panel

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except login) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "employee_id": "ADMIN001",
    "group_id": null
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

## 👥 Employee Endpoints

### Get All Employees
**GET** `/employees`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "employee_id": "ADMIN001",
    "name": "Admin User",
    "email": "admin@example.com",
    "phone_number": "1234567890",
    "language": "English",
    "group_id": null,
    "group_name": null,
    "created_at": "2024-02-02T10:30:00Z",
    "updated_at": "2024-02-02T10:30:00Z"
  },
  {
    "id": 2,
    "employee_id": "EMP001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "9876543210",
    "language": "English",
    "group_id": 1,
    "group_name": "Sales",
    "created_at": "2024-02-02T11:00:00Z",
    "updated_at": "2024-02-02T11:00:00Z"
  }
]
```

### Get Employee by ID
**GET** `/employees/:id`

**Response (200 OK):**
```json
{
  "id": 1,
  "employee_id": "ADMIN001",
  "name": "Admin User",
  "email": "admin@example.com",
  "phone_number": "1234567890",
  "language": "English",
  "group_id": null,
  "group_name": null,
  "created_at": "2024-02-02T10:30:00Z",
  "updated_at": "2024-02-02T10:30:00Z"
}
```

**Error Response (404):**
```json
{
  "error": "Employee not found"
}
```

### Create Employee
**POST** `/employees`

**Request Body:**
```json
{
  "employee_id": "EMP002",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword123",
  "phone_number": "5551234567",
  "language": "Spanish",
  "group_id": 1
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "employee_id": "EMP002",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone_number": "5551234567",
  "language": "Spanish",
  "group_id": 1,
  "created_at": "2024-02-02T12:00:00Z",
  "updated_at": "2024-02-02T12:00:00Z"
}
```

**Error Response (400):**
```json
{
  "error": "Employee ID or email already exists"
}
```

### Update Employee
**PUT** `/employees/:id`

**Request Body:**
```json
{
  "employee_id": "EMP002",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "newpassword123",
  "phone_number": "5551234567",
  "language": "French",
  "group_id": 2
}
```

**Note:** Password is optional - leave blank to keep current password

**Response (200 OK):**
```json
{
  "id": 3,
  "employee_id": "EMP002",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone_number": "5551234567",
  "language": "French",
  "group_id": 2,
  "created_at": "2024-02-02T12:00:00Z",
  "updated_at": "2024-02-02T14:30:00Z"
}
```

### Delete Employee
**DELETE** `/employees/:id`

**Response (200 OK):**
```json
{
  "message": "Employee deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Employee not found"
}
```

---

## 👨‍💼 Group Endpoints

### Get All Groups
**GET** `/groups`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Sales Team",
    "created_at": "2024-02-02T10:00:00Z",
    "updated_at": "2024-02-02T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Management",
    "created_at": "2024-02-02T10:15:00Z",
    "updated_at": "2024-02-02T10:15:00Z"
  }
]
```

### Create Group with Permissions
**POST** `/groups`

**Request Body:**
```json
{
  "name": "HR Team",
  "permissions": [
    {
      "menu_id": 1,
      "module_id": 1,
      "can_add": true,
      "can_view": true,
      "can_edit": true,
      "can_delete": false
    },
    {
      "menu_id": 1,
      "module_id": 2,
      "can_add": false,
      "can_view": true,
      "can_edit": false,
      "can_delete": false
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "HR Team",
  "created_at": "2024-02-02T13:00:00Z",
  "updated_at": "2024-02-02T13:00:00Z"
}
```

**Error Response (400):**
```json
{
  "error": "Group name already exists"
}
```

### Get Group Permissions
**GET** `/groups/:id/permissions`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "group_id": 1,
    "menu_id": 1,
    "menu_name": "Menu 1",
    "module_id": 1,
    "module_name": "Module 1-1",
    "can_add": true,
    "can_view": true,
    "can_edit": true,
    "can_delete": false,
    "created_at": "2024-02-02T13:00:00Z",
    "updated_at": "2024-02-02T13:00:00Z"
  },
  {
    "id": 2,
    "group_id": 1,
    "menu_id": 1,
    "menu_name": "Menu 1",
    "module_id": 2,
    "module_name": "Module 1-2",
    "can_add": false,
    "can_view": true,
    "can_edit": false,
    "can_delete": false,
    "created_at": "2024-02-02T13:00:00Z",
    "updated_at": "2024-02-02T13:00:00Z"
  }
]
```

### Update Group Permissions
**PUT** `/groups/:id/permissions`

**Request Body:**
```json
{
  "permissions": [
    {
      "menu_id": 1,
      "module_id": 1,
      "can_add": true,
      "can_view": true,
      "can_edit": false,
      "can_delete": false
    },
    {
      "menu_id": 2,
      "module_id": 6,
      "can_add": false,
      "can_view": true,
      "can_edit": true,
      "can_delete": true
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Permissions updated successfully"
}
```

---

## 📋 Menu & Module Endpoints

### Get All Menus
**GET** `/menus`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Menu 1",
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  {
    "id": 2,
    "name": "Menu 2",
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  {
    "id": 3,
    "name": "Menu 3",
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  {
    "id": 4,
    "name": "Menu 4",
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  {
    "id": 5,
    "name": "Menu 5",
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  }
]
```

### Get All Modules
**GET** `/modules`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Module 1-1",
    "menu_id": 1,
    "menu_name": "Menu 1",
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  {
    "id": 2,
    "name": "Module 1-2",
    "menu_id": 1,
    "menu_name": "Menu 1",
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  // ... 23 more modules (5 per menu = 25 total)
]
```

### Get Modules by Menu
**GET** `/modules/menu/:menuId`

**Example:** `GET /modules/menu/1`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Module 1-1",
    "menu_id": 1,
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  {
    "id": 2,
    "name": "Module 1-2",
    "menu_id": 1,
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  {
    "id": 3,
    "name": "Module 1-3",
    "menu_id": 1,
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  {
    "id": 4,
    "name": "Module 1-4",
    "menu_id": 1,
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  },
  {
    "id": 5,
    "name": "Module 1-5",
    "menu_id": 1,
    "created_at": "2024-02-02T09:00:00Z",
    "updated_at": "2024-02-02T09:00:00Z"
  }
]
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Statistics
**GET** `/dashboard/stats`

**Response (200 OK):**
```json
{
  "employees": 5,
  "groups": 3,
  "menus": 5,
  "modules": 25
}
```

---

## Error Handling

All errors follow this format:

**401 Unauthorized:**
```json
{
  "error": "Access denied"
}
```

**403 Forbidden:**
```json
{
  "error": "Invalid token"
}
```

**404 Not Found:**
```json
{
  "error": "[Resource] not found"
}
```

**500 Server Error:**
```json
{
  "error": "Server error"
}
```

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Invalid token |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## Example Usage with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Get Employees (with token)
```bash
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "employee_id":"EMP003",
    "name":"New Employee",
    "email":"newemp@example.com",
    "password":"password123",
    "phone_number":"5551234567",
    "language":"English",
    "group_id":1
  }'
```

### Create Group
```bash
curl -X POST http://localhost:5000/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name":"Finance Team",
    "permissions":[
      {"menu_id":1,"module_id":1,"can_add":true,"can_view":true,"can_edit":true,"can_delete":false},
      {"menu_id":1,"module_id":2,"can_add":false,"can_view":true,"can_edit":false,"can_delete":false}
    ]
  }'
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Employee passwords are hashed and never returned in responses
- Group permissions are deleted and recreated on update (not merged)
- Maximum 25 modules can be selected (5 menus × 5 modules each)
- Search functionality is handled on the frontend, not by the API
