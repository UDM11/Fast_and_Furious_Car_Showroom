// src/pages/dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserDashboard } from './UserDashboard';
import { AdminDashboard } from './AdminDashboard';
import { Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If auth state finished loading and there is no active session, redirect to Sign In
    if (!isLoading && !user) {
      navigate('/auth/signin');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-gray-400 text-sm font-semibold tracking-wider uppercase">Loading Luxury Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting...
  }

  return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
