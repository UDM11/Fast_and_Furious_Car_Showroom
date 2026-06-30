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
  Home,
  Sparkles,
  RefreshCw,
  Shield,
  DollarSign,
  Crown,
  Zap,
  ArrowRight
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
  const [activeDropdown, setActiveDropdown] = useState<'inventory' | 'services' | 'profile' | null>(null);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close menus and scroll to top on route change
  useEffect(() => {
    setIsOpen(false);
    setInventoryOpen(false);
    setServicesOpen(false);
    setActiveDropdown(null);
    window.scrollTo(0, 0);
  }, [location]);

  // Close dropdowns on scroll
  useEffect(() => {
    const handleScroll = () => {
      setActiveDropdown(null);
      setIsOpen(false);
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
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 text-sm transition-all duration-300"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo - Full Left */}
          <div className="flex items-center flex-1 justify-start">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300">
                <Car className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <h1 className="text-sm sm:text-base font-bold tracking-wider">
                <span className="text-white">FAST</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-extrabold"> & </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">FURIOUS</span>
              </h1>
            </Link>
          </div>

          {/* Navigation Items - Centered */}
          <div className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-2 relative h-full">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div 
                  key={item.name} 
                  className="relative h-full flex items-center"
                  onMouseEnter={() => {
                    if (item.hasDropdown) {
                      setActiveDropdown(item.name === 'Inventory' ? 'inventory' : 'services');
                    } else {
                      setActiveDropdown(null);
                    }
                  }}
                >
                  {item.hasDropdown ? (
                    <button 
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-all duration-300 font-medium ${
                        activeDropdown === (item.name === 'Inventory' ? 'inventory' : 'services') ? 'text-cyan-400 bg-white/5' : ''
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-1 opacity-70" />}
                      <span>{item.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        activeDropdown === (item.name === 'Inventory' ? 'inventory' : 'services') ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <Link
                      to={item.path || '#'}
                      className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 font-medium ${
                        isActive
                          ? 'text-cyan-400 bg-white/5'
                          : 'text-gray-300 hover:text-cyan-400 hover:bg-white/5'
                      }`}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-1 opacity-70" />}
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNavUnderline"
                          className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* User Profile & Auth / Hamburger - Full Right */}
          <div className="flex items-center justify-end flex-1 space-x-4">
            {user ? (
              <div 
                className="relative hidden lg:block"
                onMouseEnter={() => setActiveDropdown('profile')}
              >
                <button className="flex items-center space-x-2 p-1.5 bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-full transition-all duration-300 text-gray-300 hover:text-white">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-500/20">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate hidden xl:inline">{user.name || 'Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 mr-1" />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'profile' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl p-2 z-50"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-white text-xs font-semibold truncate">{user.name || 'User'}</p>
                        <p className="text-gray-400 text-xxs truncate">{user.email || ''}</p>
                      </div>
                      <Link
                        to="/account"
                        className="flex items-center px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors text-xs font-medium"
                      >
                        <User className="w-4 h-4 mr-2 opacity-70" />
                        My Account
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-3 py-2 text-red-400 hover:text-red-350 hover:bg-red-500/10 rounded-lg transition-colors text-xs font-medium mt-1"
                      >
                        <X className="w-4 h-4 mr-2 opacity-70" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/auth/signin">
                  <Button variant="ghost" size="sm" className="px-5 border border-transparent hover:border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-all text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="primary" size="sm" className="px-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-cyan-500/30 transition-all text-xs">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-white/10 transition-all duration-300"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mega Menus Dropdown (Desktop Only) */}
      <AnimatePresence>
        {activeDropdown === 'inventory' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-0 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl p-8 z-40 hidden lg:block"
            onMouseEnter={() => setActiveDropdown('inventory')}
          >
            <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-4 gap-8">
              <div className="col-span-3 grid grid-cols-2 gap-6">
                {navigationItems.find(i => i.name === 'Inventory')?.dropdownItems?.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.path}
                    className="flex items-start p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
                  >
                    <div className="p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20 text-cyan-400 mr-4">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">{subItem.name}</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {subItem.name === 'All Vehicles' && 'Explore our entire fleet of modern luxury, sports, and classic cars.'}
                        {subItem.name === 'Sports Cars' && 'Experience pure adrenaline with our high-performance vehicles.'}
                        {subItem.name === 'SUVs' && 'Refined power, space, and comfort for any road ahead.'}
                        {subItem.name === 'Sedans' && 'Impeccable style, comfort, and state-of-the-art technology.'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="col-span-1 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group/card">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">Featured Offer</span>
                  <h4 className="font-extrabold text-white text-base mt-2 mb-1">Book a Test Drive</h4>
                  <p className="text-gray-300 text-xs leading-relaxed mb-4">Feel the raw power and comfort of our performance models. Schedule your session today.</p>
                </div>
                <Link to="/test-drive" className="relative z-10 inline-flex items-center text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                  Get Started <ArrowRight className="w-4 h-4 ml-1 transform group-hover/card:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {activeDropdown === 'services' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-0 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl p-8 z-40 hidden lg:block"
            onMouseEnter={() => setActiveDropdown('services')}
          >
            <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-4 gap-8">
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {navigationItems.find(i => i.name === 'Services')?.dropdownItems?.map((subItem) => {
                  let ServiceIcon = Wrench;
                  let desc = '';
                  if (subItem.name === 'All Services') { ServiceIcon = Sparkles; desc = 'View our full lineup of client services.'; }
                  else if (subItem.name === 'Maintenance') { ServiceIcon = Wrench; desc = 'Expert diagnostics & routine care.'; }
                  else if (subItem.name === 'Trade-In') { ServiceIcon = RefreshCw; desc = 'Instant valuation on your current car.'; }
                  else if (subItem.name === 'Warranty') { ServiceIcon = Shield; desc = 'Extended coverages for peace of mind.'; }
                  else if (subItem.name === 'Financing') { ServiceIcon = DollarSign; desc = 'Custom loan & lease options.'; }
                  else if (subItem.name === 'Concierge') { ServiceIcon = Crown; desc = 'White-glove VIP buying experience.'; }
                  else if (subItem.name === 'Performance Upgrades') { ServiceIcon = Zap; desc = 'ECU tuning, suspension & exhausts.'; }
                  
                  return (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 group/item"
                    >
                      <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-300 group-hover/item:text-cyan-400 group-hover/item:border-cyan-500/30 transition-all mr-3">
                        <ServiceIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm mb-0.5 group-hover/item:text-cyan-400 transition-colors">{subItem.name}</h4>
                        <p className="text-gray-400 text-[10px] leading-normal">{desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              <div className="col-span-1 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group/card">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest">AI Assistance</span>
                  <h4 className="font-extrabold text-white text-base mt-2 mb-1">Talk to our Concierge</h4>
                  <p className="text-gray-300 text-xs leading-relaxed mb-4">Get instant answers on models, services, financing and more from our AI Receptionist.</p>
                </div>
                <Link to="/ai-receptionist" className="relative z-10 inline-flex items-center text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  Chat Now <ArrowRight className="w-4 h-4 ml-1 transform group-hover/card:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed left-0 right-0 top-16 sm:top-20 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 overflow-y-auto max-h-[calc(100vh-5rem)] shadow-2xl z-40"
          >
            <div className="px-4 py-4 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="border-b border-white/5 last:border-b-0">
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
                          {item.icon && <item.icon className="w-5 h-5 opacity-70" />}
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${
                          (item.name === 'Inventory' && inventoryOpen) || (item.name === 'Services' && servicesOpen) ? 'rotate-180 text-cyan-400' : ''
                        }`} />
                      </button>
                      
                      <AnimatePresence>
                        {((item.name === 'Inventory' && inventoryOpen) || (item.name === 'Services' && servicesOpen)) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-6 mb-2 space-y-1"
                          >
                            {item.dropdownItems?.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className="flex items-center py-2.5 text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-xs font-medium"
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
                          ? 'text-cyan-400 font-semibold'
                          : 'text-gray-300 hover:text-cyan-400'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon && <item.icon className="w-5 h-5 opacity-70" />}
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 mt-2 border-t border-white/5">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-white/5 rounded-lg mb-2">
                      <p className="text-white text-xs font-semibold truncate">{user.name || 'User'}</p>
                      <p className="text-gray-450 text-[10px] truncate">{user.email || ''}</p>
                    </div>
                    <Link 
                      to="/account" 
                      className="flex items-center space-x-3 py-2.5 text-gray-300 hover:text-cyan-400 text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5 opacity-70" />
                      <span>My Account</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 py-2.5 w-full text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      <X className="w-5 h-5 opacity-70" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link 
                      to="/auth/signin" 
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <Button variant="outline" size="sm" className="w-full py-2.5 text-xs text-center justify-center">
                        Sign In
                      </Button>
                    </Link>
                    <Link 
                      to="/auth/signup" 
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <Button variant="primary" size="sm" className="w-full py-2.5 text-xs text-center justify-center">
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
