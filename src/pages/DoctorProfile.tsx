import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Star, 
  Clock, 
  DollarSign, 
  ChevronLeft, 
  Medal, 
  Calendar, 
  MessageSquare, 
  ShieldCheck,
  Stethoscope,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import BookingModal from '../components/appointments/BookingModal';

interface Doctor {
  id: string;
  uid: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  experienceYears: number;
  consultationFee: number;
  photoURL: string;
  availableSlots?: string[];
}

import CalendarPicker from '../components/appointments/CalendarPicker';
import { format } from 'date-fns';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  // Simulation: Filter available slots based on the selected date (e.g. fewer slots on weekends)
  const getDynamicSlots = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay();
    const baseSlots = doctor?.availableSlots || ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00'];
    
    // Simulating "filtering" by day
    if (day === 0 || day === 6) { // Weekend
      return baseSlots.slice(0, 2); // Fewer slots
    }
    // Mix it up for demonstration
    if (day % 2 === 0) {
      return baseSlots.filter((_, i) => i % 2 === 0);
    }
    return baseSlots;
  };

  const currentSlots = getDynamicSlots(selectedDate);
  const isDateAvailable = (date: Date) => {
    const day = date.getDay();
    // Simulate that weekends have no availability for this specific view if needed, 
    // or just that they have FEWER slots but still have some.
    // For visual highlighting, let's say weekdays have "good" availability.
    return day !== 0 && day !== 6; 
  };

  const canBook = selectedDate && selectedTime;

  useEffect(() => {
    async function fetchDoctor() {
      if (!id) return;
      try {
        const res = await fetch(`/api/doctors/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDoctor(data);
        } else {
          console.error("Doctor not found");
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor not found</h2>
          <button onClick={() => navigate('/doctors')} className="text-blue-600 font-bold hover:underline flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" /> Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover/Back Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <button 
            onClick={() => navigate('/doctors')}
            className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> 
            Back to clinical team
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10"
            >
              <div className="w-full md:w-64 h-64 flex-shrink-0 rounded-[2.5rem] overflow-hidden ring-4 ring-gray-50">
                <img 
                  src={doctor.photoURL} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-3">
                      <Stethoscope className="h-3 w-3" /> {doctor.specialty}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{doctor.name}</h1>
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-50 px-4 py-2 rounded-2xl">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xl font-bold text-gray-900">{doctor.rating}</span>
                    <span className="text-sm text-gray-400 font-medium">(120+ Reviews)</span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8">
                  {doctor.bio}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                   <div className="bg-gray-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2">
                        <Medal className="h-3.5 w-3.5 text-blue-500" /> Experience
                      </div>
                      <div className="text-xl font-bold text-gray-900">{doctor.experienceYears} Years</div>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2">
                        <DollarSign className="h-3.5 w-3.5 text-green-500" /> Fee
                      </div>
                      <div className="text-xl font-bold text-gray-900">${doctor.consultationFee}</div>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Verified
                      </div>
                      <div className="text-xl font-bold text-gray-900">Licensed</div>
                   </div>
                </div>
              </div>
            </motion.div>

            <section id="availability-section" className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Doctor's Availability</h3>
                    <p className="text-sm text-gray-500 font-medium">Select a date to filter available slots</p>
                  </div>
                </div>
                {selectedDate && (
                  <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-blue-50">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-gray-700">{format(new Date(selectedDate), 'MMMM d, yyyy')}</span>
                  </div>
                )}
              </div>
              
                <CalendarPicker
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime('');
                  }}
                  selectedTime={selectedTime}
                  onTimeSelect={(time) => {
                    setSelectedTime(time);
                  }}
                  availableSlots={currentSlots}
                  isDateAvailable={isDateAvailable}
                />
              </section>

            {/* Detailed sections */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-blue-50 p-2.5 rounded-2xl">
                    <Medal className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Qualifications</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Medical Degree from Top Medical University",
                    "Certified Specialist in " + doctor.specialty,
                    "Residency at General Hospital",
                    "Member of Medical Advisory Board"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                      <span className="text-gray-600 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-purple-50 p-2.5 rounded-2xl">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Patient Feedback</h3>
                </div>
                <div className="space-y-6">
                   {[
                     { user: "Emma W.", text: "Very professional and explained everything clearly.", rating: 5 },
                     { user: "David K.", text: "The wait was minimal and the consultation was thorough.", rating: 4 }
                   ].map((review, i) => (
                     <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                       <div className="flex items-center justify-between mb-2">
                         <span className="font-bold text-gray-900">{review.user}</span>
                         <div className="flex text-yellow-400"><Star className="h-3 w-3 fill-current" /></div>
                       </div>
                       <p className="text-sm text-gray-500 font-medium italic">"{review.text}"</p>
                     </div>
                   ))}
                </div>
              </section>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-900/20"
               >
                 <h3 className="text-2xl font-bold mb-6">Booking Details</h3>
                 
                 <div className="space-y-6 mb-10">
                   <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className="text-gray-400 font-medium">Consultation Fee</span>
                      <span className="text-2xl font-sans font-bold">${doctor.consultationFee}</span>
                   </div>
                   {selectedDate && (
                     <div className="flex items-center gap-4 text-blue-200">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm font-medium">{format(new Date(selectedDate), 'EEE, MMM d, yyyy')}</span>
                     </div>
                   )}
                   {selectedTime && (
                     <div className="flex items-center gap-4 text-emerald-400">
                        <Clock className="h-5 w-5" />
                        <span className="text-sm font-black uppercase tracking-widest">{selectedTime}</span>
                     </div>
                   )}
                   {canBook && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       className="space-y-3 pt-6 border-t border-white/10"
                     >
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Detailed Symptoms</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Please describe why you're seeking a consultation..."
                          rows={3}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm text-white resize-none"
                        />
                     </motion.div>
                   )}
                   {!selectedTime && (
                      <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                         <Info className="h-5 w-5 text-blue-400" />
                         <p className="text-xs text-blue-100/70 font-medium leading-relaxed">
                           Please select a preferred date and time from the availability calendar to proceed.
                         </p>
                      </div>
                   )}
                 </div>

                 <button
                   onClick={() => canBook ? setIsBooking(true) : document.getElementById('availability-section')?.scrollIntoView({ behavior: 'smooth' })}
                   className={cn(
                     "w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2",
                     canBook 
                       ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/10" 
                       : "bg-white/10 text-gray-400 cursor-pointer hover:bg-white/15"
                   )}
                 >
                   {canBook ? 'Schedule Consultation' : 'Select Time to Book'}
                 </button>
                 
                 <p className="mt-6 text-center text-xs text-gray-400 font-medium">
                   Booking secured with 256-bit encryption
                 </p>
               </motion.div>

               <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                 <h4 className="font-bold text-gray-900 mb-4 tracking-tight">Need assistance?</h4>
                 <p className="text-sm text-gray-500 font-medium mb-6">Our support team is available 24/7 for technical issues or booking help.</p>
                 <button className="text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline">Contact Help Center</button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {isBooking && (
        <BookingModal
          doctor={doctor}
          onClose={() => setIsBooking(false)}
          initialDate={selectedDate}
          initialTime={selectedTime}
          initialNotes={notes}
        />
      )}
    </div>
  );
}
