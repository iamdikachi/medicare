import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/common/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import HealthRecords from './pages/HealthRecords';

function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Appointments</h1>
        <p className="text-gray-600">This feature is coming soon. Please check your Dashboard for upcoming consultations.</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={user ? <AppointmentsPage /> : <Navigate to="/" />} />
            <Route path="/records" element={user ? <HealthRecords /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

