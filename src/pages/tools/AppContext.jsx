import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);

  const fetchData = async () => {
    try {
      // Frontend-only - no data fetching
      setData({ users: [], payments: [], adminData: adminProfile });
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };

  useEffect(() => {
    // Frontend-only - no authentication state
    setCurrentUser(null);
    setLoginStatus(false);
    setAdminProfile(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        fetchData,
        loginStatus,
        currentUser,
        adminProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
