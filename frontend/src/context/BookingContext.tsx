import React, { createContext, useContext, useState, useEffect } from 'react';
import { TestDriveBooking, Car } from '../types';

interface BookingContextType {
  bookings: TestDriveBooking[];
  favorites: string[];
  addBooking: (booking: Omit<TestDriveBooking, 'id' | 'createdAt'>) => void;
  updateBooking: (id: string, status: TestDriveBooking['status']) => void;
  toggleFavorite: (carId: string) => void;
  isFavorite: (carId: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<TestDriveBooking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedBookings = localStorage.getItem('ff_bookings');
    const storedFavorites = localStorage.getItem('ff_favorites');
    
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
    
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    // Save bookings to localStorage
    localStorage.setItem('ff_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem('ff_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addBooking = (booking: Omit<TestDriveBooking, 'id' | 'createdAt'>) => {
    const newBooking: TestDriveBooking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = (id: string, status: TestDriveBooking['status']) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const toggleFavorite = (carId: string) => {
    setFavorites(prev => 
      prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const isFavorite = (carId: string): boolean => {
    return favorites.includes(carId);
  };

  const value = {
    bookings,
    favorites,
    addBooking,
    updateBooking,
    toggleFavorite,
    isFavorite
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};