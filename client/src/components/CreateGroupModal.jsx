import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function CreateGroupModal({ onClose, onSuccess }) {
  const [groupName, setGroupName] = useState('');
  const [menus, setMenus] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [selectedModules, setSelectedModules] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenusAndModules();
  }, []);

  const fetchMenusAndModules = async () => {
    try {
      const token = localStorage.getItem('token');
      const [menusRes, modulesRes] = await Promise.all([
        axios.get(`${API_URL}/menus`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMenus(menusRes.data);
      setModules(modulesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleModule = (moduleId) => {
    setSelectedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Convert selected modules to array format with default permissions
      const permissions = Object.keys(selectedModules)
        .filter((key) => selectedModules[key])
        .map((moduleId) => {
          const module = modules.find((m) => m.id === parseInt(moduleId));
          return {
            menu_id: module.menu_id,
            module_id: parseInt(moduleId),
            can_add: true,
            can_view: true,
            can_edit: true,
            can_delete: true,
          };
        });

      await axios.post(
        `${API_URL}/groups`,
        {
          name: groupName,
          permissions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const getModulesForMenu = (menuId) => {
    return modules.filter((module) => module.menu_id === menuId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create Group</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Group Name *</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Menu *</label>
            <select
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
            >
              <option value="">Choose a menu</option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name}
                </option>
              ))}
            </select>
          </div>

          {selectedMenu && (
            <div className="form-group">
              <label>{menus.find(m => m.id === parseInt(selectedMenu))?.name}</label>
              <div style={{ paddingLeft: '20px' }}>
                {getModulesForMenu(parseInt(selectedMenu)).map((module) => (
                  <div key={module.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`module-${module.id}`}
                      checked={selectedModules[module.id] || false}
                      onChange={() => toggleModule(module.id)}
                    />
                    <label htmlFor={`module-${module.id}`}>{module.name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;
