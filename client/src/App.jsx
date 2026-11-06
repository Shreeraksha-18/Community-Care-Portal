import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AuthModule from './components/AuthModule.jsx';
import CarePortal from './components/CarePortal.jsx';
import DonorDashboard from './components/DonorDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

export default function App() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa' }}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthModule initialMode="login" />} />
        <Route path="/login" element={<AuthModule initialMode="login" />} />
        <Route path="/register" element={<AuthModule initialMode="signup" />} />

        {/* Volunteer / General Portal Routes */}
        <Route
          path="/portal/*"
          element={<CarePortal onBackToHome={() => navigate('/')} />}
        />
        <Route
          path="/volunteer/*"
          element={<CarePortal onBackToHome={() => navigate('/')} />}
        />

        {/* Donor Hub Routes */}
        <Route
          path="/donor/*"
          element={<DonorDashboard onBackToHome={() => navigate('/')} />}
        />

        {/* Admin Console Routes */}
        <Route
          path="/admin/*"
          element={<AdminDashboard onBackToHome={() => navigate('/')} />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
