# Setup Module Component Hierarchy

## Component Tree

```
App.jsx
└── Setup.jsx (Main Controller)
    ├── Navbar (menu, logout)
    └── setup-tabs (3 tabs)
        ├── Tab 1: User Details
        │   └── UserDetails.jsx
        │       └── EmployeeForm.jsx (on edit/add)
        │           ├── 7 Form Fields
        │           └── Submit/Cancel/Clear Buttons
        │
        ├── Tab 2: Groups
        │   └── GroupManagement.jsx
        │       ├── Group List Table
        │       │   ├── Group Name
        │       │   ├── Created At
        │       │   └── Delete Button
        │       └── Add Group Form
        │           ├── Group Name Input
        │           ├── Menu Dropdown
        │           ├── Module Checkboxes
        │           └── Submit/Cancel/Clear Buttons
        │
        └── Tab 3: Module Access
            └── ModuleAccess.jsx
                ├── Group Dropdown
                ├── Menu Dropdown
                └── Permissions Table
                    ├── Module Name Column
                    ├── View Column (with Select All header)
                    ├── Add Column (with Select All header)
                    ├── Edit Column (with Select All header)
                    ├── Delete Column (with Select All header)
                    └── Save Button
```

## State Management

### Setup.jsx (Parent State)
```javascript
const [activeSection, setActiveSection] = useState('users');
const [showMenu, setShowMenu] = useState(false);
```

### UserDetails.jsx State
```javascript
const [employees, setEmployees] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [showForm, setShowForm] = useState(false);
const [editingEmployee, setEditingEmployee] = useState(null);
const [actionMenuOpen, setActionMenuOpen] = useState(null);
const [groups, setGroups] = useState([]);
```

### EmployeeForm.jsx State
```javascript
const [formData, setFormData] = useState({
  name, employee_id, email, password, language, phone_number, group_id
});
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```

### GroupManagement.jsx State
```javascript
const [groups, setGroups] = useState([]);
const [menus, setMenus] = useState([]);
const [modules, setModules] = useState([]);
const [showForm, setShowForm] = useState(false);
const [groupName, setGroupName] = useState('');
const [selectedMenu, setSelectedMenu] = useState('');
const [selectedModules, setSelectedModules] = useState({});
```

### ModuleAccess.jsx State
```javascript
const [groups, setGroups] = useState([]);
const [menus, setMenus] = useState([]);
const [modules, setModules] = useState([]);
const [selectedGroup, setSelectedGroup] = useState('');
const [selectedMenu, setSelectedMenu] = useState('');
const [permissions, setPermissions] = useState([]);
const [selectAllChecks, setSelectAllChecks] = useState({
  view, add, edit, delete
});
```

## Data Flow

### Employee Management Flow
```
UserDetails Component
    ↓
  Display employees table
    ↓
User clicks "Add Employee" or 3-dot Edit
    ↓
  Show EmployeeForm
    ↓
User fills form and clicks Submit
    ↓
  Form sends POST (new) or PUT (edit) to API
    ↓
  On success: refresh employee list
    ↓
  Close form and show updated table
```

### Group Management Flow
```
GroupManagement Component
    ↓
  Display existing groups
    ↓
User selects menu and checks modules
    ↓
  User clicks Submit
    ↓
  Send POST to /api/groups with permissions array
    ↓
  Refresh groups list
    ↓
  Reset form
```

### Permission Management Flow
```
ModuleAccess Component
    ↓
  User selects Group → Get group permissions
    ↓
  User selects Menu → Filter modules
    ↓
  Display permissions table with checkboxes
    ↓
User checks/unchecks permissions or Select All
    ↓
  User clicks Save
    ↓
  Send PUT to /api/groups/{id}/permissions
    ↓
  Refresh permissions
```

## CSS Classes Used

### Layout
- `.setup-container` - Main container
- `.setup-content` - Content area
- `.setup-tabs` - Tab navigation
- `.tab-button` - Individual tab button
- `.tab-button.active` - Active tab styling
- `.section-container` - Content section

### Form
- `.form-grid` - 7-field form layout
- `.form-group` - Individual form field
- `.form-buttons` - Form action buttons
- `.error-message` - Error display

### Tables
- `.user-table` - Employee table
- `.group-table` - Groups table
- `.permissions-table` - Permissions grid
- `.data-table` - Generic table
- `.action-menu-container` - 3-dot menu wrapper
- `.action-menu` - 3-dot menu dropdown

### UI Elements
- `.search-input` - Search input styling
- `.table-container` - Table wrapper
- `.form-card` - Form card styling
- `.section-header` - Section title
- `.section-header-buttons` - Title buttons
- `.select-all-header` - Select All checkbox headers

## Animation
- Slide-in animation on section change
- Hover effects on buttons and menu items
- Smooth transitions on state changes

## Responsive Breakpoints
- **Desktop**: Full layout with all columns
- **Tablet (768px)**: Adjusted padding and font sizes
- **Mobile**: Single column layout, reduced tables
