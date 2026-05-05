import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Camera, CreditCard, Save, AlertCircle, CheckCircle2, ChevronRight, Shield, Phone, Droplet, Thermometer, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [subscriptionTier, setSubscriptionTier] = useState(user?.subscriptionTier || 'free');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  const [bloodType, setBloodType] = useState(user?.bloodType || '');
  const [allergies, setAllergies] = useState(user?.allergies || '');
  const [chronicConditions, setChronicConditions] = useState(user?.chronicConditions || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile({ 
        displayName, photoURL, subscriptionTier,
        emergencyContact, bloodType, allergies, chronicConditions 
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const tiers = [
    { id: 'free', name: 'Basic', price: '$0', features: ['Standard Appointments', 'Digital Records'] },
    { id: 'pro', name: 'MediCare Pro', price: '$19/mo', features: ['Priority Booking', 'Unlimited Storage', 'AI Health Tips'] },
    { id: 'premium', name: 'MediCare Elite', price: '$49/mo', features: ['24/7 Concierge', 'Home Lab Tests', 'Family Plan'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-900 p-12 text-white relative">
             <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-white/10 group-hover:ring-white/30 transition-all">
                    <img src={user?.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-blue-600 p-2.5 rounded-2xl shadow-xl hover:bg-blue-700 transition-all group-hover:scale-110">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-bold mb-2 tracking-tight">{user?.displayName}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className="text-gray-400 font-medium">{user?.email}</span>
                    <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-blue-600/30">
                      {user?.subscriptionTier}
                    </span>
                  </div>
                </div>
             </div>
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
          </div>

          <div className="p-12">
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

            <form onSubmit={handleSubmit} className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-blue-50 p-2 rounded-xl">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Basic Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Profile Photo URL</label>
                    <div className="relative">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-rose-50 p-2 rounded-xl">
                    <Shield className="h-5 w-5 text-rose-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Medical Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Emergency Contact</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                        placeholder="Name or Phone number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Blood Type</label>
                    <div className="relative">
                      <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 appearance-none"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Allergies</label>
                    <div className="relative">
                      <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                        placeholder="e.g. Peanuts, Penicillin"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Chronic Conditions</label>
                    <div className="relative">
                      <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={chronicConditions}
                        onChange={(e) => setChronicConditions(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                        placeholder="e.g. Diabetes, Hypertension"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-purple-50 p-2 rounded-xl">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Subscription Plan</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {tiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSubscriptionTier(tier.id)}
                      className={cn(
                        "text-left p-6 rounded-3xl border-2 transition-all group relative overflow-hidden",
                        subscriptionTier === tier.id 
                          ? "border-blue-600 bg-blue-50/50" 
                          : "border-gray-100 bg-white hover:border-gray-200"
                      )}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-gray-900">{tier.name}</div>
                        {subscriptionTier === tier.id && (
                          <div className="bg-blue-600 rounded-full p-1">
                             <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-6">{tier.price}</div>
                      <ul className="space-y-2">
                         {tier.features.map((f, i) => (
                           <li key={i} className="text-xs text-gray-500 font-medium flex items-center gap-2">
                             <div className="w-1 h-1 bg-gray-300 rounded-full" /> {f}
                           </li>
                         ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </section>

              <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-400 font-medium">Last updated: {new Date(user?.createdAt).toLocaleDateString()}</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
