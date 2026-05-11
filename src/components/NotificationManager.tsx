import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { checkAndCreateReminders } from '../services/notificationService';

export default function NotificationManager() {
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user || !profile) return;

    const checkReminders = async () => {
      try {
        // Fetch upcoming appointments from our local API instead of Firestore
        // This is more reliable since local API is the source of truth for appointments
        const res = await fetch('/api/appointments', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch appointments');
        
        const appointments = await res.json();
        const confirmedAppointments = appointments.filter((app: any) => app.status === 'confirmed');

        await checkAndCreateReminders(confirmedAppointments, profile.reminderPreferences);
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
