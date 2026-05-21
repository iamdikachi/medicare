import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Activity, 
  Calendar, 
  Clipboard, 
  Users, 
  MessageCircle, 
  HelpCircle,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Settings,
  CreditCard,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const navigation = profile?.role === 'doctor' 
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Schedule', href: '/appointments', icon: Calendar },
        { name: 'Patient Records', href: '/records', icon: Clipboard },
        { name: 'Messages', href: '/messages', icon: MessageCircle },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Find Doctors', href: '/doctors', icon: Users },
        { name: 'My Appointments', href: '/appointments', icon: Calendar },
        { name: 'Messages', href: '/messages', icon: MessageCircle },
        { name: 'Health Records', href: '/records', icon: Clipboard },
      ];

  const secondaryNav = [
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Support', href: '/support', icon: HelpCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (!user) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 flex flex-col h-screen z-50 transition-transform lg:translate-x-0 lg:sticky lg:top-0 h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      {/* Brand */}
      <div className="p-8 pb-10">
        <Link 
          to="/dashboard" 
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-all shadow-lg shadow-blue-100">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="font-sans font-black text-2xl tracking-tighter text-gray-900">
            MediCare
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">
          Main Menu
        </div>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"
              )} />
              {item.name}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        <div className="pt-10 pb-4">
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">
            Preferences
          </div>
          {secondaryNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group",
                  isActive 
                    ? "bg-gray-900 text-white shadow-xl" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"
                )} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Trust Badges */}
      <div className="px-8 py-6 border-t border-gray-50">
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            <Shield className="h-3 w-3 text-emerald-500" />
            Secure-Data Protection
         </div>
      </div>
    </aside>
    </>
  );
}
