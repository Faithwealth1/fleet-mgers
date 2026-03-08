import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './tools/header';
import Sidebar from './tools/sidebar';

const Settings = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Frontend-only - no authentication
    const isAuthenticated = false; // No authenticated user
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Set minimal admin data for UI
    setAdminData({
      id: null,
      username: 'Guest',
      email: 'guest@example.com',
      role: 'guest'
    });
    
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <Sidebar visible={sidebarVisible} />
      <div className="container">
        <div className="containerSettings">
          <div className="headerSection">Settings</div>
          <div style={{ marginTop: '16px' }}>
            Logged in as: {adminData?.username || adminData?.email || 'Admin'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
