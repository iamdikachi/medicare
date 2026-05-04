import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/common/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Appointments from './pages/Appointments';
import HealthRecords from './pages/HealthRecords';
import Login from './pages/Login';
import Signup from './pages/Signup';


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
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/appointments" element={user ? <Appointments /> : <Navigate to="/login" />} />
            <Route path="/records" element={user ? <HealthRecords /> : <Navigate to="/login" />} />
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

