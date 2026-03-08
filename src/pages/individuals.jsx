import React, { useEffect, useState } from 'react';
import ResponsiveHeader from './tools/responsiveHeader';
import Loader from './tools/loader';

const Individuals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <ResponsiveHeader />
      <div className="container">
        {loading ? (
          <Loader />
        ) : (
          <div>
            {/* Add any additional content you want to show when data is loaded */}
          </div>
        )}
        <div className="containerIndividuals">
          <div className="section1">
            <div className="head">
              <h2>Key metrics</h2>
            </div>
            <div className="metrics">{/* Add metrics here if needed */}</div>
          </div>
          <div className="tableSection">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Individual Name</th>
                  <th>Car Make</th>
                  <th>Car Year</th>
                  <th>Car Brand</th>
                  <th>Car Engine type</th>
                  <th>Phone</th>
                  <th>Subscription Status</th>
                  <th>Date registered</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users
                    .sort((a, b) => toMillis(b.created_at || b.createdAt) - toMillis(a.created_at || a.createdAt))
                    .map((item) => (
                      <tr key={item.id} style={{ cursor: 'pointer' }}>
                        <td>{item.id}</td>
                        <td>{item.username || item.name || '-'}</td>
                        <td>{item.car_make || '-'}</td>
                        <td>{item.car_year || '-'}</td>
                        <td>{item.car_model || '-'}</td>
                        <td>{item.engine_type || '-'}</td>
                        <td>{item.phone || item.phoneNumber || '-'}</td>
                        <td>{item.subscription_status || item.subscriptionStatus || '-'}</td>
                        <td>{formatDate(item.created_at || item.createdAt)}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center' }}>
                      No users in database
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Individuals;

function toMillis(value) {
  if (!value) return 0;
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDate(input) {
  const timestamp = toMillis(input);
  if (!timestamp) return '-';
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}
