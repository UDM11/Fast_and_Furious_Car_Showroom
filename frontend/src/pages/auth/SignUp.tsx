// src/pages/auth/SignUp.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Car, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      if (success) {
        navigate('/');
      } else {
        setErrors({ general: 'Account creation failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const benefits = [
    "Exclusive access to premium inventory",
    "Priority test drive scheduling",
    "Personalized financing options",
    "AI-powered car recommendations"
  ];

  return (
    <div className="min-h-screen bg-black flex text-white overflow-hidden pt-20 sm:pt-20 lg:pt-24">
      {/* Left side - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10" />
        <img 
          src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" 
          alt="Luxury Performance Car" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-16 left-16 right-16 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Car className="w-10 h-10 text-cyan-400" />
              <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">FAST & FURIOUS</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              Unlock Elite <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Member Privileges</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-8">
              Join our exclusive club to get early access to luxury collections, direct AI support, and tailored concierge updates.
            </p>

            {/* Member Benefits in Side Panel */}
            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center text-gray-300 gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative z-10 bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md my-8 lg:my-0"
        >
          <div className="p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/80 shadow-2xl shadow-cyan-500/10">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4 lg:hidden">
                <Car className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Create Account</h2>
              <p className="text-gray-400 text-sm">Join Fast & Furious premium luxury showroom</p>
            </div>

            {/* Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5"
              >
                <p className="text-red-400 text-sm font-medium">{errors.general}</p>
              </motion.div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter your full name"
                required
                className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
                required
                className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="Enter your phone number"
                required
                className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  placeholder="Create a password"
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Terms */}
              <div className="flex items-start pt-1">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 rounded border-gray-700 text-cyan-500 focus:ring-cyan-500 bg-gray-800 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-300 cursor-pointer select-none">
                    I agree to the{' '}
                    <Link to="/terms" className="text-cyan-400 hover:text-cyan-300 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
                Create Account
              </Button>
            </form>

            {/* Mobile-only Member Benefits Summary */}
            <div className="mt-6 pt-5 border-t border-gray-800/50 lg:hidden">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Member Benefits</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  Premium Fleet Access
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  Priority Testing
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  AI Recommendations
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  VIP Concierge
                </div>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-800/50">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link
                  to="/auth/signin"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
