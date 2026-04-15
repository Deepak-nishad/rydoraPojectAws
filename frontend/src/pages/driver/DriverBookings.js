import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

function DriverBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [kmInput, setKmInput] = useState({});

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get(
        '/api/bookings/driver-bookings');
      setBookings(res.data);
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

  const handleStartTrip = async (bookingId) => {
    const startKm = kmInput[`start_${bookingId}`];
    if (!startKm) {
      alert('Please enter start KM');
      return;
    }
    try {
      await api.put(
        `/api/bookings/${bookingId}/start-trip`,
        { startKm: parseFloat(startKm) });
      showMsg('Trip started!');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data || 'Failed');
    }
  };

  const handleEndTrip = async (bookingId) => {
    const endKm = kmInput[`end_${bookingId}`];
    if (!endKm) {
      alert('Please enter end KM');
      return;
    }
    try {
      await api.put(
        `/api/bookings/${bookingId}/end-trip`,
        { endKm: parseFloat(endKm) });
      showMsg('Trip completed! Fare calculated.');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data || 'Failed');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      BOOKED: '#3498db',
      TRIP_STARTED: '#f39c12',
      COMPLETED: '#27ae60',
    };
    return colors[status] || '#333';
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>📅 My Bookings</h2>

        {msg && (
          <div style={styles.success}>{msg}</div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <div style={styles.empty}>
            No bookings yet!
          </div>
        ) : (
          <div style={styles.list}>
            {bookings.map(b => (
              <div key={b.bookingId} style={styles.card}>

                <div style={styles.cardHeader}>
                  <h3 style={styles.route}>
                    📍 {b.source} → {b.destination}
                  </h3>
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
                    <span>{b.userName}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Phone</span>
                    <span>{b.userPhone}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Vehicle</span>
                    <span>
                      {b.userVehicleNumber} (
                      {b.userVehicleType})
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Dates</span>
                    <span>
                      {b.fromDate} to {b.toDate}
                    </span>
                  </div>
                </div>

                {/* Start Trip */}
                {b.status === 'BOOKED' && (
                  <div style={styles.kmBox}>
                    <input
                      type="number"
                      placeholder="Enter Start KM from odometer"
                      value={
                        kmInput[`start_${b.bookingId}`]
                        || ''
                      }
                      onChange={(e) => setKmInput({
                        ...kmInput,
                        [`start_${b.bookingId}`]:
                          e.target.value
                      })}
                      style={styles.kmInput} />
                    <button
                      onClick={() =>
                        handleStartTrip(b.bookingId)}
                      style={styles.startBtn}>
                      🚀 Start Trip
                    </button>
                  </div>
                )}

                {/* End Trip */}
                {b.status === 'TRIP_STARTED' && (
                  <div>
                    <div style={styles.startKmInfo}>
                      🛣️ Start KM: {b.startKm}
                    </div>
                    <div style={styles.kmBox}>
                      <input
                        type="number"
                        placeholder="Enter End KM from odometer"
                        value={
                          kmInput[`end_${b.bookingId}`]
                          || ''
                        }
                        onChange={(e) => setKmInput({
                          ...kmInput,
                          [`end_${b.bookingId}`]:
                            e.target.value
                        })}
                        style={styles.kmInput} />
                      <button
                        onClick={() =>
                          handleEndTrip(b.bookingId)}
                        style={styles.endBtn}>
                        🏁 End Trip
                      </button>
                    </div>
                  </div>
                )}

                {/* Completed - show fare */}
                {b.status === 'COMPLETED' && (
                  <div style={styles.fareBox}>
                    <span>
                      🛣️ {b.totalKm} km
                    </span>
                    <span>
                      💳 ₹{b.ratePerKm}/km
                    </span>
                    <span style={styles.fare}>
                      💰 ₹{b.fare}
                    </span>
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
  status: {
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '14px',
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
  kmBox: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  kmInput: {
    flex: 1,
    padding: '9px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  startBtn: {
    padding: '9px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  endBtn: {
    padding: '9px 16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  startKmInfo: {
    color: '#555',
    fontSize: '13px',
    marginBottom: '8px',
    fontWeight: '500',
  },
  fareBox: {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: '10px',
  },
  fare: {
    fontWeight: 'bold',
    color: '#27ae60',
    fontSize: '16px',
  },
};

export default DriverBookings;
