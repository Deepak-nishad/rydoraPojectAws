import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', address: '', role: 'USER',
    vehicleNumber: '', vehicleType: '',
    licenseNumber: '', experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post(
        '/api/auth/register', form);
      const { body } = res.data;
      // console.log(res.data);

      // localStorage.setItem('token', token);
      // localStorage.setItem('role', role);
      localStorage.setItem('body', body);
      // localStorage.setItem('userId', userId);

      // if (role === 'USER') navigate('/user/dashboard');
      // else if (role === 'DRIVER')
        navigate('/Login');

    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🚗 Rydora</h1>
        <h2 style={styles.title}>Create Account</h2>

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Role Selection */}
          <div style={styles.roleRow}>
            <button
              type="button"
              style={{
                ...styles.roleBtn,
                ...(form.role === 'USER'
                  ? styles.roleActive : {})
              }}
              onClick={() => setForm({
                ...form, role: 'USER'
              })}>
              👤 Register as User
            </button>
            <button
              type="button"
              style={{
                ...styles.roleBtn,
                ...(form.role === 'DRIVER'
                  ? styles.roleActive : {})
              }}
              onClick={() => setForm({
                ...form, role: 'DRIVER'
              })}>
              🚘 Register as Driver
            </button>
          </div>

          {/* Common Fields */}
          <Input label="Full Name" name="name"
            value={form.name} onChange={handleChange}
            placeholder="Enter your name" />

          <Input label="Email" name="email"
            type="email" value={form.email}
            onChange={handleChange}
            placeholder="Enter your email" />

          <Input label="Password" name="password"
            type="password" value={form.password}
            onChange={handleChange}
            placeholder="Min 6 characters" />

          <Input label="Phone" name="phone"
            value={form.phone} onChange={handleChange}
            placeholder="Enter your phone" />

          <Input label="Address" name="address"
            value={form.address} onChange={handleChange}
            placeholder="Enter your address" />

          {/* USER specific fields */}
          {form.role === 'USER' && (
            <>
              <Input label="Vehicle Number"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g. MH12AB1234" />

              <div style={styles.field}>
                <label style={styles.label}>
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  style={styles.input}>
                  <option value="">Select Type</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="LUXURY">Luxury</option>
                  <option value="TEMPO">Tempo</option>
                </select>
              </div>
            </>
          )}

          {/* DRIVER specific fields */}
          {form.role === 'DRIVER' && (
            <>
              <Input label="License Number"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="Enter license number" />

              <Input label="Experience (years)"
                name="experience" type="number"
                value={form.experience}
                onChange={handleChange}
                placeholder="Years of experience" />
            </>
          )}

          <button
            type="submit"
            style={styles.button}
            disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account?{' '}
          <Link to="/login"
            style={{ color: '#f5a623' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

// Reusable input component
const Input = ({
  label, name, type = 'text',
  value, onChange, placeholder
}) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type={type} name={name}
      value={value} onChange={onChange}
      placeholder={placeholder}
      style={styles.input} />
  </div>
);

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '36px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
  },
  logo: {
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  title: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '20px',
  },
  error: {
    backgroundColor: '#fdecea',
    color: '#e74c3c',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  roleRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  roleBtn: {
    flex: 1,
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  roleActive: {
    border: '2px solid #1a1a2e',
    backgroundColor: '#1a1a2e',
    color: 'white',
  },
  field: {
    marginBottom: '14px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
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
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  link: {
    marginTop: '16px',
    color: '#666',
    fontSize: '14px',
  },
};

export default Register;
