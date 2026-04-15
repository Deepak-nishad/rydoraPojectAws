import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.get('/api/admin/bookings')
      .then(res => setBookings(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      BOOKED: '#3498db',
      TRIP_STARTED: '#f39c12',
      COMPLETED: '#27ae60',
      CANCELLED: '#95a5a6',
    };
    return colors[status] || '#333';
  };

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>📋 All Bookings</h2>

        {/* Filter Tabs */}
        <div style={styles.tabs}>
          {['ALL', 'BOOKED', 'TRIP_STARTED',
            'COMPLETED', 'CANCELLED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.tab,
                ...(filter === f
                  ? styles.tabActive : {})
              }}>
              {f === 'ALL' ? 'ALL' : f} (
              {f === 'ALL'
                ? bookings.length
                : bookings.filter(
                    b => b.status === f).length}
              )
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            No bookings found
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map(b => (
              <div key={b.bookingId} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.route}>
                      📍 {b.source} → {b.destination}
                    </h3>
                    <p style={styles.dates}>
                      📅 {b.fromDate} to {b.toDate}
                    </p>
                  </div>
                  <span style={{
                    ...styles.status,
                    color: getStatusColor(b.status),
                    borderColor: getStatusColor(b.status),
                  }}>
                    {b.status}
                  </span>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>User</span>
                    <span>
                      {b.userName} | {b.userPhone}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>
                      Driver
                    </span>
                    <span>
                      {b.driverName} | {b.driverPhone}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>
                      Vehicle
                    </span>
                    <span>
                      {b.userVehicleNumber} (
                      {b.userVehicleType})
                    </span>
                  </div>
                  {b.status === 'COMPLETED' && (
                    <div style={styles.infoItem}>
                      <span style={styles.label}>
                        Fare
                      </span>
                      <span style={styles.fare}>
                        {b.totalKm} km × ₹
                        {b.ratePerKm} = ₹{b.fare}
                      </span>
                    </div>
                  )}
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
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '24px',
    color: '#1a1a2e',
    marginBottom: '20px',
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
  },
  tab: {
    padding: '7px 14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '12px',
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
    alignItems: 'flex-start',
    marginBottom: '14px',
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
    whiteSpace: 'nowrap',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
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
  fare: {
    color: '#27ae60',
    fontWeight: '600',
  },
};

export default AllBookings;
