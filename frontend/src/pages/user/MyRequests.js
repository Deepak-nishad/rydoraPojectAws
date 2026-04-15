import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get(
        '/api/requests/my-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm(
      'Cancel this request?')) return;
    try {
      await api.put(`/api/requests/${id}/cancel`);
      setMsg('Request cancelled');
      fetchRequests();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data ||
        'Failed to cancel');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f39c12',
      ACCEPTED: '#27ae60',
      REJECTED: '#e74c3c',
      CANCELLED: '#95a5a6',
    };
    return colors[status] || '#333';
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>📋 My Requests</h2>

        {msg && (
          <div style={styles.success}>{msg}</div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <div style={styles.empty}>
            <p>No requests yet.</p>
            <p>Search drivers and send requests!</p>
          </div>
        ) : (
          <div style={styles.list}>
            {requests.map(req => (
              <div
                key={req.requestId}
                style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.route}>
                      📍 {req.source} →{' '}
                      {req.destination}
                    </h3>
                    <p style={styles.dates}>
                      📅 {req.fromDate} to {req.toDate}
                    </p>
                  </div>
                  <span style={{
                    ...styles.status,
                    color: getStatusColor(req.status),
                    borderColor:
                      getStatusColor(req.status),
                  }}>
                    {req.status}
                  </span>
                </div>

                <div style={styles.driverInfo}>
                  <span>👤 Driver: {req.driverName}</span>
                  <span>📞 {req.driverPhone}</span>
                </div>

                {req.status === 'PENDING' && (
                  <button
                    onClick={() =>
                      handleCancel(req.requestId)}
                    style={styles.cancelBtn}>
                    Cancel Request
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 24px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '24px',
    color: '#1a1a2e',
    marginBottom: '20px',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    border: '1px solid #eee',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  route: {
    margin: 0,
    fontSize: '16px',
    color: '#1a1a2e',
  },
  dates: {
    margin: '4px 0 0',
    color: '#888',
    fontSize: '13px',
  },
  status: {
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600',
  },
  driverInfo: {
    display: 'flex',
    gap: '20px',
    color: '#555',
    fontSize: '14px',
    marginBottom: '12px',
  },
  cancelBtn: {
    padding: '7px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default MyRequests;
