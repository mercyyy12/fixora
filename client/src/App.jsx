import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import Profile from './pages/Profile';
import Technicians from './pages/Technicians';
import TechnicianProfile from './pages/TechnicianProfile';

// Components
import Navbar from './components/Navbar';
import Loader from './components/Loader';

// Protected route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

// Public-only route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      {user && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected — all roles */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/technicians" element={<ProtectedRoute><Technicians /></ProtectedRoute>} />
        <Route path="/technicians/:id" element={<ProtectedRoute><TechnicianProfile /></ProtectedRoute>} />

        {/* Homeowner only */}
        <Route
          path="/jobs/new"
          element={<ProtectedRoute roles={['homeowner']}><CreateJob /></ProtectedRoute>}
        />
        <Route
          path="/jobs/:id/edit"
          element={<ProtectedRoute roles={['homeowner']}><EditJob /></ProtectedRoute>}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
              style: { borderRadius: '12px', fontFamily: 'DM Sans, sans-serif' },
            }}
          />
        </Router>
      </SocketProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
