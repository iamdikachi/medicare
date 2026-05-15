import { useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import CalendarPicker from './CalendarPicker';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  availableSlots?: string[];
}

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
  initialDate?: string;
  initialTime?: string;
  initialNotes?: string;
}

export default function BookingModal({ doctor, onClose, initialDate, initialTime, initialNotes }: BookingModalProps) {
  const { user } = useAuth();
  const [date, setDate] = useState(initialDate || format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(initialTime || '');
  const [notes, setNotes] = useState(initialNotes || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSlots = doctor.availableSlots || ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to book an appointment");
      return;
    }
    if (!date || !time) {
      setError("Please select both date and time");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          doctorId: doctor.id,
          dateTime: new Date(`${date}T${time}`).toISOString(),
          docName: doctor.name,
          patientName: user.displayName,
          specialty: doctor.specialty,
          status: 'pending',
          notes,
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }

      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">Book Consultation</h2>
                <p className="text-sm text-gray-500 font-medium tracking-tight">With {doctor.name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {success ? (
              <div className="py-12 text-center">
                <div className="bg-green-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Requested!</h3>
                <p className="text-gray-500 font-medium">The doctor will review your request shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {!user && (
                  <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-700 font-medium">You need to be signed in to book an appointment.</p>
                  </div>
                )}

                <div className="space-y-6">
                  <CalendarPicker
                    selectedDate={date}
                    onDateSelect={setDate}
                    selectedTime={time}
                    onTimeSelect={setTime}
                    availableSlots={availableSlots}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Symptoms / Notes</label>
                  <textarea
                    placeholder="Briefly describe your concerns..."
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Consultation Fee</span>
                    <span className="text-2xl font-sans font-bold text-gray-900">${doctor.consultationFee}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !user}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 disabled:shadow-none active:scale-95"
                  >
                    {loading ? "Requesting..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
