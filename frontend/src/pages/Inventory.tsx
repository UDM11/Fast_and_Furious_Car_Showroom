import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  ChevronDown
} from 'lucide-react';
import { carsData } from '../data/carsData';
import { Car } from '../types';
import { CarCard } from '../components/Inventory/CarCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [sortBy, setSortBy] = useState('price-low');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Premium Vehicle Inventory
          </h1>
          <p className="text-xl text-gray-400">
            Discover our exclusive collection of luxury vehicles
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-8">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by make, model, year..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Type Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm">Type:</span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {carTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Advanced Filters Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2 inline-flex" />
                  Advanced Filters
                  <ChevronDown className={`w-4 h-4 ml-2 inline-flex transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-gray-800/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-gray-800/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-700/50"
                  >
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="500000"
                          step="10000"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min="0"
                          max="500000"
                          step="10000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Year Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Year Range: {yearRange[0]} - {yearRange[1]}
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="2015"
                          max="2024"
                          value={yearRange[0]}
                          onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min="2015"
                          max="2024"
                          value={yearRange[1]}
                          onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-gray-400">
            Showing {paginatedCars.length} of {filteredCars.length} vehicles
            {searchQuery && (
              <span> for "{searchQuery}"</span>
            )}
          </p>
        </motion.div>

        {/* Car Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {paginatedCars.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {paginatedCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CarCard 
                    car={car} 
                    onViewDetails={handleCarSelect}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl text-gray-600 mb-4">🚗</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                No vehicles found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setPriceRange([0, 500000]);
                  setYearRange([2020, 2024]);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex justify-center items-center space-x-4"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-800/50 text-gray-400 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="text-gray-600">...</span>;
                }
                return null;
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};