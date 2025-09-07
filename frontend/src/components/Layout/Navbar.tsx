import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Car, 
  Bot, 
  Calendar, 
  Calculator, 
  Phone, 
  User,
  ChevronDown,
  Wrench,
  Home 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

type DropdownItem = {
  name: string;
  path: string;
  icon?: React.ElementType;
};

type NavigationItem = {
  name: string;
  path?: string;
  icon?: React.ElementType;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
};

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close menus and scroll to top on route change
  useEffect(() => {
    setIsOpen(false);
    setInventoryOpen(false);
    setServicesOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  // Close ALL dropdowns & mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false);
      setInventoryOpen(false);
      setServicesOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems: NavigationItem[] = [
    { name: 'Home', path: '/', icon: Home }, 
    { 
      name: 'Inventory', 
      path: '/inventory',
      icon: Car,
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Vehicles', path: '/inventory' }, 
        { name: 'Sports Cars', path: '/inventory?type=sports' },
        { name: 'SUVs', path: '/inventory?type=suv' },
        { name: 'Sedans', path: '/inventory?type=sedan' }
      ]
    },
    { name: 'AI Receptionist', path: '/ai-receptionist', icon: Bot },
    { name: 'Test Drive', path: '/test-drive', icon: Calendar },
    { name: 'Finance', path: '/finance', icon: Calculator },
    { 
      name: 'Services',
      icon: Wrench,
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Services', path: '/services' },
        { name: 'Maintenance', path: '/services/maintenance' },
        { name: 'Trade-In', path: '/services/trade-in' },
        { name: 'Warranty', path: '/services/warranty' },
        { name: 'Financing', path: '/services/financing' },
        { name: 'Concierge', path: '/services/concierge' },
        { name: "Performance Upgrades", path: "/services/performance" }
      ]
    },
    { name: 'Contact', path: '/contact', icon: Phone }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800/50 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 w-40 sm:w-48">
            <Car className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
            <h1 className="text-base sm:text-lg font-bold">
              <span className="text-white">Fast</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> & </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">Furious</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <div
                    onMouseEnter={() => {
                      if (item.name === 'Inventory') setInventoryOpen(true);
                      if (item.name === 'Services') setServicesOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (item.name === 'Inventory') setInventoryOpen(false);
                      if (item.name === 'Services') setServicesOpen(false);
                    }}
                  >
                    <button className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                      {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                      <span>{item.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                      {((item.name === 'Inventory' && inventoryOpen) || (item.name === 'Services' && servicesOpen)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-700/50"
                        >
                          {item.dropdownItems?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="flex items-center px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.path || '#'}
                    className={`flex items-center space-x-1 transition-colors duration-300 ${
                      location.pathname === item.path
                        ? 'text-cyan-400'
                        : 'text-gray-300 hover:text-cyan-400'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/account">
                  <Button variant="outline" size="sm" className="px-5">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="px-5" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/auth/signin">
                  <Button variant="outline" size="sm" className="px-6">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="primary" size="sm" className="px-6">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="border-b border-gray-700/30 last:border-b-0">
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => {
                          if (item.name === 'Inventory') setInventoryOpen(!inventoryOpen);
                          if (item.name === 'Services') setServicesOpen(!servicesOpen);
                        }}
                        className="flex items-center justify-between w-full text-left text-gray-300 hover:text-cyan-400 transition-colors duration-300 py-3"
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon && <item.icon className="w-5 h-5" />}
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transform transition-transform ${
                          (item.name === 'Inventory' && inventoryOpen) || (item.name === 'Services' && servicesOpen) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      <AnimatePresence>
                        {((item.name === 'Inventory' && inventoryOpen) || (item.name === 'Services' && servicesOpen)) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-6 mb-2 space-y-2"
                          >
                            {item.dropdownItems?.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className="flex items-center py-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.path || '#'}
                      className={`flex items-center space-x-3 py-3 transition-colors duration-300 ${
                        location.pathname === item.path
                          ? 'text-cyan-400'
                          : 'text-gray-300 hover:text-cyan-400'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 mt-2 border-t border-gray-700/50">
                {user ? (
                  <div className="space-y-3">
                    <Link 
                      to="/account" 
                      className="flex items-center space-x-3 py-3 text-gray-300 hover:text-cyan-400"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Account</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 py-3 w-full text-gray-300 hover:text-red-400"
                    >
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      to="/auth/signin" 
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <Button variant="outline" className="w-full py-3">
                        Sign In
                      </Button>
                    </Link>
                    <Link 
                      to="/auth/signup" 
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <Button variant="primary" className="w-full py-3">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
