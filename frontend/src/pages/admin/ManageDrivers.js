import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/api/admin/drivers');
      setDrivers(res.data);
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

  const handleApprove = async (id) => {
    try {
      await api.put(
        `/api/admin/drivers/${id}/approve`);
      showMsg('Driver approved successfully!');
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data || 'Failed');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this driver?'))
      return;
    try {
      await api.put(
        `/api/admin/drivers/${id}/reject`);
      showMsg('Driver rejected');
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data || 'Failed');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f39c12',
      APPROVED: '#27ae60',
      REJECTED: '#e74c3c',
    };
    return colors[status] || '#333';
  };

  const filtered = filter === 'ALL'
    ? drivers
    : drivers.filter(
        d => d.approvalStatus === filter);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>
          🚘 Manage Drivers
        </h2>

        {msg && (
          <div style={styles.success}>{msg}</div>
        )}

        {/* Filter Tabs */}
        <div style={styles.tabs}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED']
            .map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...styles.tab,
                  ...(filter === f
                    ? styles.tabActive : {})
                }}>
                {f} (
                {f === 'ALL'
                  ? drivers.length
                  : drivers.filter(
                      d => d.approvalStatus === f
                    ).length}
                )
              </button>
            ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            No drivers found
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map(driver => (
              <div
                key={driver.driverId}
                style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.driverLeft}>
                    <div style={styles.avatar}>
                      {driver.name[0]}
                    </div>
                    <div>
                      <h3 style={styles.name}>
                        {driver.name}
                      </h3>
                      <p style={styles.email}>
                        {driver.email}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    ...styles.status,
                    color: getStatusColor(
                      driver.approvalStatus),
                    borderColor: getStatusColor(
                      driver.approvalStatus),
                  }}>
                    {driver.approvalStatus}
                  </span>
                </div>

                <div style={styles.infoRow}>
                  <span>📞 {driver.phone}</span>
                  <span>
                    🪪 {driver.licenseNumber}
                  </span>
                  <span>
                    📅 {driver.experience} yrs exp
                  </span>
                  <span>⭐ {driver.rating} rating</span>
                  <span>
                    🚗 {driver.totalTrips} trips
                  </span>
                </div>

                {driver.approvalStatus === 'PENDING' && (
                  <div style={styles.btnRow}>
                    <button
                      onClick={() =>
                        handleApprove(driver.driverId)}
                      style={styles.approveBtn}>
                      ✅ Approve
                    </button>
                    <button
                      onClick={() =>
                        handleReject(driver.driverId)}
                      style={styles.rejectBtn}>
                      ❌ Reject
                    </button>
                  </div>
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
    maxWidth: '900px',
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
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  tab: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '13px',
  },
  tabActive: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: '1px solid #1a1a2e',
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
    gap: '14px',
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
    marginBottom: '12px',
  },
  driverLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#1a1a2e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  name: { margin: 0, fontSize: '15px', color: '#1a1a2e' },
  email: { margin: '2px 0 0', color: '#888', fontSize: '12px' },
  status: {
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600',
  },
  infoRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    color: '#555',
    fontSize: '13px',
    marginBottom: '14px',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
  },
  approveBtn: {
    padding: '8px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  rejectBtn: {
    padding: '8px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default ManageDrivers;
