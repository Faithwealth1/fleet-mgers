import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './tools/header';
import Sidebar from './tools/sidebar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { fetchAdminProfile } from '../services/firestoreService';

const Settings = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const profile = await fetchAdminProfile(user.uid);
        setAdminData(profile);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
