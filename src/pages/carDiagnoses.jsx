import React, { useEffect, useState } from 'react';
import ResponsiveHeader from './tools/responsiveHeader';
import Loader from './tools/loader';
import { fetchDiagnoses } from '../services/firestoreService';

export default function CarDiagnoses() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDiagnoses = async () => {
    setLoading(true);
    try {
      const diagnosisData = await fetchDiagnoses();
      setDiagnoses(diagnosisData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiagnoses();
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
                  <th>Username</th>
                  <th>User email</th>
                  <th>User phone</th>
                  <th>Car make</th>
                  <th>Car model</th>
                  <th>Created at</th>
                  <th style={{ textAlign: 'left' }}>Fault code(s)</th>
                </tr>
              </thead>
              <tbody>
                {diagnoses && diagnoses.length > 0 ? (
                  diagnoses
                    .sort((a, b) => toMillis(b.created_at || b.createdAt) - toMillis(a.created_at || a.createdAt))
                    .map((item) => (
                      <tr key={item.id}>
                        <td>{item.user_name || item.username || '-'}</td>
                        <td>{item.user_email || item.email || '-'}</td>
                        <td>{item.user_phone || item.phone || '-'}</td>
                        <td>{item.car_make || '-'}</td>
                        <td>{item.car_model || '-'}</td>
                        <td>{formatDate(item.created_at || item.createdAt)}</td>
                        <td style={{ textAlign: 'left' }}>{formatFaultCodes(item.fault_code)}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center' }}>
                      No diagnoses available
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
}

function toMillis(value) {
  if (!value) return 0;
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatFaultCodes(input) {
  if (!input) return '-';
  const value = Array.isArray(input) ? input.join('.') : String(input);
  let faultCodes = value.split(/[./]+/);
  faultCodes = faultCodes.filter((code) => code && code.toLowerCase() !== '03');
  return faultCodes.length ? faultCodes.join(', ') : '-';
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
