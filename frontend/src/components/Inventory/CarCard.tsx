import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Eye, Calendar, Fuel, Gauge, Zap, Shield, Award, ArrowRight } from 'lucide-react';
import { Car } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onViewDetails }) => {
  const { isFavorite, toggleFavorite } = useBooking();
  const favorite = isFavorite(car.id);

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="overflow-hidden relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 group-hover:border-cyan-500/30 transition-all duration-500">
        <div className="relative overflow-hidden">
          {/* Car Image with enhanced hover effects */}
          <div className="aspect-w-16 aspect-h-9 bg-gray-800 relative overflow-hidden">
            <motion.img
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              whileHover={{ scale: 1.05 }}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Floating elements on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </div>
        
          {/* Enhanced Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <AnimatePresence>
              {car.isNew && (
                <motion.span
                  initial={{ opacity: 0, scale: 0, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0, x: -20 }}
                  className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  NEW
                </motion.span>
              )}
            </AnimatePresence>
            
            <motion.span
              initial={{ opacity: 0, scale: 0, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full capitalize shadow-lg flex items-center"
            >
              <Award className="w-3 h-3 mr-1" />
              {car.type}
            </motion.span>
          </div>

          {/* Enhanced Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(car.id);
            }}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg ${
              favorite 
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-pink-500/25' 
                : 'bg-black/50 text-gray-300 hover:text-pink-400 hover:bg-black/70'
            }`}
          >
            <motion.div
              animate={favorite ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
            </motion.div>
          </motion.button>
          
          {/* Quick view overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.button
              onClick={() => onViewDetails(car)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Eye className="w-5 h-5" />
              <span>Quick View</span>
            </motion.button>
          </motion.div>
        </div>

        <div className="p-8">
          {/* Enhanced Car Info */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                {car.make} {car.model}
              </h3>
              <div className="flex items-center space-x-3 mt-2">
                <p className="text-gray-400">{car.year}</p>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <p className="text-gray-400 text-sm">{car.mileage.toLocaleString()} miles</p>
              </div>
            </motion.div>

            {/* Enhanced Rating */}
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <Star
                        className={`w-5 h-5 transition-colors duration-300 ${
                          i < Math.floor(car.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-600'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-gray-400 font-medium">
                  {car.rating} ({car.reviews} reviews)
                </span>
              </div>
              
              <motion.div
                className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-green-400 text-xs font-semibold flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Certified
                </span>
              </motion.div>
            </motion.div>

            {/* Enhanced Quick Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 py-4 border-y border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="flex flex-col items-center space-y-1 text-center group/stat"
                whileHover={{ scale: 1.05 }}
              >
                <Gauge className="w-5 h-5 text-cyan-400 group-hover/stat:text-cyan-300 transition-colors" />
                <span className="text-xs text-gray-400 group-hover/stat:text-gray-300 transition-colors">
                  {car.mileage.toLocaleString()} mi
                </span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center space-y-1 text-center group/stat"
                whileHover={{ scale: 1.05 }}
              >
                <Fuel className="w-5 h-5 text-green-400 group-hover/stat:text-green-300 transition-colors" />
                <span className="text-xs text-gray-400 group-hover/stat:text-gray-300 transition-colors">
                  {car.fuel}
                </span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center space-y-1 text-center group/stat"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="w-5 h-5 text-blue-400 group-hover/stat:text-blue-300 transition-colors" />
                <span className="text-xs text-gray-400 group-hover/stat:text-gray-300 transition-colors">
                  {car.year}
                </span>
              </motion.div>
            </motion.div>

            {/* Enhanced Price */}
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div>
                <motion.span 
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                  whileHover={{ scale: 1.05 }}
                >
                  ${car.price.toLocaleString()}
                </motion.span>
                {!car.isNew && (
                  <motion.p 
                    className="text-xs text-green-400 font-medium flex items-center mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Best price guarantee
                  </motion.p>
                )}
              </div>
              
              <motion.div
                className="text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-gray-400">Starting at</p>
                <p className="text-lg font-semibold text-cyan-400">
                  ${Math.round(car.price / 60).toLocaleString()}/mo
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Action Buttons */}
          <motion.div 
            className="flex space-x-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="primary"
                size="sm"
                className="w-full group relative overflow-hidden"
                onClick={() => onViewDetails(car)}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/test-drive?car=${car.id}`;
                }}
                className="group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Zap className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Test Drive
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"
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
  );
};