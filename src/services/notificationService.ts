import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { differenceInHours, differenceInMinutes, parseISO, isAfter } from 'date-fns';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment_reminder' | 'system' | 'health_alert';
  read: boolean;
  createdAt: any;
  appointmentId?: string;
}

export const getNotifications = (userId: string, callback: (notifications: AppNotification[]) => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AppNotification[];
    callback(notifications);
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
};

export const checkAndCreateReminders = async (userId: string, appointments: any[], preferences: any) => {
  if (!preferences?.inApp) return;

  const now = new Date();
  
  for (const app of appointments) {
    const appDate = parseISO(app.dateTime);
    if (!isAfter(appDate, now)) continue;

    const hoursDiff = differenceInHours(appDate, now);
    const minsDiff = differenceInMinutes(appDate, now);

    // 24 Hour Reminder
    if (preferences.remind24h && hoursDiff <= 24 && hoursDiff > 23) {
      await createAppointmentReminder(userId, app, '24 hours');
    }

    // 1 Hour Reminder
    if (preferences.remind1h && minsDiff <= 60 && minsDiff > 55) {
      await createAppointmentReminder(userId, app, '1 hour');
    }
  }
};

async function createAppointmentReminder(userId: string, app: any, timeLabel: string) {
  // Check if reminder already exists to avoid duplicates
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('appointmentId', '==', app.id),
    where('type', '==', 'appointment_reminder'),
    where('title', '==', `Reminder: Upcoming Appointment in ${timeLabel}`)
  );
  
  const existing = await getDocs(q);
  if (!existing.empty) return;

  await addDoc(collection(db, 'notifications'), {
    userId,
    appointmentId: app.id,
    title: `Reminder: Upcoming Appointment in ${timeLabel}`,
    message: `You have an appointment with ${app.docName} at ${new Date(app.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`,
    type: 'appointment_reminder',
    read: false,
    createdAt: serverTimestamp()
  });
}
