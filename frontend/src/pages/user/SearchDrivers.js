import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';

function SearchDrivers() {
  const [form, setForm] = useState({
    source: '', destination: '',
    fromDate: '', toDate: ''
  });
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [requestSent, setRequestSent] = useState({});
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSearched(false);

    try {
      const res = await api.post(
        '/api/drivers/available', {
          source: form.source,
          destination: form.destination,
          fromDate: form.fromDate,
          toDate: form.toDate,
        });

      setDrivers(Array.isArray(res.data)
        ? res.data : []);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data ||
        'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (driverId) => {
    try {
      await api.post('/api/requests/send', {
        driverId,
        source: form.source,
        destination: form.destination,
        fromDate: form.fromDate,
        toDate: form.toDate,
      });
      setRequestSent({
        ...requestSent, [driverId]: true
      });
      setMsg('Request sent successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data ||
        'Failed to send request');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>
          🔍 Search Available Drivers
        </h2>

        {/* Search Form */}
        <div style={styles.formCard}>
          <form onSubmit={handleSearch}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Source
                </label>
                <input
                  name="source"
                  placeholder="e.g. Pune"
                  value={form.source}
                  onChange={handleChange}
                  style={styles.input}
                  required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>
                  Destination
                </label>
                <input
                  name="destination"
                  placeholder="e.g. Mumbai"
                  value={form.destination}
                  onChange={handleChange}
                  style={styles.input}
                  required />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  style={styles.input}
                  required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  style={styles.input}
                  required />
              </div>
            </div>

            <button
              type="submit"
              style={styles.searchBtn}
              disabled={loading}>
              {loading
                ? 'Searching...'
                : '🔍 Search Drivers'}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.error}>{error}</div>
        )}

        {/* Success message */}
        {msg && (
          <div style={styles.success}>{msg}</div>
        )}

        {/* Results */}
        {searched && (
          <>
            <h3 style={styles.resultsTitle}>
              {drivers.length > 0
                ? `${drivers.length} Driver(s) Available`
                : 'No drivers available for selected dates'}
            </h3>

            <div style={styles.driverGrid}>
              {drivers.map(driver => (
                <div
                  key={driver.driverId}
                  style={styles.driverCard}>
                  <div style={styles.driverHeader}>
                    <div style={styles.avatar}>
                      {driver.name[0]}
                    </div>
                    <div>
                      <h3 style={styles.driverName}>
                        {driver.name}
                      </h3>
                      <p style={styles.driverPhone}>
                        📞 {driver.phone}
                      </p>
                    </div>
                  </div>

                  <div style={styles.driverInfo}>
                    <span style={styles.badge}>
                      ⭐ {driver.rating || 0} Rating
                    </span>
                    <span style={styles.badge}>
                      🚗 {driver.totalTrips} Trips
                    </span>
                    <span style={styles.badge}>
                      📅 {driver.experience} yrs exp
                    </span>
                  </div>

                  <div style={styles.fareInfo}>
                    <span>💳 Rate: ₹10/km</span>
                  </div>

                  <button
                    onClick={() =>
                      handleSendRequest(driver.driverId)}
                    disabled={
                      requestSent[driver.driverId]
                    }
                    style={{
                      ...styles.requestBtn,
                      ...(requestSent[driver.driverId]
                        ? styles.requestBtnSent : {})
                    }}>
                    {requestSent[driver.driverId]
                      ? '✅ Request Sent'
                      : 'Send Request'}
                  </button>
                </div>
              ))}
            </div>
          </>
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
  formCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  field: { marginBottom: '16px' },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#555',
    fontSize: '13px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  searchBtn: {
    padding: '11px 28px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#fdecea',
    color: '#e74c3c',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  resultsTitle: {
    color: '#333',
    marginBottom: '16px',
  },
  driverGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
  },
  driverCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
  },
  driverHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#1a1a2e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  driverName: {
    margin: 0,
    fontSize: '16px',
    color: '#1a1a2e',
  },
  driverPhone: {
    margin: 0,
    color: '#888',
    fontSize: '13px',
  },
  driverInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px',
  },
  badge: {
    backgroundColor: '#f0f4f8',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#555',
  },
  fareInfo: {
    color: '#f5a623',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '14px',
  },
  requestBtn: {
    width: '100%',
    padding: '9px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  requestBtnSent: {
    backgroundColor: '#2e7d32',
    cursor: 'default',
  },
};

export default SearchDrivers;
