import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../stylings/styles.css';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { fetchAdminProfile, fetchDiagnoses, fetchUsers } from '../../services/firestoreService';

const ResponsiveHeader = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openUp, setOpenUp] = useState(false);
  const [username, setUsername] = useState('Admin');
  const [gobdUsers, setGobdUsers] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  const nameKey = useMemo(() => {
    const trimmed = (username || '').trim();
    if (!trimmed) return 'AD';
    const parts = trimmed.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }, [username]);

  const toggleSidebarClass = () => {
    setOpenUp((prev) => !prev);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const adminProfile = await fetchAdminProfile(user.uid);
        if (adminProfile?.username) {
          setUsername(adminProfile.username);
        } else if (user.displayName) {
          setUsername(user.displayName);
        } else {
          setUsername('Admin');
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const loadHeaderCounts = async () => {
      try {
        const [usersData, diagnosesData] = await Promise.all([fetchUsers(), fetchDiagnoses()]);
        setGobdUsers(usersData);
        setDiagnoses(diagnosesData);
      } catch (error) {
        console.error('Error fetching header data:', error);
      }
    };

    loadHeaderCounts();
  }, []);

  return (
    <header className="header">
      <div className="res">
        <div className="open" onClick={toggleSidebarClass}>
          <i className="bi bi-layout-text-sidebar"></i>
        </div>
        <div className="header-search">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="header-right">
          <div className="notification-icon">
            <span role="img" aria-label="notifications">
              <i className="bi bi-bell"></i>
            </span>
          </div>
          <div className="admin-data">
            <div className="left">{nameKey}</div>
            <div className="right">
              <span className="name">{username}</span>
              <span>Admin</span>
            </div>
          </div>
        </div>
      </div>

      {sidebarVisible && (
        <div className={`sideBar ${openUp ? 'openUp' : ''}`}>
          <div className="header-logo">
            <Link to="/dashboard">
              <img src="/LOGO.png" alt="G-OBD Logo" />
            </Link>
          </div>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="messages">
              <Link to="/individuals">GOBD Users</Link>
              {gobdUsers.length > 0 ? <span>{gobdUsers.length}</span> : ''}
            </li>
            <li className="messages">
              <Link to="/car_diagnoses">Car Diagnoses</Link>
              {diagnoses.length > 0 ? <span>{diagnoses.length}</span> : ''}
            </li>
          </ul>
          <div className="header-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="logout" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </div>
          <div className="close" onClick={toggleSidebarClass}>
            <i className="bi bi-x-lg"></i>
          </div>
        </div>
      )}
    </header>
  );
};

export default ResponsiveHeader;
