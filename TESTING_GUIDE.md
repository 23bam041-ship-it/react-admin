# Setup Module - Testing & Verification Guide

## Pre-Testing Checklist

- [ ] Database is running (PostgreSQL)
- [ ] Backend server is running (port 5000)
- [ ] Frontend dev server is running (port 5173)
- [ ] Logged in as admin user
- [ ] No browser console errors

## Testing Scenarios

### 1. USER DETAILS TAB

#### 1.1 Load Employee List
**Steps**:
1. Navigate to Setup page
2. Click "User Details" tab
3. Observe employee table loading

**Expected Results**:
- [ ] Employee table displays with all employees
- [ ] Columns: Employee ID, Name, Email, Phone, Language, Group, Actions
- [ ] Loading spinner shows briefly
- [ ] All data loads correctly

**Issues to Check**:
- API endpoint `/api/employees` returns data
- Table displays all columns
- No console errors

---

#### 1.2 Search Functionality
**Steps**:
1. In User Details tab
2. Type employee name in search box
3. Table filters to matching employees
4. Type employee email
5. Table filters to matching employees
6. Type employee ID
7. Table filters to matching employees
8. Click "Clear" button

**Expected Results**:
- [ ] Search by name filters correctly (case-insensitive)
- [ ] Search by email filters correctly
- [ ] Search by ID filters correctly
- [ ] Clear button empties search and shows all employees
- [ ] Search is instant (no delay)

**Issues to Check**:
- Search logic includes name, email, AND ID
- Clear button works
- Case sensitivity handled

---

#### 1.3 Add Employee
**Steps**:
1. Click "+ Add Employee" button
2. Observe form appears
3. Form should show empty fields
4. Fill in all fields:
   - Employee ID: EMP999
   - Name: John Doe
   - Email: john@example.com
   - Password: TestPass123
   - Phone: 555-1234
   - Language: English
   - Group: (select any group)
5. Click "Submit"
6. Observe new employee in table

**Expected Results**:
- [ ] Form appears with empty fields
- [ ] Password field is required (red asterisk)
- [ ] All 7 fields display correctly
- [ ] Submit button sends data to API
- [ ] New employee appears in table
- [ ] Success message or notification shows
- [ ] Form closes automatically

**Issues to Check**:
- All 7 form fields present
- Employee ID field enabled for new employees
- Password is required for new employees
- API POST endpoint works
- Employee list refreshes after submit

---

#### 1.4 Edit Employee
**Steps**:
1. In Employee table, click 3-dot menu (⋯) on any employee row
2. Click "Edit" option
3. Form appears with employee data pre-filled
4. Modify some fields:
   - Name: Change to different name
   - Phone: Update phone number
   - Language: Change language
5. Leave password field EMPTY
6. Click "Submit"
7. Observe employee updated in table

**Expected Results**:
- [ ] 3-dot menu appears on click
- [ ] Form opens with employee data pre-filled
- [ ] Employee ID field is DISABLED
- [ ] Password field is OPTIONAL (no red asterisk)
- [ ] Submit sends PUT request
- [ ] Employee data updated in table
- [ ] Form closes after success
- [ ] Can leave password blank for edit

**Issues to Check**:
- Employee ID field disabled on edit
- Password not required for edit
- Pre-populated data correct
- API PUT endpoint works
- Null password doesn't break update

---

#### 1.5 Delete Employee
**Steps**:
1. Click 3-dot menu (⋯) on an employee row
2. Click "Delete" option
3. Confirmation dialog appears
4. Click "OK" to confirm delete
5. Observe employee removed from table
6. Click "Cancel" on another employee (verify no deletion)

**Expected Results**:
- [ ] Confirmation dialog shows before delete
- [ ] Clicking OK deletes employee
- [ ] Employee removed from table immediately
- [ ] Clicking Cancel aborts deletion
- [ ] No errors in console
- [ ] API DELETE endpoint called

**Issues to Check**:
- Confirmation dialog works
- Delete actually removes employee
- Cancel aborts deletion
- List refreshes after delete

---

#### 1.6 Clear Button
**Steps**:
1. Click "+ Add Employee"
2. Fill in some fields
3. Click "Clear" button
4. Observe form fields reset

**Expected Results**:
- [ ] All form fields reset to empty
- [ ] Clear button works in Add mode
- [ ] Clear button also works in Edit mode (if applicable)

---

### 2. GROUPS TAB

#### 2.1 Load Groups List
**Steps**:
1. Click "Groups" tab
2. Observe groups table

**Expected Results**:
- [ ] Groups table displays all existing groups
- [ ] Shows: Group Name, Created At, Delete button
- [ ] All groups load correctly

---

#### 2.2 Add Group with Module Selection
**Steps**:
1. In Groups tab, observe "Add Group" form
2. Enter group name: "TestGroup123"
3. Select a menu from dropdown (e.g., "Menu 1")
4. Observe modules for that menu appear as checkboxes
5. Check 2-3 module checkboxes
6. Click "Submit"
7. Observe new group in groups list
8. Click "Clear" to reset form

**Expected Results**:
- [ ] Form shows with group name input
- [ ] Menu dropdown displays all menus
- [ ] Selecting menu filters modules displayed
- [ ] Module checkboxes appear for selected menu only
- [ ] Submit creates group with selected permissions
- [ ] New group appears in groups list
- [ ] Clear button resets form fields
- [ ] Form can be used again for new group

**Issues to Check**:
- Menu dropdown populated correctly
- Modules filtered to selected menu only
- API POST with permissions array works
- Group list updates after creation

---

#### 2.3 Delete Group
**Steps**:
1. In groups list, click Delete button on a group
2. Observe group removed from list
3. Refresh page to verify deletion persists

**Expected Results**:
- [ ] Delete button removes group
- [ ] Group removed from list immediately
- [ ] Persistence check: group still gone after refresh

---

### 3. MODULE ACCESS TAB

#### 3.1 Load Module Access
**Steps**:
1. Click "Module Access" tab
2. Observe group dropdown and menu dropdown

**Expected Results**:
- [ ] Group dropdown displays all groups
- [ ] Menu dropdown empty until group selected
- [ ] Both dropdowns visible and functional

---

#### 3.2 Select Group and Menu
**Steps**:
1. In Module Access tab
2. Select a group from dropdown
3. Select a menu from dropdown
4. Observe permissions table loads

**Expected Results**:
- [ ] Selecting group enables menu dropdown
- [ ] Selecting menu loads permissions table
- [ ] Table shows modules with permission columns
- [ ] Table headers: Module, View, Add, Edit, Delete
- [ ] Table also includes "Select All" headers for each permission type

**Issues to Check**:
- API `/api/groups/{id}/permissions` returns data
- Table displays all columns
- Select All headers visible

---

#### 3.3 Select All Functionality
**Steps**:
1. In Module Access, select group and menu
2. Observe permissions table with 4 permission columns
3. Click "View All" checkbox in View column header
4. Observe all "View" checkboxes checked
5. Click "View All" again
6. Observe all "View" checkboxes unchecked
7. Repeat for "Add All", "Edit All", "Delete All"

**Expected Results**:
- [ ] "View All" checks/unchecks all View column checkboxes
- [ ] "Add All" checks/unchecks all Add column checkboxes
- [ ] "Edit All" checks/unchecks all Edit column checkboxes
- [ ] "Delete All" checks/unchecks all Delete column checkboxes
- [ ] Select All state toggles on click
- [ ] Individual checkboxes can still be toggled

**Issues to Check**:
- Select All logic works correctly
- All checkboxes in column checked/unchecked
- Toggle functionality works both ways

---

#### 3.4 Individual Permission Checkboxes
**Steps**:
1. In Module Access with permissions table visible
2. Click individual checkboxes for specific modules/permissions
3. Mix of checked and unchecked states

**Expected Results**:
- [ ] Individual checkboxes toggle independently
- [ ] State reflects in UI immediately
- [ ] Multiple checkboxes can be checked/unchecked

---

#### 3.5 Save Permissions
**Steps**:
1. In Module Access with permissions table visible
2. Modify some permissions (check/uncheck boxes)
3. Click "Save" button
4. Wait for save to complete
5. Select different group then back to same group
6. Verify permissions were saved

**Expected Results**:
- [ ] Save button sends PUT request
- [ ] Success message shows (or no error)
- [ ] Permissions persist after page refresh
- [ ] Changes reflected when group re-selected

**Issues to Check**:
- API `/api/groups/{id}/permissions` PUT works
- Permissions array sent correctly
- Bulk update successful

---

### 4. TAB NAVIGATION

#### 4.1 Tab Switching
**Steps**:
1. In Setup page
2. Click each tab in sequence: User Details → Groups → Module Access
3. Verify content switches correctly
4. Click back to User Details

**Expected Results**:
- [ ] Active tab is visually highlighted
- [ ] Content switches immediately when tab clicked
- [ ] Form state preserved or reset appropriately
- [ ] No content overlap between tabs
- [ ] Smooth transition animation

**Issues to Check**:
- CSS active tab styling working
- Component re-renders correctly
- No state leakage between tabs

---

#### 4.2 Tab Styling
**Steps**:
1. Observe tab buttons
2. Hover over inactive tab
3. Click to activate tab
4. Observe active tab styling

**Expected Results**:
- [ ] Active tab has underline or highlight
- [ ] Inactive tabs are less prominent
- [ ] Hover effect on inactive tabs
- [ ] Clear visual distinction

---

### 5. RESPONSIVE DESIGN

#### 5.1 Desktop View (1920px+)
**Steps**:
1. Open Setup page on desktop (or max browser width)
2. All components display with full width
3. Tables show all columns
4. Forms show all fields side-by-side

**Expected Results**:
- [ ] All content visible
- [ ] No horizontal scroll needed
- [ ] Tables readable
- [ ] Forms well-organized

---

#### 5.2 Tablet View (768px - 1024px)
**Steps**:
1. Resize browser to tablet width
2. Reload Setup page
3. Navigate through all tabs

**Expected Results**:
- [ ] Content adjusts to fit width
- [ ] Tables remain readable
- [ ] Forms stack nicely
- [ ] No content cutoff

---

#### 5.3 Mobile View (< 768px)
**Steps**:
1. Resize browser to mobile width
2. Reload Setup page
3. Navigate through all tabs
4. Interact with forms and tables

**Expected Results**:
- [ ] Single column layout
- [ ] Buttons full width or wrapped
- [ ] Tables scroll if needed
- [ ] Forms stack in single column
- [ ] Readability maintained

---

### 6. ERROR HANDLING

#### 6.1 Network Error on Load
**Steps**:
1. Stop backend server
2. Reload Setup page
3. Observe error handling

**Expected Results**:
- [ ] Graceful error message shown
- [ ] No blank page or crash
- [ ] User can see what went wrong

---

#### 6.2 Form Validation Errors
**Steps**:
1. In Add Employee, clear required field
2. Try to submit
3. Try adding employee with duplicate email
4. Observe error handling

**Expected Results**:
- [ ] Validation error shown in form
- [ ] Submit prevented if validation fails
- [ ] Helpful error message displayed
- [ ] Can fix and resubmit

---

#### 6.3 API Error Responses
**Steps**:
1. Try to create group with empty name
2. Try invalid operation
3. Observe error handling

**Expected Results**:
- [ ] Error message shows
- [ ] Form doesn't close on error
- [ ] Can retry or modify and resubmit

---

### 7. PERFORMANCE

#### 7.1 Load Time
**Steps**:
1. Open Dev Tools Performance tab
2. Navigate to Setup page
3. Measure load time

**Expected Results**:
- [ ] Setup page loads in < 2 seconds
- [ ] Tab switching is instant (< 100ms)
- [ ] Smooth animations (60fps)

---

#### 7.2 Large Dataset Handling
**Steps**:
1. With many employees/groups (100+)
2. Scroll through tables
3. Search and filter

**Expected Results**:
- [ ] Tables remain responsive
- [ ] Search works without lag
- [ ] Scrolling smooth

---

### 8. ACCESSIBILITY

#### 8.1 Keyboard Navigation
**Steps**:
1. Use Tab key to navigate form
2. Use Enter to submit forms
3. Use Escape to close modals (if any)

**Expected Results**:
- [ ] All interactive elements reachable via Tab
- [ ] Tab order logical
- [ ] Enter submits forms
- [ ] Focus visible on all elements

---

#### 8.2 Color Contrast
**Steps**:
1. Check text colors against backgrounds
2. Use browser accessibility tools

**Expected Results**:
- [ ] Text readable (sufficient contrast)
- [ ] Icons clear and visible
- [ ] Color not only indicator of state

---

## Known Issues & Workarounds

### Issue 1: Form not clearing after submit
- **Workaround**: Click Clear button manually before submitting again

### Issue 2: Search performance with many employees
- **Workaround**: Use more specific search terms

### Issue 3: Group permissions not showing
- **Workaround**: Ensure group has modules assigned first

---

## Testing Tools

### Browser DevTools
- Network tab: Verify API calls
- Console: Check for JavaScript errors
- Performance: Measure page load times
- Accessibility: Check ARIA labels and contrast

### API Testing
- Postman: Test endpoints directly
- Thunder Client: VS Code extension
- curl: Command line testing

### Responsive Testing
- Chrome DevTools Device Emulation
- Firefox Responsive Design Mode
- Online tools: responsively.app

---

## Sign-Off

| Component | Status | Tester | Date |
|-----------|--------|--------|------|
| UserDetails | PASS/FAIL | | |
| EmployeeForm | PASS/FAIL | | |
| GroupManagement | PASS/FAIL | | |
| ModuleAccess | PASS/FAIL | | |
| Tab Navigation | PASS/FAIL | | |
| Responsive Design | PASS/FAIL | | |
| Error Handling | PASS/FAIL | | |
| Performance | PASS/FAIL | | |

---

## Next Steps After Testing

1. Fix any identified issues
2. Commit changes to git
3. Push to production
4. Monitor for user reports
5. Plan additional enhancements
