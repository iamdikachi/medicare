import { motion } from 'motion/react';
import { Shield, Clock, Heart, Users, CheckCircle, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const { login } = useAuth();

  const features = [
    {
      icon: Shield,
      title: "Secure Records",
      description: "Your health records are encrypted and stored securely following the highest medical standards."
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Consult with licensed professionals anytime, anywhere. No more waiting rooms."
    },
    {
      icon: Heart,
      title: "Continuous Care",
      description: "Subscription-based plans ensure affordable, long-term health management."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  <CheckCircle className="h-3 w-3" />
                  Licensed Medical Professionals
                </div>
                <h1 className="text-5xl lg:text-7xl font-sans font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                  Your Health, <br />
                  <span className="text-blue-600">Simplified.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  The comprehensive online medical consultation platform. Book appointments, 
                  access secure health records, and subcribe for continuous professional care.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
                  >
                    Start Consultation <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link to="/doctors" className="w-full sm:w-auto bg-white text-center text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
                    View Doctors
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative z-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070"
                  alt="Doctor with tablet"
                  className="rounded-[3rem] shadow-2xl ring-1 ring-gray-100 object-cover aspect-[4/3]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Card */}
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl ring-1 ring-gray-100 hidden md:block animate-bounce-slow">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-2xl">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">500+</div>
                      <div className="text-sm text-gray-500 font-medium tracking-tight">Active Doctors</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative Background Blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/50 rounded-full blur-[100px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-sans font-bold text-gray-900 mb-4">Why Choose MediCare?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We leverage digital technology to enhance access to quality healthcare services 
              regardless of your geographical location.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:shadow-blue-100/20"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium transition-colors group-hover:text-gray-900">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-sans font-bold text-gray-900 mb-4">Affordable Health Plans</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Choose a subscription that fits your lifestyle and healthcare needs. 
              Continuous care for a peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                name: 'Basic', 
                price: '0', 
                features: ['1 Free Consultation', 'Secure Records', 'Standard Response'],
                color: 'blue'
              },
              { 
                name: 'Standard', 
                price: '29', 
                features: ['Unlimited Consultations', 'Priority Support', 'Family Sharing', 'Health Tracking'],
                color: 'gray',
                popular: true
              },
              { 
                name: 'Premium', 
                price: '59', 
                features: ['Personal Health Manager', '24/7 Priority Access', 'Specialist Referrals', 'Home Sample Collection'],
                color: 'blue'
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={cn(
                  "relative p-10 rounded-[3rem] border transition-all hover:scale-105 duration-300",
                  plan.popular ? "bg-gray-900 text-white border-gray-900 shadow-2xl" : "bg-white border-gray-100 shadow-sm"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-xl font-bold mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-sans font-black">${plan.price}</span>
                  <span className={plan.popular ? "text-gray-400" : "text-gray-500"}>/month</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium">
                      <div className={cn("p-1 rounded-full", plan.popular ? "bg-blue-600/20 text-blue-400" : "bg-green-50 text-green-600")}>
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all active:scale-95",
                  plan.popular ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100"
                )}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="font-sans font-bold text-xl tracking-tight text-gray-900">
                  MediCare
                </span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
                Designing healthcare for the digital age. We provide secure, affordable, and accessible 
                medical consultations for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Explore</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Our Doctors</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Subscriptions</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Support</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              © 2026 MediCare Healthcare. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Activity className="h-5 w-5 text-gray-300" />
              <Activity className="h-5 w-5 text-gray-300" />
              <Activity className="h-5 w-5 text-gray-300" />
            </div>
          </div>
        </div>
      </footer>
    </div>

  );
}
