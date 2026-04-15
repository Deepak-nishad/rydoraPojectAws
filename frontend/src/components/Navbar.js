import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getLinks = () => {
    if (role === 'USER') return (
      <>
        <Link to="/user/dashboard">Home</Link>
        <Link to="/user/search-drivers">Search Drivers</Link>
        <Link to="/user/my-requests">My Requests</Link>
        <Link to="/user/my-bookings">My Bookings</Link>
      </>
    );

    if (role === 'DRIVER') return (
      <>
        <Link to="/driver/dashboard">Home</Link>
        <Link to="/driver/pending-requests">Requests</Link>
        <Link to="/driver/bookings">My Bookings</Link>
      </>
    );

    if (role === 'ADMIN') return (
      <>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/drivers">Manage Drivers</Link>
        <Link to="/admin/bookings">All Bookings</Link>
      </>
    );
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🚗 Rydora</div>
      <div style={styles.links}>{getLinks()}</div>
      <div style={styles.right}>
        <span style={styles.name}>👤 {name}</span>
        <button
          onClick={handleLogout}
          style={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#1a1a2e',
    color: 'white',
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#f5a623',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  name: {
    color: '#ccc',
    fontSize: '14px',
  },
  logout: {
    padding: '6px 14px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

// Inject link styles globally
const linkStyle = document.createElement('style');
linkStyle.innerHTML = `
  nav a {
    color: #ccc;
    text-decoration: none;
    font-size: 15px;
    padding: 6px 10px;
    border-radius: 4px;
    transition: background 0.2s;
  }
  nav a:hover {
    background: rgba(255,255,255,0.1);
    color: white;
  }
`;
document.head.appendChild(linkStyle);

export default Navbar;
