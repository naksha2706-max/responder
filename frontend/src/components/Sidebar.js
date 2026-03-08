import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ adminSession, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: '📊', path: '/admin/analytics' },
    { id: 'cases', label: 'Cases Hub', icon: '📋', path: '/admin/cases' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🛡️</span>
        <div className="brand-text">
          <h2>Sahayak AI</h2>
          <p>Admin Portal</p>
        </div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="admin-profile">
          <div className="avatar">
            {adminSession?.role?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-role">{adminSession?.role?.replace('_', ' ')}</span>
            <span className="profile-id">{adminSession?.institutionId}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
