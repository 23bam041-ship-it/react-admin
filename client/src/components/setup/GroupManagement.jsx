import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function GroupManagement() {
  const [groups, setGroups] = useState([]);
  const [menus, setMenus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMenus, setSelectedMenus] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editSelectedMenus, setEditSelectedMenus] = useState({});
  const [viewingGroup, setViewingGroup] = useState(null);
  const [viewGroupMenus, setViewGroupMenus] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchMenus();
  }, []);

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

  const handleMenuToggle = (menuId) => {
    setSelectedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    const selectedMenuIds = Object.keys(selectedMenus).filter((key) => selectedMenus[key]);
    if (selectedMenuIds.length === 0) {
      setError('Please select at least one menu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Create permissions for all selected menus (without modules initially)
      // Modules will be assigned in Module Access tab
      const permissions = [];
      const menuIdsToSend = selectedMenuIds.map(Number);
      
      console.log('Creating group with menuIds:', menuIdsToSend);

      const response = await axios.post(
        `${API_URL}/groups`,
        { name: groupName, permissions, menuIds: menuIdsToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Group created:', response.data);

      setGroupName('');
      setSelectedMenus({});
      setShowForm(false);
      fetchGroups();
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setGroupName('');
    setSelectedMenus({});
    setError('');
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/groups/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchGroups();
        setOpenMenu(null);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group.id);
    setEditGroupName(group.name);
    const menuMap = {};
    menus.forEach((menu) => {
      menuMap[menu.id] = false;
    });
    // Set selected menus based on group's menus (if stored)
    setEditSelectedMenus(menuMap);
    
    // Fetch and set current menus for this group
    fetchGroupMenusForEdit(group.id, menuMap);
    setOpenMenu(null);
  };

  const fetchGroupMenusForEdit = async (groupId, menuMap) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/groups/${groupId}/menus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Mark selected menus
      response.data.forEach((menu) => {
        menuMap[menu.id] = true;
      });
      setEditSelectedMenus(menuMap);
    } catch (error) {
      console.error('Error fetching group menus for edit:', error);
    }
  };

  const handleSaveEdit = async (groupId) => {
    if (!editGroupName.trim()) {
      setError('Group name is required');
      return;
    }

    const selectedMenuIds = Object.keys(editSelectedMenus).filter((key) => editSelectedMenus[key]);
    if (selectedMenuIds.length === 0) {
      setError('Please select at least one menu');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Update group name
      await axios.put(
        `${API_URL}/groups/${groupId}`,
        { name: editGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update menus - delete old ones and insert new ones
      const menuIdsToSend = selectedMenuIds.map(Number);
      await axios.put(
        `${API_URL}/groups/${groupId}/menus`,
        { menuIds: menuIdsToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingGroup(null);
      setEditGroupName('');
      setEditSelectedMenus({});
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditGroupName('');
    setError('');
  };

  const handleViewGroup = (group) => {
    setViewingGroup(group);
    // Fetch group details to get its menus
    fetchGroupMenus(group.id);
    setOpenMenu(null);
  };

  const fetchGroupMenus = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching menus for group:', groupId);
      
      const response = await axios.get(`${API_URL}/groups/${groupId}/menus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Fetched menus:', response.data);
      setViewGroupMenus(response.data);
    } catch (error) {
      console.error('Error fetching group menus:', error);
      setViewGroupMenus([]);
    }
  };

  const handleCloseView = () => {
    setViewingGroup(null);
  };

  return (
    <div className="group-management-container" style={{color: '#333'}}>
      <div className="section-header">
        <h3>Groups</h3>
        <button
          className="btn btn-primary btn-small"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add Group'}
        </button>
      </div>

      {showForm && (
        <div className="section-container">
          <h4>Create New Group</h4>
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
              <label>Select Menus *</label>
              <div className="checkbox-grid">
                {menus.map((menu) => (
                  <div key={menu.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`menu-${menu.id}`}
                      checked={selectedMenus[menu.id] || false}
                      onChange={() => handleMenuToggle(menu.id)}
                    />
                    <label htmlFor={`menu-${menu.id}`}>{menu.name}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="group-list-section">
        <h4>Existing Groups</h4>
        {groups.length === 0 ? (
          <p className="empty-message">No groups yet. Create one to get started.</p>
        ) : (
          <div className="table-container">
            <table className="group-table">
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id}>
                    {editingGroup === group.id ? (
                      <>
                        <td colSpan="3">
                          <div style={{ padding: '10px' }}>
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333' }}>
                                Group Name:
                              </label>
                              <input
                                type="text"
                                value={editGroupName}
                                onChange={(e) => setEditGroupName(e.target.value)}
                                placeholder="Group name"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', color: '#333' }}
                              />
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#333' }}>
                                Select Menus:
                              </label>
                              <div className="checkbox-grid">
                                {menus.map((menu) => (
                                  <div key={menu.id} className="checkbox-item">
                                    <input
                                      type="checkbox"
                                      id={`edit-menu-${menu.id}`}
                                      checked={editSelectedMenus[menu.id] || false}
                                      onChange={(e) => {
                                        setEditSelectedMenus((prev) => ({
                                          ...prev,
                                          [menu.id]: e.target.checked,
                                        }));
                                      }}
                                    />
                                    <label htmlFor={`edit-menu-${menu.id}`}>{menu.name}</label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                className="btn btn-success"
                                onClick={() => handleSaveEdit(group.id)}
                                disabled={loading}
                                style={{ padding: '8px 16px', fontSize: '14px' }}
                              >
                                {loading ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                                style={{ padding: '8px 16px', fontSize: '14px' }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{group.name}</td>
                        <td>{new Date(group.created_at).toLocaleDateString()}</td>
                        <td style={{ position: 'relative' }}>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '20px',
                              cursor: 'pointer',
                              padding: '5px 10px',
                              color: '#333',
                            }}
                            onClick={() => setOpenMenu(openMenu === group.id ? null : group.id)}
                          >
                            ⋯
                          </button>
                          {openMenu === group.id && (
                            <div
                              style={{
                                position: 'absolute',
                                right: '40px',
                                top: '0',
                                backgroundColor: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                zIndex: 10,
                                minWidth: '120px',
                              }}
                            >
                              <button
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '10px 15px',
                                  border: 'none',
                                  background: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#333',
                                  fontSize: '14px',
                                  borderBottom: '1px solid #eee',
                                }}
                                onClick={() => {
                                  handleViewGroup(group);
                                }}
                              >
                                View
                              </button>
                              <button
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '10px 15px',
                                  border: 'none',
                                  background: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#333',
                                  fontSize: '14px',
                                  borderBottom: '1px solid #eee',
                                }}
                                onClick={() => {
                                  handleEditGroup(group);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '10px 15px',
                                  border: 'none',
                                  background: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#d32f2f',
                                  fontSize: '14px',
                                }}
                                onClick={() => {
                                  handleDeleteGroup(group.id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingGroup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Group Details</h3>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999',
                }}
                onClick={handleCloseView}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '8px' }}>
                Group Name:
              </label>
              <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#666' }}>
                {viewingGroup.name}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '8px' }}>
                Created At:
              </label>
              <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#666' }}>
                {new Date(viewingGroup.created_at).toLocaleDateString()}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '8px' }}>
                Selected Menus:
              </label>
              {viewGroupMenus.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {viewGroupMenus.map((menu) => (
                    <span
                      key={menu.id}
                      style={{
                        backgroundColor: '#667eea',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '14px',
                      }}
                    >
                      {menu.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>
                  No menus assigned
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleEditGroup(viewingGroup);
                  handleCloseView();
                }}
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                Edit
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCloseView}
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupManagement;
