import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export default function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/signup', '/how-it-works'].includes(location.pathname);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md",
      user && !isPublicPage ? "lg:hidden" : "block"
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          {user && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-gray-900">
              MediCare
            </span>
          </Link>

          {/* Desktop Public Nav */}
          {!user && (
            <nav className="hidden md:flex items-center ml-8 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-bold transition-colors hover:text-blue-600",
                    location.pathname === link.href ? "text-blue-600" : "text-gray-500"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="hidden sm:flex flex-col items-end mr-1">
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
                  className="h-9 w-9 rounded-full ring-2 ring-blue-50 group-hover:ring-blue-100 transition-all border border-gray-100"
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
