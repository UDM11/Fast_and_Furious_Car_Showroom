import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Car,
  Users,
  Award,
  Bot,
  Calendar,
  Calculator,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Heart,
  TrendingUp,
  Sparkles,
  Play,
  CheckCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useInventory } from '../context/InventoryContext';
import { testimonialsData } from '../data/testimonialsData';
import { formatNpr } from '../utils/currency';

// Floating particles component
const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Animated counter component
const AnimatedCounter: React.FC<{ value: string; label: string; icon: React.ElementType }> = ({ value, label, icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
      const increment = numericValue / 50;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center group"
    >
      <div className="flex justify-center mb-4">
        <motion.div 
          className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </div>
      <motion.div 
        className="text-3xl md:text-4xl font-bold text-white mb-2"
        animate={{ scale: isInView ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {value.includes('+') ? `${count}+` : value.includes('.') ? value : count}
      </motion.div>
      <div className="text-gray-400 text-sm md:text-base">{label}</div>
    </motion.div>
  );
};

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const heroSlides = [
    {
      id: 1,
      title: "Experience Luxury Redefined",
      subtitle: "Discover our exclusive collection of premium vehicles with cutting-edge technology",
      image: "https://images.pexels.com/photos/100650/pexels-photo-100650.jpeg",
      cta: "Explore Inventory",
      link: "/inventory",
      accent: "from-cyan-400 to-blue-500"
    },
    {
      id: 2,
      title: "AI-Powered Car Shopping",
      subtitle: "Let our intelligent AI receptionist find your perfect automotive match",
      image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      cta: "Try AI Assistant",
      link: "/ai-receptionist",
      accent: "from-blue-400 to-indigo-500"
    },
    {
      id: 3,
      title: "Book Your Test Drive Today",
      subtitle: "Experience unparalleled performance and luxury in every drive",
      image: "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg",
      cta: "Schedule Test Drive",
      link: "/test-drive",
      accent: "from-cyan-500 to-blue-600"
    }
  ];

  const features = [
    {
      icon: Bot,
      title: "AI Receptionist",
      description: "24/7 intelligent assistance powered by advanced machine learning",
      link: "/ai-receptionist",
      color: "from-cyan-500 to-blue-500",
      delay: 0
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Lightning-fast test drive scheduling with real-time availability",
      link: "/test-drive",
      color: "from-blue-500 to-indigo-500",
      delay: 0.1
    },
    {
      icon: Calculator,
      title: "Smart Finance",
      description: "AI-powered financing with personalized payment options",
      link: "/finance",
      color: "from-indigo-500 to-blue-600",
      delay: 0.2
    },
    {
      icon: Shield,
      title: "Premium Protection",
      description: "Comprehensive warranty and white-glove concierge service",
      link: "/services",
      color: "from-cyan-500 to-indigo-500",
      delay: 0.3
    },
    {
      icon: Clock,
      title: "Express Delivery",
      description: "Same-day delivery available for select premium vehicles",
      link: "/services",
      color: "from-blue-600 to-cyan-500",
      delay: 0.4
    },
    {
      icon: Heart,
      title: "Customer Care",
      description: "Dedicated relationship managers for personalized service",
      link: "/services",
      color: "from-cyan-400 to-blue-600",
      delay: 0.5
    }
  ];

  const stats = [
    { icon: Car, value: "500+", label: "Premium Vehicles" },
    { icon: Users, value: "10000+", label: "Happy Customers" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Star, value: "4.9", label: "Customer Rating" }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Certified Pre-Owned",
      description: "Every vehicle undergoes rigorous 200-point inspection"
    },
    {
      icon: TrendingUp,
      title: "Best Value Guarantee",
      description: "We'll match any competitor's price plus give you NPR 500 more"
    },
    {
      icon: Sparkles,
      title: "Luxury Experience",
      description: "Premium showroom with VIP lounges and concierge service"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const { cars } = useInventory();
  const featuredCars = cars.slice(0, 3);
  const topTestimonials = testimonialsData.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <FloatingParticles />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <motion.img
              src={heroSlides[currentSlide].image}
              alt="Hero"
              className="w-full h-full object-cover"
              style={{ y: y1 }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            ></motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-5">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
          style={{ y: y2 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            <span className="block">{heroSlides[currentSlide].title}</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to={heroSlides[currentSlide].link}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    {heroSlides[currentSlide].cta}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
            </Link>
            
            <motion.button
              onClick={() => setIsVideoPlaying(true)}
              className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors duration-300 group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <Play className="w-5 h-5" />
              </div>
              <span className="text-lg font-medium">Watch Showroom Tour</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Navigation Arrows */}
        <motion.button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 group"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform duration-300" />
        </motion.button>
        <motion.button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 group"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>

        {/* Enhanced Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-gradient-to-r from-cyan-400 to-blue-500' 
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </section>

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
                src="https://www.youtube.com/embed/T48K6pSifN4?autoplay=1"
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

      {/* Enhanced Search Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
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
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Find Your Dream Car
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI-powered search with instant results
            </motion.p>
            
            <motion.form 
              onSubmit={handleSearch} 
              className="relative max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <motion.input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by make, model, year, or type..."
                    className="w-full px-6 py-5 pl-14 bg-white/10 backdrop-blur-sm border border-gray-600/50 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-lg"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  
                  {/* Search suggestions */}
                  <motion.div 
                    className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm rounded-xl border border-gray-600/50 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: searchQuery ? 1 : 0, y: searchQuery ? 0 : -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {searchQuery && (
                      <div className="p-4 space-y-2">
                        <div className="text-gray-300 text-sm font-medium mb-2">Popular Searches:</div>
                        {['BMW M3', 'Tesla Model S', 'Porsche 911', 'Mercedes AMG'].map((suggestion, index) => (
                          <motion.button
                            key={suggestion}
                            type="button"
                            onClick={() => setSearchQuery(suggestion)}
                            className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="px-8 py-5 text-lg font-semibold whitespace-nowrap group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Search
                      <Search className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-black px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-400">
              Join our community of satisfied customers
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the difference with our premium services and guarantees
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <Card className="p-8 text-center h-full hover:bg-gradient-to-b hover:from-gray-800/50 hover:to-gray-900/50 transition-all duration-500">
                  <motion.div 
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                      <benefit.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Why Choose Fast & Furious?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience the future of car shopping with our cutting-edge technology, premium service, and unmatched customer satisfaction
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateY: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: feature.delay,
                  duration: 0.6,
                  ease: "easeOut"
                }}
                className="group"
              >
                <Link to={feature.link}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-8 text-center h-full relative overflow-hidden group-hover:bg-gradient-to-b group-hover:from-gray-800/50 group-hover:to-gray-900/50 transition-all duration-500">
                      {/* Animated background gradient */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                        initial={{ scale: 0, rotate: 45 }}
                        whileHover={{ scale: 1.5, rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      <div className="relative z-10">
                        <motion.div 
                          className="flex justify-center mb-6"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`p-4 bg-gradient-to-r ${feature.color} bg-opacity-20 rounded-full group-hover:bg-opacity-30 transition-all duration-300`}>
                            <feature.icon className="w-8 h-8 text-white" />
                          </div>
                        </motion.div>
                        
                        <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                          {feature.description}
                        </p>
                        
                        <motion.div
                          className="mt-6 flex items-center justify-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ x: -20 }}
                          whileHover={{ x: 0 }}
                        >
                          <span className="text-sm font-medium mr-2">Learn More</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Cars */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Vehicles
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore our handpicked selection of premium vehicles, each one carefully curated for excellence
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/inventory">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="inline-flex items-center group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      View All Inventory
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 50, rotateY: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -15, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Card className="overflow-hidden group-hover:shadow-2xl group-hover:shadow-cyan-500/10 transition-all duration-500">
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Floating badge */}
                      <motion.div
                        className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white text-sm font-medium"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + 0.5, duration: 0.3 }}
                      >
                        Featured
                      </motion.div>
                    </div>
                    
                    <div className="p-6">
                      <motion.h3 
                        className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
                      >
                        {car.make} {car.model}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-gray-400 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 0.4, duration: 0.4 }}
                      >
                        {car.year} • Premium Package
                      </motion.p>
                      
                      <motion.div 
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.5, duration: 0.4 }}
                      >
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                          {formatNpr(car.price)}
                        </span>
                        <Link to={`/inventory/${car.id}`}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button size="sm" className="group/btn relative overflow-hidden">
                              <span className="relative z-10 flex items-center">
                                View Details
                                <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
                              </span>
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                              />
                            </Button>
                          </motion.div>
                        </Link>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              What Our Customers Say
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join thousands of satisfied customers who found their dream car with us
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/testimonials">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="inline-flex items-center group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Read All Reviews
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50, rotateY: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 h-full relative overflow-hidden group-hover:bg-gradient-to-b group-hover:from-gray-800/50 group-hover:to-gray-900/50 transition-all duration-500">
                    {/* Quote decoration */}
                    <div className="absolute top-4 right-4 text-6xl text-cyan-400/10 font-serif">"
                    </div>
                    
                    <div className="relative z-10">
                      <motion.div 
                        className="flex items-center space-x-1 mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 + 0.4 + i * 0.1, duration: 0.2 }}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                i < testimonial.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-600'
                              }`}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                      
                      <motion.p 
                        className="text-gray-300 mb-8 text-lg leading-relaxed group-hover:text-gray-200 transition-colors duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.5, duration: 0.4 }}
                      >
                        "{testimonial.text}"
                      </motion.p>
                      
                      <motion.div 
                        className="flex items-center space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.6, duration: 0.4 }}
                      >
                        <motion.img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-400/20 group-hover:ring-cyan-400/40 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                        />
                        <div>
                          <h4 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors duration-300">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                            {testimonial.carPurchased}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full blur-xl"
            animate={{
              y: [0, 20, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-xs font-semibold uppercase tracking-[0.35em] text-white/70"
            >
              Start Your Journey Today
            </motion.p>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Ready to Find Your
              <span className="block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Dream Car?
                </span>
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-cyan-100 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Experience the future of car shopping with our AI-powered platform, premium service, and unmatched selection
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link to="/inventory">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Browse Inventory
                      <Car className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>
              
              <Link to="/ai-receptionist">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-4 text-lg font-semibold bg-white/10 border-2 border-white text-white hover:bg-white/20 hover:border-white group relative overflow-hidden backdrop-blur-sm"
                  >
                    <span className="relative z-10 flex items-center">
                      Try AI Assistant
                      <Bot className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-cyan-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">No Hidden Fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Certified Pre-Owned</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium">Customer Satisfaction Guaranteed</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};