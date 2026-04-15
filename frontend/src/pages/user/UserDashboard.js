import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function UserDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.welcome}>
          Welcome, {name}! 👋
        </h2>
        <p style={styles.sub}>
          What would you like to do today?
        </p>

        <div style={styles.grid}>
          <div
            style={styles.card}
            onClick={() =>
              navigate('/user/search-drivers')}>
            <div style={styles.icon}>🔍</div>
            <h3>Search Drivers</h3>
            <p>Find available drivers for your trip</p>
          </div>

          <div
            style={styles.card}
            onClick={() =>
              navigate('/user/my-requests')}>
            <div style={styles.icon}>📋</div>
            <h3>My Requests</h3>
            <p>View and manage your sent requests</p>
          </div>

          <div
            style={styles.card}
            onClick={() =>
              navigate('/user/my-bookings')}>
            <div style={styles.icon}>📅</div>
            <h3>My Bookings</h3>
            <p>Track your bookings and trips</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 24px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  welcome: {
    fontSize: '26px',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  sub: {
    color: '#666',
    marginBottom: '32px',
    fontSize: '15px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s',
    border: '1px solid #eee',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
};

export default UserDashboard;
