import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Mail, Lock, User, UserPlus, AlertCircle, Activity } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
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
