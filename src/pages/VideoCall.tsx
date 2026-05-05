import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Settings, 
  MessageSquare, 
  Users, 
  Monitor,
  Maximize2,
  Shield,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function VideoCall() {
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'chat'>('video');

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <div className="px-8 py-6 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5 relative z-20">
        <div className="flex items-center gap-4">
           <div className="bg-red-500 w-3 h-3 rounded-full animate-pulse" />
           <div>
              <h1 className="text-sm font-bold tracking-tight">Dr. Sarah Wilson</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Consultation Room • 12:45</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/20">
              <Shield className="h-3.5 w-3.5" />
              Secure-Encrypted Call
           </div>
           <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
           </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 flex relative">
        
        {/* Main Feed */}
        <div className="flex-1 p-8 relative flex items-center justify-center">
            <div className="relative w-full h-full max-w-6xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-gray-900 group">
                {videoOn ? (
                    <img 
                      src="https://images.unsplash.com/photo-1559839734-2b71f1e3c77e?auto=format&fit=crop&q=80&w=1200" 
                      alt="Doctor Feed" 
                      className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
                        <div className="w-32 h-32 bg-gray-800 rounded-[2rem] flex items-center justify-center mb-6">
                            <VideoOff className="h-12 w-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 font-bold">Doctor's camera is off</p>
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute top-8 left-8">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-bold tracking-tight">High Quality (1080p)</span>
                    </div>
                </div>

                <div className="absolute bottom-8 right-8">
                    <button className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-black/60 transition-all">
                        <Maximize2 className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>

        {/* Self View (Floating) */}
        <div className="absolute bottom-12 left-12 w-64 h-40 bg-gray-800 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl z-30 group cursor-move">
            {!isScreenSharing ? (
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300" 
                  alt="Self View" 
                  className="w-full h-full object-cover grayscale opacity-80"
                />
            ) : (
                <div className="w-full h-full bg-blue-600 flex flex-col items-center justify-center text-center p-4">
                    <Monitor className="h-8 w-8 mb-2" />
                    <p className="text-[10px] font-bold">You are presenting</p>
                </div>
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                <p className="text-[10px] font-bold">You</p>
                {!micOn && <MicOff className="h-2.5 w-2.5 text-red-500" />}
            </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-8 pb-12 flex items-center justify-center relative z-20">
         <div className="px-10 py-6 bg-gray-900/80 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl flex items-center gap-6">
            <button 
                onClick={() => setMicOn(!micOn)}
                className={cn(
                    "p-5 rounded-2xl transition-all active:scale-90",
                    micOn ? "bg-white/5 hover:bg-white/10 text-white" : "bg-red-500 text-white"
                )}
            >
                {micOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </button>
            <button 
                onClick={() => setVideoOn(!videoOn)}
                className={cn(
                    "p-5 rounded-2xl transition-all active:scale-90",
                    videoOn ? "bg-white/5 hover:bg-white/10 text-white" : "bg-red-500 text-white"
                )}
            >
                {videoOn ? <VideoIcon className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </button>

            <div className="w-[1px] h-10 bg-white/10 mx-2" />

            <button 
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={cn(
                    "p-5 rounded-2xl hover:bg-white/10 transition-all active:scale-90",
                    isScreenSharing ? "text-blue-500" : "text-gray-400"
                )}
            >
                <Monitor className="h-6 w-6" />
            </button>
            <button className="p-5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all active:scale-90">
                <Heart className="h-6 w-6" />
            </button>
            <button className="p-5 text-gray-400 hover:bg-white/10 rounded-2xl transition-all active:scale-90">
                <MessageSquare className="h-6 w-6" />
            </button>

            <div className="w-[1px] h-10 bg-white/10 mx-2" />

            <button 
                onClick={() => navigate('/appointments')}
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-[1.5rem] font-bold shadow-xl shadow-red-900/40 flex items-center gap-3 transition-all active:scale-95"
            >
                <PhoneOff className="h-5 w-5" />
                End Call
            </button>
         </div>
      </div>
    </div>
  );
}
