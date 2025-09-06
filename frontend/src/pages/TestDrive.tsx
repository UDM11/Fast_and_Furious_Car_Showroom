import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Car, 
  User, 
  Mail, 
  Phone, 
  CheckCircle,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { carsData } from '../data/carsData';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const TestDrive: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preSelectedCarId = searchParams.get('car');
  const { addBooking } = useBooking();
  const { user } = useAuth();
  
  // Form state
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!showConfirmation ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Book Your Test Drive
                </h1>
                <p className="text-xl text-gray-400">
                  Experience luxury and performance firsthand
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Vehicle Selection */}
                <Card className="p-8">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Car className="w-6 h-6 mr-3 text-cyan-400" />
                    Select Vehicle
                  </h2>
                  
                  {selectedCarData ? (
                    <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                      <img 
                        src={selectedCarData.images[0]} 
                        alt={`${selectedCarData.make} ${selectedCarData.model}`}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {selectedCarData.make} {selectedCarData.model}
                        </h3>
                        <p className="text-gray-400">{selectedCarData.year}</p>
                        <p className="text-cyan-400 font-semibold">
                          ${selectedCarData.price.toLocaleString()}
                        </p>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        onClick={() => setSelectedCar('')}
                        className="ml-auto"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {carsData.slice(0, 6).map(car => (
                        <motion.div
                          key={car.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCar(car.id)}
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 ${
                            selectedCar === car.id
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <img 
                            src={car.images[0]} 
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-24 object-cover rounded-lg mb-3"
                          />
                          <h3 className="text-white font-semibold text-sm">
                            {car.make} {car.model}
                          </h3>
                          <p className="text-gray-400 text-xs">{car.year}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {errors.selectedCar && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.selectedCar}
                    </p>
                  )}
                </Card>

                {/* Date & Time Selection */}
                <Card className="p-8">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-cyan-400" />
                    Select Date & Time
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Preferred Date
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                        {availableDates.slice(0, 12).map(date => {
                          const dateObj = new Date(date);
                          const isSelected = selectedDate === date;
                          
                          return (
                            <motion.button
                              key={date}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedDate(date)}
                              className={`p-3 text-sm rounded-lg border-2 transition-all duration-300 ${
                                isSelected
                                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
                              }`}
                            >
                              <div className="font-semibold">
                                {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-xs">
                                {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                      {errors.selectedDate && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.selectedDate}
                        </p>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Preferred Time
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                        {timeSlots.map(time => {
                          const isSelected = selectedTime === time;
                          
                          return (
                            <motion.button
                              key={time}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 text-sm rounded-lg border-2 transition-all duration-300 ${
                                isSelected
                                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
                              }`}
                            >
                              <Clock className="w-4 h-4 mx-auto mb-1" />
                              {time}
                            </motion.button>
                          );
                        })}
                      </div>
                      {errors.selectedTime && (
                        <p className="text-red-400 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.selectedTime}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Personal Information */}
                <Card className="p-8">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-cyan-400" />
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={errors.name}
                      placeholder="Enter your full name"
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={errors.phone}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Any specific questions or requirements?"
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </Card>

                {/* Location Info */}
                <Card className="p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Fast & Furious Car Showroom
                      </h3>
                      <p className="text-gray-300 mb-1">123 Speed Avenue, Racing District, RD 12345</p>
                      <p className="text-gray-400 text-sm">
                        Our experienced team will be ready to assist you with your test drive.
                        Please arrive 10 minutes early with a valid driver's license.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Submit Button */}
                <div className="text-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? 'Booking...' : 'Book Test Drive'}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="p-12 max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mb-8"
                >
                  <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
                </motion.div>
                
                <h1 className="text-3xl font-bold text-white mb-4">
                  Test Drive Booked Successfully!
                </h1>
                
                <p className="text-gray-300 mb-8">
                  Your test drive has been confirmed. We'll send you a confirmation email shortly.
                </p>
                
                <div className="bg-gray-800/50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="text-lg font-semibold text-white mb-4">Booking Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vehicle:</span>
                      <span className="text-white">
                        {selectedCarData?.make} {selectedCarData?.model} {selectedCarData?.year}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{formData.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => {
                      setShowConfirmation(false);
                      // Reset form
                      setSelectedCar('');
                      setSelectedDate('');
                      setSelectedTime('');
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        message: ''
                      });
                    }}
                    className="w-full md:w-auto mr-4"
                  >
                    Book Another Test Drive
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/inventory'}
                    className="w-full md:w-auto"
                  >
                    Continue Browsing
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};