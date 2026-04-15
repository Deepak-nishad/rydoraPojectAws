import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/api/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const statCards = stats ? [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: '👤',
      color: '#3498db'
    },
    {
      label: 'Total Drivers',
      value: stats.totalDrivers,
      icon: '🚘',
      color: '#9b59b6'
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: '⏳',
      color: '#f39c12'
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: '📅',
      color: '#1a1a2e'
    },
    {
      label: 'Active Trips',
      value: stats.activeTrips,
      icon: '🚀',
      color: '#e67e22'
    },
    {
      label: 'Completed Trips',
      value: stats.completedTrips,
      icon: '✅',
      color: '#27ae60'
    },
  ] : [];

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>
          📊 Admin Dashboard
        </h2>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {statCards.map((s, i) => (
            <div key={i} style={{
              ...styles.statCard,
              borderLeft: `4px solid ${s.color}`
            }}>
              <div style={styles.statIcon}>
                {s.icon}
              </div>
              <div>
                <div style={{
                  ...styles.statValue,
                  color: s.color
                }}>
                  {s.value}
                </div>
                <div style={styles.statLabel}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 style={styles.sectionTitle}>
          Quick Actions
        </h3>
        <div style={styles.actionGrid}>
          <div
            style={styles.actionCard}
            onClick={() => navigate('/admin/drivers')}>
            <div style={styles.actionIcon}>🚘</div>
            <h3>Manage Drivers</h3>
            <p>Approve or reject driver registrations</p>
          </div>
          <div
            style={styles.actionCard}
            onClick={() => navigate('/admin/bookings')}>
            <div style={styles.actionIcon}>📋</div>
            <h3>All Bookings</h3>
            <p>View all bookings and trip details</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    fontSize: '24px',
    color: '#1a1a2e',
    marginBottom: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: { fontSize: '32px' },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: '13px',
  },
  sectionTitle: {
    color: '#333',
    marginBottom: '16px',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    cursor: 'pointer',
    textAlign: 'center',
    border: '1px solid #eee',
  },
  actionIcon: {
    fontSize: '36px',
    marginBottom: '10px',
  },
};

export default AdminDashboard;
