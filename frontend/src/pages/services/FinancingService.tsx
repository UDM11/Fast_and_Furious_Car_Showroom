// src/pages/services/FinancingService.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Calculator, Clock, CheckCircle, Car, Phone, Mail, ArrowRight, CreditCard, Percent, Shield, UserCheck, FileText, TrendingUp, BadgeCheck } from 'lucide-react';

export const FinancingService: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [formData, setFormData] = useState({
    vehiclePrice: '',
    downPayment: '',
    loanTerm: '60',
    creditScore: '700',
    interestRate: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employmentStatus: '',
    annualIncome: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePayment = () => {
    const price = parseFloat(formData.vehiclePrice) || 0;
    const downPayment = parseFloat(formData.downPayment) || 0;
    const loanAmount = price - downPayment;
    const term = parseInt(formData.loanTerm) || 60;
    const annualRate = parseFloat(formData.interestRate) || 5.5;
    const monthlyRate = annualRate / 100 / 12;
    
    if (loanAmount <= 0) return 0;
    
    const payment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term) / 
                   (Math.pow(1 + monthlyRate, term) - 1);
    
    return payment.toFixed(2);
  };

  const loanTerms = [
    { months: 36, label: '3 years' },
    { months: 48, label: '4 years' },
    { months: 60, label: '5 years' },
    { months: 72, label: '6 years' },
    { months: 84, label: '7 years' }
  ];

  const creditScoreRanges = [
    { range: '300-579', rate: '8.5%', label: 'Poor' },
    { range: '580-669', rate: '6.5%', label: 'Fair' },
    { range: '670-739', rate: '5.5%', label: 'Good' },
    { range: '740-799', rate: '4.5%', label: 'Very Good' },
    { range: '800-850', rate: '3.9%', label: 'Excellent' }
  ];

  const financingOptions = [
    {
      title: 'Retail Financing',
      description: 'Traditional auto loans for new and pre-owned vehicles',
      features: ['Competitive rates', 'Flexible terms', 'Quick approval'],
      icon: CreditCard
    },
    {
      title: 'Lease Options',
      description: 'Lower monthly payments with option to buy at lease end',
      features: ['Lower payments', 'Upgrade frequently', 'Maintenance packages'],
      icon: FileText
    },
    {
      title: 'Refinancing',
      description: 'Lower your current auto loan payments with better rates',
      features: ['Reduce payments', 'Better terms', 'Fast processing'],
      icon: TrendingUp
    },
    {
      title: 'First-Time Buyer',
      description: 'Special programs for those building credit history',
      features: ['Credit building', 'Co-signer options', 'Education resources'],
      icon: BadgeCheck
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Calculator className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Premium Financing Services</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Experience seamless financing solutions tailored for luxury vehicle ownership with competitive rates and personalized service.
        </p>
      </div>

      {/* Financing Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {financingOptions.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center hover:border-cyan-500 transition-colors">
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{option.description}</p>
              <ul className="text-left space-y-1">
                {option.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'calculator'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Payment Calculator
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'apply'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Apply Now
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rates'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Interest Rates
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Calculator/Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            {activeTab === 'calculator' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Payment Calculator</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Vehicle Price (NPR)</label>
                    <input
                      type="number"
                      name="vehiclePrice"
                      value={formData.vehiclePrice}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      placeholder="50,000"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Down Payment (NPR)</label>
                    <input
                      type="number"
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      placeholder="5,000"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Loan Term</label>
                    <select
                      name="loanTerm"
                      value={formData.loanTerm}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                    >
                      {loanTerms.map(term => (
                        <option key={term.months} value={term.months}>
                          {term.label} ({term.months} months)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      name="interestRate"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      placeholder="5.5"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Results */}
                {formData.vehiclePrice && (
                  <div className="bg-gray-700 rounded-lg p-4 mt-6">
                    <h3 className="text-lg font-semibold mb-2">Estimated Monthly Payment</h3>
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      ${calculatePayment()}
                    </div>
                    <p className="text-gray-300 text-sm">
                      Based on {formData.loanTerm} months at {formData.interestRate || '5.5'}% APR
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'apply' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Financing Application</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Employment Status</label>
                    <select
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                    >
                      <option value="">Select Status</option>
                      <option value="employed">Employed</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="student">Student</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Annual Income ($)</label>
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                      placeholder="75,000"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Credit Score</label>
                    <select
                      name="creditScore"
                      value={formData.creditScore}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                    >
                      <option value="300">300-579 (Poor)</option>
                      <option value="580">580-669 (Fair)</option>
                      <option value="670">670-739 (Good)</option>
                      <option value="740">740-799 (Very Good)</option>
                      <option value="800">800-850 (Excellent)</option>
                    </select>
                  </div>
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3">
                  Submit Application
                </Button>
              </div>
            )}

            {activeTab === 'rates' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Current Interest Rates</h2>
                
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Credit Score Based Rates</h3>
                  <div className="space-y-3">
                    {creditScoreRanges.map((range, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0">
                        <div>
                          <span className="text-gray-300">{range.range}</span>
                          <span className="text-gray-400 text-sm ml-2">({range.label})</span>
                        </div>
                        <span className="text-cyan-400 font-semibold">{range.rate} APR</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-700/30">
                  <h3 className="text-lg font-semibold mb-2 text-cyan-400">Special Offers</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• 0% APR for 36 months on select models</li>
                    <li>• First payment deferred for 90 days</li>
                    <li>• No down payment required for qualified buyers</li>
                    <li>• Loyalty customer discount: 0.5% APR reduction</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Benefits Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Why Choose Our Financing?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Percent className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Competitive Rates</h3>
                  <p className="text-gray-300 text-sm">Lowest APR starting from 3.9% for qualified buyers.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Quick Approval</h3>
                  <p className="text-gray-300 text-sm">Get pre-approved in as little as 30 minutes.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Flexible Terms</h3>
                  <p className="text-gray-300 text-sm">Loan terms from 36 to 84 months available.</p>
                </div>
              </div>

              <div className="flex items-start">
                <UserCheck className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">All Credit Welcome</h3>
                  <p className="text-gray-300 text-sm">We work with all credit situations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-300 mb-4">
              Our financing specialists are here to assist you with any questions.
            </p>
            <div className="space-y-2">
              <p className="text-cyan-400 flex items-center">
                <Phone className="w-4 h-4 mr-2" /> +977-9800000000
              </p>
              <p className="text-cyan-400 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> finance@fastfuries.com
              </p>
            </div>
          </div>

          <div className="bg-cyan-600/20 rounded-lg border border-cyan-500/30 p-6">
            <h2 className="text-xl font-semibold mb-2 text-cyan-400">Pre-Approval Available</h2>
            <p className="text-gray-300 text-sm mb-4">
              Get pre-approved online and know your budget before you shop.
            </p>
            <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
              Get Pre-Approved
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Financing FAQs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">What credit score do I need?</h3>
              <p className="text-gray-300 text-sm">We work with all credit scores. Rates vary based on creditworthiness.</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">How long does approval take?</h3>
              <p className="text-gray-300 text-sm">Most applications are approved within 30 minutes to 2 hours.</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Can I apply online?</h3>
              <p className="text-gray-300 text-sm">Yes! Our online application is secure and takes about 10 minutes.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">What documents do I need?</h3>
              <p className="text-gray-300 text-sm">Driver's license, proof of income, and proof of residence are typically required.</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Are there any hidden fees?</h3>
              <p className="text-gray-300 text-sm">No hidden fees. All costs are clearly explained upfront.</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Can I refinance later?</h3>
              <p className="text-gray-300 text-sm">Yes, we offer refinancing options for existing customers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};