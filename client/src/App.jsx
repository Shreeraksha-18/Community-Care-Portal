import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import CarePortal from './components/CarePortal.jsx';
import DonorDashboard from './components/DonorDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

export default function App() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa' }}>
      <Routes>
        {/* Landing Page with integrated auth drawer */}
        <Route path="/" element={<LandingPage />} />

        {/* Volunteer / General Portal Routes */}
        <Route
          path="/portal"
          element={<CarePortal onBackToHome={() => navigate('/')} />}
        />
        <Route
          path="/volunteer"
          element={<CarePortal onBackToHome={() => navigate('/')} />}
        />

        {/* Donor Hub Routes */}
        <Route
          path="/donor"
          element={<DonorDashboard onBackToHome={() => navigate('/')} />}
        />

        {/* Admin Console Routes */}
        <Route
          path="/admin"
          element={<AdminDashboard onBackToHome={() => navigate('/')} />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
