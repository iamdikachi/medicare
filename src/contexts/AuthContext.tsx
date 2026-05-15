import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  login: () => Promise<void>; // This will now be standard sign in or just removed if not needed, keeping for compat if possible
  signUpWithEmail: (email: string, pass: string, name: string, role: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  updateProfile: (data: { 
    displayName?: string; 
    photoURL?: string; 
    subscriptionTier?: string;
    subscriptionStatus?: string;
    subscriptionStartDate?: string;
    emergencyContact?: string;
    bloodType?: string;
    allergies?: string;
    chronicConditions?: string;
    role?: string;
    reminderPreferences?: {
      email: boolean;
      inApp: boolean;
      remind24h: boolean;
      remind1h: boolean;
    };
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sign in anonymously to Firebase to allow Firestore access with rules
    signInAnonymously(auth).catch(err => console.error("Firebase anonymous auth failed:", err));

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signUpWithEmail = async (email: string, pass: string, name: string, role: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password: pass, name, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    setUser(data);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setUser(data);
  };

  const updateProfile = async (updateData: { 
    displayName?: string; 
    photoURL?: string; 
    subscriptionTier?: string;
    subscriptionStatus?: string;
    subscriptionStartDate?: string;
    emergencyContact?: string;
    bloodType?: string;
    allergies?: string;
    chronicConditions?: string;
    role?: string;
  }) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');
    setUser(data);
  };

  const login = async () => {
    // We could implement Google OAuth manually, but for now we'll stick to Email
    console.log("Google Login not implemented in custom auth yet. Use Email.");
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile: user, loading, login, signUpWithEmail, signInWithEmail, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
