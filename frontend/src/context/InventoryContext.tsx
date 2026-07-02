import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car } from '../types';
import { carsData } from '../data/carsData';
import { fetchCars, insertCar, updateCarInDb, deleteCarFromDb } from '../services/supabaseService';

interface InventoryContextType {
  cars: Car[];
  addCar: (car: Omit<Car, 'id' | 'rating' | 'reviews'>) => Promise<void>;
  updateCar: (id: string, car: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCars();
        if (data.length > 0) {
          setCars(data);
        } else {
          // Seed Supabase with static data on first run
          const seeded: Car[] = [];
          for (const car of carsData) {
            const { id, rating, reviews, ...rest } = car;
            const inserted = await insertCar(rest);
            seeded.push(inserted);
          }
          setCars(seeded);
        }
      } catch (err) {
        console.error('[InventoryContext] load error, falling back to static data:', err);
        setCars(carsData);
      }
    };
    load();
  }, []);

  const addCar = async (car: Omit<Car, 'id' | 'rating' | 'reviews'>) => {
    const newCar = await insertCar(car);
    setCars(prev => [...prev, newCar]);
  };

  const updateCar = async (id: string, fields: Partial<Car>) => {
    await updateCarInDb(id, fields);
    setCars(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
  };

  const deleteCar = async (id: string) => {
    await deleteCarFromDb(id);
    setCars(prev => prev.filter(c => c.id !== id));
  };

  return (
    <InventoryContext.Provider value={{ cars, addCar, updateCar, deleteCar }}>
      {children}
    </InventoryContext.Provider>
  );
};
