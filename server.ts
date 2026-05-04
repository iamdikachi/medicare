import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import fs from 'fs';

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
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77e?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'doc2',
        name: 'Dr. James Chen',
        specialty: 'Neurology',
        bio: 'Expert in neurodegenerative disorders and brain health. James has published several papers on cognitive enhancement.',
        rating: 4.8,
        experienceYears: 8,
        consultationFee: 65,
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'doc3',
        name: 'Dr. Emily Brooks',
        specialty: 'Pediatrics',
        bio: 'Compassionate care for children and adolescents. Emily is known for her patient and friendly approach to childhood development.',
        rating: 5.0,
        experienceYears: 15,
        consultationFee: 40,
        photoURL: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'doc4',
        name: 'Dr. Robert Miller',
        specialty: 'Dermatology',
        bio: 'Specializing in skin cancer screening and cosmetic dermatology with a focus on natural-looking results.',
        rating: 4.7,
        experienceYears: 10,
        consultationFee: 55,
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400'
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
    const { email, password, name } = req.body;
    const users = getData(USERS_FILE);
    if (users.find((u: any) => u.email === email)) return res.status(400).json({ error: 'Exists' });
    
    const newUser = {
      uid: Math.random().toString(36).substring(7),
      email,
      password: await bcrypt.hash(password, 10),
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: 'patient',
      subscriptionTier: 'free',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveData(USERS_FILE, users);
    const token = jwt.sign({ uid: newUser.uid }, JWT_SECRET);
    res.cookie('auth_token', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'lax',
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
      sameSite: 'lax',
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
    res.clearCookie('auth_token', { path: '/' });
    res.json({ success: true });
  });

  // --- Data API ---
  app.get('/api/doctors', (req, res) => res.json(getData(DOCTORS_FILE)));
  app.get('/api/doctors/:id', (req, res) => {
    const doctor = getData(DOCTORS_FILE).find((d: any) => d.id === req.params.id);
    doctor ? res.json(doctor) : res.status(404).send();
  });

  app.get('/api/appointments', authenticate, (req: any, res) => {
    const apps = getData(APPOINTMENTS_FILE).filter((a: any) => a.patientId === req.userUid);
    res.json(apps);
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
    const recs = getData(RECORDS_FILE).filter((r: any) => r.patientId === req.userUid);
    res.json(recs);
  });

  app.post('/api/records', authenticate, (req: any, res) => {
    const recs = getData(RECORDS_FILE);
    const newRec = { id: Math.random().toString(36).substring(7), ...req.body, patientId: req.userUid, createdAt: new Date().toISOString() };
    recs.push(newRec);
    saveData(RECORDS_FILE, recs);
    res.json(newRec);
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
