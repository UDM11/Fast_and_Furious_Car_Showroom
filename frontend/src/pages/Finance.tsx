import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Car
} from 'lucide-react';
import { FinanceCalculation } from '../types';
import { carsData } from '../data/carsData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Finance: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preSelectedCarId = searchParams.get('car');
  const preSelectedPrice = searchParams.get('price');
  
  const [selectedCar, setSelectedCar] = useState(preSelectedCarId || '');
  const [carPrice, setCarPrice] = useState(parseInt(preSelectedPrice || '0') || 285000);
  const [downPayment, setDownPayment] = useState(Math.floor(carPrice * 0.2));
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(4.5);
  const [calculation, setCalculation] = useState<FinanceCalculation | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<FinanceCalculation[]>([]);

  const selectedCarData = carsData.find(car => car.id === selectedCar);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Finance Calculator
          </h1>
          <p className="text-xl text-gray-400">
            Calculate your monthly payments and explore financing options
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Vehicle Selection */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Car className="w-6 h-6 mr-3 text-cyan-400" />
                Select Vehicle
              </h2>
              
              {selectedCarData ? (
                <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg mb-6">
                  <img 
                    src={selectedCarData.images[0]} 
                    alt={`${selectedCarData.make} ${selectedCarData.model}`}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {selectedCarData.make} {selectedCarData.model}
                    </h3>
                    <p className="text-gray-400">{selectedCarData.year}</p>
                    <p className="text-cyan-400 font-semibold">
                      ${selectedCarData.price.toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedCar('')}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {carsData.slice(0, 4).map(car => (
                    <motion.div
                      key={car.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCar(car.id)}
                      className="cursor-pointer p-4 rounded-lg border-2 border-gray-700 hover:border-gray-600 transition-all duration-300"
                    >
                      <img 
                        src={car.images[0]} 
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-20 object-cover rounded-lg mb-3"
                      />
                      <h3 className="text-white font-semibold text-sm">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-400 text-xs">{car.year}</p>
                      <p className="text-cyan-400 text-sm font-semibold">
                        ${car.price.toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Manual Price Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Vehicle Price: ${carPrice.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  step="5000"
                  value={carPrice}
                  onChange={(e) => setCarPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$50K</span>
                  <span>$500K</span>
                </div>
              </div>
            </Card>

            {/* Finance Parameters */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-cyan-400" />
                Loan Parameters
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Down Payment */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Down Payment: ${downPayment.toLocaleString()} ({((downPayment / carPrice) * 100).toFixed(1)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={Math.floor(carPrice * 0.5)}
                    step="1000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$0</span>
                    <span>${Math.floor(carPrice * 0.5).toLocaleString()}</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Loan Term
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {loanTermOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interest Rate */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Interest Rate
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {interestRateOptions.map(option => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInterestRate(option.value)}
                        className={`p-3 text-sm rounded-lg border-2 transition-all duration-300 ${
                          interestRate === option.value
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                            : 'border-gray-700 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        <div className="font-semibold">{option.value}%</div>
                        <div className="text-xs opacity-75">
                          {option.label.split(' ').slice(-1)[0].replace('(', '').replace(')', '')}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Breakdown Chart */}
            {calculation && (
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <PieChart className="w-6 h-6 mr-3 text-cyan-400" />
                  Payment Breakdown
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Chart Visualization */}
                  <div className="relative">
                    <div className="w-64 h-64 mx-auto">
                      {/* This would be replaced with a real chart library in production */}
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-4 border-gray-700">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            ${calculation.monthlyPayment.toLocaleString()}
                          </div>
                          <div className="text-gray-400">Monthly</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Legend */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                        <span className="text-gray-300">Principal</span>
                      </div>
                      <span className="text-white font-semibold">
                        ${(carPrice - downPayment).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                        <span className="text-gray-300">Interest</span>
                      </div>
                      <span className="text-white font-semibold">
                        ${calculation.totalInterest.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">Down Payment</span>
                      </div>
                      <span className="text-white font-semibold">
                        ${downPayment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>

          {/* Results & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Monthly Payment */}
            {calculation && (
              <Card className="p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                  Monthly Payment
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                    ${Math.round(calculation.monthlyPayment).toLocaleString()}
                  </div>
                  <p className="text-gray-400">per month</p>
                </div>
              </Card>
            )}

            {/* Summary */}
            {calculation && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vehicle Price</span>
                    <span className="text-white">${carPrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Down Payment</span>
                    <span className="text-white">${downPayment.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Loan Amount</span>
                    <span className="text-white">${(carPrice - downPayment).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Interest Rate</span>
                    <span className="text-white">{interestRate}% APR</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Loan Term</span>
                    <span className="text-white">{loanTerm} months</span>
                  </div>
                  
                  <hr className="border-gray-700" />
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Interest</span>
                    <span className="text-white">${Math.round(calculation.totalInterest).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-300">Total Cost</span>
                    <span className="text-white">${Math.round(calculation.totalPayment).toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={saveCalculation}
                  className="w-full"
                  disabled={!calculation}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Calculation
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={downloadPDF}
                  className="w-full"
                  disabled={!calculation}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={() => window.location.href = '/test-drive'}
                  className="w-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Test Drive
                </Button>
              </div>
            </Card>

            {/* Saved Calculations */}
            {savedCalculations.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Calculations</h3>
                <div className="space-y-3">
                  {savedCalculations.slice(0, 3).map((calc, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-semibold">
                            ${Math.round(calc.monthlyPayment).toLocaleString()}/mo
                          </div>
                          <div className="text-gray-400 text-sm">
                            ${calc.carPrice.toLocaleString()} • {calc.loanTerm}mo • {calc.interestRate}%
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Load
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Custom Styles for Sliders */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #1f2937;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  );
};