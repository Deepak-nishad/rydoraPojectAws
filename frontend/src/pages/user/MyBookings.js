import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({});
  const [showReview, setShowReview] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get(
        '/api/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (bookingId) => {
    try {
      await api.post(
        `/api/reviews/add/${bookingId}`,
        reviewForm[bookingId]);
      setMsg('Review submitted successfully!');
      setShowReview({ ...showReview, [bookingId]: false });
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data ||
        'Failed to submit review');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      BOOKED: '#3498db',
      TRIP_STARTED: '#f39c12',
      COMPLETED: '#27ae60',
      CANCELLED: '#95a5a6',
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

                {/* Header */}
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

                {/* Info Grid */}
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Driver
                    </span>
                    <span>{b.driverName}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Phone
                    </span>
                    <span>{b.driverPhone}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Dates
                    </span>
                    <span>{b.fromDate} to {b.toDate}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Vehicle
                    </span>
                    <span>
                      {b.userVehicleNumber} (
                      {b.userVehicleType})
                    </span>
                  </div>
                </div>

                {/* Fare details if completed */}
                {b.status === 'COMPLETED' && (
                  <div style={styles.fareBox}>
                    <span>
                      🛣️ {b.totalKm} km
                    </span>
                    <span>
                      💳 ₹{b.ratePerKm}/km
                    </span>
                    <span style={styles.fare}>
                      💰 Total: ₹{b.fare}
                    </span>
                  </div>
                )}

                {/* Review button */}
                {b.status === 'COMPLETED' && (
                  <div style={{ marginTop: '12px' }}>
                    <button
                      onClick={() => setShowReview({
                        ...showReview,
                        [b.bookingId]:
                          !showReview[b.bookingId]
                      })}
                      style={styles.reviewToggleBtn}>
                      ⭐ Write Review
                    </button>

                    {showReview[b.bookingId] && (
                      <div style={styles.reviewForm}>
                        <div style={styles.ratingRow}>
                          <label>Rating: </label>
                          <select
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                [b.bookingId]: {
                                  ...reviewForm[
                                    b.bookingId],
                                  rating: parseInt(
                                    e.target.value)
                                }
                              })}
                            style={styles.select}>
                            <option value="">
                              Select
                            </option>
                            {[1,2,3,4,5].map(n => (
                              <option
                                key={n} value={n}>
                                {'⭐'.repeat(n)} ({n})
                              </option>
                            ))}
                          </select>
                        </div>

                        <textarea
                          placeholder="Write your comment..."
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              [b.bookingId]: {
                                ...reviewForm[b.bookingId],
                                comment: e.target.value
                              }
                            })}
                          style={styles.textarea} />

                        <button
                          onClick={() =>
                            handleReviewSubmit(
                              b.bookingId)}
                          style={styles.submitBtn}>
                          Submit Review
                        </button>
                      </div>
                    )}
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
    marginBottom: '12px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '13px',
    color: '#555',
  },
  infoLabel: {
    color: '#aaa',
    fontSize: '11px',
    textTransform: 'uppercase',
  },
  fareBox: {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333',
  },
  fare: {
    fontWeight: 'bold',
    color: '#27ae60',
  },
  reviewToggleBtn: {
    padding: '7px 16px',
    backgroundColor: '#f5a623',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  reviewForm: {
    marginTop: '12px',
    padding: '14px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    fontSize: '14px',
  },
  select: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '13px',
    resize: 'vertical',
    minHeight: '70px',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  submitBtn: {
    padding: '8px 18px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default MyBookings;
