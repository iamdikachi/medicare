import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowUpRight, Stethoscope, Check, X, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface DoctorDashboardProps {
  profile: any;
  appointments: any[];
  onUpdateStatus: (id: string, status: 'confirmed' | 'declined') => Promise<void>;
}

export default function DoctorDashboard({ profile, appointments, onUpdateStatus }: DoctorDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined' | 'cancelled'>('all');

  const filteredAppointments = appointments.filter(app => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return app.status === 'pending' || app.status === 'booked';
    return app.status === statusFilter;
  });

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-2xl">
              <Stethoscope className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Consultation Schedule</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'declined', label: 'Declined' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  statusFilter === filter.id 
                    ? "bg-white text-emerald-600 shadow-sm" 
                    : "text-gray-500 hover:text-emerald-500 hover:bg-white/50"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <Link to="/appointments" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
            Full History <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
               <Calendar className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium tracking-tight">No {statusFilter !== 'all' ? statusFilter : ''} appointments found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((app) => (
              <motion.div 
                layout
                key={app.id} 
                className="group p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-emerald-100 hover:bg-emerald-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-sm shrink-0">
                    <span className="text-xs font-black text-emerald-600 uppercase mb-0.5">{format(new Date(app.dateTime), 'MMM')}</span>
                    <span className="text-xl font-black text-gray-900 leading-none">{format(new Date(app.dateTime), 'dd')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold text-gray-900 tracking-tight mb-0.5">Review Patient Consultation</div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-emerald-500" /> {format(new Date(app.dateTime), 'hh:mm a')}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className={cn(
                        "capitalize px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        app.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" :
                        app.status === 'declined' ? "bg-rose-100 text-rose-700" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {app.status}
                      </span>
                    </div>
                    {app.notes && (
                      <div className="mt-4 p-4 bg-white/60 border border-emerald-100/50 rounded-2xl text-xs text-gray-600 italic leading-relaxed">
                        "{app.notes}"
                      </div>
                    )}
                  </div>
                </div>
                
                {(app.status === 'booked' || app.status === 'pending') && (
                  <div className="flex items-center gap-3">
                     <button 
                       onClick={() => onUpdateStatus(app.id, 'confirmed')}
                       className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                     >
                       <Check className="h-4 w-4" /> Approve
                     </button>
                     <button 
                       onClick={() => onUpdateStatus(app.id, 'declined')}
                       className="flex-1 md:flex-none flex items-center justify-center p-3 bg-white border border-gray-200 text-rose-500 rounded-2xl hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-95 shadow-sm"
                     >
                       <X className="h-5 w-5" />
                     </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white col-span-full lg:col-span-1">
          <h3 className="text-xl font-bold mb-4">Account Analytics</h3>
          <p className="text-gray-400 text-sm mb-8">Performance overview for this month.</p>
          <div className="space-y-6">
            {[
              { label: 'Patient Loyalty', value: '88%', trend: '+12%' },
              { label: 'Avg Feedback', value: '4.9/5', trend: 'Stable' },
              { label: 'Completion Rate', value: '96%', trend: '+2%' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">{stat.label}</span>
                <div className="text-right">
                  <div className="font-bold">{stat.value}</div>
                  <div className="text-[10px] text-emerald-400 font-black">{stat.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-emerald-600 rounded-[3rem] p-10 text-white col-span-full lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-sans font-bold mb-4">Patient Care Tips</h3>
            <p className="text-emerald-50 text-lg opacity-90 leading-relaxed max-w-md">
              Always encourage patients to log their daily activity to provide you with more accurate diagnostic data during follow-ups.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-8">
            <Link to="/profile" className="bg-white/20 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/30 transition-all">
              Update Availability
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
