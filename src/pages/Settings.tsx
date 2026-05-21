import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Shield, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff,
  Bell,
  Smartphone,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('en');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    analytics: true,
    publicProfile: false
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Mock save delay
    setTimeout(() => {
      setLoading(false);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-12 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            App Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">
            Manage your account security, appearance, and privacy preferences
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
        >
          <div className="p-10 md:p-12">
            {error && (
              <div className="mb-8 bg-rose-50 text-rose-600 p-5 rounded-2xl flex items-center gap-3 text-sm font-medium border border-rose-100">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-8 bg-green-50 text-green-600 p-5 rounded-2xl flex items-center gap-3 text-sm font-medium border border-green-100">
                <CheckCircle2 className="h-5 w-5" />
                {success}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-12">
              
              {/* Appearance */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-indigo-50 dark:bg-indigo-500/10 p-2 rounded-xl">
                    <Sun className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Appearance</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all",
                      theme === 'light' ? "border-blue-600 bg-blue-50/50" : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                  >
                    <Sun className={cn("h-8 w-8 mb-3", theme === 'light' ? "text-blue-600" : "text-gray-400")} />
                    <span className={cn("font-bold", theme === 'light' ? "text-blue-600" : "text-gray-500")}>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all",
                      theme === 'dark' ? "border-blue-600 bg-blue-50/50" : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                  >
                    <Moon className={cn("h-8 w-8 mb-3", theme === 'dark' ? "text-blue-600" : "text-gray-400")} />
                    <span className={cn("font-bold", theme === 'dark' ? "text-blue-600" : "text-gray-500")}>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all col-span-2 md:col-span-1",
                      theme === 'system' ? "border-blue-600 bg-blue-50/50" : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                  >
                    <Smartphone className={cn("h-8 w-8 mb-3", theme === 'system' ? "text-blue-600" : "text-gray-400")} />
                    <span className={cn("font-bold", theme === 'system' ? "text-blue-600" : "text-gray-500")}>System</span>
                  </button>
                </div>
              </section>

              {/* Security */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-rose-50 p-2 rounded-xl">
                    <Shield className="h-5 w-5 text-rose-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Security</h2>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-3xl space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-white border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                        placeholder="Enter current password"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-white border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Privacy */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-emerald-50 p-2 rounded-xl">
                    <Eye className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Privacy</h2>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all">
                    <div>
                      <span className="block text-sm font-bold text-gray-900 mb-1">Public Profile</span>
                      <span className="block text-xs font-medium text-gray-500">Allow other users to see your basic profile information</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={privacySettings.publicProfile}
                      onChange={() => handlePrivacyToggle('publicProfile')}
                      className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-600 transition-all"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all">
                    <div>
                      <span className="block text-sm font-bold text-gray-900 mb-1">Data Sharing</span>
                      <span className="block text-xs font-medium text-gray-500">Share anonymous data for medical research purposes</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={privacySettings.dataSharing}
                      onChange={() => handlePrivacyToggle('dataSharing')}
                      className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-600 transition-all"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all">
                    <div>
                      <span className="block text-sm font-bold text-gray-900 mb-1">Usage Analytics</span>
                      <span className="block text-xs font-medium text-gray-500">Help us improve the app by sending crash reports</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={privacySettings.analytics}
                      onChange={() => handlePrivacyToggle('analytics')}
                      className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-600 transition-all"
                    />
                  </label>
                </div>
              </section>

              {/* Language & Region */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-amber-50 p-2 rounded-xl">
                    <Globe className="h-5 w-5 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Language & Region</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Language</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 appearance-none"
                      >
                        <option value="en">English (US)</option>
                        <option value="uk">English (UK)</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-8 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
