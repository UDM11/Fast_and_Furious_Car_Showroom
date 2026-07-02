import React, { createContext, useContext, useState, useEffect } from 'react';
import { TestDriveBooking } from '../types';
import { useAuth } from './AuthContext';
import {
  fetchAllBookings,
  fetchUserBookings,
  insertBooking,
  updateBookingStatus,
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from '../services/supabaseService';

interface BookingContextType {
  bookings: TestDriveBooking[];
  favorites: string[];
  addBooking: (booking: Omit<TestDriveBooking, 'id' | 'createdAt'>) => Promise<void>;
  updateBooking: (id: string, status: TestDriveBooking['status']) => Promise<void>;
  toggleFavorite: (carId: string) => Promise<void>;
  isFavorite: (carId: string) => boolean;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) throw new Error('useBooking must be used within a BookingProvider');
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<TestDriveBooking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadBookings = async () => {
    try {
      // Admin sees all bookings; regular user sees only their own
      const data = user?.role === 'admin'
        ? await fetchAllBookings()
        : user
        ? await fetchUserBookings(user.id)
        : [];
      setBookings(data);
    } catch (err) {
      console.error('[BookingContext] loadBookings error:', err);
    }
  };

  const loadFavorites = async () => {
    if (!user) { setFavorites([]); return; }
    try {
      const data = await fetchFavorites(user.id);
      setFavorites(data);
    } catch (err) {
      console.error('[BookingContext] loadFavorites error:', err);
    }
  };

  useEffect(() => {
    loadBookings();
    loadFavorites();
  }, [user?.id, user?.role]);

  const addBooking = async (booking: Omit<TestDriveBooking, 'id' | 'createdAt'>) => {
    try {
      const newBooking = await insertBooking(booking);
      setBookings(prev => [newBooking, ...prev]);
    } catch (err) {
      console.error('[BookingContext] addBooking failed:', err);
      throw err;
    }
  };

  const updateBooking = async (id: string, status: TestDriveBooking['status']) => {
    await updateBookingStatus(id, status);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const toggleFavorite = async (carId: string) => {
    if (!user) return;
    if (favorites.includes(carId)) {
      await removeFavorite(user.id, carId);
      setFavorites(prev => prev.filter(id => id !== carId));
    } else {
      await addFavorite(user.id, carId);
      setFavorites(prev => [...prev, carId]);
    }
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  return (
    <BookingContext.Provider value={{
      bookings, favorites, addBooking, updateBooking,
      toggleFavorite, isFavorite, refreshBookings: loadBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
};
