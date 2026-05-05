import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bell, 
  Search, 
  Menu, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  ChevronDown,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, profile, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="h-20 bg-white border-b border-gray-100 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Brand for mobile */}
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2 mr-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
        </Link>
        
        {/* Search Bar - Hidden on small mobile */}
        <div className="hidden sm:flex items-center max-w-md w-full relative">
          <Search className="absolute left-4 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/10 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Notifications */}
        <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative group">
          <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-50 rounded-2xl transition-all group"
          >
            <div className="relative">
              <img
                src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                alt="Profile"
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-white shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                {profile?.displayName?.split(' ')[0] || 'User'}
              </p>
              <p className="text-[10px] uppercase font-black text-blue-600 tracking-tighter opacity-80 leading-none">
                {profile?.subscriptionTier || 'Free Member'}
              </p>
            </div>
            
            <ChevronDown className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isDropdownOpen && "rotate-180"
            )} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 py-3 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-gray-50 mb-2">
                  <p className="text-sm font-bold text-gray-900">{profile?.displayName || 'User'}</p>
                  <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
                </div>
                
                <div className="px-2 space-y-1">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl transition-all"
                  >
                    <UserIcon className="h-4 w-4" />
                    My Profile
                  </Link>
                  <Link 
                    to="/appointments" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl transition-all"
                  >
                    <Activity className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl transition-all"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-50 px-2">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
