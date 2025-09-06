import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { 
  Zap, 
  Settings, 
  Gauge, 
  Fuel, 
  Wind, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Shield,
  Award,
  Clock,
  Phone,
  Mail,
  Car,
  Sparkles
} from 'lucide-react';

export const PerformanceUpgrades: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('engine');
  const [selectedPackage, setSelectedPackage] = useState('stage1');

  const categories = [
    { id: 'engine', name: 'Engine Performance', icon: Settings },
    { id: 'suspension', name: 'Suspension & Handling', icon: Gauge },
    { id: 'exhaust', name: 'Exhaust Systems', icon: Fuel },
    { id: 'aerodynamics', name: 'Aerodynamics', icon: Wind },
    { id: 'cosmetic', name: 'Cosmetic Upgrades', icon: Sparkles }
  ];

  const packages = {
    stage1: {
      name: 'Stage 1 Performance',
      price: '$2,500 - $5,000',
      description: 'Entry-level performance enhancements for daily driving',
      features: [
        'ECU Remapping',
        'Cold Air Intake',
        'Performance Air Filter',
        'Sport Exhaust System',
        '20-30% Power Increase'
      ],
      benefits: ['Improved throttle response', 'Better fuel efficiency', 'Maintains warranty']
    },
    stage2: {
      name: 'Stage 2 Performance',
      price: '$5,000 - $12,000',
      description: 'Advanced upgrades for serious enthusiasts',
      features: [
        'Turbo/Supercharger Upgrade',
        'High-Flow Downpipe',
        'Performance Intercooler',
        'Upgraded Fuel System',
        '40-60% Power Increase'
      ],
      benefits: ['Significant power gains', 'Track-ready performance', 'Custom tuning']
    },
    stage3: {
      name: 'Stage 3 Performance',
      price: '$15,000 - $30,000+',
      description: 'Ultimate performance package for maximum power',
      features: [
        'Full Engine Build',
        'Big Turbo Kit',
        'Race Fuel System',
        'Strengthened Transmission',
        '80-120% Power Increase'
      ],
      benefits: ['Race car performance', 'Complete transformation', 'Professional installation']
    }
  };

  const upgrades: Record<string, any[]> = {
    engine: [
      { name: 'ECU Tuning', price: '$800-1,500', power: '+20-30%', time: '2-3 hours' },
      { name: 'Turbo Upgrade', price: '$3,000-8,000', power: '+40-70%', time: '1-2 days' },
      { name: 'Supercharger Kit', price: '$5,000-12,000', power: '+50-80%', time: '2-3 days' },
      { name: 'Cold Air Intake', price: '$300-800', power: '+5-10%', time: '1-2 hours' },
      { name: 'Performance Camshafts', price: '$1,500-3,000', power: '+15-25%', time: '1 day' }
    ],
    suspension: [
      { name: 'Coilover Kit', price: '$1,200-3,000', improvement: 'Handling +35%', time: '4-6 hours' },
      { name: 'Sway Bars', price: '$400-900', improvement: 'Body Roll -40%', time: '2-3 hours' },
      { name: 'Performance Brakes', price: '$1,500-4,000', improvement: 'Stopping -30%', time: '1 day' },
      { name: 'Strut Tower Brace', price: '$200-500', improvement: 'Rigidity +20%', time: '1 hour' }
    ],
    exhaust: [
      { name: 'Cat-Back Exhaust', price: '$800-2,500', sound: 'Aggressive', power: '+5-15%' },
      { name: 'Downpipe', price: '$400-1,200', sound: 'Deep', power: '+10-20%' },
      { name: 'Headers', price: '$600-1,800', sound: 'Sporty', power: '+8-15%' },
      { name: 'Muffler Delete', price: '$200-500', sound: 'Loud', power: '+3-5%' }
    ],
    aerodynamics: [
      { name: 'Front Splitter', price: '$400-1,200', downforce: '+25%', material: 'Carbon Fiber' },
      { name: 'Rear Wing', price: '$600-2,000', downforce: '+40%', material: 'Carbon Fiber' },
      { name: 'Side Skirts', price: '$300-900', downforce: '+15%', material: 'Fiberglass' },
      { name: 'Diffuser', price: '$500-1,500', downforce: '+30%', material: 'Carbon Fiber' }
    ],
    cosmetic: [
      { name: 'Carbon Fiber Hood', price: '$1,200-2,500', weight: '-40%', style: 'Aggressive' },
      { name: 'Custom Wheels', price: '$800-3,000', weight: '-20%', style: 'Premium' },
      { name: 'Body Kit', price: '$2,000-6,000', style: 'Full Conversion', material: 'Polyurethane' },
      { name: 'Window Tint', price: '$200-600', protection: 'UV 99%', style: 'Stealth' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Zap className="w-12 h-12 text-yellow-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
          Performance Upgrades
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Unleash your vehicle's true potential with our expert performance upgrades and tuning services.
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex justify-center mb-8 overflow-x-auto">
        <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-md transition-all ${
                  selectedCategory === category.id
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                <span className="whitespace-nowrap">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {upgrades[selectedCategory].map((upgrade, index) => (
          <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-yellow-500 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{upgrade.name}</h3>
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price:</span>
                <span className="text-yellow-400 font-semibold">{upgrade.price}</span>
              </div>
              
              {'power' in upgrade && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Power Gain:</span>
                  <span className="text-green-400 font-semibold">{upgrade.power}</span>
                </div>
              )}
              
              {'improvement' in upgrade && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Improvement:</span>
                  <span className="text-blue-400 font-semibold">{upgrade.improvement}</span>
                </div>
              )}
              
              {'time' in upgrade && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Install Time:</span>
                  <span className="text-cyan-400 font-semibold">{upgrade.time}</span>
                </div>
              )}
            </div>

            <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black group-hover:scale-105 transition-transform">
              Add to Build
            </Button>
          </div>
        ))}
      </div>

      {/* Performance Packages */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Performance Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(packages).map(([key, pkg]) => (
            <div key={key} className={`bg-gray-800 rounded-lg border p-6 ${
              selectedPackage === key ? 'border-yellow-500 scale-105' : 'border-gray-700'
            } transition-all`}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{pkg.name}</h3>
                <p className="text-yellow-400 font-bold text-lg mb-2">{pkg.price}</p>
                <p className="text-gray-300 text-sm">{pkg.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Features:</h4>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3">Benefits:</h4>
                <ul className="space-y-1">
                  {pkg.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-400">• {benefit}</li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => setSelectedPackage(key)}
                className={`w-full ${
                  selectedPackage === key 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-700 hover:bg-yellow-500 hover:text-black'
                }`}
              >
                {selectedPackage === key ? 'Selected' : 'Select Package'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Warranty Safe</h3>
          <p className="text-gray-300 text-sm">All upgrades maintain your vehicle's warranty coverage</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quick Installation</h3>
          <p className="text-gray-300 text-sm">Most upgrades completed in 1-2 business days</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <Car className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dyno Testing</h3>
          <p className="text-gray-300 text-sm">Before and after performance verification</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Premium Parts</h3>
          <p className="text-gray-300 text-sm">Only genuine and certified performance parts</p>
        </div>
      </div>

      {/* Consultation Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade?</h2>
          <p className="text-gray-300">
            Schedule a consultation with our performance specialists to create your custom upgrade plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-yellow-400 mr-3" />
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-gray-300">+977-9800000000</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-yellow-400 mr-3" />
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-gray-300">performance@fastfuries.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-yellow-400 mr-3" />
              <div>
                <h3 className="font-semibold">Working Hours</h3>
                <p className="text-gray-300">Mon-Sat: 8AM-8PM</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Consultation</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-gray-600 border border-gray-500 rounded px-4 py-2 text-white placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-gray-600 border border-gray-500 rounded px-4 py-2 text-white placeholder-gray-400"
              />
              <select className="w-full bg-gray-600 border border-gray-500 rounded px-4 py-2 text-white">
                <option>Select Vehicle Type</option>
                <option>Sports Car</option>
                <option>SUV</option>
                <option>Sedan</option>
                <option>Luxury</option>
              </select>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black">
                Request Consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};