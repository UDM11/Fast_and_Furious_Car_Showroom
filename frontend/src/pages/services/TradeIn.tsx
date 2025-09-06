// src/pages/services/TradeIn.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Car, Calculator, CheckCircle, Clock, DollarSign, Shield } from 'lucide-react';

export const TradeIn: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleType: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Thank you for your trade-in request! We will contact you shortly.');
    setCurrentStep(4);
  };

  const steps = [
    { id: 1, title: 'Vehicle Details', icon: Car },
    { id: 2, title: 'Your Information', icon: Calculator },
    { id: 3, title: 'Review & Submit', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Vehicle Trade-In Program</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Get the best value for your current vehicle when upgrading to a premium Fast & Furious luxury car.
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-4 md:space-x-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.id
                    ? 'bg-cyan-500 border-cyan-500 text-white'
                    : 'border-gray-600 text-gray-400'
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <span className={`ml-2 font-medium ${currentStep >= step.id ? 'text-cyan-400' : 'text-gray-400'}`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${currentStep > step.id ? 'bg-cyan-500' : 'bg-gray-600'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Vehicle Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Vehicle Type</label>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="sports">Sports Car</option>
                        <option value="suv">SUV</option>
                        <option value="sedan">Sedan</option>
                        <option value="coupe">Coupe</option>
                        <option value="convertible">Convertible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Make</label>
                      <input
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                        placeholder="e.g., BMW"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Model</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                        placeholder="e.g., M4 Competition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Year</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                        placeholder="e.g., 2022"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Mileage</label>
                      <input
                        type="number"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                        placeholder="e.g., 15000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Condition</label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                        required
                      >
                        <option value="">Select Condition</option>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Your Information</h2>
                  
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
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Review Your Information</h2>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Vehicle Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      <p>Type: {formData.vehicleType}</p>
                      <p>Make: {formData.make}</p>
                      <p>Model: {formData.model}</p>
                      <p>Year: {formData.year}</p>
                      <p>Mileage: {formData.mileage} miles</p>
                      <p>Condition: {formData.condition}</p>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">Your Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      <p>Name: {formData.firstName} {formData.lastName}</p>
                      <p>Email: {formData.email}</p>
                      <p>Phone: {formData.phone}</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-500 text-white px-6 py-2"
                    >
                      Submit Trade-In Request
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
                  <p className="text-gray-300 mb-6">
                    Your trade-in request has been received. Our team will contact you within 24 hours 
                    to discuss your vehicle's value and next steps.
                  </p>
                  <Button
                    onClick={() => {
                      setCurrentStep(1);
                      setFormData({
                        vehicleType: '',
                        make: '',
                        model: '',
                        year: '',
                        mileage: '',
                        condition: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: ''
                      });
                    }}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2"
                  >
                    Start New Trade-In
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Benefits Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Why Trade With Us?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <DollarSign className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Best Value Guarantee</h3>
                  <p className="text-gray-300 text-sm">We offer competitive prices based on current market values.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Quick Evaluation</h3>
                  <p className="text-gray-300 text-sm">Get your vehicle's value assessed within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Hassle-Free Process</h3>
                  <p className="text-gray-300 text-sm">We handle all paperwork and documentation for you.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-300 mb-4">
              Our trade-in specialists are here to assist you with any questions.
            </p>
            <div className="space-y-2">
              <p className="text-cyan-400">📞 +977-9800000000</p>
              <p className="text-cyan-400">✉️ tradein@fastfuries.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};