import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  ChevronDown,
  Search,
  Shield,
  Smartphone,
  CreditCard,
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  Send
} from 'lucide-react';
import { cn } from '../lib/utils';

const faqs = [
  {
    q: "How do I book an appointment?",
    a: "Browse our doctors page, select a specialist, choose an available time slot, and confirm your booking. You'll receive an instant confirmation."
  },
  {
    q: "Can I reschedule or cancel an appointment?",
    a: "Yes, you can reschedule or cancel any upcoming appointment from your Appointments dashboard up to 2 hours before the scheduled time."
  },
  {
    q: "Is my medical data secure?",
    a: "Absolutely. We use end-to-end encryption for all communications and follow HIPAA guidelines to ensure your health data stays private."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, debit cards, and digital wallets. Premium plans are billed monthly with no long-term commitment."
  },
  {
    q: "How do video consultations work?",
    a: "Simply join from your Appointments page at the scheduled time. Our secure video platform works on any device with a camera and internet connection."
  },
  {
    q: "Can I access my medical records anytime?",
    a: "Yes, all your health records, lab results, and consultation notes are available 24/7 in the Health Records section of your dashboard."
  }
];

const categories = [
  { icon: Calendar, title: "Appointments", desc: "Booking, rescheduling, cancellations", color: "bg-blue-50 text-blue-600" },
  { icon: FileText, title: "Medical Records", desc: "Access, sharing, and updates", color: "bg-purple-50 text-purple-600" },
  { icon: CreditCard, title: "Billing & Plans", desc: "Payments, subscriptions, refunds", color: "bg-emerald-50 text-emerald-600" },
  { icon: Shield, title: "Privacy & Security", desc: "Data protection, HIPAA compliance", color: "bg-amber-50 text-amber-600" },
  { icon: Smartphone, title: "Technical Support", desc: "App issues, video calls, connectivity", color: "bg-rose-50 text-rose-600" },
  { icon: Users, title: "Account & Profile", desc: "Login, settings, preferences", color: "bg-cyan-50 text-cyan-600" },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Help & Support</h1>
          <p className="text-gray-500 font-medium">Find answers, get help, or reach out to our team.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mb-16">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for answers..."
            className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all font-medium text-gray-900 shadow-sm"
          />
        </div>

        {/* Help Categories */}
        <div className="mb-20">
          <h2 className="text-xl font-bold text-gray-900 mb-8 uppercase tracking-tight">Browse by Topic</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all text-left group"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", cat.color)}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.title}</h3>
                <p className="text-sm font-medium text-gray-500">{cat.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-blue-50 p-2 rounded-xl">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Frequently Asked Questions</h2>
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="font-medium">No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden transition-all hover:border-gray-200">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50/50"
                      >
                        <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                        <ChevronDown className={cn(
                          "h-5 w-5 text-gray-400 shrink-0 transition-transform",
                          openFaq === i && "rotate-180"
                        )} />
                      </button>
                      <motion.div
                        initial={false}
                        animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm text-center"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                  Our support team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setContactForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="text-blue-600 font-bold text-sm hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                  <div className="bg-purple-50 p-2 rounded-xl">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Contact Us</h2>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-bold text-gray-700 ml-1 mb-2 block">Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 ml-1 mb-2 block">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 ml-1 mb-2 block">Subject</label>
                    <select
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 appearance-none"
                    >
                      <option value="">Select a topic</option>
                      <option value="appointments">Appointments</option>
                      <option value="billing">Billing & Subscription</option>
                      <option value="technical">Technical Issue</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 ml-1 mb-2 block">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 resize-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Quick Contact Bar */}
        <div className="mt-16 bg-gray-900 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1">Need urgent help?</h4>
              <p className="text-gray-400 font-medium">Call our support line 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-2xl font-black tracking-tight">+1 (800) 555-MEDI</span>
            <div className="hidden md:flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Available Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
