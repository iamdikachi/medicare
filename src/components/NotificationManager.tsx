import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { checkAndCreateReminders } from '../services/notificationService';

export default function NotificationManager() {
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user || !profile) return;

    const checkReminders = async () => {
      try {
        // Fetch upcoming appointments
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('patientId', '==', user.uid),
          where('status', '==', 'confirmed')
        );
        
        const snapshot = await getDocs(appointmentsQuery);
        const appointments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        await checkAndCreateReminders(user.uid, appointments, profile.reminderPreferences);
      } catch (error) {
        console.error('Error checking reminders:', error);
      }
    };

    // Run once on load
    checkReminders();

    // Check every 10 minutes
    const interval = setInterval(checkReminders, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, profile]);

  return null;
}
