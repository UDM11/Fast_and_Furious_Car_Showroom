// src/pages/Maintenance.tsx
import React from "react";
import { Button } from "../../components/ui/Button";

export const Maintenance: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-4">
        Premium Maintenance Services
      </h1>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
        Keep your luxury vehicle in perfect condition with our expert maintenance services designed for high-performance cars.
      </p>

      {/* Maintenance Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {/* Regular Maintenance Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-white">🛠️</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Regular Maintenance
            </h2>
            <p className="text-gray-300 mb-4">Keep your vehicle running smoothly with our scheduled maintenance packages</p>
            <ul className="mb-4 text-gray-300 list-disc list-inside space-y-1 text-left">
              <li>Oil changes with premium synthetic oil</li>
              <li>Filter replacements</li>
              <li>Brake inspection and service</li>
              <li>Tire rotation and balancing</li>
              <li>Comprehensive vehicle inspection</li>
            </ul>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700">
            <span className="font-semibold text-white">Starting from $150</span>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded border border-gray-600">
              Schedule Now
            </Button>
          </div>
        </div>

        {/* Diagnostic Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-white">🔍</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Diagnostic Services
            </h2>
            <p className="text-gray-300 mb-4">Advanced diagnostics for identifying and resolving complex vehicle issues</p>
            <ul className="mb-4 text-gray-300 list-disc list-inside space-y-1 text-left">
              <li>Computerized engine diagnostics</li>
              <li>Electrical system analysis</li>
              <li>Performance troubleshooting</li>
              <li>Check engine light diagnosis</li>
              <li>Comprehensive system reports</li>
            </ul>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700">
            <span className="font-semibold text-white">Starting from $120</span>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded border border-gray-600">
              Learn More
            </Button>
          </div>
        </div>

        {/* Brake Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-white">🛑</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Brake Services
            </h2>
            <p className="text-gray-300 mb-4">Premium brake services for optimal stopping power and safety</p>
            <ul className="mb-4 text-gray-300 list-disc list-inside space-y-1 text-left">
              <li>Brake pad and rotor replacement</li>
              <li>Brake fluid flush and replacement</li>
              <li>Caliper service and repair</li>
              <li>ABS system diagnostics</li>
              <li>Performance brake upgrades</li>
            </ul>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700">
            <span className="font-semibold text-white">Starting from $250</span>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded border border-gray-600">
              Schedule Now
            </Button>
          </div>
        </div>

        {/* Tire Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-white">🌀</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Tire Services
            </h2>
            <p className="text-gray-300 mb-4">Complete tire services for performance and safety</p>
            <ul className="mb-4 text-gray-300 list-disc list-inside space-y-1 text-left">
              <li>Premium tire installation</li>
              <li>Wheel alignment and balancing</li>
              <li>Tire rotation services</li>
              <li>Flat repair and replacement</li>
              <li>Performance tire recommendations</li>
            </ul>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700">
            <span className="font-semibold text-white">Starting from $80</span>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded border border-gray-600">
              Learn More
            </Button>
          </div>
        </div>

        {/* Fluid Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-white">💧</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Fluid Services
            </h2>
            <p className="text-gray-300 mb-4">Comprehensive fluid maintenance for optimal performance</p>
            <ul className="mb-4 text-gray-300 list-disc list-inside space-y-1 text-left">
              <li>Engine oil change</li>
              <li>Transmission fluid service</li>
              <li>Coolant flush and replacement</li>
              <li>Brake fluid exchange</li>
              <li>Differential fluid service</li>
            </ul>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700">
            <span className="font-semibold text-white">Starting from $100</span>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded border border-gray-600">
              Schedule Now
            </Button>
          </div>
        </div>

        {/* Electrical Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-white">⚡</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Electrical Services
            </h2>
            <p className="text-gray-300 mb-4">Expert electrical system maintenance and repair</p>
            <ul className="mb-4 text-gray-300 list-disc list-inside space-y-1 text-left">
              <li>Battery testing and replacement</li>
              <li>Alternator and starter service</li>
              <li>Lighting system repair</li>
              <li>Wiring diagnostics</li>
              <li>Entertainment system service</li>
            </ul>
          </div>
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700">
            <span className="font-semibold text-white">Starting from $130</span>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded border border-gray-600">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Maintenance Packages Section */}
      <section className="mt-8 bg-gray-800 p-8 rounded-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Maintenance Packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-700 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Basic Care</h3>
            <p className="text-gray-300 mb-4">Essential maintenance for your vehicle</p>
            <p className="text-2xl font-bold text-white mb-4">$299/year</p>
            <ul className="space-y-2 text-gray-300 mb-6">
              <li>2 Oil Changes</li>
              <li>Tire Rotation</li>
              <li>Basic Inspection</li>
              <li>Fluid Top-Off</li>
            </ul>
            <Button className="bg-gray-600 hover:bg-gray-500 text-white w-full py-2 rounded">
              Select Plan
            </Button>
          </div>
          
          <div className="p-6 bg-gray-700 rounded-lg text-center border-2 border-yellow-500">
            <h3 className="text-xl font-semibold text-white mb-4">Premium Care</h3>
            <p className="text-gray-300 mb-4">Comprehensive maintenance package</p>
            <p className="text-2xl font-bold text-white mb-4">$599/year</p>
            <ul className="space-y-2 text-gray-300 mb-6">
              <li>4 Oil Changes</li>
              <li>Full Inspection</li>
              <li>Brake Service</li>
              <li>Filter Replacements</li>
              <li>Priority Scheduling</li>
            </ul>
            <Button className="bg-yellow-600 hover:bg-yellow-500 text-white w-full py-2 rounded">
              Select Plan
            </Button>
          </div>
          
          <div className="p-6 bg-gray-700 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Elite Care</h3>
            <p className="text-gray-300 mb-4">Complete premium maintenance</p>
            <p className="text-2xl font-bold text-white mb-4">$999/year</p>
            <ul className="space-y-2 text-gray-300 mb-6">
              <li>6 Oil Changes</li>
              <li>All Fluid Services</li>
              <li>Full Diagnostics</li>
              <li>24/7 Roadside Assistance</li>
              <li>Loaner Vehicle</li>
              <li>Pickup & Delivery</li>
            </ul>
            <Button className="bg-gray-600 hover:bg-gray-500 text-white w-full py-2 rounded">
              Select Plan
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mt-16 bg-gray-800 p-8 rounded-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Why Choose Our Maintenance Services?
        </h2>
        <ul className="space-y-3 text-gray-300 max-w-3xl mx-auto">
          <li>✅ Certified technicians specialized in luxury vehicles</li>
          <li>✅ Genuine OEM parts and premium fluids</li>
          <li>✅ State-of-the-art diagnostic equipment</li>
          <li>✅ Transparent pricing with no hidden fees</li>
          <li>✅ Convenient pickup and delivery service</li>
          <li>✅ Comfortable customer lounge with amenities</li>
          <li>✅ Digital service reports and history tracking</li>
        </ul>
      </section>
    </div>
  );
};