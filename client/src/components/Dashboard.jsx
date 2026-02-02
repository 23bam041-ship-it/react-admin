import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Dashboard({ onLogout }) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [stats, setStats] = useState(null);
  const [menus, setMenus] = useState([]);
  const [modules, setModules] = useState([]);
  const [userGroup, setUserGroup] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchStats();
    fetchMenus();
    fetchModules();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
      
      // Check if user is admin
      if (email === 'admin@example.com') {
        setIsAdmin(true);
      }
      
      // Fetch employee info to get group
      const response = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const currentUser = response.data.find(emp => emp.email === email);
      if (currentUser && currentUser.group_id) {
        setUserGroup(currentUser.group_id);
        // Fetch permissions for this group
        const permRes = await axios.get(`${API_URL}/groups/${currentUser.group_id}/permissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPermissions(permRes.data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  const getAccessibleMenus = () => {
    // If admin, show all menus
    if (isAdmin) {
      return menus;
    }
    
    // For regular users, show only menus that have at least one accessible module
    return menus.filter((menu) =>
      userPermissions.some((perm) => perm.menu_id === menu.id)
    );
  };

  const getModulesForMenu = (menuId) => {
    const allModules = modules.filter((module) => module.menu_id === menuId);
    
    // If admin, show all modules. Otherwise, show only modules user has access to
    if (isAdmin) {
      return allModules;
    }
    
    return allModules.filter((module) =>
      userPermissions.some(
        (perm) => perm.menu_id === menuId && perm.module_id === module.id
      )
    );
  };

  const handleMenuClick = (menuId) => {
    setSelectedMenu(selectedMenu === menuId ? null : menuId);
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setShowMenu(false);
  };

  const closeModulePage = () => {
    setSelectedModule(null);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Dashboard</h1>
        <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
          ⋮
        </div>
        {showMenu && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => setShowMenu(false)}>
              Return to Dashboard
            </div>
            {getAccessibleMenus().map((menu) => (
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
                      <div 
                        key={module.id} 
                        className="submenu-item"
                        onClick={() => handleModuleClick(module)}
                        style={{ cursor: 'pointer' }}
                      >
                        {module.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isAdmin && (
              <div className="dropdown-item" onClick={() => navigate('/setup')}>
                Setup
              </div>
            )}
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </nav>

      <div className="dashboard-content">
        <h2>Welcome to Admin Panel</h2>
        {stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Employees</h3>
              <p>{stats.employees}</p>
            </div>
            <div className="stat-card">
              <h3>Total Groups</h3>
              <p>{stats.groups}</p>
            </div>
            <div className="stat-card">
              <h3>Total Menus</h3>
              <p>{stats.menus}</p>
            </div>
            <div className="stat-card">
              <h3>Total Modules</h3>
              <p>{stats.modules}</p>
            </div>
          </div>
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>

      {selectedModule && (
        <div className="module-overlay" onClick={closeModulePage}>
          <div className="module-page" onClick={(e) => e.stopPropagation()}>
            <div className="module-header">
              <h2>{selectedModule.name}</h2>
              <button className="module-close-btn" onClick={closeModulePage}>
                ✕
              </button>
            </div>
            <div className="module-content">
              <p className="module-message">
                {selectedModule.name} has opened for <strong>{userEmail}</strong>
              </p>
              <div className="module-info">
                <p><strong>Module ID:</strong> {selectedModule.id}</p>
                <p><strong>Menu:</strong> {menus.find(m => m.id === selectedModule.menu_id)?.name}</p>
                <p><strong>User Group:</strong> {userGroup || 'No Group Assigned'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
