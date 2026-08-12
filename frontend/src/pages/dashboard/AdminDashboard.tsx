// src/pages/dashboard/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useInventory } from '../../context/InventoryContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Car, 
  Calendar, 
  Users, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  UserPlus, 
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';
import { formatNpr } from '../../utils/currency';
import { fetchAllUsers, updateUserRoleInDb, fetchContactMessages } from '../../services/supabaseService';

interface AddCarModalState {
  isOpen: boolean;
  isEditing: boolean;
  editId?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  type: 'sedan' | 'suv' | 'sports';
  mileage: number;
  fuel: string;
  transmission: string;
  engine: string;
  image: string;
  description: string;
  features: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, logout, updateUserRole } = useAuth();
  const { bookings, updateBooking } = useBooking();
  const { cars, addCar, updateCar, deleteCar } = useInventory();

  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'bookings' | 'users' | 'messages'>('overview');
  const [contactMessages, setContactMessages] = useState<any[]>([]);

  
  // Modal State for Add/Edit Car
  const [modalState, setModalState] = useState<AddCarModalState>({
    isOpen: false,
    isEditing: false,
    make: '',
    model: '',
    year: 2024,
    price: 150000,
    type: 'sports',
    mileage: 0,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    engine: '4.0L V8 Twin-Turbo',
    image: 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg',
    description: 'A premium luxury vehicle that combines style and performance.',
    features: 'Premium Audio, Leather Seats, Navigation, Driver Assist'
  });

  const [systemUsers, setSystemUsers] = useState<Array<{ id: string; name: string; email: string; phone: string; role: 'user' | 'admin' }>>([]);

  useEffect(() => {
    fetchAllUsers()
      .then(data => setSystemUsers(data.map((u: any) => ({
        id: u.id,
        name: u.name || u.email?.split('@')[0] || 'User',
        email: u.email || '',
        phone: u.phone || '',
        role: u.role || 'user',
      }))))
      .catch(err => console.error('[AdminDashboard] fetchAllUsers error:', err));

    fetchContactMessages()
      .then(data => setContactMessages(data))
      .catch(err => console.error('[AdminDashboard] fetchContactMessages error:', err));
  }, []);

  const handleToggleUserRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const targetRole = currentRole === 'user' ? 'admin' : 'user';
    if (userId === user?.id) {
      if (!window.confirm('Demote yourself? You will lose admin access until promoted back.')) return;
      await updateUserRole(targetRole);
    }
    await updateUserRoleInDb(userId, targetRole);
    setSystemUsers(prev => prev.map(u => u.id === userId ? { ...u, role: targetRole } : u));
  };

  const handleOpenAddModal = () => {
    setModalState({
      isOpen: true,
      isEditing: false,
      make: '',
      model: '',
      year: 2024,
      price: 120000,
      type: 'sports',
      mileage: 0,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      engine: '4.0L V8 Twin-Turbo',
      image: 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg',
      description: 'A premium luxury vehicle that combines style and performance.',
      features: 'Carbon Fiber Trim, Adaptive Suspension, Premium Audio, Navigation'
    });
  };

  const handleOpenEditModal = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    setModalState({
      isOpen: true,
      isEditing: true,
      editId: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      type: car.type,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      engine: car.engine,
      image: car.images[0],
      description: car.description,
      features: car.features.join(', ')
    });
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    const carPayload = {
      make: modalState.make,
      model: modalState.model,
      year: Number(modalState.year),
      price: Number(modalState.price),
      type: modalState.type,
      mileage: Number(modalState.mileage),
      fuel: modalState.fuel,
      transmission: modalState.transmission,
      engine: modalState.engine,
      images: [modalState.image],
      description: modalState.description,
      features: modalState.features.split(',').map(f => f.trim()).filter(f => f.length > 0),
      isNew: modalState.mileage === 0
    };

    if (modalState.isEditing && modalState.editId) {
      updateCar(modalState.editId, carPayload);
    } else {
      addCar(carPayload);
    }

    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleDeleteCar = (carId: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle from the showroom inventory? This cannot be undone.")) {
      deleteCar(carId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-400 border border-green-500/30 flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5 w-fit"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      case 'completed':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  // Calculations for overview stats
  const totalValue = cars.reduce((acc, car) => acc + car.price, 0);
  const activeBookingsCount = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sliders },
    { id: 'vehicles', label: 'Manage Vehicles', icon: Car, badge: cars.length },
    { id: 'bookings', label: 'Manage Bookings', icon: Calendar, badge: bookings.filter(b => b.status === 'pending').length },
    { id: 'users', label: 'User Roles', icon: Users, badge: systemUsers.length },
    { id: 'messages', label: 'Client Messages', icon: FileText, badge: contactMessages.length },
  ] as const;

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Shield className="w-5 h-5" />
              <span className="text-xs uppercase font-extrabold tracking-widest">Administrator Console</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Showroom Control Center
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => updateUserRole('user')}
              className="border-gray-850 hover:border-cyan-500/50 hover:text-cyan-400 flex items-center gap-2"
            >
              Exit Admin Mode
            </Button>
            <Button variant="outline" onClick={logout} className="border-gray-850 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-2">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-medium tracking-wide transition-all border text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/5'
                      : 'bg-gray-900/30 border-gray-850 text-gray-400 hover:text-white hover:bg-gray-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-cyan-500 text-black font-bold' : 'bg-gray-800 text-gray-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Pane */}
          <div className="lg:col-span-3">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="p-6 bg-gray-900/30 border-gray-850 flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Vehicles</p>
                      <h4 className="text-2xl font-bold text-white mt-0.5">{cars.length}</h4>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gray-900/30 border-gray-850 flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-400">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Active Bookings</p>
                      <h4 className="text-2xl font-bold text-white mt-0.5">{activeBookingsCount}</h4>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gray-900/30 border-gray-850 flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Showroom Users</p>
                      <h4 className="text-2xl font-bold text-white mt-0.5">{systemUsers.length}</h4>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gray-900/30 border-gray-850 flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 text-green-400">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Asset Valuation</p>
                      <h4 className="text-xl font-bold text-white mt-0.5">{formatNpr(totalValue)}</h4>
                    </div>
                  </Card>
                </div>

                {/* Dashboard Chart Mock & Activity Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Performance metrics */}
                  <Card className="p-6 bg-gray-900/20 border-gray-850 md:col-span-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-cyan-400" />
                          Showroom Interest Trend
                        </h3>
                        <span className="text-xs text-green-450 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-bold">+18.5% this week</span>
                      </div>
                      
                      {/* CSS/SVG Mini Chart */}
                      <div className="h-40 w-full flex items-end justify-between pt-6 px-2 border-b border-gray-800 gap-1.5">
                        <div className="w-full bg-cyan-950/20 hover:bg-cyan-500/20 border-t border-cyan-800 h-1/5 rounded-t transition-all relative group" title="Mon: 3 Bookings"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[10px] px-1.5 py-0.5 rounded border border-gray-850 opacity-0 group-hover:opacity-100 transition-opacity">3</span></div>
                        <div className="w-full bg-cyan-950/20 hover:bg-cyan-500/20 border-t border-cyan-800 h-2/5 rounded-t transition-all relative group" title="Tue: 6 Bookings"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[10px] px-1.5 py-0.5 rounded border border-gray-850 opacity-0 group-hover:opacity-100 transition-opacity">6</span></div>
                        <div className="w-full bg-cyan-950/20 hover:bg-cyan-500/20 border-t border-cyan-800 h-1/3 rounded-t transition-all relative group" title="Wed: 5 Bookings"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[10px] px-1.5 py-0.5 rounded border border-gray-850 opacity-0 group-hover:opacity-100 transition-opacity">5</span></div>
                        <div className="w-full bg-cyan-950/20 hover:bg-cyan-500/20 border-t border-cyan-800 h-3/5 rounded-t transition-all relative group" title="Thu: 9 Bookings"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[10px] px-1.5 py-0.5 rounded border border-gray-850 opacity-0 group-hover:opacity-100 transition-opacity">9</span></div>
                        <div className="w-full bg-cyan-950/20 hover:bg-cyan-500/20 border-t border-cyan-800 h-1/2 rounded-t transition-all relative group" title="Fri: 8 Bookings"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[10px] px-1.5 py-0.5 rounded border border-gray-850 opacity-0 group-hover:opacity-100 transition-opacity">8</span></div>
                        <div className="w-full bg-cyan-950/20 hover:bg-cyan-500/20 border-t border-cyan-800 h-4/5 rounded-t transition-all relative group" title="Sat: 12 Bookings"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[10px] px-1.5 py-0.5 rounded border border-gray-850 opacity-0 group-hover:opacity-100 transition-opacity">12</span></div>
                        <div className="w-full bg-cyan-500/25 hover:bg-cyan-500/40 border-t border-cyan-400 h-full rounded-t transition-all relative group" title="Sun: 15 Bookings"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[10px] px-1.5 py-0.5 rounded border border-gray-850 opacity-0 group-hover:opacity-100 transition-opacity">15</span></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500 mt-2 px-1 font-bold">
                        <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Action Widget */}
                  <Card className="p-6 bg-gray-900/20 border-gray-850 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold flex items-center gap-2 mb-3">
                        <Sliders className="w-5 h-5 text-cyan-400" />
                        Admin Actions
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed mb-4">
                        Add a new premium car to the collection or approve pending client booking requests.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Button onClick={handleOpenAddModal} size="sm" className="w-full flex items-center justify-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add New Car
                      </Button>
                      <Button onClick={() => setActiveTab('bookings')} variant="outline" size="sm" className="w-full border-gray-850">
                        View Pending Bookings
                      </Button>
                    </div>
                  </Card>

                </div>

              </motion.div>
            )}

            {/* VEHICLES TAB */}
            {activeTab === 'vehicles' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Car className="w-5.5 h-5.5 text-cyan-400" />
                    Manage Showroom Inventory
                  </h3>
                  <Button onClick={handleOpenAddModal} className="flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Car
                  </Button>
                </div>

                <Card className="p-6 bg-gray-900/20 border-gray-850">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          <th className="pb-3 pl-2">Vehicle</th>
                          <th className="pb-3">Specs</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-850 text-sm">
                        {cars.map((car) => (
                          <tr key={car.id} className="hover:bg-gray-900/10">
                            <td className="py-4 pl-2 flex items-center gap-3">
                              <img src={car.images[0]} alt="" className="w-12 h-8 object-cover rounded border border-gray-800" />
                              <div>
                                <h4 className="font-bold text-white leading-none">{car.make} {car.model}</h4>
                                <span className="text-[11px] text-gray-500">Year: {car.year}</span>
                              </div>
                            </td>
                            <td className="py-4 text-xs text-gray-400">
                              <div>Engine: {car.engine}</div>
                              <div>Gear: {car.transmission}</div>
                            </td>
                            <td className="py-4 capitalize">
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                                car.type === 'sports' 
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                  : car.type === 'suv'
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                              }`}>
                                {car.type}
                              </span>
                            </td>
                            <td className="py-4 font-bold text-cyan-400">{formatNpr(car.price)}</td>
                            <td className="py-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={() => handleOpenEditModal(car.id)}
                                  className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
                                  title="Edit Vehicle"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCar(car.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                  title="Delete Vehicle"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5.5 h-5.5 text-cyan-400" />
                  Client Booking Applications
                </h3>

                <Card className="p-6 bg-gray-900/20 border-gray-850">
                  {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="pb-3 pl-2">Client Details</th>
                            <th className="pb-3">Booked Vehicle</th>
                            <th className="pb-3">Date & Time</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-850 text-sm">
                          {bookings.map((booking) => {
                            const car = cars.find(c => c.id === booking.carId);
                            return (
                              <tr key={booking.id} className="hover:bg-gray-900/10">
                                <td className="py-4 pl-2">
                                  <div className="font-bold text-white leading-none">{booking.name}</div>
                                  <span className="text-xs text-gray-500">{booking.email} | {booking.phone}</span>
                                </td>
                                <td className="py-4">
                                  {car ? (
                                    <span className="font-semibold text-gray-255">{car.make} {car.model}</span>
                                  ) : (
                                    <span className="text-gray-500">Deleted Car</span>
                                  )}
                                </td>
                                <td className="py-4 text-gray-300">
                                  <div>{booking.date}</div>
                                  <div className="text-xs text-gray-550">{booking.time}</div>
                                </td>
                                <td className="py-4">{getStatusBadge(booking.status)}</td>
                                <td className="py-4 text-right">
                                  <div className="flex gap-2 justify-end">
                                    {booking.status === 'pending' && (
                                      <>
                                        <button 
                                          onClick={() => updateBooking(booking.id, 'confirmed')}
                                          className="p-1 text-green-400 hover:bg-green-500/10 rounded transition-colors"
                                          title="Confirm Booking"
                                        >
                                          <Check className="w-4.5 h-4.5" />
                                        </button>
                                        <button 
                                          onClick={() => updateBooking(booking.id, 'cancelled')}
                                          className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                          title="Decline Booking"
                                        >
                                          <X className="w-4.5 h-4.5" />
                                        </button>
                                      </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                      <Button 
                                        variant="outline" 
                                        size="xs"
                                        onClick={() => updateBooking(booking.id, 'completed')}
                                        className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                                      >
                                        Mark Done
                                      </Button>
                                    )}
                                    {(booking.status === 'completed' || booking.status === 'cancelled') && (
                                      <span className="text-xs text-gray-600 font-medium">Archived</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No bookings have been made yet in the system.
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5.5 h-5.5 text-cyan-400" />
                  Showroom Users Roster
                </h3>

                <Card className="p-6 bg-gray-900/20 border-gray-850">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                          <th className="pb-3 pl-2">User Details</th>
                          <th className="pb-3">User Email</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-850 text-sm">
                        {systemUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-900/10">
                            <td className="py-4 pl-2 font-bold text-white">
                              {u.name}
                              <div className="text-xs text-gray-500 font-normal mt-0.5">{u.phone}</div>
                            </td>
                            <td className="py-4 text-gray-300">{u.email}</td>
                            <td className="py-4 capitalize">
                              <span className={`px-2 py-0.5 text-xs font-bold rounded border ${
                                u.role === 'admin' 
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                                  : 'bg-gray-800 text-gray-450 border-gray-700'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <Button 
                                variant="outline" 
                                size="xs"
                                onClick={() => handleToggleUserRole(u.id, u.role)}
                                className={
                                  u.role === 'admin' 
                                    ? 'border-gray-800 hover:bg-red-500/10 hover:text-red-400' 
                                    : 'border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10'
                                }
                              >
                                {u.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5.5 h-5.5 text-cyan-400" />
                  Customer Inquiries & Messages
                </h3>

                <Card className="p-6 bg-gray-900/20 border-gray-850">
                  {contactMessages.length > 0 ? (
                    <div className="space-y-4">
                      {contactMessages.map((msg) => (
                        <div key={msg.id} className="p-5 rounded-xl bg-gray-900/40 border border-gray-800 hover:border-gray-700 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                            <div>
                              <h4 className="text-base font-bold text-white">{msg.name}</h4>
                              <p className="text-xs text-gray-500">{msg.email} {msg.phone ? `| ${msg.phone}` : ''}</p>
                            </div>
                            <span className="text-[11px] text-gray-600 bg-gray-950 px-2.5 py-1 rounded border border-gray-850">
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-xs">
                            <div className="bg-gray-950/40 p-2.5 rounded border border-gray-900 text-gray-400">
                              <span className="text-gray-600 font-bold block uppercase text-[10px] tracking-wider mb-1">Subject</span>
                              {msg.subject || 'General Inquiry'}
                            </div>
                            <div className="bg-gray-950/40 p-2.5 rounded border border-gray-900 text-gray-400">
                              <span className="text-gray-600 font-bold block uppercase text-[10px] tracking-wider mb-1">Interested Model</span>
                              {msg.car_model || 'None Specified'}
                            </div>
                            <div className="bg-gray-950/40 p-2.5 rounded border border-gray-900 text-gray-400">
                              <span className="text-gray-600 font-bold block uppercase text-[10px] tracking-wider mb-1">Pref. Contact</span>
                              <span className="capitalize">{msg.preferred_contact || 'Email'}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-950/20 rounded border border-gray-900 text-sm text-gray-350 whitespace-pre-line leading-relaxed">
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No contact messages have been received yet.
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

          </div>

        </div>

      </div>

      {/* ADD/EDIT CAR SLIDE OVER / MODAL */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-850 flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Car className="w-6 h-6 text-cyan-400" />
                {modalState.isEditing ? 'Edit Luxury Vehicle' : 'Add Luxury Showroom Vehicle'}
              </h3>
              <button 
                onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))} 
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="p-6 space-y-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Make"
                  type="text"
                  value={modalState.make}
                  onChange={(e) => setModalState(prev => ({ ...prev, make: e.target.value }))}
                  placeholder="e.g. Aston Martin"
                  required
                />
                <Input
                  label="Model"
                  type="text"
                  value={modalState.model}
                  onChange={(e) => setModalState(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="e.g. DBS Superleggera"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Year"
                  type="number"
                  value={modalState.year}
                  onChange={(e) => setModalState(prev => ({ ...prev, year: Number(e.target.value) }))}
                  required
                />
                <Input
                  label="Price ($)"
                  type="number"
                  value={modalState.price}
                  onChange={(e) => setModalState(prev => ({ ...prev, price: Number(e.target.value) }))}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Body Type</label>
                  <select
                    value={modalState.type}
                    onChange={(e) => setModalState(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm outline-none focus:border-cyan-500"
                  >
                    <option value="sports">Sports</option>
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Mileage (miles)"
                  type="number"
                  value={modalState.mileage}
                  onChange={(e) => setModalState(prev => ({ ...prev, mileage: Number(e.target.value) }))}
                  required
                />
                <Input
                  label="Engine"
                  type="text"
                  value={modalState.engine}
                  onChange={(e) => setModalState(prev => ({ ...prev, engine: e.target.value }))}
                  placeholder="e.g. 5.2L V12"
                  required
                />
                <Input
                  label="Transmission"
                  type="text"
                  value={modalState.transmission}
                  onChange={(e) => setModalState(prev => ({ ...prev, transmission: e.target.value }))}
                  placeholder="e.g. 8-Speed Automatic"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Fuel Type"
                  type="text"
                  value={modalState.fuel}
                  onChange={(e) => setModalState(prev => ({ ...prev, fuel: e.target.value }))}
                  placeholder="e.g. Gasoline"
                  required
                />
                <Input
                  label="Image URL"
                  type="text"
                  value={modalState.image}
                  onChange={(e) => setModalState(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="e.g. https://images.com/..."
                  required
                />
              </div>

              <Input
                label="Key Features (comma-separated)"
                type="text"
                value={modalState.features}
                onChange={(e) => setModalState(prev => ({ ...prev, features: e.target.value }))}
                placeholder="e.g. Carbon Trim, Heated Seats, Navigation"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={modalState.description}
                  onChange={(e) => setModalState(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-850">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))} 
                  className="border-gray-800"
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {modalState.isEditing ? 'Save Changes' : 'Publish Car'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
