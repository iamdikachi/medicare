import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Calendar, Clipboard, TrendingUp, Clock, Plus, ArrowUpRight, Activity, Heart, Droplets } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [appRes, recRes] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/records')
        ]);
        if (appRes.ok) setAppointments(await appRes.json());
        if (recRes.ok) setRecords(await recRes.json());
      } catch (err) {
        console.error("Data fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = [
    { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Blood Pressure', value: '120/80', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Blood Glucose', value: '95 mg/dL', icon: Droplets, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-sans font-bold text-gray-900 mb-2 capitalize">
              Welcome, {profile?.displayName?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-gray-600 font-medium">Here's an overview of your health status and appointments.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/doctors"
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> New Consultation
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6"
            >
              <div className={stat.bg + " p-5 rounded-3xl"}>
                <stat.icon className={stat.color + " h-8 w-8"} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-none mb-2">{stat.label}</div>
                <div className="text-3xl font-sans font-bold text-gray-900">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2.5 rounded-2xl">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
                </div>
                <Link to="/appointments" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                  View All <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="font-medium">No upcoming appointments found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((app) => (
                    <div key={app.id} className="group p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="bg-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                          <span className="text-xs font-bold text-blue-600 uppercase mb-0.5">{format(new Date(app.dateTime), 'MMM')}</span>
                          <span className="text-lg font-bold text-gray-900 leading-none">{format(new Date(app.dateTime), 'dd')}</span>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 tracking-tight mb-0.5">{app.docName || 'Consultation'}</div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1 text-blue-600 font-bold">{app.specialty}</span>
                            <span className="hidden sm:block w-1.5 h-1.5 bg-gray-300 rounded-full" />
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {format(new Date(app.dateTime), 'hh:mm a')}</span>
                            <span className="hidden sm:block w-1.5 h-1.5 bg-gray-300 rounded-full" />
                            <span className="capitalize">{app.status}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-all shadow-sm">
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Health Record Summary */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2.5 rounded-2xl">
                    <Clipboard className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Medical Records</h2>
                </div>
                <Link to="/records" className="text-sm font-bold text-purple-600 hover:underline flex items-center gap-1">
                  View Full History <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {records.length === 0 ? (
                 <div className="text-center py-12 text-gray-400">
                  <p className="font-medium">No recent records available.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                   {records.slice(0, 4).map((record) => (
                    <div key={record.id} className="p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-purple-100 hover:bg-purple-50/30 transition-all">
                      <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">{record.type}</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{record.title}</h4>
                      <p className="text-sm text-gray-500 font-medium mb-4">{format(new Date(record.date), 'MMMM dd, yyyy')}</p>
                      <button className="text-xs font-bold text-gray-900 flex items-center gap-1 hover:gap-2 transition-all">
                        VIEW DETAILS <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Recommendations or Plan Info */}
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-sm font-bold text-blue-400 uppercase tracking-widst mb-4">Subscription Plan</div>
                <h3 className="text-3xl font-sans font-bold mb-6">MediCare <br />{profile?.subscriptionTier === 'premium' ? 'Premium' : profile?.subscriptionTier === 'basic' ? 'Basic' : 'Free'}</h3>
                <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                  {profile?.subscriptionTier === 'premium' 
                    ? "You have full access to all features including 24/7 video consultations." 
                    : "Upgrade your plan to get unlimited consultations and faster doctor responses."}
                </p>
                <button className="w-full bg-white text-gray-900 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-black/20">
                  Manage Subscription
                </button>
              </div>
              <Activity className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white">
              <div className="bg-white/20 p-3 rounded-2xl w-fit mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Daily Tip</h3>
              <p className="text-blue-100 font-medium leading-relaxed opacity-90">
                Regular hydration is key to maintaining healthy blood pressure levels. Aim for at least 8 glasses of water a day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
