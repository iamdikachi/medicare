import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/common/Header';
import DashboardHeader from './components/common/DashboardHeader';
import Sidebar from './components/common/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import HealthRecords from './pages/HealthRecords';
import Messages from './pages/Messages';
import VideoCall from './pages/VideoCall';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Subscription from './pages/Subscription';
import { useLocation } from 'react-router-dom';
import { cn } from './lib/utils';
import NotificationManager from './components/NotificationManager';


function AppRoutes() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isPublicPage = ['/', '/login', '/signup', '/how-it-works'].includes(location.pathname);
  const showDashboardLayout = user && !isPublicPage;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {user && <NotificationManager />}
      {showDashboardLayout && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {showDashboardLayout ? (
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        ) : (
          <Header 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen}
          />
        )}
        <main className={cn(
          "flex-1 overflow-auto",
          showDashboardLayout ? "bg-gray-50/10" : "bg-white"
        )}>
          <Routes>
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
            <Route path="/video-consultation" element={user ? <VideoCall /> : <Navigate to="/login" />} />
            <Route path="/how-it-works" element={!user ? <HowItWorks /> : <Navigate to="/dashboard" />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/appointments" element={user ? <Appointments /> : <Navigate to="/login" />} />
            <Route path="/records" element={user ? <HealthRecords /> : <Navigate to="/login" />} />
            <Route path="/subscription" element={user ? <Subscription /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

