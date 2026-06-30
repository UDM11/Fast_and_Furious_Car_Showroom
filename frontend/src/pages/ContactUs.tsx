import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Sparkles,
  Clock,
  Users,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Navigation,
  Headphones,
  Calendar,
  Globe,
  Shield,
  Heart,
  Zap
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// Floating particles component for contact
const ContactParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 25 + 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Animated counter component
const AnimatedCounter: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ 
  value, 
  suffix = '', 
  duration = 2000 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView && value > 0) {
      const increment = value / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);
  
  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  carModel: string;
  phone: string;
  preferredContact: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    carModel: '',
    phone: '',
    preferredContact: 'email'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLabel] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      setTimeout(() => {
        setSuccess('Your message has been sent successfully!');
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          carModel: '',
          phone: '',
          preferredContact: 'email'
        });
        setLoading(false);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    } catch {
      setError('Something went wrong. Please try again later.');
      setLoading(false);
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const carModels = [
    'Select Car Model', 
    'Luxury Sedan', 
    'Premium SUV', 
    'Sports Car', 
    'Electric Vehicle',
    'Hybrid Vehicle',
    'Convertible',
    'Coupe',
    'Hatchback'
  ];
  
  const contactMethods = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-20 pb-16 relative overflow-hidden">
      <ContactParticles />
      
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
          style={{ y: y1 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block">
              Contact
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Our Team
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Ready to find your dream car? Our expert team is here to help you every step of the way. Reach out today!
          </motion.p>
        </motion.div>

        <motion.div
          ref={formRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Enhanced Contact Info */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Contact Methods */}
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: 'Email Us',
                  info: 'support@fastfurious.com',
                  subInfo: 'We respond within 2 hours',
                  color: 'from-blue-500 to-cyan-500',
                  href: 'mailto:support@fastfurious.com'
                },
                {
                  icon: Phone,
                  title: 'Call Us',
                  info: '+1 (555) 123-4567',
                  subInfo: 'Mon-Sat: 8AM-8PM, Sun: 10AM-6PM',
                  color: 'from-cyan-500 to-blue-500',
                  href: 'tel:+15551234567'
                },
                {
                  icon: MapPin,
                  title: 'Visit Us',
                  info: '123 Speed Avenue, Racing District',
                  subInfo: 'Premium showroom with VIP lounge',
                  color: 'from-blue-500 to-indigo-500',
                  href: 'https://maps.google.com'
                }
              ].map((contact, index) => (
                <motion.a
                  key={contact.title}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="block group"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className={`p-3 bg-gradient-to-r ${contact.color} bg-opacity-20 rounded-full group-hover:bg-opacity-30 transition-all duration-300`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <contact.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors duration-300">
                          {contact.title}
                        </h3>
                        <p className="text-gray-300 font-medium mb-1">
                          {contact.info}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {contact.subInfo}
                        </p>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Enhanced Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="pt-8 border-t border-gray-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                Follow Us
              </h3>
              
              <div className="flex gap-4">
                {[
                  { icon: Facebook, name: 'Facebook', color: 'hover:text-blue-500', href: '#' },
                  { icon: Twitter, name: 'Twitter', color: 'hover:text-sky-500', href: '#' },
                  { icon: Instagram, name: 'Instagram', color: 'hover:text-pink-500', href: '#' }
                ].map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    title={social.name}
                    className={`p-3 bg-gray-800/50 rounded-full text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700/50`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Map */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-8"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 relative">
                <iframe
                  title="Fast & Furious Car Showroom Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0271715608636!2d85.32216601506141!3d27.71724573168342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1909b0c12b2d%3A0xe0f02a2f07d7cabc!2sKathmandu!5e0!3m2!1sen!2snp!4v1617850684530!5m2!1sen!2snp"
                  className="w-full h-64 md:h-80 border-0"
                  loading="lazy"
                />
                
                <motion.a
                  href="https://www.google.com/maps/dir/?api=1&destination=123+Speed+Avenue,Racing+District"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Navigation className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Get Directions
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

        {/* Contact Form */}
        <div className="flex-1 bg-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Name */}
            <div className="relative">
              <Input
                type="text"
                name="name"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                required
                className="peer hover:shadow-md transition-shadow"
              />
              <label className="absolute left-3 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-cyan-400 peer-focus:text-sm transition-all">
                Your Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <Input
                type="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
                className="peer hover:shadow-md transition-shadow"
              />
              <label className="absolute left-3 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-cyan-400 peer-focus:text-sm transition-all">
                Your Email
              </label>
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>

            {/* Subject */}
            <div className="relative">
              <Input
                type="text"
                name="subject"
                placeholder=" "
                value={formData.subject}
                onChange={handleChange}
                required
                className="peer hover:shadow-md transition-shadow"
              />
              <label className="absolute left-3 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-cyan-400 peer-focus:text-sm transition-all">
                Subject
              </label>
            </div>

            {/* Car Model */}
            <div className="relative">
              <select
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                required
                className="peer w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none hover:shadow-md transition-shadow"
              >
                {carModels.map((model) => (
                  <option key={model} value={model === "Select Car Model" ? "" : model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                name="message"
                placeholder=" "
                value={formData.message}
                onChange={handleChange}
                required
                rows={12}
                className="peer w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none resize-none hover:shadow-md transition-shadow"
              ></textarea>
              <label className="absolute left-3 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-cyan-400 peer-focus:text-sm transition-all">
                Your Message
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              {loading ? "Sending..." : <>Send Message <Send size={18} /></>}
            </Button>

            {success && <p className="text-green-400 text-sm mt-2 animate-pulse">{success}</p>}
          </form>
        </div>
      </motion.div>

        {/* Contact Statistics */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              We're Here to Help
            </h2>
            <p className="text-xl text-gray-400">
              Our commitment to customer service excellence
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, value: 2, suffix: 'hrs', label: 'Response Time' },
              { icon: Users, value: 98, suffix: '%', label: 'Satisfaction Rate' },
              { icon: Award, value: 15, suffix: '+', label: 'Years Experience' },
              { icon: Star, value: 4.9, suffix: '/5', label: 'Customer Rating' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div 
                  className="flex justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-4xl font-bold text-white mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.div>
                
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-400">
                Quick answers to common questions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: 'What are your showroom hours?',
                  answer: 'Mon-Sat: 8AM-8PM, Sunday: 10AM-6PM. We also offer appointments outside these hours.'
                },
                {
                  question: 'Do you offer financing options?',
                  answer: 'Yes, we provide competitive financing with rates starting from 2.9% APR and flexible terms.'
                },
                {
                  question: 'Can I schedule a test drive online?',
                  answer: 'Absolutely! You can book test drives through our website or by calling us directly.'
                },
                {
                  question: 'Do you accept trade-ins?',
                  answer: 'Yes, we offer competitive trade-in values with instant quotes and market analysis.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-cyan-400 mr-2" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
      
      {/* Enhanced WhatsApp Button */}
      <div className="fixed right-4 sm:right-6 bottom-20 z-50 flex items-center gap-3 justify-end pointer-events-none">
        <AnimatePresence>
          {showLabel && (
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 text-sm select-none whitespace-nowrap shadow-lg pointer-events-auto"
            >
              <MessageCircle size={14} /> WhatsApp Chat
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.a
          href="https://wa.me/15551234567"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/25 pointer-events-auto"
          aria-label="Chat on WhatsApp"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle size={24} color="white" />
        </motion.a>
      </div>
      
    </div>
  );
};

export default ContactUs;