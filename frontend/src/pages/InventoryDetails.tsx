import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Calendar, 
  Fuel, 
  Gauge, 
  Settings, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Camera,
  Play,
  Share2,
  Phone,
  Calculator,
  Zap,
  Award,
  CheckCircle,
  Eye,
  Download,
  MessageCircle,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';
import { carsData } from '../data/carsData';
import { Car } from '../types';
import { useBooking } from '../context/BookingContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const InventoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useBooking();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [is360View, setIs360View] = useState(false);
  const [showFinanceCalculator, setShowFinanceCalculator] = useState(false);
  
  const car = carsData.find(c => c.id === id);

  useEffect(() => {
    if (!car) {
      navigate('/inventory');
    }
  }, [car, navigate]);

  if (!car) return null;

  const favorite = isFavorite(car.id);
  const recommendedCars = carsData
    .filter(c => c.id !== car.id && (c.type === car.type || c.make === car.make))
    .slice(0, 3);

  const handleTestDrive = () => {
    navigate(`/test-drive?car=${car.id}`);
  };

  const handleFinanceCalculation = () => {
    navigate(`/finance?car=${car.id}&price=${car.price}`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button & Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/inventory')}
                className="text-gray-400 hover:text-white group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Inventory
              </Button>
              
              <motion.div
                className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Premium Vehicle</span>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <Card className="overflow-hidden group">
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-800 to-gray-900">
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      src={car.images[currentImageIndex]}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  
                  {/* Enhanced Controls */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIs360View(!is360View)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                        is360View 
                          ? 'bg-cyan-500/90 border-cyan-400 text-white shadow-lg shadow-cyan-500/25' 
                          : 'bg-black/40 border-white/20 text-gray-300 hover:text-cyan-400 hover:border-cyan-400/50'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      <span className="text-sm font-medium">360° View</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-black/40 border border-white/20 text-gray-300 hover:text-white transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Gallery</span>
                    </motion.button>
                  </div>
                  
                  {/* Image Counter */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {car.images.length}
                  </div>

                  {/* Enhanced Navigation Arrows */}
                  {car.images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-all duration-300 border border-white/20 hover:border-cyan-400/50"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, x: 2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-all duration-300 border border-white/20 hover:border-cyan-400/50"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </motion.button>
                    </>
                  )}

                  {/* Enhanced Image Indicators */}
                  {car.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {car.images.map((_, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex 
                              ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                              : 'bg-white/40 hover:bg-white/60 backdrop-blur-sm'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Enhanced Thumbnail Gallery */}
              {car.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-4 gap-3"
                >
                  {car.images.slice(0, 4).map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-w-16 aspect-h-9 rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                        index === currentImageIndex 
                          ? 'border-cyan-400 shadow-lg shadow-cyan-400/25' 
                          : 'border-white/20 hover:border-cyan-400/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${car.make} ${car.model} view ${index + 1}`}
                        className="w-full h-20 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Car Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl md:text-5xl font-bold text-white mb-3"
                    >
                      {car.make} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{car.model}</span>
                    </motion.h1>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <p className="text-xl text-gray-400">{car.year}</p>
                      <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">{car.isNew ? 'New' : 'Certified Pre-Owned'}</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(car.id)}
                      className={`p-3 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                        favorite 
                          ? 'bg-pink-500/90 border-pink-400 text-white shadow-lg shadow-pink-500/25' 
                          : 'bg-white/10 border-white/20 text-gray-300 hover:text-pink-400 hover:border-pink-400/50'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${favorite ? 'fill-current' : ''}`} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:text-cyan-400 hover:border-cyan-400/50 rounded-full transition-all duration-300"
                    >
                      <Share2 className="w-6 h-6" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:text-blue-400 hover:border-blue-400/50 rounded-full transition-all duration-300"
                    >
                      <Download className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(car.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">
                    {car.rating} ({car.reviews} reviews)
                  </span>
                </div>

                {/* Enhanced Price Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                        ${car.price.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Best price guarantee
                        </span>
                        <span className="text-blue-400 flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          Financing available
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Starting from</p>
                      <p className="text-2xl font-bold text-white">${Math.round(car.price * 0.02).toLocaleString()}/mo</p>
                      <p className="text-gray-400 text-xs">with approved credit</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Quick Specs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-cyan-400" />
                    Vehicle Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: Gauge, label: 'Mileage', value: `${car.mileage.toLocaleString()} mi`, color: 'text-cyan-400' },
                      { icon: Fuel, label: 'Fuel Type', value: car.fuel, color: 'text-green-400' },
                      { icon: Settings, label: 'Transmission', value: car.transmission, color: 'text-blue-400' },
                      { icon: Zap, label: 'Engine', value: car.engine, color: 'text-purple-400' }
                    ].map((spec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 ${spec.color} group-hover:scale-110 transition-transform`}>
                          <spec.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{spec.label}</p>
                          <p className="text-white font-medium">{spec.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Enhanced Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" onClick={handleTestDrive} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/25">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Test Drive
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" onClick={handleFinanceCalculation} className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Finance
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-3 mt-4"
              >
                {[
                  { icon: MessageCircle, label: 'Chat', color: 'text-green-400' },
                  { icon: Phone, label: 'Call', color: 'text-blue-400' },
                  { icon: MapPin, label: 'Visit', color: 'text-purple-400' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  >
                    <action.icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Enhanced Contact Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Questions about this vehicle?</p>
                        <p className="text-gray-400 text-sm">Our experts are available 24/7</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-green-400" />
                          <span className="text-green-400 text-xs">Avg response: 2 minutes</span>
                        </div>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Description</h2>
                <p className="text-gray-300 leading-relaxed mb-8">
                  {car.description}
                </p>
                
                <h3 className="text-lg font-semibold text-white mb-4">Features & Equipment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Vehicle History */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Vehicle History</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Previous Owners</span>
                    <span className="text-white">{car.isNew ? '0' : '1'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Accidents</span>
                    <span className="text-green-400">No reported accidents</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Service Records</span>
                    <span className="text-green-400">Full history available</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Title Status</span>
                    <span className="text-green-400">Clean title</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-6">
                  View Full Report
                </Button>
              </Card>
            </motion.div>
          </div>

          {/* Recommended Cars */}
          {recommendedCars.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Similar Vehicles You Might Like
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendedCars.map((recommendedCar, index) => (
                  <motion.div
                    key={recommendedCar.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card hover className="overflow-hidden cursor-pointer" onClick={() => navigate(`/inventory/${recommendedCar.id}`)}>
                      <img
                        src={recommendedCar.images[0]}
                        alt={`${recommendedCar.make} ${recommendedCar.model}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {recommendedCar.make} {recommendedCar.model}
                        </h3>
                        <p className="text-gray-400 mb-4">{recommendedCar.year}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            ${recommendedCar.price.toLocaleString()}
                          </span>
                          <Button size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};