import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import CarePortal from './components/CarePortal.jsx';
import DonorDashboard from './components/DonorDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch (e) {
    return null;
  }
}

// Home route:
// - If user is NOT logged in: displays Landing Page (with Sign in and Register)
// - If user IS logged in: acts as the home page for their role and opens their Dashboard!
function HomeRoute() {
  const user = getLoggedInUser();
  if (!user) {
    return <LandingPage />;
  }
  if (user.role === 'donor') {
    return <Navigate to="/donor" replace />;
  }
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/volunteer" replace />;
}

// Protected route wrapper:
// - If not logged in, redirect to "/" (Landing Page / Sign in)
// - If logged in with another role, redirect to user's assigned role dashboard
function ProtectedRoute({ allowedRole, children }) {
  const user = getLoggedInUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRole && user.role !== allowedRole) {
    const target = user.role === 'donor' ? '/donor' : user.role === 'admin' ? '/admin' : '/volunteer';
    return <Navigate to={target} replace />;
  }
  return children;
}

export default function App() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa', overflow: 'hidden', maxWidth: '100vw' }}>
      <Routes>
        {/* Home route: LandingPage when not logged in, Role Dashboard when logged in */}
        <Route path="/" element={<HomeRoute />} />

        {/* Volunteer / General Portal Routes */}
        <Route
          path="/portal"
          element={
            <ProtectedRoute allowedRole="volunteer">
              <CarePortal onBackToHome={() => navigate('/')} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute allowedRole="volunteer">
              <CarePortal onBackToHome={() => navigate('/')} />
            </ProtectedRoute>
          }
        />

        {/* Donor Hub Routes */}
        <Route
          path="/donor"
          element={
            <ProtectedRoute allowedRole="donor">
              <DonorDashboard onBackToHome={() => navigate('/')} />
            </ProtectedRoute>
          }
        />

        {/* Admin Console Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard onBackToHome={() => navigate('/')} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
