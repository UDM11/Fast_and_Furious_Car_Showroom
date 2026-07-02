import { supabase } from '../utils/supabaseClient';
import { Car, TestDriveBooking } from '../types';

// ─── BOOKINGS ────────────────────────────────────────────────────────────────

export const fetchAllBookings = async (): Promise<TestDriveBooking[]> => {
  const { data, error } = await supabase
    .from('test_drive_bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(dbToBooking);
};

export const fetchUserBookings = async (userId: string): Promise<TestDriveBooking[]> => {
  const { data, error } = await supabase
    .from('test_drive_bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[fetchUserBookings] error:', error);
    throw error;
  }
  return (data || []).map(dbToBooking);
};

export const insertBooking = async (
  booking: Omit<TestDriveBooking, 'id' | 'createdAt'>
): Promise<TestDriveBooking> => {
  const payload = bookingToDb(booking);
  console.log('[insertBooking] payload:', payload);
  const { data, error } = await supabase
    .from('test_drive_bookings')
    .insert([payload])
    .select()
    .single();
  if (error) {
    console.error('[insertBooking] error:', error);
    throw error;
  }
  return dbToBooking(data);
};

export const updateBookingStatus = async (
  id: string,
  status: TestDriveBooking['status']
): Promise<void> => {
  const { error } = await supabase
    .from('test_drive_bookings')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
};

// ─── INVENTORY ───────────────────────────────────────────────────────────────

export const fetchCars = async (): Promise<Car[]> => {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(dbToCar);
};

export const insertCar = async (car: Omit<Car, 'id' | 'rating' | 'reviews'>): Promise<Car> => {
  const { data, error } = await supabase
    .from('cars')
    .insert([carToDb(car)])
    .select()
    .single();
  if (error) throw error;
  return dbToCar(data);
};

export const updateCarInDb = async (id: string, fields: Partial<Car>): Promise<void> => {
  const { error } = await supabase
    .from('cars')
    .update(carToDb(fields as any))
    .eq('id', id);
  if (error) throw error;
};

export const deleteCarFromDb = async (id: string): Promise<void> => {
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
};

// ─── FAVORITES ───────────────────────────────────────────────────────────────

export const fetchFavorites = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('car_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map((r: any) => r.car_id);
};

export const addFavorite = async (userId: string, carId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, car_id: carId }]);
  if (error && error.code !== '23505') throw error; // ignore duplicate
};

export const removeFavorite = async (userId: string, carId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('car_id', carId);
  if (error) throw error;
};

// ─── USERS (admin) ───────────────────────────────────────────────────────────

export const fetchAllUsers = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const updateUserRoleInDb = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
  const { error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', userId);
  if (error) throw error;
};

// ─── MAPPERS ─────────────────────────────────────────────────────────────────

function dbToBooking(row: any): TestDriveBooking {
  return {
    id: row.id,
    carId: row.car_id,
    userId: row.user_id,
    date: row.date,
    time: row.time,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    createdAt: row.created_at,
  };
}

function bookingToDb(b: Omit<TestDriveBooking, 'id' | 'createdAt'>) {
  return {
    car_id: b.carId || null,
    user_id: b.userId || null,
    date: b.date,
    time: b.time,
    name: b.name,
    email: b.email,
    phone: b.phone,
    status: b.status,
  };
}

function dbToCar(row: any): Car {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    price: row.price,
    type: row.type,
    mileage: row.mileage,
    fuel: row.fuel,
    transmission: row.transmission,
    engine: row.engine,
    features: row.features || [],
    images: row.images || [],
    description: row.description,
    isNew: row.is_new,
    rating: row.rating,
    reviews: row.reviews,
  };
}

function carToDb(car: Partial<Car>) {
  const row: any = {};
  if (car.make !== undefined) row.make = car.make;
  if (car.model !== undefined) row.model = car.model;
  if (car.year !== undefined) row.year = car.year;
  if (car.price !== undefined) row.price = car.price;
  if (car.type !== undefined) row.type = car.type;
  if (car.mileage !== undefined) row.mileage = car.mileage;
  if (car.fuel !== undefined) row.fuel = car.fuel;
  if (car.transmission !== undefined) row.transmission = car.transmission;
  if (car.engine !== undefined) row.engine = car.engine;
  if (car.features !== undefined) row.features = car.features;
  if (car.images !== undefined) row.images = car.images;
  if (car.description !== undefined) row.description = car.description;
  if (car.isNew !== undefined) row.is_new = car.isNew;
  if (car.rating !== undefined) row.rating = car.rating;
  if (car.reviews !== undefined) row.reviews = car.reviews;
  return row;
}
