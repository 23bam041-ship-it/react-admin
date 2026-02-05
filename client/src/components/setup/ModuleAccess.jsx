import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function ModuleAccess() {
  const [groups, setGroups] = useState([]);
  const [menus, setMenus] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedGroupMenus, setSelectedGroupMenus] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoPermissions, setAutoPermissions] = useState({
    view: false,
    add: false,
    edit: false,
    delete: false,
  });

  useEffect(() => {
    fetchGroups();
    fetchMenus();
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupPermissions(selectedGroup);
      fetchGroupMenus(selectedGroup);
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

  const fetchGroupPermissions = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/groups/${groupId}/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissions(response.data);
      setExpandedModule({});
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const fetchGroupMenus = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/groups/${groupId}/menus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedGroupMenus(response.data);
    } catch (error) {
      console.error('Error fetching group menus:', error);
    }
  };

  const getModulesForMenu = (menuId) => {
    return modules.filter((module) => module.menu_id === parseInt(menuId));
  };

  const handleAutoPermission = (permType) => {
    const newValue = !autoPermissions[permType];
    setAutoPermissions((prev) => ({ ...prev, [permType]: newValue }));

    // Apply this permission to all modules in selected group's menus only
    selectedGroupMenus.forEach((menu) => {
      getModulesForMenu(menu.id).forEach((module) => {
        updatePermission(menu.id, module.id, `can_${permType}`, newValue);
      });
    });
  };

  const getPermission = (menuId, moduleId) => {
    return (
      permissions.find(
        (p) => p.menu_id === menuId && p.module_id === moduleId
      ) || {
        can_add: false,
        can_view: false,
        can_edit: false,
        can_delete: false,
      }
    );
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

  const handleSelectAll = (permType, menuId) => {
    const newValue = !selectAllChecks[permType];
    setSelectAllChecks((prev) => ({ ...prev, [permType]: newValue }));

    const modulesInMenu = getSelectedModulesForMenu(menuId);

    modulesInMenu.forEach((module) => {
      updatePermission(menuId, module.id, `can_${permType}`, newValue);
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const activePermissions = permissions.filter(
        (p) => p.can_add || p.can_view || p.can_edit || p.can_delete
      );

      await axios.put(
        `${API_URL}/groups/${selectedGroup}/permissions`,
        { permissions: activePermissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Permissions updated successfully!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Failed to save permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-access">
      <div className="section-header">
        <h3>Module Access</h3>
      </div>

      <div className="form-group" style={{ maxWidth: '400px' }}>
        <label>Select Group *</label>
        <select
          value={selectedGroup}
          onChange={(e) => {
            setSelectedGroup(e.target.value);
            setExpandedMenu('');
          }}
          style={{ fontSize: '13px', padding: '8px' }}
        >
          <option value="">Choose a group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup && (
        <>
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '15px',
            border: '1px solid #ddd',
            maxWidth: '700px'
          }}>
            <h5 style={{ marginTop: 0, marginBottom: '10px', color: '#333', fontSize: '13px' }}>Automatic Permissions (Apply to All Modules):</h5>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#333', fontSize: '12px' }}>
                <input
                  type="checkbox"
                  checked={autoPermissions.view}
                  onChange={() => handleAutoPermission('view')}
                />
                View All
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#333', fontSize: '12px' }}>
                <input
                  type="checkbox"
                  checked={autoPermissions.add}
                  onChange={() => handleAutoPermission('add')}
                />
                Add All
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#333', fontSize: '12px' }}>
                <input
                  type="checkbox"
                  checked={autoPermissions.edit}
                  onChange={() => handleAutoPermission('edit')}
                />
                Edit All
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#333', fontSize: '12px' }}>
                <input
                  type="checkbox"
                  checked={autoPermissions.delete}
                  onChange={() => handleAutoPermission('delete')}
                />
                Delete All
              </label>
            </div>
          </div>

          <div className="menus-list" style={{ maxWidth: '700px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Select Menu and Modules:</label>
            <div className="menus-container">
              {selectedGroupMenus.map((menu) => {
                const modulesForThisMenu = getModulesForMenu(menu.id);
                
                return (
                  <div key={menu.id} className="menu-item">
                    <button
                      className="menu-toggle-btn"
                      onClick={() =>
                        setExpandedMenu(expandedMenu === menu.id ? '' : menu.id)
                      }
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    >
                      <span className="menu-arrow">
                        {expandedMenu === menu.id ? '▼' : '▶'}
                      </span>
                      {menu.name}
                    </button>
                    
                    {expandedMenu === menu.id && (
                      <div className="modules-list">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' }}>
                          {modulesForThisMenu.map((module) => {
                            const perm = getPermission(menu.id, module.id);

                            return (
                              <div
                                key={module.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '8px 12px',
                                  backgroundColor: '#f5f5f5',
                                  borderRadius: '4px',
                                  gap: '10px',
                                  flexWrap: 'wrap'
                                }}
                              >
                                <span style={{ flex: '0 0 120px', fontWeight: '500', color: '#333', fontSize: '12px' }}>
                                  {module.name}
                                </span>
                                
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#333', fontSize: '12px' }}>
                                  <input
                                    type="checkbox"
                                    checked={perm.can_view}
                                    onChange={(e) =>
                                      updatePermission(
                                        menu.id,
                                        module.id,
                                        'can_view',
                                        e.target.checked
                                      )
                                    }
                                  />
                                  View
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#333', fontSize: '12px' }}>
                                  <input
                                    type="checkbox"
                                    checked={perm.can_add}
                                    onChange={(e) =>
                                      updatePermission(
                                        menu.id,
                                        module.id,
                                        'can_add',
                                        e.target.checked
                                      )
                                    }
                                  />
                                  Add
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#333', fontSize: '12px' }}>
                                  <input
                                    type="checkbox"
                                    checked={perm.can_edit}
                                    onChange={(e) =>
                                      updatePermission(
                                        menu.id,
                                        module.id,
                                        'can_edit',
                                        e.target.checked
                                      )
                                    }
                                  />
                                  Edit
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#333', fontSize: '12px' }}>
                                  <input
                                    type="checkbox"
                                    checked={perm.can_delete}
                                    onChange={(e) =>
                                      updatePermission(
                                        menu.id,
                                        module.id,
                                        'can_delete',
                                        e.target.checked
                                      )
                                    }
                                  />
                                  Delete
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {selectedGroup && (
        <div className="form-buttons" style={{ maxWidth: '700px', marginTop: '15px' }}>
          <button
            className="btn btn-success"
            onClick={handleSave}
            disabled={loading}
            style={{ padding: '10px 20px', fontSize: '14px', width: 'auto' }}
          >
            {loading ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ModuleAccess;
