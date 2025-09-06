import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Car, Clock, CheckCircle, Phone, Mail, User, Calendar, Shield, Star, Gift } from 'lucide-react';

export const ConciergeService: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const conciergeFeatures = [
    {
      title: 'Vehicle Pickup & Delivery',
      description: 'Door-to-door pickup and delivery for servicing or detailing.',
      icon: Car,
    },
    {
      title: '24/7 Assistance',
      description: 'Always-on concierge support for your vehicle needs.',
      icon: Clock,
    },
    {
      title: 'Travel Planning',
      description: 'We help plan routes, hotel bookings, and reservations.',
      icon: Calendar,
    },
    {
      title: 'VIP Experience',
      description: 'Exclusive benefits, gifts, and premium customer treatment.',
      icon: Gift,
    },
  ];

  const faqs = [
    {
      q: 'What is Concierge Service?',
      a: 'It is a premium service where we handle everything from vehicle pick-up to reservations for your convenience.',
    },
    {
      q: 'Is the service available 24/7?',
      a: 'Yes, our team is available at all times to assist with urgent or planned requests.',
    },
    {
      q: 'Can I customize the services?',
      a: 'Yes, you can request custom arrangements based on your lifestyle and needs.',
    },
    {
      q: 'Is Concierge Service available for all customers?',
      a: 'Concierge Service is primarily offered to premium and loyalty customers, but others may request access.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Star className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Luxury Concierge Service</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Our concierge service offers personalized assistance, ensuring your vehicle and lifestyle needs are handled with
          precision and care.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {conciergeFeatures.map((feature, index) => {
          const IconComp = feature.icon;
          return (
            <div
              key={index}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center hover:border-cyan-500 transition-colors"
            >
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconComp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('membership')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'membership' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            Membership
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'faq' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            FAQ
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Concierge Overview</h2>
              <p className="text-gray-300 mb-4">
                From vehicle services to lifestyle support, our concierge team ensures a seamless premium experience. Whether
                it’s organizing vehicle maintenance or planning your next weekend getaway, we handle it all for you.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Personalized lifestyle support
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Doorstep convenience
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" /> Travel and event assistance
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'membership' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Membership Tiers</h2>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-cyan-400">Standard Membership</h3>
                  <p className="text-gray-300 text-sm">Includes vehicle concierge and basic travel assistance.</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-cyan-400">Premium Membership</h3>
                  <p className="text-gray-300 text-sm">Enhanced access with 24/7 support and lifestyle planning.</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-cyan-400">Elite Membership</h3>
                  <p className="text-gray-300 text-sm">All-inclusive VIP concierge with exclusive privileges.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Concierge FAQs</h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-gray-300 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Why Choose Concierge?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Trusted & Secure</h3>
                  <p className="text-gray-300 text-sm">We handle all tasks with discretion and reliability.</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="w-6 h-6 text-cyan-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold">Personalized</h3>
                  <p className="text-gray-300 text-sm">Tailored services that match your preferences.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Need Assistance?</h2>
            <p className="text-gray-300 mb-4">Our concierge specialists are available anytime to assist you.</p>
            <div className="space-y-2">
              <p className="text-cyan-400 flex items-center">
                <Phone className="w-4 h-4 mr-2" /> +977-9800001111
              </p>
              <p className="text-cyan-400 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> concierge@fastfuries.com
              </p>
            </div>
          </div>

          <div className="bg-cyan-600/20 rounded-lg border border-cyan-500/30 p-6">
            <h2 className="text-xl font-semibold mb-2 text-cyan-400">Get Started Today</h2>
            <p className="text-gray-300 text-sm mb-4">Enroll in our concierge service and unlock a world of premium experiences.</p>
            <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">Enroll Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
