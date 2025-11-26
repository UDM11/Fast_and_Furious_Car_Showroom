import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Wrench,
  RefreshCw,
  Shield,
  DollarSign,
  Crown,
  Zap,
  Sparkles,
  Star,
  CheckCircle,
  ArrowRight,
  Award,
  Clock,
  Users,
  Heart,
  Target,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Play,
  Headphones
} from 'lucide-react';
import { servicesData } from '../data/servicesData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Floating particles component for services
const ServicesParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Service icon mapping
const serviceIcons = {
  '🔧': Wrench,
  '🔄': RefreshCw,
  '🛡️': Shield,
  '💰': DollarSign,
  '👔': Crown,
  '⚡': Zap
};

// Animated counter component
const AnimatedCounter: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ 
  value, 
  suffix = '', 
  duration = 2000 
}) => {
  const ref = React.useRef(null);
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

export const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-20 pb-16 relative overflow-hidden">
      <ServicesParticles />
      
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
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
          className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
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
          <motion.div
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-purple-300 text-sm font-medium flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Services
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block">
              Luxury Car
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Services
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Experience unparalleled luxury with our comprehensive suite of premium automotive services, designed for discerning customers who demand excellence
          </motion.p>
          
          {/* Service Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="flex items-center space-x-2 text-purple-400">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Premium Quality</span>
            </div>
            <div className="flex items-center space-x-2 text-cyan-400">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2 text-pink-400">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Customer First</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {servicesData.map((service, index) => {
              const IconComponent = serviceIcons[service.icon as keyof typeof serviceIcons] || Wrench;
              const isSelected = selectedService === service.id;
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50, rotateY: 15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                  className="group"
                  onMouseEnter={() => setSelectedService(service.id)}
                  onMouseLeave={() => setSelectedService(null)}
                >
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`p-8 h-full relative overflow-hidden transition-all duration-500 ${
                      isSelected 
                        ? 'bg-gradient-to-b from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/10' 
                        : 'bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-gray-600/50'
                    }`}>
                      {/* Animated background gradient */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={{ scale: 0, rotate: 45 }}
                        whileHover={{ scale: 1.5, rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      <div className="relative z-10">
                        {/* Service Icon */}
                        <motion.div 
                          className="flex justify-center mb-6"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                            <IconComponent className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                          </div>
                        </motion.div>
                        
                        {/* Service Title */}
                        <h2 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-purple-400 transition-colors duration-300">
                          {service.title}
                        </h2>
                        
                        {/* Service Description */}
                        <p className="text-gray-400 mb-6 text-center group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Enhanced Features List */}
                        <motion.ul 
                          className="mb-8 space-y-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {service.features.map((feature, featureIndex) => (
                            <motion.li
                              key={featureIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + index * 0.1 + featureIndex * 0.05 }}
                              className="flex items-start group/item"
                            >
                              <motion.div
                                className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5"
                                whileHover={{ scale: 1.2 }}
                              >
                                <CheckCircle className="w-3 h-3 text-white" />
                              </motion.div>
                              <span className="text-gray-300 group-hover/item:text-white transition-colors duration-300 text-sm">
                                {feature}
                              </span>
                            </motion.li>
                          ))}
                        </motion.ul>

                        {/* Price & Action */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-700/50 group-hover:border-gray-600/50 transition-colors duration-300">
                          <motion.div 
                            className="mb-4 sm:mb-0"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                              {service.price}
                            </span>
                          </motion.div>
                          
                          <Link to={`/services/${service.slug}`} className="w-full sm:w-auto">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button className="w-full sm:w-auto group/btn relative overflow-hidden">
                                <span className="relative z-10 flex items-center justify-center">
                                  Learn More
                                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: 0 }}
                                  transition={{ duration: 0.3 }}
                                />
                              </Button>
                            </motion.div>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Why Choose Us Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <Card className="p-12 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-purple-500/20 relative overflow-hidden">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <div className="relative z-10">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Why Choose Our
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"> Services?</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Experience the difference with our premium automotive services
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Award,
                    title: 'Certified Technicians',
                    description: 'Expert professionals with specialized luxury car training',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    icon: Shield,
                    title: 'Premium OEM Parts',
                    description: 'Genuine parts with quality certification guarantee',
                    color: 'from-green-500 to-emerald-500'
                  },
                  {
                    icon: Crown,
                    title: 'VIP Experience',
                    description: 'Personalized luxury service with premium hospitality',
                    color: 'from-purple-500 to-pink-500'
                  },
                  {
                    icon: Target,
                    title: 'Transparent Pricing',
                    description: 'No hidden fees with complete honesty guarantee',
                    color: 'from-orange-500 to-red-500'
                  },
                  {
                    icon: Clock,
                    title: '24/7 Support',
                    description: 'Round-the-clock customer support and roadside assistance',
                    color: 'from-cyan-500 to-blue-500'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Satisfaction Guarantee',
                    description: '100% satisfaction or your money back promise',
                    color: 'from-pink-500 to-rose-500'
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="group"
                  >
                    <motion.div
                      className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <motion.div 
                        className={`p-4 bg-gradient-to-r ${benefit.color} bg-opacity-20 rounded-full mb-4 group-hover:bg-opacity-30 transition-all duration-300`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <benefit.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                        {benefit.description}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Service Statistics */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-400">
              Our commitment to excellence speaks for itself
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: 15000, suffix: '+', label: 'Happy Customers' },
              { icon: Award, value: 25, suffix: '+', label: 'Years Experience' },
              { icon: Star, value: 98, suffix: '%', label: 'Satisfaction Rate' },
              { icon: CheckCircle, value: 50000, suffix: '+', label: 'Services Completed' }
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
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-purple-400" />
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

        {/* Contact CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-12 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/30 text-center relative overflow-hidden">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            <div className="relative z-10">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to Experience
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"> Premium Service?</span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Contact our service experts today and discover why thousands of customers trust us with their luxury vehicles
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="px-8 py-4 text-lg font-semibold group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Call Now: (555) 123-4567
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="px-8 py-4 text-lg font-semibold group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Email Us
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Contact Info */}
              <motion.div
                className="flex flex-wrap justify-center gap-8 mt-8 text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>123 Speed Avenue, Racing District</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Sat: 8AM-8PM, Sun: 10AM-6PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Headphones className="w-4 h-4" />
                  <span>24/7 Emergency Support</span>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.section>
      </div>
      
      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg shadow-purple-500/25 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: scrollY > 400 ? 1 : 0,
          scale: scrollY > 400 ? 1 : 0
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronRight className="w-6 h-6 -rotate-90" />
      </motion.button>
      
      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};