import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDetails from './setup/UserDetails';
import GroupManagement from './setup/GroupManagement';
import ModuleAccess from './setup/ModuleAccess';

function Setup({ onLogout }) {
  const [activeSection, setActiveSection] = useState('users');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

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
        <h1>Setup</h1>
        <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
          ⋮
        </div>
        {showMenu && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => setShowMenu(false)}>
              Return to Dashboard
            </div>
            <div className="dropdown-item" onClick={() => navigate('/dashboard')}>
              Dashboard
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </nav>

      <div className="setup-content">
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
      </div>
    </div>
  );
}

export default Setup;
