import { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';

const API_URL = 'http://localhost:5000/api';

function UserDetails() {
  const [employees, setEmployees] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchEmployeeId, setSearchEmployeeId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchGroups();
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

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchName.toLowerCase()) &&
      emp.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      emp.employee_id.toLowerCase().includes(searchEmployeeId.toLowerCase())
  );

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
    setActionMenuOpen(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(employees.filter((emp) => emp.id !== id));
        setActionMenuOpen(null);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleFormSuccess = () => {
    fetchEmployees();
    handleFormClose();
  };

  if (showForm) {
    return (
      <EmployeeForm
        employee={editingEmployee}
        groups={groups}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="user-details-container">
      <div className="section-header">
        <h3>User Details</h3>
        <button className="btn btn-success" onClick={handleAddNew}>
          + Add Employee
        </button>
      </div>

      <div className="user-details-search">
        <div className="search-field">
          <label>Search by Name:</label>
          <input
            type="text"
            placeholder="Enter name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="search-field">
          <label>Search by Email:</label>
          <input
            type="text"
            placeholder="Enter email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="search-field">
          <label>Search by Employee ID:</label>
          <input
            type="text"
            placeholder="Enter ID..."
            value={searchEmployeeId}
            onChange={(e) => setSearchEmployeeId(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setSearchName('');
            setSearchEmail('');
            setSearchEmployeeId('');
          }}
        >
          Clear All
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading employees...</div>
      ) : (
        <div className="table-container">
          <table className="user-table">
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
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone_number || 'N/A'}</td>
                  <td>{emp.language || 'N/A'}</td>
                  <td>
                    {groups.find((g) => g.id === emp.group_id)?.name ||
                      'No Group'}
                  </td>
                  <td>
                    <div className="action-menu-container">
                      <button
                        className="action-menu-toggle"
                        onClick={() =>
                          setActionMenuOpen(
                            actionMenuOpen === emp.id ? null : emp.id
                          )
                        }
                      >
                        ⋯
                      </button>
                      {actionMenuOpen === emp.id && (
                        <div className="action-menu">
                          <div
                            onClick={() => handleEdit(emp)}
                            className="action-menu-item"
                          >
                            Edit
                          </div>
                          <div
                            onClick={() => handleDelete(emp.id)}
                            className="action-menu-item delete"
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
