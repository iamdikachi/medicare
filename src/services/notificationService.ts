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
import { db, auth } from '../lib/firebase';
import { differenceInHours, differenceInMinutes, parseISO, isAfter } from 'date-fns';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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

export const getNotifications = (callback: (notifications: AppNotification[]) => void) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return () => {};

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
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'notifications');
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `notifications/${notificationId}`);
  }
};

export const checkAndCreateReminders = async (appointments: any[], preferences: any) => {
  if (!preferences?.inApp || !auth.currentUser) return;

  const userId = auth.currentUser.uid;
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
  try {
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
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'notifications');
  }
}
