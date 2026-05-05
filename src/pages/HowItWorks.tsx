import React from 'react';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  Search, 
  Calendar, 
  Video, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight,
  Shield,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up in seconds with your email and set up your health profile with basic medical information.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Search,
      title: "Find a Specialty",
      description: "Browse through our network of certified specialists - from cardiologists to pediatricians.",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: Calendar,
      title: "Book Instantly",
      description: "Select a date and time that fits your schedule. Our real-time calendar makes booking effortless.",
      color: "bg-amber-50 text-amber-600"
    },
    {
      icon: Video,
      title: "Consult Remotely",
      description: "Join your consultation via secure video, audio, or chat from the comfort of your home.",
      color: "bg-rose-50 text-rose-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gray-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block">
              Guided Tour
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              Healthcare that works <br/> <span className="text-blue-500">around you.</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed mb-10">
              MediCare simplifies the connection between you and world-class doctors. 
              No waiting rooms, no travel, just quality care 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
                Get Started Now
              </Link>
              <Link to="/doctors" className="w-full sm:w-auto bg-white/10 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10">
                Browse Doctors
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -ml-64 -mb-64" />
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight uppercase">Four Simple Steps</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center group"
              >
                <div className={cn(
                  "w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:scale-110 group-hover:-rotate-3 shadow-lg shadow-gray-100",
                  step.color
                )}>
                  <step.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+4rem)] w-[calc(100%-8rem)] border-t-2 border-dashed border-gray-100" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
               <motion.div
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
               >
                 <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 block">Unmatched Security</span>
                 <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                   Your privacy is our <br/> <span className="text-blue-600">highest priority.</span>
                 </h2>
                 <div className="space-y-8">
                   {[
                     { icon: Shield, title: "HIPAA Compliant", desc: "We adhere strictly to health data privacy standards." },
                     { icon: Smartphone, title: "Secure Platform", desc: "All communication is encrypted end-to-end." },
                     { icon: CreditCard, title: "Transparent Pricing", desc: "No hidden fees or surprise medical bills." }
                   ].map((benefit, i) => (
                     <div key={i} className="flex gap-6">
                       <div className="bg-white p-3 rounded-2xl shadow-sm h-fit">
                         <benefit.icon className="h-6 w-6 text-gray-900" />
                       </div>
                       <div>
                         <h4 className="text-lg font-bold text-gray-900 mb-1">{benefit.title}</h4>
                         <p className="text-gray-500 font-medium">{benefit.desc}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </motion.div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="relative z-10"
               >
                  <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
                      alt="Doctor using tablet" 
                      className="rounded-[2.5rem] w-full h-[500px] object-cover"
                    />
                  </div>
                  {/* Floating element */}
                  <div className="absolute -bottom-10 -right-10 bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl border border-white/10 hidden md:block max-w-xs">
                     <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-4" />
                     <p className="text-lg font-bold mb-2">Instant Verification</p>
                     <p className="text-sm text-gray-400 font-medium">All our doctors go through a rigorous secondary verification process.</p>
                  </div>
               </motion.div>
               {/* Background blob */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full blur-[100px] -z-10 opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="bg-blue-600 rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to prioritize <br/> your health?</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/signup" className="w-full sm:w-auto bg-white text-blue-600 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl active:scale-95">
                    Start Your Free Account
                  </Link>
                  <button className="flex items-center gap-2 font-bold text-lg hover:translate-x-1 transition-all">
                    Talk to our support <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
              {/* Decorative circle */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-32 -mb-32" />
           </div>
        </div>
      </section>
    </div>
  );
}
