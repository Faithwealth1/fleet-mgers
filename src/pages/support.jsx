import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveHeader from './tools/responsiveHeader';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Support = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ResponsiveHeader />
      <div className="container">
        <div className="containerSupport">
          <div className="head">Support</div>
          <div className="tableSection">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th className="action">Priority</th>
                  <th className="action">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td>val2</td>
                    <td>val2</td>
                    <td>val2</td>
                    <td>val2</td>
                    <td className="action">
                      <span className="low">low</span>
                    </td>
                    <td className="action">val2</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
