// src/pages/dashboard/UserDashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useInventory } from '../../context/InventoryContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Calendar, 
  Heart, 
  Settings, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Mail,
  Shield,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNpr } from '../../utils/currency';
import { supabase } from '../../utils/supabaseClient';

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { bookings, updateBooking, favorites, toggleFavorite } = useBooking();
  const { cars } = useInventory();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'favorites' | 'profile'>('overview');
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // bookings are already filtered per-user by BookingContext
  const userBookings = bookings;
  
  // Filter favorite cars
  const favoriteCars = cars.filter(car => favorites.includes(car.id));

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);
    setIsUpdatingProfile(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name,
          phone
        }
      });
      if (error) throw error;
      setProfileSuccess("Profile updated successfully!");
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this test drive booking?")) {
      updateBooking(bookingId, 'cancelled');
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: userBookings.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoriteCars.length },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-cyan-400 bg-clip-text text-transparent">
              Client Portal
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage your luxury vehicles, bookings, and profile settings.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={logout} className="border-gray-850 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Content Grid */}
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

          {/* Main Display Pane */}
          <div className="lg:col-span-3">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-800/80 bg-gradient-to-r from-gray-900 via-black to-gray-900 p-8">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.name || 'Valued Client'}</h2>
                    <p className="text-gray-400 max-w-lg leading-relaxed">
                      Welcome to your personalized Fast & Furious dashboard. Here you can track your booked luxury test drives and view your curated collection of premium supercars.
                    </p>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-gray-900/30 border-gray-850 flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Test Drives Booked</p>
                      <h4 className="text-2xl font-bold text-white mt-0.5">{userBookings.length}</h4>
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-gray-900/30 border-gray-850 flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Saved Vehicles</p>
                      <h4 className="text-2xl font-bold text-white mt-0.5">{favoriteCars.length}</h4>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gray-900/30 border-gray-850 flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Account Status</p>
                      <h4 className="text-lg font-bold text-white mt-1 capitalize">{user?.role} Access</h4>
                    </div>
                  </Card>
                </div>

                {/* Recent Booking Widget */}
                <Card className="p-6 bg-gray-900/20 border-gray-850">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    Recent Activity
                  </h3>
                  {userBookings.length > 0 ? (
                    <div className="space-y-4">
                      {userBookings.slice(0, 2).map((booking) => {
                        const car = cars.find(c => c.id === booking.carId);
                        return (
                          <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-900/40 border border-gray-800/80 rounded-xl gap-4">
                            <div>
                              <span className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</span>
                              <h4 className="font-bold text-white mt-0.5">{car ? `${car.make} ${car.model}` : 'Premium Vehicle'}</h4>
                              <p className="text-sm text-gray-400 mt-0.5">Scheduled for: {booking.date} at {booking.time}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        );
                      })}
                      <button 
                        onClick={() => setActiveTab('bookings')} 
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors mt-2"
                      >
                        View all bookings &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">No booked test drives yet.</p>
                      <Link to="/inventory">
                        <Button variant="outline" size="sm" className="mt-4 border-gray-800">Browse Inventory</Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* MY BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="p-6 bg-gray-900/20 border-gray-850">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Calendar className="w-5.5 h-5.5 text-cyan-400" />
                    My Test Drive Bookings
                  </h3>
                  
                  {userBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="pb-3 pl-2">Vehicle</th>
                            <th className="pb-3">Date & Time</th>
                            <th className="pb-3">Contact</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-850 text-sm">
                          {userBookings.map((booking) => {
                            const car = cars.find(c => c.id === booking.carId);
                            return (
                              <tr key={booking.id} className="hover:bg-gray-900/10">
                                <td className="py-4 pl-2 font-bold text-white">
                                  {car ? (
                                    <Link to={`/inventory/${car.id}`} className="hover:text-cyan-400 transition-colors">
                                      {car.make} {car.model} ({car.year})
                                    </Link>
                                  ) : (
                                    <span>Premium Car</span>
                                  )}
                                </td>
                                <td className="py-4 text-gray-300">
                                  <div>{booking.date}</div>
                                  <div className="text-xs text-gray-500">{booking.time}</div>
                                </td>
                                <td className="py-4 text-gray-400 text-xs">
                                  <div>{booking.name}</div>
                                  <div>{booking.phone}</div>
                                </td>
                                <td className="py-4">{getStatusBadge(booking.status)}</td>
                                <td className="py-4 text-right">
                                  {booking.status === 'pending' || booking.status === 'confirmed' ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-400"
                                    >
                                      Cancel
                                    </Button>
                                  ) : (
                                    <span className="text-xs text-gray-500 font-medium">No actions</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500">You haven't scheduled any test drives yet.</p>
                      <Link to="/inventory" className="inline-block mt-4">
                        <Button>Book a Test Drive</Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* FAVORITES TAB */}
            {activeTab === 'favorites' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Heart className="w-5.5 h-5.5 text-red-500 fill-red-500" />
                    Saved Showroom Vehicles
                  </h3>
                </div>

                {favoriteCars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoriteCars.map((car) => (
                      <Card key={car.id} className="group relative overflow-hidden bg-gray-900/25 border-gray-850 flex flex-col justify-between">
                        <div>
                          {/* Image Container */}
                          <div className="relative h-48 overflow-hidden rounded-t-xl">
                            <img 
                              src={car.images[0]} 
                              alt={`${car.make} ${car.model}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <button
                              onClick={() => toggleFavorite(car.id)}
                              className="absolute top-3 right-3 p-2 bg-black/60 rounded-full border border-gray-800 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 transition-colors z-10"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-3 left-3 bg-cyan-500 text-black px-2 py-0.5 text-xs font-bold rounded">
                              {car.type.toUpperCase()}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-5">
                            <h4 className="font-extrabold text-xl text-white group-hover:text-cyan-400 transition-colors">
                              {car.make} {car.model}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                              <span>Year: {car.year}</span>
                              <span>Engine: {car.engine}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-3 line-clamp-2">
                              {car.description}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-gray-850">
                          <span className="text-lg font-extrabold text-cyan-400">{formatNpr(car.price)}</span>
                          <div className="flex gap-2">
                            <Link to={`/inventory/${car.id}`}>
                              <Button variant="outline" size="sm" className="border-gray-850">Details</Button>
                            </Link>
                            <Link to={`/test-drive?car=${car.id}`}>
                              <Button size="sm">Book Test Drive</Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center bg-gray-900/20 border-gray-850">
                    <Heart className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500">Your favorite luxury vehicles will appear here.</p>
                    <Link to="/inventory" className="inline-block mt-4">
                      <Button variant="outline" className="border-gray-800">Browse Inventory</Button>
                    </Link>
                  </Card>
                )}
              </motion.div>
            )}

            {/* PROFILE SETTINGS TAB */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="p-8 bg-gray-900/25 border-gray-850">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Settings className="w-5.5 h-5.5 text-cyan-400" />
                    Account Profile Settings
                  </h3>

                  {profileSuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-4 mb-6 text-sm font-medium">
                      {profileSuccess}
                    </div>
                  )}

                  {profileError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6 text-sm font-medium">
                      {profileError}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                        className="bg-gray-800/40 border-gray-750 focus:border-cyan-500 text-white"
                      />

                      <Input
                        label="Phone Number"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        required
                        className="bg-gray-800/40 border-gray-750 focus:border-cyan-500 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-850 rounded-xl text-gray-500 cursor-not-allowed select-none text-sm outline-none"
                          />
                          <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-600" />
                        </div>
                        <p className="text-[11px] text-gray-650 mt-1.5">Email address cannot be changed dynamically.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">User Access Level</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={`${user?.role.toUpperCase()} PORTAL`}
                            disabled
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-850 rounded-xl text-cyan-500/70 font-semibold cursor-not-allowed select-none text-sm outline-none"
                          />
                          <Shield className="absolute right-3.5 top-3.5 w-4 h-4 text-cyan-500/50" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-850 flex justify-end">
                      <Button type="submit" isLoading={isUpdatingProfile} className="w-full md:w-auto">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
