import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/UserDashboard';
import SearchDrivers from './pages/user/SearchDrivers';
import MyRequests from './pages/user/MyRequests';
import MyBookings from './pages/user/MyBookings';
import DriverDashboard from './pages/driver/DriverDashboard';
import PendingRequests from './pages/driver/PendingRequests';
import DriverBookings from './pages/driver/DriverBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDrivers from './pages/admin/ManageDrivers';
import AllBookings from './pages/admin/AllBookings';

// Protected route component
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role)
    return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Navigate to="/login" />
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={
          <ProtectedRoute role="USER">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/user/search-drivers" element={
          <ProtectedRoute role="USER">
            <SearchDrivers />
          </ProtectedRoute>
        } />
        <Route path="/user/my-requests" element={
          <ProtectedRoute role="USER">
            <MyRequests />
          </ProtectedRoute>
        } />
        <Route path="/user/my-bookings" element={
          <ProtectedRoute role="USER">
            <MyBookings />
          </ProtectedRoute>
        } />

        {/* Driver Routes */}
        <Route path="/driver/dashboard" element={
          <ProtectedRoute role="DRIVER">
            <DriverDashboard />
          </ProtectedRoute>
        } />
        <Route path="/driver/pending-requests" element={
          <ProtectedRoute role="DRIVER">
            <PendingRequests />
          </ProtectedRoute>
        } />
        <Route path="/driver/bookings" element={
          <ProtectedRoute role="DRIVER">
            <DriverBookings />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/drivers" element={
          <ProtectedRoute role="ADMIN">
            <ManageDrivers />
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute role="ADMIN">
            <AllBookings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
