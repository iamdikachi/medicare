import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Messages() {
  const { user, profile } = useAuth();
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState('');
  const isDoctor = profile?.role === 'doctor';

  const chats = isDoctor ? [
    {
      id: 0,
      name: 'John Doe (Patient)',
      lastMessage: 'Thank you for the prescription, doctor.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      time: '02:15 PM',
      online: true,
      unread: 1,
    },
    {
      id: 1,
      name: 'Jane Smith (Patient)',
      lastMessage: 'When should I take the next dose?',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      time: '10:30 AM',
      online: false,
      unread: 0,
    }
  ] : [
    {
      id: 0,
      name: 'Dr. Sarah Wilson',
      lastMessage: 'Your blood test results look promising.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c77e?auto=format&fit=crop&q=80&w=100',
      time: '12:45 PM',
      online: true,
      unread: 2,
    },
    {
      id: 1,
      name: 'Dr. James Chen',
      lastMessage: 'Let me know if you feel any dizziness.',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100',
      time: 'Yesterday',
      online: false,
      unread: 0,
    }
  ];

  const messages = isDoctor ? [
    { senderId: 'patient1', term: 'Hello Dr., I have a question about my medication.', time: '02:00 PM' },
    { senderId: 'me', term: 'Hello John, please go ahead.', time: '02:05 PM' },
    { senderId: 'patient1', term: 'Thank you for the prescription, doctor. Does it have side effects?', time: '02:15 PM' },
  ] : [
    { senderId: 'doc1', term: 'Hello, how are you feeling today?', time: '10:00 AM' },
    { senderId: 'me', term: 'Feeling much better, thank you doctor.', time: '10:15 AM' },
    { senderId: 'doc1', term: 'Great! Your recent blood test results are ready.', time: '10:20 AM' },
    { senderId: 'doc1', term: 'I will send them over shortly.', time: '10:21 AM' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      <div className="container mx-auto px-4 py-10 flex gap-8 h-[calc(100vh-80px)]">
        
        {/* Sidebar */}
        <div className="w-full md:w-96 flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Messages</h1>
              <div className="bg-blue-50 p-2 rounded-xl">
                 <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={cn(
                    "w-full p-4 rounded-3xl flex items-center gap-4 transition-all hover:bg-gray-50 text-left relative group",
                    activeChat === chat.id ? "bg-blue-50/50 ring-1 ring-blue-100 shadow-sm" : ""
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <img src={chat.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 truncate">{chat.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium truncate group-hover:text-gray-700 transition-colors">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="absolute top-4 right-4 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden relative">
            
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <img src={chats[activeChat].avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                 <div>
                    <h2 className="font-bold text-gray-900 leading-none mb-1">{chats[activeChat].name}</h2>
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                       <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Now</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 hover:text-blue-600 border border-gray-50">
                    <Phone className="h-5 w-5" />
                 </button>
                 <button className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 hover:text-blue-600 border border-gray-50">
                    <Video className="h-5 w-5" />
                 </button>
                 <button className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 border border-gray-50">
                    <MoreVertical className="h-5 w-5" />
                 </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
               <div className="flex justify-center">
                  <div className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="h-3 w-3" /> End-to-end encrypted
                  </div>
               </div>

               {messages.map((msg, i) => (
                 <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col max-w-[70%]",
                      msg.senderId === 'me' ? "ml-auto items-end" : "items-start"
                    )}
                 >
                    <div className={cn(
                      "px-6 py-4 rounded-[2rem] font-medium leading-relaxed",
                      msg.senderId === 'me' 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    )}>
                      {msg.term}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-2 mx-2">
                      {msg.time}
                    </span>
                 </motion.div>
               ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-50">
               <div className="flex items-center gap-4">
                  <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full pl-6 pr-12 py-4 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 rounded-full">
                       <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <button 
                    className="bg-blue-600 text-white p-4 rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-90"
                  >
                    <Send className="h-5 w-5" />
                  </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
