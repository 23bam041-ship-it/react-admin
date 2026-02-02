import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function ModuleAccessModal({ onClose, onSuccess }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [modules, setModules] = useState([]);
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchMenusAndModules();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupPermissions(selectedGroup);
    }
  }, [selectedGroup]);

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

  const fetchGroupPermissions = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/groups/${groupId}/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const getPermission = (menuId, moduleId) => {
    return permissions.find(
      (p) => p.menu_id === menuId && p.module_id === moduleId
    ) || { can_add: false, can_view: false, can_edit: false, can_delete: false };
  };

  const updatePermission = (menuId, moduleId, field, value) => {
    setPermissions((prev) => {
      const existing = prev.find(
        (p) => p.menu_id === menuId && p.module_id === moduleId
      );
      
      if (existing) {
        return prev.map((p) =>
          p.menu_id === menuId && p.module_id === moduleId
            ? { ...p, [field]: value }
            : p
        );
      } else {
        return [
          ...prev,
          {
            menu_id: menuId,
            module_id: moduleId,
            can_add: field === 'can_add' ? value : false,
            can_view: field === 'can_view' ? value : false,
            can_edit: field === 'can_edit' ? value : false,
            can_delete: field === 'can_delete' ? value : false,
          },
        ];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Filter out permissions where all values are false
      const activePermissions = permissions.filter(
        (p) => p.can_add || p.can_view || p.can_edit || p.can_delete
      );

      await axios.put(
        `${API_URL}/groups/${selectedGroup}/permissions`,
        { permissions: activePermissions },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Permissions updated successfully!');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  const getModulesForMenu = (menuId) => {
    return modules.filter((module) => module.menu_id === menuId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <h2>Module Access Management</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Group *</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              required
            >
              <option value="">Select a group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {selectedGroup && (
            <div className="form-group">
              <label>Select Menu *</label>
              <select
                value={selectedMenu}
                onChange={(e) => setSelectedMenu(e.target.value)}
                required
              >
                <option value="">Choose a menu</option>
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedGroup && selectedMenu && (
            <div className="form-group">
              <label>Module Access Permissions for {menus.find(m => m.id === parseInt(selectedMenu))?.name}</label>
              {getModulesForMenu(parseInt(selectedMenu)).map((module) => {
                const perm = getPermission(parseInt(selectedMenu), module.id);
                // Only show modules that have been assigned (have any permission set)
                if (!perm.can_add && !perm.can_view && !perm.can_edit && !perm.can_delete) {
                  return null;
                }
                return (
                  <div key={module.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <strong>{module.name}</strong>
                    <div className="permission-checkboxes">
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`add-${selectedMenu}-${module.id}`}
                          checked={perm.can_add}
                          onChange={(e) =>
                            updatePermission(parseInt(selectedMenu), module.id, 'can_add', e.target.checked)
                          }
                        />
                        <label htmlFor={`add-${selectedMenu}-${module.id}`}>Add</label>
                      </div>
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`view-${selectedMenu}-${module.id}`}
                          checked={perm.can_view}
                          onChange={(e) =>
                            updatePermission(parseInt(selectedMenu), module.id, 'can_view', e.target.checked)
                          }
                        />
                        <label htmlFor={`view-${selectedMenu}-${module.id}`}>View</label>
                      </div>
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`edit-${selectedMenu}-${module.id}`}
                          checked={perm.can_edit}
                          onChange={(e) =>
                            updatePermission(parseInt(selectedMenu), module.id, 'can_edit', e.target.checked)
                          }
                        />
                        <label htmlFor={`edit-${selectedMenu}-${module.id}`}>Edit</label>
                      </div>
                      <div className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`delete-${selectedMenu}-${module.id}`}
                          checked={perm.can_delete}
                          onChange={(e) =>
                            updatePermission(parseInt(selectedMenu), module.id, 'can_delete', e.target.checked)
                          }
                        />
                        <label htmlFor={`delete-${selectedMenu}-${module.id}`}>Delete</label>
                      </div>
                    </div>
                  </div>
                );
              }).filter(Boolean)}
              {!getModulesForMenu(parseInt(selectedMenu)).some((module) => {
                const perm = getPermission(parseInt(selectedMenu), module.id);
                return perm.can_add || perm.can_view || perm.can_edit || perm.can_delete;
              }) && (
                <div style={{ padding: '10px', color: '#666' }}>
                  No modules assigned to this menu for this group.
                </div>
              )}
            </div>
          )}

          <div className="modal-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading || !selectedGroup}>
              {loading ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModuleAccessModal;
