import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDetails from './setup/UserDetails';
import GroupManagement from './setup/GroupManagement';
import ModuleAccess from './setup/ModuleAccess';

const API_URL = 'http://localhost:5000/api';

function Setup({ onLogout }) {
  const [activeSection, setActiveSection] = useState('users');
  const [showMenu, setShowMenu] = useState(false);
  const [menus, setMenus] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [viewingMenu, setViewingMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
    fetchModules();
  }, []);

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

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const sections = [
    { id: 'users', label: 'User Details' },
    { id: 'groups', label: 'Groups' },
    { id: 'access', label: 'Module Access' },
  ];

  return (
    <div className="setup-container">
      <nav className="navbar">
        <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
          ⋮
        </div>
        <h1 style={{ marginLeft: '20px' }}>Setup</h1>
      </nav>

      {showMenu && (
        <div className="full-screen-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="full-screen-menu" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Menu</h2>
              <button 
                onClick={() => setShowMenu(false)}
                style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <div 
                style={{ padding: '15px', cursor: 'pointer', color: '#333', fontWeight: '500', fontSize: '16px', borderBottom: '1px solid #eee', transition: 'background 0.2s' }}
                onClick={() => {
                  navigate('/dashboard');
                  setShowMenu(false);
                }}
              >
                Return to Dashboard
              </div>
              
              {menus.map((menu) => (
                <div key={menu.id}>
                  <div 
                    style={{ 
                      padding: '15px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      color: '#333', 
                      fontWeight: '500',
                      fontSize: '15px',
                      borderBottom: '1px solid #eee',
                      transition: 'background 0.2s',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <span style={{ fontSize: '12px' }}>▼</span>
                    {menu.name}
                  </div>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '10px 0' }}>
                    {getModulesForMenu(menu.id).map((module) => (
                      <div 
                        key={module.id} 
                        onClick={() => {
                          setViewingMenu(menu.id);
                          setShowMenu(false);
                        }}
                        style={{ 
                          fontSize: '14px', 
                          color: '#666', 
                          cursor: 'pointer', 
                          padding: '12px 40px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {module.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div 
                style={{ padding: '15px', cursor: 'pointer', color: '#333', fontWeight: '500', fontSize: '16px', marginTop: '20px' }}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="setup-content">
        {viewingMenu ? (
          <div style={{ padding: '20px' }}>
            <button 
              onClick={() => setViewingMenu(null)}
              style={{ 
                padding: '10px 20px', 
                marginBottom: '20px', 
                background: '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back
            </button>
            
            <h2 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
              {menus.find(m => m.id === viewingMenu)?.name}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
              {getModulesForMenu(viewingMenu).map((module) => (
                <div 
                  key={module.id}
                  style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9ecef';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '16px' }}>
                    {module.name}
                  </h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    Module ID: {module.id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="setup-tabs">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`tab-button ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="setup-section">
              {activeSection === 'users' && <UserDetails />}
              {activeSection === 'groups' && <GroupManagement />}
              {activeSection === 'access' && <ModuleAccess />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Setup;
