import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  Check, 
  Zap, 
  Shield, 
  Crown, 
  CreditCard, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    id: 'free',
    name: 'Free Member',
    price: '$0',
    description: 'Basic health tracking for individuals.',
    features: [
      'Basic Health Records',
      'Community Forum Access',
      'Standard Appointment Booking',
      'Basic Profile'
    ],
    icon: Shield,
    color: 'gray'
  },
  {
    id: 'basic',
    name: 'Basic Health',
    price: '$9.99',
    description: 'Enhanced features for active health monitoring.',
    features: [
      'Everything in Free',
      'Unlimited Health Records',
      'Priority Support',
      'Video Consultation (1/mo)',
      'Health Statistics'
    ],
    icon: Zap,
    color: 'blue',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Care',
    price: '$24.99',
    description: 'Complete healthcare management suite.',
    features: [
      'Everything in Basic',
      'Unlimited Video Consultation',
      'Personal Health Concierge',
      'Family History Tracking',
      'Early Access to Features'
    ],
    icon: Crown,
    color: 'purple'
  }
];

export default function Subscription() {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const currentTier = profile?.subscriptionTier || 'free';

  const handleUpgrade = async (tierId: string) => {
    if (tierId === currentTier) return;
    
    setLoading(tierId);
    try {
      await updateProfile({ subscriptionTier: tierId });
      // In a real app, this would trigger a payment gateway
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <Link to="/profile" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 mb-4">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Profile
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Subscription Management</h1>
          <p className="text-gray-500 font-medium">Manage your plan, billing, and access levels.</p>
        </div>

        {/* Current Plan Hero */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className={cn(
                "h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-lg transition-transform",
                currentTier === 'free' ? "bg-gray-50 text-gray-400" :
                currentTier === 'basic' ? "bg-blue-600 text-white shadow-blue-200" :
                "bg-purple-600 text-white shadow-purple-200"
              )}>
                {currentTier === 'free' ? <Shield className="h-10 w-10" /> :
                 currentTier === 'basic' ? <Zap className="h-10 w-10" /> :
                 <Crown className="h-10 w-10" />}
              </div>
              <div>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Your Current Plan</p>
                <h2 className="text-3xl font-black text-gray-900 mb-2 capitalize">{currentTier} Plan</h2>
                <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                   <div className="flex items-center gap-2">
                     <Calendar className="h-4 w-4 text-gray-400" />
                     Billed Monthly
                   </div>
                   <div className="flex items-center gap-2 text-emerald-500">
                     <CreditCard className="h-4 w-4" />
                     Status: Active
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
               <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Next Billing Date</p>
                 <p className="text-sm font-bold text-gray-900">June 5th, 2026</p>
               </div>
            </div>
          </div>
        </div>

        {/* Plan Options */}
        <div className="grid lg:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -10 }}
              className={cn(
                "bg-white rounded-[2.5rem] p-8 border transition-all flex flex-col",
                plan.id === currentTier ? "border-blue-600 ring-4 ring-blue-600/5" : "border-gray-100 hover:border-blue-200 shadow-sm",
                plan.popular && "relative"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center mb-6",
                  plan.color === 'blue' ? "bg-blue-50 text-blue-600" :
                  plan.color === 'purple' ? "bg-purple-50 text-purple-600" :
                  "bg-gray-50 text-gray-400"
                )}>
                  <plan.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                   <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                   <span className="text-sm font-bold text-gray-400">/month</span>
                </div>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">What's included</p>
                 {plan.features.map((feature, idx) => (
                   <div key={idx} className="flex items-center gap-3">
                     <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center">
                       <Check className="h-3 w-3 text-emerald-500" />
                     </div>
                     <span className="text-sm font-bold text-gray-700">{feature}</span>
                   </div>
                 ))}
              </div>

              <button
                disabled={loading !== null || plan.id === currentTier}
                onClick={() => handleUpgrade(plan.id)}
                className={cn(
                  "w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all relative overflow-hidden",
                  plan.id === currentTier 
                    ? "bg-gray-50 text-gray-400 cursor-default" 
                    : plan.popular
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95"
                      : "bg-gray-900 text-white hover:bg-black active:scale-95 shadow-xl shadow-gray-200"
                )}
              >
                {loading === plan.id ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                ) : plan.id === currentTier ? (
                  "Current Plan"
                ) : (
                  `Switch to ${plan.id}`
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table Link & Help */}
        <div className="mt-20 bg-blue-50 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-100/50">
           <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Info className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Need help choosing?</h4>
                <p className="text-sm font-medium text-gray-600">Compare all features and see which plan fits your lifestyle.</p>
              </div>
           </div>
           <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all border border-blue-100 shadow-sm whitespace-nowrap">
             View Comparison Matrix
           </button>
        </div>
      </div>
    </div>
  );
}
