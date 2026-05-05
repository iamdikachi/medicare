import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  History, 
  Stethoscope, 
  Search,
  LayoutList,
  CalendarDays,
  ChevronLeft,
  Info
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  isToday,
  parseISO
} from 'date-fns';
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

type ViewMode = 'list' | 'month' | 'week' | 'day';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments', { credentials: 'include' });
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

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const searchString = searchTerm.toLowerCase();
      return (
        (app.docName || '').toLowerCase().includes(searchString) ||
        (app.specialty || '').toLowerCase().includes(searchString)
      );
    });
  }, [appointments, searchTerm]);

  const upcoming = filteredAppointments
    .filter(a => new Date(a.dateTime) >= new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const past = filteredAppointments
    .filter(a => new Date(a.dateTime) < new Date() || a.status === 'cancelled')
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  // Calendar Logic
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const navigateDate = (direction: 'next' | 'prev') => {
    if (viewMode === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
    }
  };

  const getAppointmentsForDay = (day: Date) => {
    return filteredAppointments.filter(app => isSameDay(parseISO(app.dateTime), day));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">My Appointments</h1>
            <p className="text-gray-500 font-medium tracking-tight">Manage your upcoming and past consultations</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
                viewMode === 'list' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <LayoutList className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all text-nowrap",
                viewMode !== 'list' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </button>
          </div>
          
          <Link 
            to="/doctors"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 whitespace-nowrap"
          >
            Book New Consultation
          </Link>
        </div>

        {/* List View */}
        {viewMode === 'list' ? (
          <>
            {/* Search Bar */}
            <div className="relative mb-12 group max-w-4xl">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by doctor or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-100 pl-16 pr-6 py-5 rounded-[2rem] font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm shadow-gray-100"
              />
            </div>

            <div className="space-y-12 max-w-4xl">
              {/* Upcoming Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-50 p-2 rounded-xl">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Upcoming</h2>
                </div>
                
                {upcoming.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                    <CalendarIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
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
                              <CalendarIcon className="h-4 w-4 text-gray-400" />
                              {format(parseISO(app.dateTime), 'EEEE, MMMM do')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {format(parseISO(app.dateTime), 'h:mm a')}
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
                                <div className="text-sm font-bold text-gray-700">{format(parseISO(app.dateTime), 'MMM d, yyyy')}</div>
                                <div className="text-xs text-gray-400 font-medium">{format(parseISO(app.dateTime), 'h:mm a')}</div>
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
          </>
        ) : (
          /* Calendar View */
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col min-h-[700px]">
            {/* Calendar Controls */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-gray-900 min-w-[240px]">
                  {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMMM d, yyyy')}
                </h2>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setCurrentDate(new Date())} className="px-4 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors">
                    Today
                  </button>
                  <button onClick={() => navigateDate('next')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex bg-gray-50 p-1 rounded-xl">
                {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                      viewMode === mode ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Content */}
            <div className="flex-1 overflow-auto">
              {viewMode === 'month' && (
                <div className="grid grid-cols-7 h-full">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-4 text-center border-b border-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      {day}
                    </div>
                  ))}
                  {/* Grid */}
                  {monthDays.map((day, idx) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    const isOutside = !isSameMonth(day, currentDate);
                    return (
                      <div 
                        key={idx}
                        onClick={() => dayAppointments.length > 0 && setSelectedDayAppointments(dayAppointments)}
                        className={cn(
                          "min-h-[120px] p-4 border-r border-b border-gray-50 group hover:bg-blue-50/20 transition-colors cursor-pointer",
                          isOutside && "bg-gray-50/30 grayscale opacity-40",
                          isToday(day) && "bg-blue-50/10"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={cn(
                            "text-sm font-bold h-7 w-7 flex items-center justify-center rounded-lg",
                            isToday(day) ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500"
                          )}>
                            {format(day, 'd')}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 3).map(app => (
                            <div key={app.id} className="text-[10px] font-bold py-1 px-2 rounded-lg bg-blue-50 text-blue-700 truncate border border-blue-100 shadow-sm">
                              {format(parseISO(app.dateTime), 'h:mm')} {app.docName}
                            </div>
                          ))}
                          {dayAppointments.length > 3 && (
                            <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest pl-2">
                              + {dayAppointments.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {viewMode === 'week' && (
                <div className="grid grid-cols-7 h-full">
                  {weekDays.map((day, idx) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    return (
                      <div key={idx} className={cn(
                        "min-h-[500px] border-r border-gray-50 flex flex-col",
                        isToday(day) && "bg-blue-50/10"
                      )}>
                        <div className="p-6 border-b border-gray-50 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{format(day, 'EEE')}</p>
                          <p className={cn(
                            "text-xl font-black h-10 w-10 flex items-center justify-center mx-auto rounded-xl",
                            isToday(day) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-900"
                          )}>{format(day, 'd')}</p>
                        </div>
                        <div className="flex-1 p-2 space-y-2">
                          {dayAppointments.map(app => (
                            <motion.div
                              layoutId={app.id}
                              key={app.id}
                              className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                            >
                              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                                {format(parseISO(app.dateTime), 'h:mm a')}
                              </p>
                              <p className="text-xs font-bold text-gray-900 truncate mb-1">{app.docName}</p>
                              <p className="text-[9px] font-medium text-gray-400 truncate uppercase">{app.specialty}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {viewMode === 'day' && (
                <div className="p-8 max-w-3xl mx-auto">
                   <div className="flex items-center gap-6 mb-12">
                      <div className="h-20 w-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                         <span className="text-3xl font-black">{format(currentDate, 'd')}</span>
                      </div>
                      <div>
                         <h3 className="text-4xl font-black text-gray-900 tracking-tighter">
                            {format(currentDate, 'EEEE')}
                         </h3>
                         <p className="text-gray-500 font-bold uppercase tracking-widest">{format(currentDate, 'MMMM yyyy')}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      {getAppointmentsForDay(currentDate).length === 0 ? (
                        <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                           <Clock className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                           <p className="text-gray-500 font-bold">No appointments for this day.</p>
                        </div>
                      ) : (
                        getAppointmentsForDay(currentDate).map(app => (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={app.id}
                            className="flex items-center gap-8 group"
                          >
                            <div className="w-24 text-right">
                               <p className="text-sm font-black text-gray-900">{format(parseISO(app.dateTime), 'h:mm')}</p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{format(parseISO(app.dateTime), 'a')}</p>
                            </div>
                            <div className="flex-1 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:border-blue-100 transition-all">
                               <div className="flex items-center justify-between mb-4">
                                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                     {app.specialty}
                                  </span>
                                  <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest",
                                    app.status === 'confirmed' ? "text-emerald-500" : "text-amber-500"
                                  )}>{app.status}</span>
                               </div>
                               <h4 className="text-xl font-black text-gray-900 mb-1">{app.docName}</h4>
                               <p className="text-sm font-medium text-gray-500 mb-4">{app.notes || 'Routine checkup and consultation'}</p>
                               <div className="flex items-center gap-4">
                                  <Link to={`/doctors/${app.doctorId}`} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View Profile</Link>
                                  <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-500">Cancel</button>
                               </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Day Overlay/Modal */}
        <AnimatePresence>
          {selectedDayAppointments && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDayAppointments(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-blue-600 p-10 text-white relative">
                   <button 
                    onClick={() => setSelectedDayAppointments(null)}
                    className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                   >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                   </button>
                   <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Appointments For</p>
                   <h3 className="text-4xl font-black tracking-tight cursor-default">
                     {format(parseISO(selectedDayAppointments[0].dateTime), 'MMMM do')}
                   </h3>
                </div>
                <div className="p-4 space-y-3 max-h-[400px] overflow-auto bg-gray-50/50">
                   {selectedDayAppointments.map(app => (
                      <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                         <div className="bg-blue-50 p-4 rounded-2xl">
                            <Clock className="h-6 w-6 text-blue-600" />
                         </div>
                         <div className="flex-1">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{format(parseISO(app.dateTime), 'h:mm a')}</p>
                            <h4 className="font-black text-gray-900 leading-tight">{app.docName}</h4>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{app.specialty} Specialist</p>
                         </div>
                         <Link 
                            to={`/doctors/${app.doctorId}`}
                            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                         >
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                         </Link>
                      </div>
                   ))}
                </div>
                <div className="p-8 bg-white text-center">
                   <button 
                    onClick={() => setSelectedDayAppointments(null)}
                    className="w-full py-4 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
                   >
                     Close Window
                   </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
