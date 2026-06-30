import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Zap,
  Star,
  Car as CarIcon,
  X,
  ArrowUpDown,
  MapPin,
  Clock,
  Shield
} from 'lucide-react';
import { carsData } from '../data/carsData';
import { Car } from '../types';
import { CarCard } from '../components/Inventory/CarCard';
import { formatNpr } from '../utils/currency';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// Floating particles component for inventory
const InventoryParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 25 + 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

// Enhanced filter chip component
const FilterChip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-300"
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-2 hover:text-white transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [sortBy, setSortBy] = useState('price-low');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 9;

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedType !== 'all') params.set('type', selectedType);
    setSearchParams(params);
  }, [searchQuery, selectedType, setSearchParams]);

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let filtered = carsData.filter(car => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.year.toString().includes(query) ||
          car.type.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (selectedType !== 'all' && car.type !== selectedType) {
        return false;
      }

      // Price filter
      if (car.price < priceRange[0] || car.price > priceRange[1]) {
        return false;
      }

      // Year filter
      if (car.year < yearRange[0] || car.year > yearRange[1]) {
        return false;
      }

      return true;
    });

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'year-new':
          return b.year - a.year;
        case 'year-old':
          return a.year - b.year;
        case 'rating':
          return b.rating - a.rating;
        case 'mileage':
          return a.mileage - b.mileage;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedType, priceRange, yearRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCarSelect = (car: Car) => {
    navigate(`/inventory/${car.id}`);
  };

  const carTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'sports', label: 'Sports Cars' },
    { value: 'sedan', label: 'Sedans' },
    { value: 'suv', label: 'SUVs' }
  ];

  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'year-new', label: 'Year: Newest First' },
    { value: 'year-old', label: 'Year: Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'mileage', label: 'Lowest Mileage' }
  ];

  // Active filters for display
  const activeFilters = [];
  if (searchQuery) activeFilters.push({ key: 'search', label: `Search: "${searchQuery}"`, remove: () => setSearchQuery('') });
  if (selectedType !== 'all') activeFilters.push({ key: 'type', label: `Type: ${selectedType}`, remove: () => setSelectedType('all') });
  if (priceRange[0] > 0 || priceRange[1] < 500000) activeFilters.push({ key: 'price', label: `Price: ${formatNpr(priceRange[0])} - ${formatNpr(priceRange[1])}`, remove: () => setPriceRange([0, 500000]) });
  if (yearRange[0] > 2020 || yearRange[1] < 2024) activeFilters.push({ key: 'year', label: `Year: ${yearRange[0]}-${yearRange[1]}`, remove: () => setYearRange([2020, 2024]) });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-20 pb-16 relative overflow-hidden">
      <InventoryParticles />
      
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
          style={{ y: y1 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block">
              Premium Vehicle
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Inventory
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Discover our exclusive collection of luxury vehicles, each one carefully curated for excellence and performance
          </motion.p>
          
          {/* Quick Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="flex items-center space-x-2 text-cyan-400">
              <CarIcon className="w-5 h-5" />
              <span className="font-semibold">{carsData.length}+ Vehicles</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Certified Pre-Owned</span>
            </div>
            <div className="flex items-center space-x-2 text-yellow-400">
              <Star className="w-5 h-5" />
              <span className="font-semibold">4.9 Rating</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="p-8 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
            <div className="space-y-8">
              {/* Enhanced Search Bar */}
              <div className="relative">
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <motion.input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by make, model, year, or any keyword..."
                    className="w-full pl-16 pr-6 py-5 bg-gray-800/50 border-2 border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 text-lg"
                    whileFocus={{ borderColor: '#06b6d4' }}
                  />
                  
                  {/* Search suggestions */}
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-600/50 overflow-hidden z-20"
                      >
                        <div className="p-4 space-y-2">
                          <div className="text-gray-300 text-sm font-medium mb-2">Quick Suggestions:</div>
                          {['BMW', 'Mercedes', 'Audi', 'Tesla', 'Porsche'].filter(brand => 
                            brand.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((suggestion, index) => (
                            <motion.button
                              key={suggestion}
                              type="button"
                              onClick={() => setSearchQuery(suggestion)}
                              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              
              {/* Active Filters */}
              <AnimatePresence>
                {activeFilters.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-3 items-center"
                  >
                    <span className="text-gray-400 text-sm font-medium">Active Filters:</span>
                    {activeFilters.map((filter) => (
                      <FilterChip
                        key={filter.key}
                        label={filter.label}
                        onRemove={filter.remove}
                      />
                    ))}
                    <motion.button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedType('all');
                        setPriceRange([0, 500000]);
                        setYearRange([2020, 2024]);
                      }}
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline"
                      whileHover={{ scale: 1.05 }}
                    >
                      Clear All
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Quick Filters */}
              <div className="flex flex-wrap gap-6 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Type Filter */}
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-gray-300 text-sm font-medium">Type:</span>
                    <motion.select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="bg-gray-800/50 border-2 border-gray-600/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 cursor-pointer"
                      whileFocus={{ scale: 1.02 }}
                    >
                      {carTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>

                  {/* Sort */}
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-gray-300 text-sm font-medium">Sort:</span>
                    <motion.select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-800/50 border-2 border-gray-600/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 cursor-pointer"
                      whileFocus={{ scale: 1.02 }}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>

                  {/* Advanced Filters Toggle */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        Advanced Filters
                        <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </motion.div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm font-medium mr-2">View:</span>
                  <div className="flex items-center bg-gray-800/50 rounded-xl p-1 border border-gray-600/50">
                    <motion.button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === 'grid' 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === 'list' 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <List className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Enhanced Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="pt-8 border-t border-gradient-to-r from-gray-700/50 via-cyan-500/20 to-gray-700/50"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Price Range */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-300 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                            Price Range
                          </label>
                          <span className="text-sm text-cyan-400 font-semibold">
                            {formatNpr(priceRange[0])} - {formatNpr(priceRange[1])}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="relative">
                            <input
                              type="range"
                              min="0"
                              max="500000"
                              step="10000"
                              value={priceRange[0]}
                              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>NPR 0</span>
                              <span>NPR 500K</span>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <input
                              type="range"
                              min="0"
                              max="500000"
                              step="10000"
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Year Range */}
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-300 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-blue-400" />
                            Year Range
                          </label>
                          <span className="text-sm text-cyan-400 font-semibold">
                            {yearRange[0]} - {yearRange[1]}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="relative">
                            <input
                              type="range"
                              min="2015"
                              max="2024"
                              value={yearRange[0]}
                              onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>2015</span>
                              <span>2024</span>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <input
                              type="range"
                              min="2015"
                              max="2024"
                              value={yearRange[1]}
                              onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Quick Filter Presets */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 pt-6 border-t border-gray-700/30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-300">Quick Presets:</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { label: 'Luxury (NPR 100K+)', price: [100000, 500000], year: [2020, 2024] },
                          { label: 'Budget Friendly (<NPR 50K)', price: [0, 50000], year: [2018, 2024] },
                          { label: 'Latest Models (2023+)', price: [0, 500000], year: [2023, 2024] },
                          { label: 'Mid-Range (NPR 50K-NPR 100K)', price: [50000, 100000], year: [2020, 2024] }
                        ].map((preset, index) => (
                          <motion.button
                            key={preset.label}
                            onClick={() => {
                              setPriceRange(preset.price);
                              setYearRange(preset.year);
                            }}
                            className="px-4 py-2 bg-gray-800/50 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 border border-gray-600/50 hover:border-cyan-500/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            {preset.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-2 text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <CarIcon className="w-5 h-5 text-cyan-400" />
                <span className="text-lg font-semibold">
                  {filteredCars.length} {filteredCars.length === 1 ? 'Vehicle' : 'Vehicles'}
                </span>
                {searchQuery && (
                  <span className="text-gray-400"> matching "{searchQuery}"</span>
                )}
              </motion.div>
              
              {filteredCars.length > 0 && (
                <motion.div
                  className="text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Page {currentPage} of {totalPages}
                </motion.div>
              )}
            </div>
            
            {/* Loading indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-2 text-cyan-400"
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-sm">Loading...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Car Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {paginatedCars.length > 0 ? (
            <motion.div 
              className={`grid gap-6 md:gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}
              layout
            >
              <AnimatePresence mode="popLayout">
                {paginatedCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                      layout: { duration: 0.3 }
                    }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <CarCard 
                      car={car} 
                      onViewDetails={handleCarSelect}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                  <CarIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  No vehicles found
                </h3>
                <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
                  We couldn't find any vehicles matching your criteria. Try adjusting your filters or search terms.
                </p>
              </motion.div>
              
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedType('all');
                        setPriceRange([0, 500000]);
                        setYearRange([2020, 2024]);
                      }}
                      className="group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Clear All Filters
                        <X className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform duration-300" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery('')}
                      className="group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Browse All Cars
                        <ArrowUpDown className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-300" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </motion.div>
                </div>
                
                <motion.p 
                  className="text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Or try searching for popular brands like BMW, Mercedes, Audi, or Tesla
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 500);
                  }}
                  disabled={currentPage === 1}
                  className="group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                    Previous
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
              
              <div className="flex items-center space-x-2">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <motion.button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          setIsLoading(true);
                          setTimeout(() => setIsLoading(false), 500);
                        }}
                        className={`w-12 h-12 rounded-xl transition-all duration-300 font-semibold ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                            : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50'
                        }`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {page}
                      </motion.button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return (
                      <motion.span 
                        key={page} 
                        className="text-gray-600 px-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        ...
                      </motion.span>
                    );
                  }
                  return null;
                })}
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 500);
                  }}
                  disabled={currentPage === totalPages}
                  className="group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Next
                    <ChevronDown className="w-4 h-4 ml-2 -rotate-90" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
            </div>
            
            {/* Page info */}
            <motion.div
              className="text-sm text-gray-400 flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <MapPin className="w-4 h-4" />
              <span>Page {currentPage} of {totalPages}</span>
            </motion.div>
          </motion.div>
        )}
      </div>
      
    </div>
  );
};