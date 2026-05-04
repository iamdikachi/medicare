import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, ChevronRight, AlertCircle, CheckCircle2, History, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface Appointment {
  id: string;
  doctorId: string;
  docName?: string;
  specialty?: string;
  dateTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user]);

  const upcoming = appointments
    .filter(a => new Date(a.dateTime) >= new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const past = appointments
    .filter(a => new Date(a.dateTime) < new Date() || a.status === 'cancelled')
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">My Appointments</h1>
            <p className="text-gray-500 font-medium tracking-tight">Manage your upcoming and past consultations</p>
          </div>
          <Link 
            to="/doctors"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 whitespace-nowrap"
          >
            Book New Consultation
          </Link>
        </div>

        <div className="space-y-12">
          {/* Upcoming Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-xl">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Upcoming</h2>
            </div>
            
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <Calendar className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-medium mb-6">No upcoming appointments scheduled.</p>
                <Link to="/doctors" className="text-blue-600 font-bold hover:underline">Find a doctor now</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                        <Stethoscope className="h-3.5 w-3.5" />
                        {app.specialty || 'General Consultation'}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{app.docName || 'Specialist Doctor'}</h3>
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500 mt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {format(new Date(app.dateTime), 'EEEE, MMMM do')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {format(new Date(app.dateTime), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                        app.status === 'confirmed' ? "bg-green-50 text-green-600" :
                        app.status === 'pending' ? "bg-amber-50 text-amber-600" :
                        "bg-gray-50 text-gray-400"
                      )}>
                        {app.status}
                      </div>
                      <Link 
                        to={`/doctors/${app.doctorId}`}
                        className="p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-gray-100 shadow-sm"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Past Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-100 p-2 rounded-xl">
                <History className="h-5 w-5 text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">History</h2>
            </div>

            {past.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium ml-1">No past appointments recorded.</p>
            ) : (
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Doctor</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {past.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold text-gray-900">{app.docName || 'Doctor'}</div>
                            <div className="text-xs text-gray-400 font-medium">{app.specialty}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-sm font-bold text-gray-700">{format(new Date(app.dateTime), 'MMM d, yyyy')}</div>
                            <div className="text-xs text-gray-400 font-medium">{format(new Date(app.dateTime), 'h:mm a')}</div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg",
                              app.status === 'completed' ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"
                            )}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">View Notes</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
