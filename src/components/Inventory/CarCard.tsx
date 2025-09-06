import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Eye, Calendar, Fuel, Gauge } from 'lucide-react';
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
    <Card hover className="overflow-hidden">
      <div className="relative">
        {/* Car Image */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-800">
          <img
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            className="w-full h-48 object-cover rounded-t-xl"
            loading="lazy"
          />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {car.isNew && (
            <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold rounded-full">
              NEW
            </span>
          )}
          <span className="px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold rounded-full capitalize">
            {car.type}
          </span>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(car.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            favorite 
              ? 'bg-pink-500 text-white' 
              : 'bg-black/50 text-gray-300 hover:text-pink-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      <div className="p-6">
        {/* Car Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-white">
              {car.make} {car.model}
            </h3>
            <p className="text-gray-400 text-sm">{car.year}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(car.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {car.rating} ({car.reviews} reviews)
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Gauge className="w-4 h-4" />
              <span>{car.mileage.toLocaleString()} mi</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Fuel className="w-4 h-4" />
              <span>{car.fuel}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{car.year}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                ${car.price.toLocaleString()}
              </span>
              {!car.isNew && (
                <p className="text-xs text-gray-400">Best price guarantee</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(car)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to test drive with car pre-selected
              window.location.href = `/test-drive?car=${car.id}`;
            }}
          >
            Test Drive
          </Button>
        </div>
      </div>
    </Card>
  );
};