import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Play,
  MessageCircle,
  Mic,
  Phone
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { carsData } from '../data/carsData';
import { testimonialsData } from '../data/testimonialsData';

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const navigate = useNavigate();

  const heroSlides = [
    {
      id: 1,
      title: "Experience Luxury Redefined",
      subtitle: "Discover our exclusive collection of premium vehicles",
      image: "https://images.pexels.com/photos/100650/pexels-photo-100650.jpeg",
      cta: "Explore Inventory",
      link: "/inventory"
    },
    {
      id: 2,
      title: "AI-Powered Car Shopping",
      subtitle: "Let our AI receptionist find your perfect match",
      image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
      cta: "Try AI Assistant",
      link: "/ai-receptionist"
    },
    {
      id: 3,
      title: "Book Your Test Drive Today",
      subtitle: "Experience performance like never before",
      image: "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg",
      cta: "Schedule Test Drive",
      link: "/test-drive"
    }
  ];

  const features = [
    {
      icon: Bot,
      title: "AI Receptionist",
      description: "24/7 intelligent assistance for all your car shopping needs",
      link: "/ai-receptionist"
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Schedule test drives with our seamless booking system",
      link: "/test-drive"
    },
    {
      icon: Calculator,
      title: "Finance Calculator",
      description: "Calculate payments and explore financing options instantly",
      link: "/finance"
    },
    {
      icon: Award,
      title: "Premium Service",
      description: "White-glove service and luxury amenities included",
      link: "/services"
    }
  ];

  const stats = [
    { icon: Car, value: "500+", label: "Premium Vehicles" },
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Star, value: "4.9", label: "Customer Rating" }
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

  const featuredCars = carsData.slice(0, 3);
  const topTestimonials = testimonialsData.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={heroSlides[currentSlide].image}
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {heroSlides[currentSlide].title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to={heroSlides[currentSlide].link}>
              <Button size="lg" className="mr-4">
                {heroSlides[currentSlide].cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-cyan-400' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Predictive Search */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Find Your Dream Car
            </h2>
            
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by make, model, year, or type..."
                  className="w-full px-6 py-4 pl-12 bg-white/10 backdrop-blur-sm border border-gray-600 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2"
              >
                Search
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full">
                    <stat.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Fast & Furious?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of car shopping with our cutting-edge technology and premium service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.link}>
                  <Card hover className="p-8 text-center h-full">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full">
                        <feature.icon className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured Vehicles
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Explore our handpicked selection of premium cars
            </p>
            <Link to="/inventory">
              <Button variant="outline">
                View All Inventory
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden">
                  <img
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-400 mb-4">{car.year}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        ${car.price.toLocaleString()}
                      </span>
                      <Link to={`/inventory/${car.id}`}>
                        <Button size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Read reviews from satisfied customers
            </p>
            <Link to="/testimonials">
              <Button variant="outline">
                Read All Reviews
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.carPurchased}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Find Your Dream Car?
            </h2>
            <p className="text-xl text-cyan-100 mb-8">
              Start your journey with our AI-powered car shopping experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inventory">
                <Button size="lg" variant="secondary">
                  Browse Inventory
                </Button>
              </Link>
              <Link to="/ai-receptionist">
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-cyan-600">
                  Try AI Assistant
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Chatbot */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl"
          >
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-6 h-6 text-cyan-400" />
                  <span className="text-white font-semibold">AI Assistant</span>
                </div>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4 h-64 overflow-y-auto">
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                <p className="text-white text-sm">
                  Hello! I'm your AI assistant. How can I help you find your perfect car today?
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-4">
        {/* AI Chatbot Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChatbot(!showChatbot)}
          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center"
        >
          <Bot className="w-6 h-6" />
        </motion.button>

        {/* Voice Assistant Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsVoiceActive(!isVoiceActive)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isVoiceActive 
              ? 'bg-gradient-to-r from-pink-500 to-red-600 animate-pulse' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:shadow-gray-500/25'
          }`}
        >
          <Mic className="w-6 h-6" />
        </motion.button>

        {/* Book Test Drive CTA */}
        <Link to="/test-drive">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-pink-500/25 flex items-center justify-center"
          >
            <Calendar className="w-6 h-6" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
};