import { useEffect, useState } from 'react';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Search, Stethoscope, Star, Clock, DollarSign, Filter } from 'lucide-react';
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
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const q = query(collection(db, 'doctors'));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        
        if (docs.length === 0) {
          // Add some dummy doctors if collection is empty
          const dummyDoctors = [
            {
              uid: 'doc1',
              name: 'Dr. Sarah Wilson',
              specialty: 'Cardiology',
              bio: 'Specialist in cardiovascular diseases with 10+ years of experience.',
              rating: 4.9,
              experienceYears: 12,
              consultationFee: 50,
              photoURL: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77e?auto=format&fit=crop&q=80&w=400'
            },
            {
              uid: 'doc2',
              name: 'Dr. James Chen',
              specialty: 'Neurology',
              bio: 'Expert in neurodegenerative disorders and brain health.',
              rating: 4.8,
              experienceYears: 8,
              consultationFee: 65,
              photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
            },
            {
              uid: 'doc3',
              name: 'Dr. Emily Brooks',
              specialty: 'Pediatrics',
              bio: 'Compassionate care for children and adolescents.',
              rating: 5.0,
              experienceYears: 15,
              consultationFee: 40,
              photoURL: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400'
            }
          ];
          
          for (const d of dummyDoctors) {
            await addDoc(collection(db, 'doctors'), d);
          }
          setDoctors(dummyDoctors.map((d, i) => ({ id: `new_${i}`, ...d })));
        } else {
          setDoctors(docs);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-sans font-bold text-gray-900 mb-2">Find Your Doctor</h1>
            <p className="text-gray-600 font-medium">Book a consultation with our licensed medical professionals.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
              />
            </div>
            <button className="p-3.5 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <Filter className="h-6 w-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-96 rounded-[2.5rem] animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 transition-all flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={doctor.photoURL}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-gray-900">{doctor.rating}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                    {doctor.specialty}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">{doctor.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                    {doctor.bio}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-bold">{doctor.experienceYears} Years Exp.</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-bold">${doctor.consultationFee}/Session</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="w-full bg-gray-50 text-gray-900 py-4 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-gray-100 mt-auto"
                  >
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
}
