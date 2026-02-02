import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddEmployeeModal from './AddEmployeeModal';
import CreateGroupModal from './CreateGroupModal';
import ModuleAccessModal from './ModuleAccessModal';

const API_URL = 'http://localhost:5000/api';

function Setup({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showModuleAccess, setShowModuleAccess] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menus, setMenus] = useState([]);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchMenus();
    fetchModules();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/menus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/modules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(response.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const getModulesForMenu = (menuId) => {
    return modules.filter((module) => module.menu_id === menuId);
  };

  const handleMenuClick = (menuId) => {
    setSelectedMenu(selectedMenu === menuId ? null : menuId);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowAddEmployee(true);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="setup-container">
      <nav className="navbar">
        <h1>Setup</h1>
        <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
          ⋮
        </div>
        {showMenu && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </div>
            {menus.map((menu) => (
              <div key={menu.id}>
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuClick(menu.id)}
                >
                  {menu.name} {selectedMenu === menu.id ? '▼' : '▶'}
                </div>
                {selectedMenu === menu.id && (
                  <div className="submenu">
                    {getModulesForMenu(menu.id).map((module) => (
                      <div key={module.id} className="submenu-item">
                        {module.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </nav>

      <div className="setup-content">
        <div className="setup-buttons">
          <button
            className="btn btn-success"
            onClick={() => {
              setEditingEmployee(null);
              setShowAddEmployee(true);
            }}
          >
            Add Employee
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateGroup(true)}>
            Create Group
          </button>
          <button className="btn btn-warning" onClick={() => setShowModuleAccess(true)}>
            Module Access
          </button>
        </div>

        <div className="employee-list">
          <h2>Employee List</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, email, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading employees...</div>
          ) : (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Language</th>
                  <th>Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.employee_id}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone_number || 'N/A'}</td>
                      <td>{employee.language || 'N/A'}</td>
                      <td>{employee.group_name || 'No Group'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showAddEmployee && (
        <AddEmployeeModal
          onClose={() => {
            setShowAddEmployee(false);
            setEditingEmployee(null);
          }}
          onSuccess={fetchEmployees}
          editingEmployee={editingEmployee}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onSuccess={() => {
            setShowCreateGroup(false);
            fetchEmployees();
          }}
        />
      )}

      {showModuleAccess && (
        <ModuleAccessModal
          onClose={() => setShowModuleAccess(false)}
          onSuccess={() => setShowModuleAccess(false)}
        />
      )}
    </div>
  );
}

export default Setup;
