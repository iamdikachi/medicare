import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Stethoscope, Activity, Heart, Droplets } from 'lucide-react';
import { cn } from '../lib/utils';
import PatientDashboard from '../components/dashboard/PatientDashboard';
import DoctorDashboard from '../components/dashboard/DoctorDashboard';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isPractitioner = profile?.role === 'doctor';

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [appRes, recRes] = await Promise.all([
          fetch(`/api/appointments${isPractitioner ? '?mode=practitioner' : ''}`),
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
  }, [user, isPractitioner]);

  const handleUpdateStatus = async (appId: string, status: 'confirmed' | 'declined') => {
    try {
      const res = await fetch(`/api/appointments/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setAppointments(apps => apps.map(a => a.id === appId ? { ...a, status } : a));
      }
    } catch (err) {
      console.error("Status update error", err);
    }
  };

  const stats = [
    { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Blood Pressure', value: '120/80', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Blood Glucose', value: '95 mg/dL', icon: Droplets, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h screen bg-gray-50 pt-10 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="mb-4">
               {isPractitioner ? (
                 <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border bg-emerald-50 text-emerald-600 border-emerald-100">
                   Practitioner Portal
                 </span>
               ) : (
                 <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border bg-blue-50 text-blue-600 border-blue-100">
                   Patient Dashboard
                 </span>
               )}
            </div>
            <h1 className="text-4xl font-sans font-bold text-gray-900 mb-2 capitalize">
              Welcome, {profile?.displayName?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-gray-600 font-medium">
              {isPractitioner 
                ? "Manage your incoming consultation requests and daily schedule."
                : "Here's an overview of your health status and recent medical activity."}
            </p>
          </div>
        </div>

        {/* View Switcher - Strictly based on role now */}
        {isPractitioner ? (
          <DoctorDashboard 
            profile={profile} 
            appointments={appointments} 
            onUpdateStatus={handleUpdateStatus} 
          />
        ) : (
          <PatientDashboard 
            profile={profile} 
            appointments={appointments} 
            records={records} 
            stats={stats} 
          />
        )}
      </div>
    </div>
  );
}
