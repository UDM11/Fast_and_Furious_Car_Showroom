import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  Calendar,
  Percent,
  Save,
  Download,
  CreditCard,
  Car,
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Award,
  Heart,
  Navigation,
  Timer,
  Users,
  CheckCircle,
  BarChart3,
  Target,
  Banknote,
  Clock,
  TrendingDown
} from 'lucide-react';
import { FinanceCalculation } from '../types';
import { useInventory } from '../context/InventoryContext';
import { formatNpr } from '../utils/currency';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Floating particles component for finance
const FinanceParticles: React.FC = () => {
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

// Animated counter component
const AnimatedValue: React.FC<{ value: number; prefix?: string; suffix?: string; duration?: number }> = ({ 
  value, 
  prefix = '', 
  suffix = '', 
  duration = 1000 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView && value > 0) {
      const increment = value / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);
  
  return (
    <span ref={ref}>
      {prefix}{Math.round(count).toLocaleString()}{suffix}
    </span>
  );
};

// Interactive chart component
const InteractiveChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage * 2.51} 251`;
          const strokeDashoffset = -index * 2.51 * (data.slice(0, index).reduce((sum, prev) => sum + prev.value, 0) / total);
          
          return (
            <motion.circle
              key={item.name}
              cx="100"
              cy="100"
              r="40"
              fill="none"
              stroke={item.color}
              strokeWidth={hoveredSegment === item.name ? "12" : "8"}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredSegment(item.name)}
              onMouseLeave={() => setHoveredSegment(null)}
              initial={{ strokeDasharray: "0 251" }}
              animate={{ strokeDasharray }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          );
        })}
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {formatNpr(total)}
          </div>
          <div className="text-gray-400 text-sm">Total Cost</div>
        </div>
      </div>
    </div>
  );
};

export const Finance: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preSelectedCarId = searchParams.get('car');
  const preSelectedPrice = searchParams.get('price');
  const { cars } = useInventory();
  const [selectedCar, setSelectedCar] = useState(preSelectedCarId || '');
  const [carPrice, setCarPrice] = useState(parseInt(preSelectedPrice || '0') || 285000);
  const [downPayment, setDownPayment] = useState(Math.floor(carPrice * 0.2));
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(4.5);
  const [calculation, setCalculation] = useState<FinanceCalculation | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<FinanceCalculation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const selectedCarData = cars.find(car => car.id === selectedCar);

  // Calculate finance details
  useEffect(() => {
    const principal = carPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    
    if (principal <= 0) {
      setCalculation({
        carPrice,
        downPayment,
        loanTerm,
        interestRate,
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: downPayment
      });
      return;
    }
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = (monthlyPayment * numberOfPayments) + downPayment;
    const totalInterest = totalPayment - carPrice;

    setCalculation({
      carPrice,
      downPayment,
      loanTerm,
      interestRate,
      monthlyPayment: monthlyPayment || 0,
      totalInterest: Math.max(0, totalInterest),
      totalPayment
    });
  }, [carPrice, downPayment, loanTerm, interestRate]);

  // Update car price when different car is selected
  useEffect(() => {
    if (selectedCarData) {
      setCarPrice(selectedCarData.price);
      setDownPayment(Math.floor(selectedCarData.price * 0.2));
    }
  }, [selectedCarData]);

  // Load saved calculations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ff_finance_calculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const saveCalculation = () => {
    if (!calculation) return;
    
    const newCalculations = [calculation, ...savedCalculations.slice(0, 4)]; // Keep only 5 most recent
    setSavedCalculations(newCalculations);
    localStorage.setItem('ff_finance_calculations', JSON.stringify(newCalculations));
  };

  const downloadPDF = () => {
    // In a real app, you'd generate and download a PDF
    alert('PDF download would be implemented with a PDF library like jsPDF');
  };

  const loanTermOptions = [
    { value: 36, label: '36 months (3 years)' },
    { value: 48, label: '48 months (4 years)' },
    { value: 60, label: '60 months (5 years)' },
    { value: 72, label: '72 months (6 years)' },
    { value: 84, label: '84 months (7 years)' }
  ];

  const interestRateOptions = [
    { value: 2.9, label: '2.9% APR (Excellent Credit)' },
    { value: 4.5, label: '4.5% APR (Good Credit)' },
    { value: 6.9, label: '6.9% APR (Fair Credit)' },
    { value: 9.9, label: '9.9% APR (Poor Credit)' }
  ];

  // Data for payment breakdown chart
  const paymentBreakdown = calculation ? [
    { name: 'Principal', value: carPrice - downPayment, color: '#06b6d4' },
    { name: 'Interest', value: calculation.totalInterest, color: '#f59e0b' },
    { name: 'Down Payment', value: downPayment, color: '#10b981' }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-20 pb-16 relative overflow-hidden">
      <FinanceParticles />
      
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
          className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
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
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block">
              Finance Your
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Dream Car
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Calculate your monthly payments with our advanced AI-powered finance calculator and explore personalized financing options
          </motion.p>
          
          {/* Benefits */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="flex items-center space-x-2 text-cyan-400">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2 text-cyan-400">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Instant Results</span>
            </div>
            <div className="flex items-center space-x-2 text-yellow-400">
              <Star className="w-5 h-5" />
              <span className="font-semibold">Best Rates</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Calculator Controls */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="xl:col-span-2 space-y-8"
          >
            {/* Enhanced Vehicle Selection */}
            <Card className="p-8 md:p-12 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                  <motion.div
                    className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mr-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Car className="w-8 h-8 text-cyan-400" />
                  </motion.div>
                  Choose Your Vehicle
                </h2>
                
                {selectedCarData ? (
                  <motion.div 
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-cyan-500/30 p-8 mb-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                      <motion.div 
                        className="relative overflow-hidden rounded-xl"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img 
                          src={selectedCarData.images[0]} 
                          alt={`${selectedCarData.make} ${selectedCarData.model}`}
                          className="w-full md:w-48 h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </motion.div>
                      
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {selectedCarData.make} {selectedCarData.model}
                        </h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                          <span className="px-3 py-1 bg-gray-700/50 rounded-full text-gray-300 text-sm">
                            {selectedCarData.year}
                          </span>
                          <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-sm font-semibold">
                            ${selectedCarData.price.toLocaleString()}
                          </span>
                          <span className="px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {selectedCarData.rating}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-6">
                          Calculate financing options for this premium vehicle
                        </p>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedCar('')}
                          className="group relative overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center">
                            Change Vehicle
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {cars.slice(0, 4).map((car, index) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCar(car.id)}
                        className="cursor-pointer group relative overflow-hidden rounded-xl transition-all duration-300 hover:ring-2 hover:ring-cyan-500 bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-cyan-500/50"
                      >
                        <div className="relative overflow-hidden">
                          <img 
                            src={car.images[0]} 
                            alt={`${car.make} ${car.model}`}
                            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {car.make} {car.model}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">{car.year}</span>
                            <span className="text-cyan-400 font-semibold">
                              ${car.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Enhanced Price Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xl font-semibold text-white flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-cyan-400" />
                      Vehicle Price
                    </label>
                    <motion.span 
                      className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                      key={carPrice}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formatNpr(carPrice)}
                    </motion.span>
                  </div>
                  
                  <div className="relative">
                    <motion.input
                      type="range"
                      min="50000"
                      max="500000"
                      step="5000"
                      value={carPrice}
                      onChange={(e) => {
                        setCarPrice(parseInt(e.target.value));
                        setIsCalculating(true);
                        setTimeout(() => setIsCalculating(false), 500);
                      }}
                      className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-enhanced"
                      whileFocus={{ scale: 1.02 }}
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>NPR 50K</span>
                      <span className="text-gray-500">Budget Range</span>
                      <span>NPR 500K</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </Card>

            {/* Enhanced Finance Parameters */}
            <Card className="p-8 md:p-12 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                  <motion.div
                    className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mr-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <BarChart3 className="w-8 h-8 text-cyan-400" />
                  </motion.div>
                  Loan Configuration
                </h2>
                
                <div className="space-y-10">
                  {/* Enhanced Down Payment */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <label className="text-xl font-semibold text-white flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-400" />
                        Down Payment
                      </label>
                      <div className="text-right">
                        <motion.div 
                          className="text-2xl font-bold text-blue-400"
                          key={downPayment}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {formatNpr(downPayment)}
                        </motion.div>
                        <div className="text-sm text-gray-400">
                          {((downPayment / carPrice) * 100).toFixed(1)}% of price
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <motion.input
                        type="range"
                        min="0"
                        max={Math.floor(carPrice * 0.5)}
                        step="1000"
                        value={downPayment}
                        onChange={(e) => {
                          setDownPayment(parseInt(e.target.value));
                          setIsCalculating(true);
                          setTimeout(() => setIsCalculating(false), 500);
                        }}
                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-enhanced"
                        whileFocus={{ scale: 1.02 }}
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                          <span>NPR 0 (0%)</span>
                        <span className="text-gray-500">Recommended: 20%</span>
                          <span>{formatNpr(Math.floor(carPrice * 0.5))} (50%)</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Loan Term */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                      Loan Term
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {loanTermOptions.map((option, index) => (
                        <motion.button
                          key={option.value}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setLoanTerm(option.value);
                            setIsCalculating(true);
                            setTimeout(() => setIsCalculating(false), 500);
                          }}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                            loanTerm === option.value
                              ? 'border-blue-500 bg-gradient-to-b from-blue-500/20 to-indigo-500/20 text-blue-400 shadow-lg shadow-blue-500/25'
                              : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="font-bold text-lg mb-1">{option.value} mo</div>
                          <div className="text-xs opacity-75">
                            {option.label.split(' ').slice(-2).join(' ')}
                          </div>
                          {loanTerm === option.value && (
                            <motion.div
                              className="absolute top-2 right-2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", duration: 0.3 }}
                            >
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Enhanced Interest Rate */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <label className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Percent className="w-5 h-5 mr-2 text-cyan-400" />
                      Interest Rate (APR)
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {interestRateOptions.map((option, index) => {
                        const isSelected = interestRate === option.value;
                        const creditLevel = option.label.split(' ').slice(-1)[0].replace('(', '').replace(')', '');
                        
                        return (
                          <motion.button
                            key={option.value}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setInterestRate(option.value);
                              setIsCalculating(true);
                              setTimeout(() => setIsCalculating(false), 500);
                            }}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                              isSelected
                                ? 'border-cyan-500 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/25'
                                : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                className="absolute top-2 right-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.3 }}
                              >
                                <CheckCircle className="w-4 h-4 text-cyan-400" />
                              </motion.div>
                            )}
                            
                            <div className="font-bold text-xl mb-1">{option.value}%</div>
                            <div className="text-xs opacity-75 mb-2">APR</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              creditLevel === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                              creditLevel === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                              creditLevel === 'Fair' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {creditLevel}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Card>

            {/* Enhanced Payment Breakdown Chart */}
            <AnimatePresence>
              {calculation && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card className="p-8 md:p-12 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                        <motion.div
                          className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mr-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <PieChart className="w-8 h-8 text-cyan-400" />
                        </motion.div>
                        Payment Analysis
                      </h2>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Interactive Chart */}
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                        >
                          <InteractiveChart data={paymentBreakdown} />
                          
                          {/* Monthly Payment Display */}
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            <div className="text-center bg-gray-900/80 backdrop-blur-sm rounded-full p-6">
                              <motion.div 
                                className="text-3xl font-bold text-white mb-1"
                                key={calculation.monthlyPayment}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <AnimatedValue value={calculation.monthlyPayment} prefix="NPR " />
                              </motion.div>
                              <div className="text-gray-400 text-sm">Monthly Payment</div>
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Enhanced Breakdown Legend */}
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          {paymentBreakdown.map((item, index) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
                              whileHover={{ scale: 1.02, y: -2 }}
                            >
                              <div className="flex items-center space-x-4">
                                <motion.div 
                                  className="w-6 h-6 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                  whileHover={{ scale: 1.2 }}
                                />
                                <div>
                                  <span className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                                    {item.name}
                                  </span>
                                  <div className="text-gray-400 text-sm">
                                    {((item.value / calculation.totalPayment) * 100).toFixed(1)}% of total
                                  </div>
                                </div>
                              </div>
                              <motion.span 
                                className="text-white font-bold text-lg"
                                key={item.value}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <AnimatedValue value={item.value} prefix="NPR " />
                              </motion.span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Results & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-8"
          >
            {/* Enhanced Monthly Payment */}
            <AnimatePresence>
              {calculation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-2 border-cyan-500/30 relative overflow-hidden">
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    <div className="relative z-10">
                      <motion.h3 
                        className="text-xl font-bold text-white mb-6 flex items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          className="p-2 bg-cyan-500/20 rounded-full mr-3"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <CreditCard className="w-6 h-6 text-cyan-400" />
                        </motion.div>
                        Monthly Payment
                      </motion.h3>
                      
                      <div className="text-center">
                        <motion.div 
                          className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3"
                          key={calculation.monthlyPayment}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, type: "spring" }}
                        >
                          <AnimatedValue value={Math.round(calculation.monthlyPayment)} prefix="NPR " />
                        </motion.div>
                        
                        <motion.p 
                          className="text-gray-300 text-lg mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          per month for {loanTerm} months
                        </motion.p>
                        
                        <motion.div
                          className="flex items-center justify-center space-x-4 text-sm text-gray-400"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="flex items-center">
                            <TrendingDown className="w-4 h-4 mr-1 text-cyan-400" />
                            {interestRate}% APR
                          </div>
                          <div className="flex items-center">
                            <Banknote className="w-4 h-4 mr-1 text-blue-400" />
                            {formatNpr(downPayment)} down
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Summary */}
            <AnimatePresence>
              {calculation && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="p-8 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-8 flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div
                        className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full mr-3"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                      </motion.div>
                      Loan Summary
                    </motion.h3>
                    
                    <div className="space-y-6">
                      {[
                        { label: 'Vehicle Price', value: carPrice, icon: Car, color: 'text-cyan-400' },
                        { label: 'Down Payment', value: downPayment, icon: Target, color: 'text-blue-400' },
                        { label: 'Loan Amount', value: carPrice - downPayment, icon: Banknote, color: 'text-cyan-400' },
                        { label: 'Interest Rate', value: `${interestRate}% APR`, icon: Percent, color: 'text-cyan-400', isText: true },
                        { label: 'Loan Term', value: `${loanTerm} months`, icon: Calendar, color: 'text-blue-400', isText: true },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group"
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className="flex items-center space-x-3">
                            <motion.div
                              className={`p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-700 transition-all duration-300`}
                              whileHover={{ scale: 1.1 }}
                            >
                              <item.icon className={`w-4 h-4 ${item.color}`} />
                            </motion.div>
                            <span className="text-gray-300 group-hover:text-white transition-colors">
                              {item.label}
                            </span>
                          </div>
                          <motion.span 
                            className="text-white font-semibold text-lg"
                            key={item.value}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {item.isText ? item.value : formatNpr(typeof item.value === 'number' ? item.value : Number(item.value))}
                          </motion.span>
                        </motion.div>
                      ))}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="border-t border-gray-700/50 pt-6 mt-6"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="text-center p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/30">
                            <div className="text-sm text-gray-400 mb-1">Total Interest</div>
                            <motion.div 
                              className="text-2xl font-bold text-cyan-400"
                              key={calculation.totalInterest}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <AnimatedValue value={Math.round(calculation.totalInterest)} prefix="NPR " />
                            </motion.div>
                          </div>
                          
                          <div className="text-center p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl border border-blue-500/30">
                            <div className="text-sm text-gray-400 mb-1">Total Cost</div>
                            <motion.div 
                              className="text-2xl font-bold text-blue-400"
                              key={calculation.totalPayment}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <AnimatedValue value={Math.round(calculation.totalPayment)} prefix="NPR " />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-8 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
                <motion.h3 
                  className="text-2xl font-bold text-white mb-8 flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mr-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Zap className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                  Quick Actions
                </motion.h3>
                
                <div className="space-y-4">
                  {[
                    {
                      onClick: saveCalculation,
                      disabled: !calculation,
                      icon: Save,
                      text: 'Save Calculation',
                      variant: 'primary' as const,
                      color: 'from-cyan-600 to-blue-600',
                      delay: 0.6
                    },
                    {
                      onClick: downloadPDF,
                      disabled: !calculation,
                      icon: Download,
                      text: 'Download Report',
                      variant: 'outline' as const,
                      color: 'from-blue-600/20 to-cyan-600/20',
                      delay: 0.7
                    },
                    {
                      onClick: () => window.location.href = '/test-drive',
                      disabled: false,
                      icon: Calendar,
                      text: 'Schedule Test Drive',
                      variant: 'secondary' as const,
                      color: 'from-cyan-600/20 to-indigo-600/20',
                      delay: 0.8
                    }
                  ].map((action, index) => (
                    <motion.div
                      key={action.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: action.delay }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={action.onClick}
                        variant={action.variant}
                        disabled={action.disabled}
                        className="w-full group relative overflow-hidden py-4"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <action.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                          {action.text}
                          <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${action.color}`}
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Enhanced Saved Calculations */}
            <AnimatePresence>
              {savedCalculations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card className="p-8 backdrop-blur-sm bg-gray-900/50 border border-gray-700/50">
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-8 flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <motion.div
                        className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mr-3"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Clock className="w-6 h-6 text-cyan-400" />
                      </motion.div>
                      Recent Calculations
                    </motion.h3>
                    
                    <div className="space-y-4">
                      {savedCalculations.slice(0, 3).map((calc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <motion.div 
                                className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors"
                                whileHover={{ scale: 1.05 }}
                              >
                                {formatNpr(Math.round(calc.monthlyPayment))}/mo
                              </motion.div>
                              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                                <span className="flex items-center">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  {formatNpr(calc.carPrice)}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {calc.loanTerm}mo
                                </span>
                                <span className="flex items-center">
                                  <Percent className="w-3 h-3 mr-1" />
                                  {calc.interestRate}%
                                </span>
                              </div>
                            </div>
                            
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="group/btn relative overflow-hidden"
                                onClick={() => {
                                  setCarPrice(calc.carPrice);
                                  setDownPayment(calc.downPayment);
                                  setLoanTerm(calc.loanTerm);
                                  setInterestRate(calc.interestRate);
                                }}
                              >
                                <span className="relative z-10 flex items-center">
                                  Load
                                  <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
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
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {isCalculating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-white font-semibold">Calculating...</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Custom Styles */}
      <style>{`
        .slider-enhanced::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 3px solid #1f2937;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
          transition: all 0.3s ease;
        }
        
        .slider-enhanced::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.5);
        }
        
        .slider-enhanced::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 3px solid #1f2937;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }
        
        .slider-enhanced::-webkit-slider-track {
          background: linear-gradient(90deg, #374151, #06b6d4);
          height: 12px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};