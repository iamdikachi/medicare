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
    description: 'Essential health tracking for individuals taking their first steps.',
    features: [
      { text: 'Digital Health Records', included: true },
      { text: 'Appointment Scheduling', included: true },
      { text: 'Basic Profile Management', included: true },
      { text: 'Community Forum Access', included: true },
      { text: 'Priority Support', included: false },
      { text: 'Video Consultations', included: false },
    ],
    icon: Shield,
    color: 'gray'
  },
  {
    id: 'basic',
    name: 'Basic Health',
    price: '$9.99',
    description: 'Perfect for active individuals who need priority access and more tracking.',
    features: [
      { text: 'Unlimited Health Records', included: true },
      { text: 'Priority Booking & Queues', included: true },
      { text: 'Video Consultation (1/mo)', included: true },
      { text: 'Health Trends & Stats', included: true },
      { text: 'Family Care Linking', included: false },
      { text: '24/7 Concierge', included: false },
    ],
    icon: Zap,
    color: 'blue',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Care',
    price: '$24.99',
    description: 'The ultimate healthcare suite for comprehensive family management.',
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Unlimited Consultations', included: true },
      { text: 'Dedicated Health Concierge', included: true },
      { text: 'Early Access to New Tech', included: true },
      { text: 'Advanced Genetic Reports', included: true },
      { text: 'Family Support Plan', included: true },
    ],
    icon: Crown,
    color: 'purple'
  }
];

export default function Subscription() {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: '**** **** **** 4242',
    expiry: '12/26',
    address: '123 Medical Drive, Health City, HC 12345'
  });

  const currentTier = profile?.subscriptionTier || 'free';

  const handleUpgrade = async (tierId: string) => {
    if (tierId === currentTier) return;
    
    // If upgrading from free to something else, maybe show a "billing first" step
    // but for this demo we'll assume it's "robustly" handled by updating the profile
    
    setLoading(tierId);
    try {
      await updateProfile({ 
        subscriptionTier: tierId,
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date().toISOString()
      });
      // In a real app, this would trigger a payment gateway
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setLoading(null);
    }
  };

  const BILLING_HISTORY = [
    { id: 'inv_1', date: '2026-05-05', amount: currentTier === 'free' ? '$0.00' : PLANS.find(p => p.id === currentTier)?.price, status: 'Paid' },
    { id: 'inv_2', date: '2026-04-05', amount: '$0.00', status: 'Paid' },
    { id: 'inv_3', date: '2026-03-05', amount: '$0.00', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <Link to="/profile" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 mb-4">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Profile
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Subscription & Billing</h1>
          <p className="text-gray-500 font-medium">Upgrade your healthcare experience with personalized plans designed for your unique needs and family support.</p>
        </div>

        {/* Current Plan Hero */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full -mr-40 -mt-40 blur-3xl transition-transform group-hover:scale-110 duration-700"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="flex items-start gap-8">
              <div className={cn(
                "h-24 w-24 rounded-[2.5rem] flex items-center justify-center shadow-lg transition-all shrink-0",
                currentTier === 'free' ? "bg-gray-50 text-gray-400" :
                currentTier === 'basic' ? "bg-blue-600 text-white shadow-blue-200" :
                "bg-purple-600 text-white shadow-purple-200"
              )}>
                {currentTier === 'free' ? <Shield className="h-12 w-12" /> :
                 currentTier === 'basic' ? <Zap className="h-12 w-12" /> :
                 <Crown className="h-12 w-12" />}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Active Plan</p>
                  <h2 className="text-4xl font-black text-gray-900 capitalize leading-none">{currentTier} Plan</h2>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                   <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                     <Calendar className="h-4 w-4 text-gray-400" />
                     Renewing Monthly
                   </div>
                   <div className="flex items-center gap-2 text-sm font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                     <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                     Active Status
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
               <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 w-full sm:w-auto">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Next Billing Cycle</p>
                 <p className="text-xl font-black text-gray-900">June 5th, 2026</p>
                 <p className="text-xs font-medium text-gray-500 mt-1">Automatic renewal enabled</p>
               </div>
               <button 
                 onClick={() => setShowBillingModal(true)}
                 className="px-8 py-5 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto"
               >
                 Manage Billing
               </button>
            </div>
          </div>
        </div>

        {/* Benefits Highlight */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: 'Priority Support', desc: 'Average response time < 2 hours', icon: Zap },
             { label: 'Family Coverage', desc: 'Secure health tracking for up to 5 members', icon: Crown },
             { label: 'Smart Insights', desc: 'AI-driven health trend analysis', icon: Sparkles },
           ].map((item, idx) => (
             <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-colors">
               <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                 <item.icon className="h-6 w-6 text-blue-600" />
               </div>
               <div>
                  <h4 className="font-black text-gray-900 text-sm">{item.label}</h4>
                  <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
               </div>
             </div>
           ))}
        </div>

        {/* Plan Selection */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -10 }}
              className={cn(
                "bg-white rounded-[2.5rem] p-8 border transition-all flex flex-col relative overflow-hidden",
                plan.id === currentTier 
                  ? "border-blue-600 ring-4 ring-blue-600/5" 
                  : "border-gray-100 hover:border-blue-200 shadow-sm"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-blue-200 z-10 whitespace-nowrap">
                  <Sparkles className="h-3 w-3" />
                  Recommended
                </div>
              )}

              <div className="mb-10">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm",
                  plan.color === 'blue' ? "bg-blue-50 text-blue-600" :
                  plan.color === 'purple' ? "bg-purple-50 text-purple-600" :
                  "bg-gray-50 text-gray-400"
                )}>
                  <plan.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                   <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                   <span className="text-sm font-bold text-gray-400">/mo</span>
                </div>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Core Benefits</p>
                 {plan.features.map((feature, idx) => (
                   <div key={idx} className={cn(
                     "flex items-center gap-3 transition-opacity",
                     !feature.included && "opacity-40"
                   )}>
                     <div className={cn(
                       "h-6 w-6 rounded-lg flex items-center justify-center",
                       feature.included 
                        ? (plan.id === currentTier ? "bg-blue-50" : "bg-emerald-50") 
                        : "bg-gray-50"
                     )}>
                       {feature.included ? (
                        <Check className={cn(
                          "h-3.5 w-3.5",
                          plan.id === currentTier ? "text-blue-600" : "text-emerald-500"
                        )} />
                       ) : (
                        <div className="h-1 w-1 bg-gray-300 rounded-full" />
                       )}
                     </div>
                     <span className={cn(
                       "text-sm font-bold",
                       feature.included 
                        ? (plan.id === currentTier ? "text-blue-900" : "text-gray-700") 
                        : "text-gray-400"
                     )}>{feature.text}</span>
                   </div>
                 ))}
              </div>

              <button
                disabled={loading !== null || plan.id === currentTier}
                onClick={() => handleUpgrade(plan.id)}
                className={cn(
                  "w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition-all relative overflow-hidden",
                  plan.id === currentTier 
                    ? "bg-blue-50 text-blue-600 cursor-default border border-blue-100" 
                    : plan.popular
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95"
                      : "bg-gray-900 text-white hover:bg-black active:scale-95 shadow-xl shadow-gray-200"
                )}
              >
                {loading === plan.id ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                ) : plan.id === currentTier ? (
                  "Currently Subscribed"
                ) : (
                  `Upgrade to ${plan.id}`
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Section */}
        <div className="mb-20">
           <div className="text-center mb-12">
              <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Compare All Features</h3>
              <p className="text-gray-500 font-medium">Detailed breakdown of why medical professionals recommend Premium.</p>
           </div>
           
           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">Health Feature</th>
                       <th className="py-8 px-10 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Free</th>
                       <th className="py-8 px-10 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest bg-blue-50/30">Basic</th>
                       <th className="py-8 px-10 text-center text-[10px] font-black text-purple-600 uppercase tracking-widest">Premium</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {[
                       { name: 'Digital Health Vault', free: 'Basic', basic: 'Unlimited', premium: 'Unlimited+' },
                       { name: 'Video Consultations', free: 'Pay-per-use', basic: '1 Monthly', premium: 'Unlimited' },
                       { name: 'Lab Result Analysis', free: 'Manual', basic: 'Automated', premium: 'Expert Review' },
                       { name: 'Emergency Support', free: 'Standard', basic: 'Priority', premium: 'Concierge' },
                       { name: 'Family Linking', free: 'Not included', basic: 'Up to 2', premium: 'Up to 5' },
                       { name: 'Medical Wearable Sync', free: 'No', basic: 'Yes', premium: 'Advanced' },
                    ].map((row, idx) => (
                       <tr key={idx} className="group hover:bg-gray-50/30 transition-colors">
                          <td className="py-6 px-10 font-bold text-gray-900 text-sm">{row.name}</td>
                          <td className="py-6 px-10 text-center font-medium text-gray-500 text-sm">{row.free}</td>
                          <td className="py-6 px-10 text-center font-bold text-blue-600 text-sm bg-blue-50/10 group-hover:bg-blue-50/20">{row.basic}</td>
                          <td className="py-6 px-10 text-center font-black text-purple-700 text-sm uppercase tracking-widest">{row.premium}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Billing History & Invoices */}
        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm mb-12">
           <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Billing History</h3>
                <p className="text-gray-500 font-medium text-sm">Download invoices and track your payments.</p>
              </div>
              <button className="text-blue-600 font-bold text-sm hover:underline">Download All (PDF)</button>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="border-b border-gray-50">
                   <th className="text-left pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoices</th>
                   <th className="text-left pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                   <th className="text-left pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                   <th className="text-left pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                   <th className="text-right pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                 </tr>
               </thead>
               <tbody>
                 {BILLING_HISTORY.map((invoice, idx) => (
                   <tr key={idx} className="group border-b border-gray-50/50 last:border-0">
                     <td className="py-6">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                              <CreditCard className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                           </div>
                           <span className="font-bold text-gray-900">{invoice.id}</span>
                        </div>
                     </td>
                     <td className="py-6 font-medium text-gray-500">{invoice.date}</td>
                     <td className="py-6 font-bold text-gray-900">{invoice.amount}</td>
                     <td className="py-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {invoice.status}
                        </span>
                     </td>
                     <td className="py-6 text-right">
                        <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">Download</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Help Panel */}
        <div className="bg-blue-600 rounded-[3rem] p-10 md:p-14 relative overflow-hidden text-white">
           <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl" />
           <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                 <h4 className="text-3xl font-black mb-4">Enterprise Solutions?</h4>
                 <p className="text-blue-100 font-medium leading-relaxed mb-8">
                   Do you manage a medical team or a clinic? We offer specialized enterprise packages with comprehensive dashboard controls and volume discounts.
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20">
                       Contact Sales
                    </button>
                    <button className="bg-blue-700 text-white border border-blue-500 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 transition-all">
                       Learn More
                    </button>
                 </div>
              </div>
              <div className="h-48 w-48 bg-white/10 rounded-[3rem] backdrop-blur-2xl flex items-center justify-center p-8 border border-white/20">
                 <Sparkles className="h-full w-full text-blue-200" />
              </div>
           </div>
        </div>
      </div>

      {/* Billing Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBillingModal(false)}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 overflow-hidden"
          >
            <button 
              onClick={() => setShowBillingModal(false)}
              className="absolute top-8 right-8 p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </button>

            <h3 className="text-3xl font-black text-gray-900 mb-2">Payment Settings</h3>
            <p className="text-gray-500 font-medium mb-10">Manage your secure payment sources and billing address.</p>

            <div className="space-y-8">
               <div className="space-y-4">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Payment Method</label>
                 <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{billingInfo.cardNumber}</p>
                        <p className="text-xs text-gray-500 font-medium">Expires {billingInfo.expiry}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 font-bold text-sm">Update</button>
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Billing Address</label>
                 <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start justify-between">
                    <p className="text-sm font-bold text-gray-700 leading-relaxed max-w-[250px]">
                      {billingInfo.address}
                    </p>
                    <button className="text-blue-600 font-bold text-sm">Edit</button>
                 </div>
               </div>

               <div className="pt-6 flex flex-col gap-4">
                  <button 
                    onClick={() => setShowBillingModal(false)}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
                  >
                    Save Changes
                  </button>
                  <p className="text-center text-[10px] text-gray-400 font-bold flex items-center justify-center gap-2">
                    <Shield className="h-3 w-3" />
                    256-bit SSL encrypted & PCI-DSS compliant
                  </p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
