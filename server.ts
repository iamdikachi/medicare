import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'medicare-super-secret-key';
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const DOCTORS_FILE = path.join(DATA_DIR, 'doctors.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Initialize files
[USERS_FILE, DOCTORS_FILE, APPOINTMENTS_FILE, RECORDS_FILE].forEach(file => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]));
});

// Seed Doctors if empty
const seedDoctors = () => {
  const doctors = JSON.parse(fs.readFileSync(DOCTORS_FILE, 'utf-8'));
  if (doctors.length === 0) {
    const dummyDoctors = [
      {
        id: 'doc1',
        name: 'Dr. Sarah Wilson',
        specialty: 'Cardiology',
        bio: 'Specialist in cardiovascular diseases with 10+ years of experience. Sarah focuses on preventive care and heart health optimization.',
        rating: 4.9,
        experienceYears: 12,
        consultationFee: 50,
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77e?auto=format&fit=crop&q=80&w=400',
        availableSlots: ['09:00', '10:30', '14:00', '16:30']
      },
      {
        id: 'doc2',
        name: 'Dr. James Chen',
        specialty: 'Neurology',
        bio: 'Expert in neurodegenerative disorders and brain health. James has published several papers on cognitive enhancement.',
        rating: 4.8,
        experienceYears: 8,
        consultationFee: 65,
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
        availableSlots: ['08:00', '11:00', '13:00', '15:00']
      },
      {
        id: 'doc3',
        name: 'Dr. Emily Brooks',
        specialty: 'Pediatrics',
        bio: 'Compassionate care for children and adolescents. Emily is known for her patient and friendly approach to childhood development.',
        rating: 5.0,
        experienceYears: 15,
        consultationFee: 40,
        photoURL: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
        availableSlots: ['09:30', '12:00', '14:30', '17:00']
      },
      {
        id: 'doc4',
        name: 'Dr. Robert Miller',
        specialty: 'Dermatology',
        bio: 'Specializing in skin cancer screening and cosmetic dermatology with a focus on natural-looking results.',
        rating: 4.7,
        experienceYears: 10,
        consultationFee: 55,
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
        availableSlots: ['10:00', '11:30', '13:30', '16:00']
      }
    ];
    fs.writeFileSync(DOCTORS_FILE, JSON.stringify(dummyDoctors, null, 2));
  }
};
seedDoctors();

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Configure multer for file storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  const upload = multer({ storage });

  const getData = (file: string) => JSON.parse(fs.readFileSync(file, 'utf-8'));
  const saveData = (file: string, data: any[]) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

  // Middleware to verify JWT
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;
    if (!token) {
      console.log('[Auth] No token found in cookies');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { uid: string };
      req.userUid = decoded.uid;
      next();
    } catch (err) {
      console.log('[Auth] Invalid token');
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- Auth API ---
  app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name, role } = req.body;
    const users = getData(USERS_FILE);
    if (users.find((u: any) => u.email === email)) return res.status(400).json({ error: 'Exists' });
    
    const newUser = {
      uid: Math.random().toString(36).substring(7),
      email,
      password: await bcrypt.hash(password, 10),
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: role || 'patient',
      subscriptionTier: 'free',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveData(USERS_FILE, users);
    const token = jwt.sign({ uid: newUser.uid }, JWT_SECRET);
    res.cookie('auth_token', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none',
      path: '/'
    });
    const { password: _, ...cleanUser } = newUser;
    res.json(cleanUser);
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = getData(USERS_FILE).find((u: any) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Credentials' });
    const token = jwt.sign({ uid: user.uid }, JWT_SECRET);
    res.cookie('auth_token', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'none',
      path: '/'
    });
    const { password: _, ...cleanUser } = user;
    res.json(cleanUser);
  });

  app.get('/api/auth/me', authenticate, (req: any, res) => {
    const user = getData(USERS_FILE).find((u: any) => u.uid === req.userUid);
    if (!user) return res.status(404).json({ error: 'Not found' });
    const { password: _, ...cleanUser } = user;
    res.json(cleanUser);
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('auth_token', { 
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.json({ success: true });
  });

  app.patch('/api/auth/profile', authenticate, (req: any, res) => {
    const { 
      displayName, photoURL, subscriptionTier, 
      subscriptionStatus, subscriptionStartDate,
      emergencyContact, bloodType, allergies, chronicConditions,
      reminderPreferences, role,
      specialty, bio, experienceYears, consultationFee
    } = req.body;
    let users = getData(USERS_FILE);
    const userIndex = users.findIndex((u: any) => u.uid === req.userUid);

    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    // Update allowed fields
    if (displayName !== undefined) users[userIndex].displayName = displayName;
    if (photoURL !== undefined) users[userIndex].photoURL = photoURL;
    if (subscriptionTier !== undefined) users[userIndex].subscriptionTier = subscriptionTier;
    if (subscriptionStatus !== undefined) users[userIndex].subscriptionStatus = subscriptionStatus;
    if (subscriptionStartDate !== undefined) users[userIndex].subscriptionStartDate = subscriptionStartDate;
    if (emergencyContact !== undefined) users[userIndex].emergencyContact = emergencyContact;
    if (bloodType !== undefined) users[userIndex].bloodType = bloodType;
    if (allergies !== undefined) users[userIndex].allergies = allergies;
    if (chronicConditions !== undefined) users[userIndex].chronicConditions = chronicConditions;
    if (reminderPreferences !== undefined) users[userIndex].reminderPreferences = reminderPreferences;
    if (role !== undefined) users[userIndex].role = role;
    if (specialty !== undefined) users[userIndex].specialty = specialty;
    if (bio !== undefined) users[userIndex].bio = bio;
    if (experienceYears !== undefined) users[userIndex].experienceYears = experienceYears;
    if (consultationFee !== undefined) users[userIndex].consultationFee = consultationFee;

    saveData(USERS_FILE, users);

    // Sync with doctors.json if role is doctor
    if (users[userIndex].role === 'doctor') {
      let doctors = getData(DOCTORS_FILE);
      let docIndex = doctors.findIndex((d: any) => d.uid === req.userUid || d.id === req.userUid || d.id === `doc_${req.userUid}`);
      
      if (docIndex === -1) {
        docIndex = doctors.findIndex((d: any) => d.name === users[userIndex].displayName);
      }
      
      const doctorData = {
        id: docIndex !== -1 ? doctors[docIndex].id : `doc_${req.userUid}`,
        uid: req.userUid,
        name: users[userIndex].displayName,
        specialty: users[userIndex].specialty || 'General Practitioner',
        bio: users[userIndex].bio || 'Licensed medical professional dedicated to providing excellent healthcare.',
        rating: docIndex !== -1 ? doctors[docIndex].rating : 5.0,
        experienceYears: users[userIndex].experienceYears !== undefined ? Number(users[userIndex].experienceYears) : (docIndex !== -1 ? doctors[docIndex].experienceYears : 5),
        consultationFee: users[userIndex].consultationFee !== undefined ? Number(users[userIndex].consultationFee) : (docIndex !== -1 ? doctors[docIndex].consultationFee : 45),
        photoURL: users[userIndex].photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${users[userIndex].email}`,
        availableSlots: docIndex !== -1 ? (doctors[docIndex].availableSlots || ['09:00', '10:30', '14:00', '16:30']) : ['09:00', '10:30', '14:00', '16:30']
      };

      if (docIndex !== -1) {
        doctors[docIndex] = doctorData;
      } else {
        doctors.push(doctorData);
      }
      saveData(DOCTORS_FILE, doctors);
    }

    const { password: _, ...cleanUser } = users[userIndex];
    res.json(cleanUser);
  });

  // --- Data API ---
  app.get('/api/doctors', (req, res) => res.json(getData(DOCTORS_FILE)));
  app.get('/api/doctors/:id', (req, res) => {
    const doctor = getData(DOCTORS_FILE).find((d: any) => d.id === req.params.id);
    doctor ? res.json(doctor) : res.status(404).send();
  });

  app.get('/api/appointments', authenticate, (req: any, res) => {
    const { mode } = req.query;
    const apps = getData(APPOINTMENTS_FILE);
    
    if (mode === 'practitioner') {
      // In a real app, we'd check which doctor this user is. 
      // For demo, we'll return all appointments to simulate a doctor seeing their schedule.
      return res.json(apps.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    
    const userApps = apps.filter((a: any) => a.patientId === req.userUid);
    res.json(userApps);
  });

  app.patch('/api/appointments/:id', authenticate, (req: any, res) => {
    const { status } = req.body;
    let apps = getData(APPOINTMENTS_FILE);
    // Allow update if they are the patient OR if they are in practitioner mode
    const appIndex = apps.findIndex((a: any) => a.id === req.params.id);

    if (appIndex === -1) return res.status(404).json({ error: 'Appointment not found' });

    if (status !== undefined) apps[appIndex].status = status;
    saveData(APPOINTMENTS_FILE, apps);

    res.json(apps[appIndex]);
  });

  app.post('/api/appointments', authenticate, (req: any, res) => {
    console.log('[API] Processing appointment for patient:', req.userUid);
    const apps = getData(APPOINTMENTS_FILE);
    const newApp = { 
      id: Math.random().toString(36).substring(7), 
      ...req.body, 
      patientId: req.userUid, 
      createdAt: new Date().toISOString() 
    };
    apps.push(newApp);
    saveData(APPOINTMENTS_FILE, apps);
    console.log('[API] Appointment saved with ID:', newApp.id);
    res.json(newApp);
  });

  app.get('/api/records', authenticate, (req: any, res) => {
    const user = getData(USERS_FILE).find((u: any) => u.uid === req.userUid);
    const recs = getData(RECORDS_FILE);
    
    if (user?.role === 'doctor') {
      const users = getData(USERS_FILE);
      const enhancedRecs = recs.map((r: any) => {
        const patient = users.find((u: any) => u.uid === r.patientId);
        return { ...r, patientName: patient?.displayName || 'Unknown Patient' };
      });
      return res.json(enhancedRecs);
    }
    
    // Patients see only their own
    res.json(recs.filter((r: any) => r.patientId === req.userUid));
  });

  app.post('/api/records', authenticate, (req: any, res) => {
    const recs = getData(RECORDS_FILE);
    const { title, type, date, content, attachmentUrl } = req.body;
    const newRec = { 
      id: Math.random().toString(36).substring(7), 
      title, type, date, content, attachmentUrl,
      patientId: req.userUid, 
      createdAt: new Date().toISOString() 
    };
    recs.push(newRec);
    saveData(RECORDS_FILE, recs);
    res.json(newRec);
  });

  app.post('/api/upload', authenticate, upload.single('document'), (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'dist/index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
}
startServer();
