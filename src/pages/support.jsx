import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveHeader from './tools/responsiveHeader';

const Support = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Frontend-only - no authentication
    const isAuthenticated = false; // No authenticated user
    
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    setLoading(false);
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
