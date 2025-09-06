import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Calculator
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/inventory')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Inventory
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-gray-800">
                  <img
                    src={car.images[currentImageIndex]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-96 object-cover"
                  />
                </div>
                
                {/* 360° View Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIs360View(!is360View)}
                  className={`absolute top-4 left-4 px-3 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                    is360View 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-black/50 text-gray-300 hover:text-cyan-400'
                  }`}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  360° View
                </motion.button>

                {/* Navigation Arrows */}
                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all duration-300"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all duration-300"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {car.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {car.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-cyan-400' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {car.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'border-cyan-400' 
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${car.make} ${car.model} view ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
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
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {car.make} {car.model}
                  </h1>
                  <p className="text-xl text-gray-400">{car.year}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(car.id)}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      favorite 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-800/50 text-gray-300 hover:text-pink-400'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${favorite ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-gray-800/50 text-gray-300 hover:text-cyan-400 rounded-full transition-all duration-300"
                  >
                    <Share2 className="w-6 h-6" />
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

              {/* Price */}
              <div className="mb-8">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                  ${car.price.toLocaleString()}
                </div>
                {!car.isNew && (
                  <p className="text-gray-400">Best price guarantee • Financing available</p>
                )}
              </div>
            </div>

            {/* Quick Specs */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Vehicle Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Gauge className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-gray-400">Mileage</p>
                    <p className="text-white">{car.mileage.toLocaleString()} mi</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Fuel className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-gray-400">Fuel Type</p>
                    <p className="text-white">{car.fuel}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-gray-400">Transmission</p>
                    <p className="text-white">{car.transmission}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-gray-400">Engine</p>
                    <p className="text-white">{car.engine}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button size="lg" onClick={handleTestDrive} className="w-full">
                <Calendar className="w-5 h-5 mr-2" />
                Book Test Drive
              </Button>
              
              <Button variant="outline" size="lg" onClick={handleFinanceCalculation} className="w-full">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Finance
              </Button>
            </div>

            {/* Contact */}
            <Card className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Questions about this vehicle?</p>
                  <p className="text-gray-400 text-sm">Our experts are here to help</p>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </Card>
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
  );
};