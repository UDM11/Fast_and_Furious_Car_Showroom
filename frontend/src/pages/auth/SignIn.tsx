// src/pages/auth/SignIn.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Car, Facebook } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/');
      } else {
        setErrors({ general: 'Invalid email or password' });
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

  return (
    <div className="min-h-screen bg-black flex text-white overflow-hidden pt-20 sm:pt-20 lg:pt-24">
      {/* Left side - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
        <img 
          src="https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg" 
          alt="Luxury Sport Car" 
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
              Redefining the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Luxury Experience</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-md leading-relaxed">
              Access our exclusive fleet, personalized payment solutions, and the future of elite automobile sales.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative z-10 bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/80 shadow-2xl shadow-cyan-500/10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4 lg:hidden">
                <Car className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-gray-400 text-sm">Sign in to your Fast & Furious account</p>
            </div>

            {/* Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6"
              >
                <p className="text-red-400 text-sm font-medium">{errors.general}</p>
              </motion.div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
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
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  placeholder="Enter your password"
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

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-700 text-cyan-500 focus:ring-cyan-500 bg-gray-800 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>

                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="mx-3 text-gray-500 text-xs uppercase tracking-wider font-semibold">or</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 hover:bg-gray-800/50 hover:text-white transition-all text-sm border-gray-800"
                onClick={() => alert("Google login coming soon")}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                Google
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 hover:bg-gray-800/50 hover:text-white transition-all text-sm border-gray-800"
                onClick={() => alert("Facebook login coming soon")}
              >
                <Facebook className="w-4 h-4 text-blue-500" />
                Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-8 pt-4 border-t border-gray-800/50">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/auth/signup"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
