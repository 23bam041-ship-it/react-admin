import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AddEmployeeModal({ onClose, onSuccess, editingEmployee }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    password: '',
    phone_number: '',
    language: '',
    group_id: '',
  });
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
    if (editingEmployee) {
      setFormData({
        employee_id: editingEmployee.employee_id,
        name: editingEmployee.name,
        email: editingEmployee.email,
        password: '',
        phone_number: editingEmployee.phone_number || '',
        language: editingEmployee.language || '',
        group_id: editingEmployee.group_id || '',
      });
    }
  }, [editingEmployee]);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (editingEmployee) {
        // Update employee
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't send empty password
        }
        await axios.put(`${API_URL}/employees/${editingEmployee.id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create employee
        if (!formData.password) {
          setError('Password is required for new employees');
          setLoading(false);
          return;
        }
        await axios.post(`${API_URL}/employees`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee ID *</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password {editingEmployee ? '(Leave blank to keep current)' : '*'}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!editingEmployee}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Language</label>
            <select name="language" value={formData.language} onChange={handleChange}>
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
          <div className="form-group">
            <label>Group</label>
            <select name="group_id" value={formData.group_id} onChange={handleChange}>
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Saving...' : editingEmployee ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployeeModal;
