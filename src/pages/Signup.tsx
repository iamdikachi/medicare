import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Mail, Lock, User, UserPlus, AlertCircle, Activity, Eye, EyeOff, Stethoscope } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Signup() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  
  const [role, setRole] = useState<'patient' | 'doctor'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl mb-6">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join MediCare</h1>
          <p className="text-gray-500 font-medium tracking-tight">Access quality healthcare digitally</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 mb-6 text-sm font-medium">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3 mb-8">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">I am signing up as a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group",
                  role === 'patient' 
                    ? "border-blue-600 bg-blue-50/50" 
                    : "border-gray-100 bg-gray-50 hover:border-blue-200"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  role === 'patient' ? "bg-blue-600 text-white" : "bg-white text-gray-400 group-hover:text-blue-500"
                )}>
                  <User className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  role === 'patient' ? "text-blue-900" : "text-gray-500"
                )}>Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group",
                  role === 'doctor' 
                    ? "border-emerald-600 bg-emerald-50/50" 
                    : "border-gray-100 bg-gray-50 hover:border-emerald-200"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  role === 'doctor' ? "bg-emerald-600 text-white" : "bg-white text-gray-400 group-hover:text-emerald-500"
                )}>
                  <Stethoscope className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  role === 'doctor' ? "text-emerald-900" : "text-gray-500"
                )}>Doctor</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-white",
              role === 'doctor' 
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
            )}
          >
            {loading ? "Creating account..." : <><UserPlus className="h-5 w-5" /> Create Account</>}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest bg-white px-4 text-gray-400">Or sign up with</div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
            Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
}
