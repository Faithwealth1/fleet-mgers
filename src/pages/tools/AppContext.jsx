import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { fetchAdminProfile } from '../../services/firestoreService';

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
      const [usersSnap, paymentsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'payments')),
      ]);

      const usersData = usersSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
      const paymentsData = paymentsSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }));

      setData({ users: usersData, payments: paymentsData, adminData: adminProfile });
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);
      setLoginStatus(Boolean(user));

      if (!user) {
        setAdminProfile(null);
        return;
      }

      try {
        const profile = await fetchAdminProfile(user.uid);
        setAdminProfile(profile);
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    });

    return () => unsubscribe();
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
