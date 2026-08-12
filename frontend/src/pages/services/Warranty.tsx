// src/pages/services/Warranty.tsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Shield, Clock, CheckCircle, Car, Phone, Mail, ArrowRight } from 'lucide-react';

  const warrantyPlans = {
    standard: {
      name: 'Standard Warranty',
      price: 'Included',
      duration: '3 years / 36,000 miles',
      coverage: [
        'Bumper-to-bumper coverage',
        'Engine and transmission',
        'Electrical systems',
        'Air conditioning',
        'Fuel system',
        'Basic roadside assistance'
      ],
      exclusions: [
        'Normal wear and tear',
        'Tires and wheels',
        'Brake pads and rotors',
        'Windshield wipers',
        'Damage from accidents'
      ]
    },
    extended: {
      name: 'Extended Warranty',
      price: 'NPR 2,500 - NPR 5,000',
      duration: '5 years / 60,000 miles',
      coverage: [
        'All Standard coverage plus',
        'Advanced electrical systems',
        'Entertainment system',
        'Navigation system',
        'Premium roadside assistance',
        'Rental car coverage',
        'Trip interruption benefits'
      ],
      exclusions: [
        'Normal wear and tear',
        'Collision damage',
        'Modifications and alterations',
        'Environmental damage',
        'Commercial use'
      ]
    },
    premium: {
      name: 'Premium Warranty',
      price: 'NPR 4,000 - NPR 8,000',
      duration: '7 years / 100,000 miles',
      coverage: [
        'All Extended coverage plus',
        'Hybrid/electric components',
        'Advanced driver assistance systems',
        'Performance components',
        '24/7 concierge service',
        'Loaner vehicle guarantee',
        'Hotel accommodation coverage',
        'Transferable to new owner'
      ],
      exclusions: [
        'Regular maintenance items',
        'Cosmetic damage',
        'Aftermarket parts',
        'Racing or competition use',
        'Natural disasters'
      ]
    }
  };

export const Warranty: React.FC = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof warrantyPlans>('standard');
  const [formData, setFormData] = useState({ name: '', email: '', question: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  const faqs = [
    {
      question: 'What is covered under the warranty?',
      answer: 'Our warranties cover repairs for defects in materials or workmanship. This includes most mechanical and electrical components, with specific coverage varying by plan.'
    },
    {
      question: 'Can I transfer my warranty to a new owner?',
      answer: 'Yes, our Premium warranty is fully transferable to subsequent owners. Standard and Extended warranties may require a transfer fee.'
    },
    {
      question: 'Where can get service under warranty?',
      answer: 'You can visit any authorized Fast & Furious service center nationwide. We have over 50 locations across the country.'
    },
    {
      question: 'What is not covered by the warranty?',
      answer: 'Normal wear and tear, maintenance items, damage from accidents, modifications, and environmental damage are typically not covered.'
    },
    {
      question: 'How do I make a warranty claim?',
      answer: 'Contact our warranty department directly or visit any service center. We will assess your vehicle and handle the claim process for you.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Shield className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Premium Warranty Protection</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Comprehensive coverage plans designed to protect your investment and ensure peace of mind for years to come.
        </p>
      </div>

      {/* Warranty Plans */}
      <div className="mb-16">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {(Object.keys(warrantyPlans) as Array<keyof typeof warrantyPlans>).map((planKey) => (
              <button
                key={planKey}
                onClick={() => setActiveTab(planKey)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === planKey
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {warrantyPlans[planKey].name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">{warrantyPlans[activeTab].name}</h2>
              <div className="flex items-center mb-6">
                <Clock className="w-5 h-5 text-cyan-400 mr-2" />
                <span className="text-gray-300">{warrantyPlans[activeTab].duration}</span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-cyan-400">Coverage Includes:</h3>
                <ul className="space-y-2">
                  {warrantyPlans[activeTab].coverage.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">Investment Protection</h3>
                <p className="text-2xl font-bold text-cyan-400 mb-4">{warrantyPlans[activeTab].price}</p>
                <p className="text-gray-300 text-sm mb-4">
                  {warrantyPlans[activeTab].price === 'Included' 
                    ? 'Complimentary with vehicle purchase'
                    : 'One-time payment or flexible financing available'
                  }
                </p>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2">
                  Get Quote
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-400">Not Covered:</h3>
                <ul className="space-y-2">
                  {warrantyPlans[activeTab].exclusions.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-4 h-4 text-red-400 mr-2 flex items-center justify-center">✕</div>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Comprehensive Protection</h3>
          <p className="text-gray-300">
            Coverage for thousands of components with no deductible on most plans.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nationwide Service</h3>
          <p className="text-gray-300">
            Access to over 50 authorized service centers across the country.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
          <p className="text-gray-300">
            Round-the-clock roadside assistance and customer support.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Need Warranty Assistance?</h2>
          <p className="text-gray-300">
            Our warranty specialists are here to help you with any questions or claims.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-cyan-400 mr-3" />
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-gray-300">+977-9800000000</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-cyan-400 mr-3" />
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-gray-300">warranty@fastfuries.com</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Inquiry</h3>
            {showSuccess ? (
              <div className="text-center py-6 space-y-2">
                <div className="text-3xl text-green-400">✓</div>
                <h4 className="font-bold text-white">Inquiry Sent!</h4>
                <p className="text-gray-300 text-sm">We will get back to you shortly.</p>
                <Button 
                  onClick={() => {
                    setShowSuccess(false);
                    setFormData({ name: '', email: '', question: '' });
                  }} 
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs mt-2 px-3 py-1.5"
                >
                  Ask Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-4 py-2 text-white placeholder-gray-400 text-sm"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-4 py-2 text-white placeholder-gray-400 text-sm"
                  required
                />
                <textarea
                  placeholder="Your Question"
                  rows={3}
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-4 py-2 text-white placeholder-gray-400 text-sm"
                  required
                />
                <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 flex items-center justify-center" type="submit">
                  Send Message <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};