import React, { useEffect, useState } from 'react';
import ResponsiveHeader from './tools/responsiveHeader';
import Chart from './tools/chart';
import Loader from './tools/loader';
import { fetchPayments, fetchSiteUsers, fetchUsers, toMillis } from '../services/firestoreService';

const Dashboard = () => {
  const [data, setData] = useState({ users: [] });
  const [payments, setPayments] = useState([]);
  const [siteUsers, setSiteUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usersData, siteUsersData, paymentsData] = await Promise.all([
        fetchUsers(),
        fetchSiteUsers(),
        fetchPayments(),
      ]);

      const registeredUsers = mergeUsers(siteUsersData, usersData);
      setData({ users: registeredUsers, payments: paymentsData, adminData: null });
      setPayments(getPaymentChunk(registeredUsers, paymentsData));
      setSiteUsers(registeredUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const intervalId = setInterval(loadDashboardData, 10000);
    const onFocus = () => loadDashboardData();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
    };
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
        <div className="section1">
          <div className="head">
            <h2>Key metrics</h2>
          </div>
          <div className="metrics">
            <div className="value active">
              <div className="title">Total registered Chat users</div>
              <span className="num">{siteUsers?.length || 0}</span>
            </div>
            <div className="value active_gobd">
              <div className="title">Total registered GOBD users</div>
              <span className="num">{data?.users?.length || 0}</span>
            </div>
          </div>
        </div>
        <div className="section2">
          <div className="chartsCont">
            <Chart />
          </div>
          <div className="individualsCont">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {siteUsers && siteUsers.length > 0 ? (
                  siteUsers.map((item, i) => (
                    <tr key={item.id || i}>
                      <td>{item.username || item.name || '-'}</td>
                      <td>{item.email || '-'}</td>
                      <td>{item.phone || item.phoneNumber || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center' }}>
                      No users available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="section3">
          <h2>Payments</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Subscription Plan</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments && payments.length > 0 ? (
                payments.map((item, i) => (
                  <tr key={item.payment?.id || i}>
                    <td>{item.username || '-'}</td>
                    <td>{item.payment?.amount ?? item.payment?.payment_amount ?? '-'}</td>
                    <td>{item.payment?.payment_status || item.payment?.status || '-'}</td>
                    <td>{item.payment?.subscription_plan || item.payment?.plan || '-'}</td>
                    <td>{formatDate(item.payment?.payment_date || item.payment?.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    No payments available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

function mergeUsers(primaryUsers = [], secondaryUsers = []) {
  const merged = [...primaryUsers, ...secondaryUsers];
  const byKey = new Map();

  merged.forEach((entry) => {
    const key = entry.id || entry.uid || entry.user_id || entry.email || `${entry.username || ''}-${entry.phone || entry.phoneNumber || ''}`;
    if (!key) return;

    const current = byKey.get(String(key));
    if (!current) {
      byKey.set(String(key), entry);
      return;
    }

    const currentTime = getUserCreatedMillis(current);
    const incomingTime = getUserCreatedMillis(entry);
    if (incomingTime >= currentTime) {
      byKey.set(String(key), entry);
    }
  });

  return [...byKey.values()].sort((a, b) => getUserCreatedMillis(b) - getUserCreatedMillis(a));
}

function getUserCreatedMillis(entry) {
  return (
    toMillis(entry?.created_at) ||
    toMillis(entry?.createdAt) ||
    toMillis(entry?.registered_at) ||
    toMillis(entry?.registeredAt) ||
    toMillis(entry?.timestamp) ||
    0
  );
}

function getPaymentChunk(usersArray = [], paymentsArray = []) {
  const userMap = new Map();
  usersArray.forEach((user) => {
    const keys = [user.id, user.uid, user.user_id].filter(Boolean);
    keys.forEach((key) => userMap.set(String(key), user));
  });

  return paymentsArray.map((payment) => {
    const paymentUserId = [payment.user_id, payment.userId, payment.uid].find(Boolean);
    const matchedUser = paymentUserId ? userMap.get(String(paymentUserId)) : null;

    if (!matchedUser) {
      return {
        username: payment.username || 'Unknown',
        payment,
      };
    }

    return { ...matchedUser, payment };
  });
}

function formatDate(value) {
  if (!value) return '-';

  let date;
  if (typeof value?.toDate === 'function') {
    date = value.toDate();
  } else if (typeof value?.seconds === 'number') {
    date = new Date(value.seconds * 1000);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return '-';

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  };

  return date.toLocaleString('en-NG', options);
}
