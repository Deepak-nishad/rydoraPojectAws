import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get(
        '/api/requests/pending');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleAccept = async (id) => {
    try {
      await api.put(`/api/requests/${id}/accept`);
      showMsg('Request accepted! Booking created.');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data || 'Failed');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this request?'))
      return;
    try {
      await api.put(`/api/requests/${id}/reject`);
      showMsg('Request rejected');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data || 'Failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>
          📨 Pending Requests
        </h2>

        {msg && (
          <div style={styles.success}>{msg}</div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <div style={styles.empty}>
            <p>No pending requests right now.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {requests.map(req => (
              <div
                key={req.requestId}
                style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.route}>
                    📍 {req.source} → {req.destination}
                  </h3>
                  <span style={styles.pending}>
                    PENDING
                  </span>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>
                      User
                    </span>
                    <span>{req.userName}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>
                      Phone
                    </span>
                    <span>{req.userPhone}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>
                      Vehicle
                    </span>
                    <span>
                      {req.userVehicleNumber} (
                      {req.userVehicleType})
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>
                      Dates
                    </span>
                    <span>
                      {req.fromDate} to {req.toDate}
                    </span>
                  </div>
                </div>

                <div style={styles.btnRow}>
                  <button
                    onClick={() =>
                      handleAccept(req.requestId)}
                    style={styles.acceptBtn}>
                    ✅ Accept
                  </button>
                  <button
                    onClick={() =>
                      handleReject(req.requestId)}
                    style={styles.rejectBtn}>
                    ❌ Reject
                  </button>
                </div>
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
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
    alignItems: 'center',
    marginBottom: '14px',
  },
  route: {
    margin: 0,
    fontSize: '16px',
    color: '#1a1a2e',
  },
  pending: {
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid #f39c12',
    color: '#f39c12',
    fontSize: '12px',
    fontWeight: '600',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '16px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '13px',
    color: '#555',
  },
  label: {
    color: '#aaa',
    fontSize: '11px',
    textTransform: 'uppercase',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
  },
  acceptBtn: {
    flex: 1,
    padding: '9px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  rejectBtn: {
    flex: 1,
    padding: '9px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default PendingRequests;
