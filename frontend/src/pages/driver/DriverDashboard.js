import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

function DriverDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/api/drivers/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.welcome}>
          Welcome, {name}! 🚘
        </h2>

        {profile && (
          <div style={styles.profileCard}>
            <div style={styles.avatar}>
              {name[0]}
            </div>
            <div style={styles.profileInfo}>
              <h3 style={{ margin: 0 }}>{name}</h3>
              <p style={styles.sub}>
                License: {profile.licenseNumber}
              </p>
              <div style={styles.stats}>
                <div style={styles.stat}>
                  <span style={styles.statNum}>
                    ⭐ {profile.rating || 0}
                  </span>
                  <span style={styles.statLabel}>
                    Rating
                  </span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNum}>
                    🚗 {profile.totalTrips}
                  </span>
                  <span style={styles.statLabel}>
                    Trips
                  </span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNum}>
                    📅 {profile.experience}
                  </span>
                  <span style={styles.statLabel}>
                    Yrs Exp
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={styles.grid}>
          <div
            style={styles.card}
            onClick={() =>
              navigate('/driver/pending-requests')}>
            <div style={styles.icon}>📨</div>
            <h3>Pending Requests</h3>
            <p>View and respond to user requests</p>
          </div>

          <div
            style={styles.card}
            onClick={() =>
              navigate('/driver/bookings')}>
            <div style={styles.icon}>📅</div>
            <h3>My Bookings</h3>
            <p>Start and end your trips</p>
          </div>
        </div>
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
  welcome: {
    fontSize: '24px',
    color: '#1a1a2e',
    marginBottom: '20px',
  },
  profileCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '28px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#1a1a2e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    fontWeight: 'bold',
  },
  profileInfo: { flex: 1 },
  sub: { color: '#888', margin: '4px 0 10px', fontSize: '13px' },
  stats: { display: 'flex', gap: '24px' },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNum: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  statLabel: { fontSize: '11px', color: '#aaa' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    textAlign: 'center',
    border: '1px solid #eee',
  },
  icon: { fontSize: '40px', marginBottom: '12px' },
};

export default DriverDashboard;
