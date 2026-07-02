import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car } from '../types';
import { carsData } from '../data/carsData';

interface InventoryContextType {
  cars: Car[];
  addCar: (car: Omit<Car, 'id' | 'rating' | 'reviews'>) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('ff_inventory');
    if (stored) {
      setCars(JSON.parse(stored));
    } else {
      setCars(carsData);
      localStorage.setItem('ff_inventory', JSON.stringify(carsData));
    }
  }, []);

  const addCar = (car: Omit<Car, 'id' | 'rating' | 'reviews'>) => {
    const newCar: Car = {
      ...car,
      id: Math.random().toString(36).substr(2, 9),
      rating: 5.0,
      reviews: 0
    };
    setCars(prev => {
      const updated = [...prev, newCar];
      localStorage.setItem('ff_inventory', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCar = (id: string, updatedFields: Partial<Car>) => {
    setCars(prev => {
      const updated = prev.map(car => car.id === id ? { ...car, ...updatedFields } : car);
      localStorage.setItem('ff_inventory', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCar = (id: string) => {
    setCars(prev => {
      const updated = prev.filter(car => car.id !== id);
      localStorage.setItem('ff_inventory', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <InventoryContext.Provider value={{ cars, addCar, updateCar, deleteCar }}>
      {children}
    </InventoryContext.Provider>
  );
};
