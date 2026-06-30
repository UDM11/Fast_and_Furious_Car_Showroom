import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Car, 
  User, 
  Mail, 
  Phone, 
  CheckCircle,
  MapPin,
  AlertCircle,
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  ChevronRight,
  Award,
  Heart,
  Navigation,
  Timer,
  Users,
  TrendingUp
} from 'lucide-react';
import { carsData } from '../data/carsData';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { formatNpr } from '../utils/currency';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// Floating particles component for test drive
const TestDriveParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
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
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Step indicator component
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-12">
      {[...Array(totalSteps)].map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <React.Fragment key={stepNumber}>
            <motion.div
              className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                isActive
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                  : isCompleted
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                  : 'border-gray-600 bg-gray-800/50 text-gray-400'
              }`}
              whileHover={{ scale: 1.1 }}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {isCompleted ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="font-bold">{stepNumber}</span>
              )}
              
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            {index < totalSteps - 1 && (
              <motion.div
                className={`w-16 h-1 rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-blue-500' : 'bg-gray-700'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const TestDrive: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preSelectedCarId = searchParams.get('car');
  const { addBooking } = useBooking();
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowScrollTop(latest > 400);
  });
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCar, setSelectedCar] = useState(preSelectedCarId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Generate available dates (next 30 days, excluding Sundays)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (0 = Sunday)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();
  const selectedCarData = carsData.find(car => car.id === selectedCar);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedCar) newErrors.selectedCar = 'Please select a vehicle';
    if (!selectedDate) newErrors.selectedDate = 'Please select a date';
    if (!selectedTime) newErrors.selectedTime = 'Please select a time';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add booking
    addBooking({
      carId: selectedCar,
      userId: user?.id || 'guest',
      date: selectedDate,
      time: selectedTime,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: 'pending'
    });

    setIsSubmitting(false);
    setShowConfirmation(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const totalSteps = 4;
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-20 pb-16 relative overflow-hidden">
      <TestDriveParticles />
      
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          {!showConfirmation ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
            >
              {/* Enhanced Header */}
              <motion.div 
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
                    Book Your
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Test Drive
                  </span>
                </motion.h1>
                <motion.div
                  className="flex flex-wrap justify-center gap-8 mt-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <div className="flex items-center space-x-2 text-green-400">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Fully Insured</span>
                  </div>
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <Timer className="w-5 h-5" />
                    <span className="font-semibold">30-Min Sessions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <Star className="w-5 h-5" />
                    <span className="font-semibold">Expert Guidance</span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Step Indicator */}
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Step 1: Vehicle Selection */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="p-8 md:p-12 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                            <motion.div
                              className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mr-4"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Car className="w-8 h-8 text-cyan-400" />
                            </motion.div>
                            Select Your Dream Vehicle
                          </h2>
                          
                          {selectedCarData ? (
                            <motion.div 
                              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-cyan-500/30 p-8"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                                <motion.div 
                                  className="relative overflow-hidden rounded-xl"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <img 
                                    src={selectedCarData.images[0]} 
                                    alt={`${selectedCarData.make} ${selectedCarData.model}`}
                                    className="w-full md:w-48 h-32 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </motion.div>
                                
                                <div className="flex-1 text-center md:text-left">
                                  <h3 className="text-2xl font-bold text-white mb-2">
                                    {selectedCarData.make} {selectedCarData.model}
                                  </h3>
                                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                                    <span className="px-3 py-1 bg-gray-700/50 rounded-full text-gray-300 text-sm">
                                      {selectedCarData.year}
                                    </span>
                                    <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-sm font-semibold">
                                      {formatNpr(selectedCarData.price)}
                                    </span>
                                    <span className="px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm flex items-center">
                                      <Star className="w-3 h-3 mr-1" />
                                      {selectedCarData.rating}
                                    </span>
                                  </div>
                                  <p className="text-gray-400 mb-6">
                                    Experience the perfect blend of luxury and performance
                                  </p>
                                </div>
                                
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button 
                                    type="button"
                                    variant="outline" 
                                    onClick={() => setSelectedCar('')}
                                    className="group relative overflow-hidden"
                                  >
                                    <span className="relative z-10 flex items-center">
                                      Change Vehicle
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
                              </div>
                            </motion.div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {carsData.slice(0, 6).map((car, index) => (
                                <motion.div
                                  key={car.id}
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  whileHover={{ y: -8, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setSelectedCar(car.id)}
                                  className={`cursor-pointer group relative overflow-hidden rounded-xl transition-all duration-300 ${
                                    selectedCar === car.id
                                      ? 'ring-2 ring-cyan-500 bg-gradient-to-b from-cyan-500/10 to-blue-500/10'
                                      : 'hover:ring-2 hover:ring-gray-600 bg-gradient-to-b from-gray-800/50 to-gray-900/50'
                                  }`}
                                >
                                  <div className="relative overflow-hidden">
                                    <img 
                                      src={car.images[0]} 
                                      alt={`${car.make} ${car.model}`}
                                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    
                                    {selectedCar === car.id && (
                                      <motion.div
                                        className="absolute top-3 right-3 p-2 bg-cyan-500 rounded-full"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", duration: 0.3 }}
                                      >
                                        <CheckCircle className="w-5 h-5 text-white" />
                                      </motion.div>
                                    )}
                                  </div>
                                  
                                  <div className="p-6">
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                      {car.make} {car.model}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400">{car.year}</span>
                                      <span className="text-cyan-400 font-semibold">
                                        {formatNpr(car.price)}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          
                          {errors.selectedCar && (
                            <motion.p 
                              className="text-red-400 text-sm mt-6 flex items-center justify-center"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle className="w-4 h-4 mr-2" />
                              {errors.selectedCar}
                            </motion.p>
                          )}
                          
                          {/* Step 1 Navigation */}
                          <motion.div 
                            className="flex justify-end mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                onClick={() => {
                                  if (selectedCar) {
                                    nextStep();
                                  } else {
                                    setErrors({ selectedCar: 'Please select a vehicle' });
                                  }
                                }}
                                disabled={!selectedCar}
                                className="group relative overflow-hidden"
                              >
                                <span className="relative z-10 flex items-center">
                                  Continue to Date & Time
                                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: 0 }}
                                  transition={{ duration: 0.3 }}
                                />
                              </Button>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 2: Date & Time Selection */}
                <AnimatePresence mode="wait">
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="p-8 md:p-12 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                            <motion.div
                              className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mr-4"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Calendar className="w-8 h-8 text-cyan-400" />
                            </motion.div>
                            Choose Your Perfect Time
                          </h2>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Enhanced Date Selection */}
                            <motion.div
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="flex items-center justify-between mb-6">
                                <label className="text-xl font-semibold text-white flex items-center">
                                  <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                                  Select Date
                                </label>
                                <span className="text-sm text-gray-400">
                                  {selectedDate && formatDate(selectedDate)}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
                                {availableDates.slice(0, 15).map((date, index) => {
                                  const dateObj = new Date(date);
                                  const isSelected = selectedDate === date;
                                  const isToday = date === new Date().toISOString().split('T')[0];
                                  
                                  return (
                                    <motion.button
                                      key={date}
                                      type="button"
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.1 * index }}
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => setSelectedDate(date)}
                                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 group ${
                                        isSelected
                                          ? 'border-cyan-500 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/25'
                                          : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'
                                      }`}
                                    >
                                      {isSelected && (
                                        <motion.div
                                          className="absolute top-2 right-2"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", duration: 0.3 }}
                                        >
                                          <CheckCircle className="w-4 h-4 text-cyan-400" />
                                        </motion.div>
                                      )}
                                      
                                      <div className="text-center">
                                        <div className="font-bold text-lg mb-1">
                                          {dateObj.getDate()}
                                        </div>
                                        <div className="text-xs opacity-75">
                                          {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                                        </div>
                                        <div className="text-xs opacity-60 mt-1">
                                          {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </div>
                                        {isToday && (
                                          <div className="text-xs text-green-400 font-semibold mt-1">
                                            Today
                                          </div>
                                        )}
                                      </div>
                                    </motion.button>
                                  );
                                })}
                              </div>
                              
                              {errors.selectedDate && (
                                <motion.p 
                                  className="text-red-400 text-sm mt-4 flex items-center"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  {errors.selectedDate}
                                </motion.p>
                              )}
                            </motion.div>

                            {/* Enhanced Time Selection */}
                            <motion.div
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <div className="flex items-center justify-between mb-6">
                                <label className="text-xl font-semibold text-white flex items-center">
                                  <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                                  Select Time
                                </label>
                                <span className="text-sm text-gray-400">
                                  {selectedTime && `${selectedTime} (30 min session)`}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
                                {timeSlots.map((time, index) => {
                                  const isSelected = selectedTime === time;
                                  const isPeak = ['12:00', '13:00', '17:00', '17:30'].includes(time);
                                  
                                  return (
                                    <motion.button
                                      key={time}
                                      type="button"
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.05 * index }}
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => setSelectedTime(time)}
                                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 group ${
                                        isSelected
                                          ? 'border-cyan-500 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/25'
                                          : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'
                                      }`}
                                    >
                                      {isSelected && (
                                        <motion.div
                                          className="absolute top-2 right-2"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", duration: 0.3 }}
                                        >
                                          <CheckCircle className="w-4 h-4 text-cyan-400" />
                                        </motion.div>
                                      )}
                                      
                                      <div className="text-center">
                                        <Clock className="w-5 h-5 mx-auto mb-2 opacity-75" />
                                        <div className="font-bold">{time}</div>
                                        {isPeak && (
                                          <div className="text-xs text-orange-400 mt-1">
                                            Popular
                                          </div>
                                        )}
                                      </div>
                                    </motion.button>
                                  );
                                })}
                              </div>
                              
                              {errors.selectedTime && (
                                <motion.p 
                                  className="text-red-400 text-sm mt-4 flex items-center"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  {errors.selectedTime}
                                </motion.p>
                              )}
                            </motion.div>
                          </div>
                          
                          {/* Step 2 Navigation */}
                          <motion.div 
                            className="flex justify-between mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="group relative overflow-hidden"
                              >
                                <span className="relative z-10 flex items-center">
                                  <ChevronRight className="w-5 h-5 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                                  Back to Vehicle
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20"
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
                                type="button"
                                onClick={() => {
                                  const newErrors: Record<string, string> = {};
                                  if (!selectedDate) newErrors.selectedDate = 'Please select a date';
                                  if (!selectedTime) newErrors.selectedTime = 'Please select a time';
                                  
                                  if (Object.keys(newErrors).length > 0) {
                                    setErrors(newErrors);
                                  } else {
                                    nextStep();
                                  }
                                }}
                                disabled={!selectedDate || !selectedTime}
                                className="group relative overflow-hidden"
                              >
                                <span className="relative z-10 flex items-center">
                                  Continue to Details
                                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: 0 }}
                                  transition={{ duration: 0.3 }}
                                />
                              </Button>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3: Personal Information */}
                <AnimatePresence mode="wait">
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="p-8 md:p-12 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                            <motion.div
                              className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mr-4"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <User className="w-8 h-8 text-cyan-400" />
                            </motion.div>
                            Your Contact Details
                          </h2>
                          
                          <div className="space-y-8">
                            <motion.div 
                              className="grid grid-cols-1 md:grid-cols-2 gap-8"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input
                                  label="Full Name"
                                  value={formData.name}
                                  onChange={(e) => handleInputChange('name', e.target.value)}
                                  error={errors.name}
                                  placeholder="Enter your full name"
                                  required
                                  className="transition-all duration-300 focus:ring-2 focus:ring-cyan-500"
                                />
                              </motion.div>
                              
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input
                                  label="Email Address"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleInputChange('email', e.target.value)}
                                  error={errors.email}
                                  placeholder="Enter your email"
                                  required
                                  className="transition-all duration-300 focus:ring-2 focus:ring-cyan-500"
                                />
                              </motion.div>
                            </motion.div>
                            
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              whileFocus={{ scale: 1.02 }}
                            >
                              <Input
                                label="Phone Number"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                error={errors.phone}
                                placeholder="Enter your phone number"
                                required
                                className="transition-all duration-300 focus:ring-2 focus:ring-cyan-500"
                              />
                            </motion.div>
                            
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <label className="block text-lg font-semibold text-white mb-4">
                                Additional Message (Optional)
                              </label>
                              <motion.textarea
                                value={formData.message}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                placeholder="Any specific questions or requirements? Let us know how we can make your test drive experience perfect!"
                                rows={4}
                                className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 resize-none"
                                whileFocus={{ scale: 1.02 }}
                              />
                            </motion.div>
                          </div>
                          
                          {/* Step 3 Navigation */}
                          <motion.div 
                            className="flex justify-between mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="group relative overflow-hidden"
                              >
                                <span className="relative z-10 flex items-center">
                                  <ChevronRight className="w-5 h-5 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                                  Back to Date & Time
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20"
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
                                type="button"
                                onClick={() => {
                                  const newErrors: Record<string, string> = {};
                                  if (!formData.name.trim()) newErrors.name = 'Name is required';
                                  if (!formData.email.trim()) newErrors.email = 'Email is required';
                                  if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
                                  
                                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                  if (formData.email && !emailRegex.test(formData.email)) {
                                    newErrors.email = 'Please enter a valid email address';
                                  }
                                  
                                  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
                                  if (formData.phone && !phoneRegex.test(formData.phone)) {
                                    newErrors.phone = 'Please enter a valid phone number';
                                  }
                                  
                                  if (Object.keys(newErrors).length > 0) {
                                    setErrors(newErrors);
                                  } else {
                                    nextStep();
                                  }
                                }}
                                disabled={!formData.name || !formData.email || !formData.phone}
                                className="group relative overflow-hidden"
                              >
                                <span className="relative z-10 flex items-center">
                                  Review & Confirm
                                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: 0 }}
                                  transition={{ duration: 0.3 }}
                                />
                              </Button>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 4: Review & Confirm */}
                <AnimatePresence mode="wait">
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="p-8 md:p-12 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                            <motion.div
                              className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mr-4"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <CheckCircle className="w-8 h-8 text-cyan-400" />
                            </motion.div>
                            Review Your Booking
                          </h2>
                          
                          {/* Booking Summary */}
                          <motion.div 
                            className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 mb-8 border border-gray-700/50"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h3 className="text-xl font-semibold text-white mb-6">Booking Summary</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Vehicle Info */}
                              <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  <img 
                                    src={selectedCarData?.images[0]} 
                                    alt={`${selectedCarData?.make} ${selectedCarData?.model}`}
                                    className="w-20 h-14 object-cover rounded-lg"
                                  />
                                  <div>
                                    <h4 className="text-lg font-semibold text-white">
                                      {selectedCarData?.make} {selectedCarData?.model}
                                    </h4>
                                    <p className="text-gray-400">{selectedCarData?.year}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Date:</span>
                                    <span className="text-white font-semibold">{formatDate(selectedDate)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Time:</span>
                                    <span className="text-white font-semibold">{selectedTime}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white font-semibold">30 minutes</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Contact Info */}
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Name:</span>
                                  <span className="text-white font-semibold">{formData.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Email:</span>
                                  <span className="text-white font-semibold">{formData.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Phone:</span>
                                  <span className="text-white font-semibold">{formData.phone}</span>
                                </div>
                                {formData.message && (
                                  <div className="pt-3 border-t border-gray-700/50">
                                    <span className="text-gray-400 block mb-2">Message:</span>
                                    <span className="text-white text-sm">{formData.message}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                          
                          {/* Location Info */}
                          <motion.div
                            className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-8 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="flex items-start space-x-6">
                              <motion.div
                                className="p-3 bg-cyan-500/20 rounded-full flex-shrink-0"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                <MapPin className="w-8 h-8 text-cyan-400" />
                              </motion.div>
                              <div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                  Fast & Furious Car Showroom
                                </h3>
                                <p className="text-gray-300 mb-2">123 Speed Avenue, Racing District, RD 12345</p>
                                <div className="space-y-2 text-sm text-gray-400">
                                  <p className="flex items-center">
                                    <Navigation className="w-4 h-4 mr-2" />
                                    GPS coordinates will be sent via email
                                  </p>
                                  <p className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Please arrive 10 minutes early
                                  </p>
                                  <p className="flex items-center">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Valid driver's license required
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                          
                          {/* Step 4 Navigation */}
                          <motion.div 
                            className="flex justify-between"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="group relative overflow-hidden"
                              >
                                <span className="relative z-10 flex items-center">
                                  <ChevronRight className="w-5 h-5 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                                  Back to Details
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20"
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
                                type="submit" 
                                size="lg" 
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                className="group relative overflow-hidden px-8 py-4"
                              >
                                <span className="relative z-10 flex items-center">
                                  {isSubmitting ? (
                                    <>
                                      <motion.div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      />
                                      Confirming Booking...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                                      Confirm Test Drive
                                    </>
                                  )}
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: 0 }}
                                  transition={{ duration: 0.3 }}
                                />
                              </Button>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <Card className="p-12 md:p-16 max-w-4xl mx-auto backdrop-blur-sm bg-gray-900/50 border border-gray-700/50 relative overflow-hidden">
                {/* Success Animation Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                />
                
                {/* Floating Success Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-green-400/30 rounded-full"
                      initial={{
                        x: Math.random() * 400,
                        y: Math.random() * 400,
                        scale: 0,
                      }}
                      animate={{
                        y: [null, -20, 0],
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        delay: 0.5 + i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative z-10">
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                    className="mb-8"
                  >
                    <div className="relative mx-auto w-32 h-32">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                        <CheckCircle className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Success Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-8"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                        Success!
                      </span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                      Your Test Drive is Confirmed
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                      We're excited to have you experience our premium vehicle. A confirmation email with all details has been sent to your inbox.
                    </p>
                  </motion.div>
                  
                  {/* Enhanced Booking Details */}
                  <motion.div 
                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 mb-8 border border-gray-700/50"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <h3 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center">
                      <Award className="w-6 h-6 mr-3 text-cyan-400" />
                      Booking Confirmation
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Vehicle Details */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 mb-4">
                          <img 
                            src={selectedCarData?.images[0]} 
                            alt={`${selectedCarData?.make} ${selectedCarData?.model}`}
                            className="w-24 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h4 className="text-lg font-bold text-white">
                              {selectedCarData?.make} {selectedCarData?.model}
                            </h4>
                            <p className="text-gray-400">{selectedCarData?.year}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                            <span className="text-gray-400 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Date:
                            </span>
                            <span className="text-white font-semibold">{formatDate(selectedDate)}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                            <span className="text-gray-400 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Time:
                            </span>
                            <span className="text-white font-semibold">{selectedTime}</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-gray-400 flex items-center">
                              <Timer className="w-4 h-4 mr-2" />
                              Duration:
                            </span>
                            <span className="text-white font-semibold">30 minutes</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                          <span className="text-gray-400 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Name:
                          </span>
                          <span className="text-white font-semibold">{formData.name}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                          <span className="text-gray-400 flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email:
                          </span>
                          <span className="text-white font-semibold text-sm">{formData.email}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                          <span className="text-gray-400 flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            Phone:
                          </span>
                          <span className="text-white font-semibold">{formData.phone}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-400 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Location:
                          </span>
                          <span className="text-white font-semibold text-sm">Fast & Furious Showroom</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Next Steps */}
                  <motion.div
                    className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-6 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                      <Navigation className="w-5 h-5 mr-2 text-cyan-400" />
                      What's Next?
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Mail className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-gray-300">Check your email for confirmation & directions</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Shield className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-gray-300">Bring valid driver's license & arrive 10 min early</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Heart className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-gray-300">Enjoy your premium test drive experience!</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Action Buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={() => {
                          setShowConfirmation(false);
                          setCurrentStep(1);
                          setSelectedCar('');
                          setSelectedDate('');
                          setSelectedTime('');
                          setFormData({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                            message: ''
                          });
                          setErrors({});
                        }}
                        className="group relative overflow-hidden px-8 py-3"
                      >
                        <span className="relative z-10 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                          Book Another Test Drive
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
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
                        onClick={() => window.location.href = '/inventory'}
                        className="group relative overflow-hidden px-8 py-3"
                      >
                        <span className="relative z-10 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 group-hover:translate-y-1 transition-transform duration-300" />
                          Continue Browsing
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-lg shadow-cyan-500/25 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronRight className="w-6 h-6 -rotate-90" />
      </motion.button>
    </div>
  );
};

// Add custom scrollbar styles
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.3);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(6, 182, 212, 0.5);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(6, 182, 212, 0.7);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}