import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, User as UserIcon, LogOut, Calendar, Clipboard, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Header() {
  const { user, profile, login, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Doctors', href: '/doctors', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Records', href: '/records', icon: Clipboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-gray-900">
            MediCare
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-1.5",
                location.pathname === item.href ? "text-blue-600" : "text-gray-600"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <div className="flex flex-col items-end mr-1">
                  <span className="text-sm font-medium text-gray-900 leading-none">
                    {profile?.displayName || 'User'}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600">
                    {profile?.subscriptionTier || 'Free'}
                  </span>
                </div>
                <img
                  src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                  alt="Avatar"
                  className="h-9 w-9 rounded-full ring-2 ring-blue-50 group-hover:ring-blue-100 transition-all"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors px-4 py-2"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
