import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Clipboard, Plus, Search, FileText, Calendar, Filter, X, Check, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import React from 'react';

export default function HealthRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('diagnosis');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/records');
        if (res.ok) {
          const data = await res.json();
          setRecords(data);
        }
      } catch (err) {
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          date,
          content
        })
      });
      if (res.ok) {
        const newDoc = await res.json();
        setRecords([newDoc, ...records]);
        setIsAdding(false);
        setTitle('');
        setContent('');
      }
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const filteredRecords = records.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-sans font-bold text-gray-900 mb-2">Medical History</h1>
            <p className="text-gray-600 font-medium">Keep track of your health journey and important documents.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-xl shadow-gray-100 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Record
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-24 rounded-3xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleAddRecord} className="bg-white p-10 rounded-[2.5rem] border-2 border-blue-100 shadow-xl shadow-blue-50/50 mb-8 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Create New Record</h3>
                      <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                        <input
                          required
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Blood Test Result"
                          className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">Type</label>
                          <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                          >
                            <option value="diagnosis">Diagnosis</option>
                            <option value="prescription">Prescription</option>
                            <option value="test_result">Test Result</option>
                            <option value="history">General History</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">Date</label>
                          <input
                            required
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Content / Description</label>
                      <textarea
                        required
                        placeholder="Detailed information about this record..."
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2 active:scale-95"
                      >
                        <Save className="h-5 w-5" /> Save Medical Record
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredRecords.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center flex flex-col items-center">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  <Clipboard className="h-12 w-12 text-gray-200" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Records Found</h3>
                <p className="text-gray-500 max-w-sm mb-10">Start building your medical history by adding your first record or document.</p>
                <button 
                  onClick={() => setIsAdding(true)}
                   className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
                >
                  Create First Record
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all flex flex-col md:flex-row md:items-start gap-8"
                  >
                    <div className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110",
                      record.type === 'diagnosis' ? 'bg-rose-50 text-rose-600' :
                      record.type === 'prescription' ? 'bg-blue-50 text-blue-600' :
                      record.type === 'test_result' ? 'bg-amber-50 text-amber-600' :
                      'bg-gray-50 text-gray-600'
                    )}>
                      {record.type === 'prescription' ? <FileText className="h-10 w-10" /> : <Clipboard className="h-10 w-10" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                             <span className={cn(
                               "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg",
                               record.type === 'diagnosis' ? 'bg-rose-100 text-rose-700' :
                               record.type === 'prescription' ? 'bg-blue-100 text-blue-700' :
                               record.type === 'test_result' ? 'bg-amber-100 text-amber-700' :
                               'bg-gray-100 text-gray-700'
                             )}>
                               {record.type.replace('_', ' ')}
                             </span>
                             <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                               <Calendar className="h-3.5 w-3.5" />
                               {format(new Date(record.date), 'MMMM dd, yyyy')}
                             </div>
                           </div>
                           <h3 className="text-2xl font-bold text-gray-900 leading-tight">{record.title}</h3>
                        </div>
                        <button className="h-fit px-5 py-2.5 bg-gray-50 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors uppercase tracking-wider">
                          View PDF
                        </button>
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed max-w-3xl">
                        {record.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
