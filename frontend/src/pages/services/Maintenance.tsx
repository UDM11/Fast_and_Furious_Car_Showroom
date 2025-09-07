// src/pages/Maintenance.tsx
import React from "react";
import { Button } from "../../components/ui/Button";

export const Maintenance: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Premium Maintenance Services
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto mb-6 px-2">
          Keep your luxury vehicle in perfect condition with our expert maintenance services designed for high-performance cars.
        </p>
      </div>

      {/* Maintenance Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {/* Regular Maintenance Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-amber-500">🛠️</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Regular Maintenance
            </h2>
            <p className="text-gray-300 mb-4">Keep your vehicle running smoothly with our scheduled maintenance packages</p>
            <ul className="mb-4 text-gray-300 space-y-2 text-left w-full">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Oil changes with premium synthetic oil</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Filter replacements</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Brake inspection and service</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Tire rotation and balancing</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Comprehensive vehicle inspection</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-700 gap-3">
            <span className="font-semibold text-amber-500 text-lg">From $150</span>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto">
              Schedule Now
            </Button>
          </div>
        </div>

        {/* Diagnostic Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-amber-500">🔍</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Diagnostic Services
            </h2>
            <p className="text-gray-300 mb-4">Advanced diagnostics for identifying and resolving complex vehicle issues</p>
            <ul className="mb-4 text-gray-300 space-y-2 text-left w-full">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Computerized engine diagnostics</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Electrical system analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Performance troubleshooting</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Check engine light diagnosis</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Comprehensive system reports</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-700 gap-3">
            <span className="font-semibold text-amber-500 text-lg">From $120</span>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>

        {/* Brake Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-amber-500">🛑</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Brake Services
            </h2>
            <p className="text-gray-300 mb-4">Premium brake services for optimal stopping power and safety</p>
            <ul className="mb-4 text-gray-300 space-y-2 text-left w-full">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Brake pad and rotor replacement</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Brake fluid flush and replacement</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Caliper service and repair</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>ABS system diagnostics</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Performance brake upgrades</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-700 gap-3">
            <span className="font-semibold text-amber-500 text-lg">From $250</span>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto">
              Schedule Now
            </Button>
          </div>
        </div>

        {/* Tire Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-amber-500">🌀</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Tire Services
            </h2>
            <p className="text-gray-300 mb-4">Complete tire services for performance and safety</p>
            <ul className="mb-4 text-gray-300 space-y-2 text-left w-full">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Premium tire installation</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Wheel alignment and balancing</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Tire rotation services</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Flat repair and replacement</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Performance tire recommendations</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-700 gap-3">
            <span className="font-semibold text-amber-500 text-lg">From $80</span>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>

        {/* Fluid Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-amber-500">💧</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Fluid Services
            </h2>
            <p className="text-gray-300 mb-4">Comprehensive fluid maintenance for optimal performance</p>
            <ul className="mb-4 text-gray-300 space-y-2 text-left w-full">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Engine oil change</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Transmission fluid service</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Coolant flush and replacement</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Brake fluid exchange</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Differential fluid service</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-700 gap-3">
            <span className="font-semibold text-amber-500 text-lg">From $100</span>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto">
              Schedule Now
            </Button>
          </div>
        </div>

        {/* Electrical Services Card */}
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-4 text-amber-500">⚡</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Electrical Services
            </h2>
            <p className="text-gray-300 mb-4">Expert electrical system maintenance and repair</p>
            <ul className="mb-4 text-gray-300 space-y-2 text-left w-full">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Battery testing and replacement</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Alternator and starter service</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Lighting system repair</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Wiring diagnostics</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Entertainment system service</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-700 gap-3">
            <span className="font-semibold text-amber-500 text-lg">From $130</span>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Maintenance Packages Section */}
      <section className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 p-6 md:p-8 rounded-lg border border-amber-500/20">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Maintenance Packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-700 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Basic Care</h3>
            <p className="text-gray-300 mb-4 text-sm">Essential maintenance for your vehicle</p>
            <p className="text-2xl font-bold text-amber-500 mb-4">$299/year</p>
            <ul className="space-y-2 text-gray-300 mb-6 text-sm">
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>2 Oil Changes</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Tire Rotation</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Basic Inspection</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Fluid Top-Off</span>
              </li>
            </ul>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full py-2 rounded transition-colors">
              Select Plan
            </Button>
          </div>
          
          <div className="p-6 bg-gray-700 rounded-lg text-center border-2 border-amber-500">
            <h3 className="text-xl font-semibold text-white mb-4">Premium Care</h3>
            <p className="text-gray-300 mb-4 text-sm">Comprehensive maintenance package</p>
            <p className="text-2xl font-bold text-amber-500 mb-4">$599/year</p>
            <ul className="space-y-2 text-gray-300 mb-6 text-sm">
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>4 Oil Changes</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Full Inspection</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Brake Service</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Filter Replacements</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Priority Scheduling</span>
              </li>
            </ul>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full py-2 rounded transition-colors">
              Select Plan
            </Button>
          </div>
          
          <div className="p-6 bg-gray-700 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Elite Care</h3>
            <p className="text-gray-300 mb-4 text-sm">Complete premium maintenance</p>
            <p className="text-2xl font-bold text-amber-500 mb-4">$999/year</p>
            <ul className="space-y-2 text-gray-300 mb-6 text-sm">
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>6 Oil Changes</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>All Fluid Services</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Full Diagnostics</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>24/7 Roadside Assistance</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Loaner Vehicle</span>
              </li>
              <li className="flex justify-center items-center">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Pickup & Delivery</span>
              </li>
            </ul>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full py-2 rounded transition-colors">
              Select Plan
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 p-6 md:p-8 rounded-lg border border-amber-500/20">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Why Choose Our Maintenance Services?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3 md:mr-4">
              <span className="text-amber-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Certified Luxury Vehicle Technicians</h3>
              <p className="text-gray-300 text-xs md:text-sm">Experts with specialized training</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3 md:mr-4">
              <span className="text-amber-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Genuine OEM Parts & Premium Fluids</h3>
              <p className="text-gray-300 text-xs md:text-sm">Quality certification for all components</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3 md:mr-4">
              <span className="text-amber-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">State-of-the-Art Diagnostic Equipment</h3>
              <p className="text-gray-300 text-xs md:text-sm">Advanced technology for accurate diagnostics</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3 md:mr-4">
              <span className="text-amber-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Transparent Pricing</h3>
              <p className="text-gray-300 text-xs md:text-sm">No hidden fees with honesty guarantee</p>
            </div>
          </div>
          
          <div className="flex items-start md:col-span-2 justify-center">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3 md:mr-4">
              <span className="text-amber-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Convenient Pickup & Delivery Service</h3>
              <p className="text-gray-300 text-xs md:text-sm">Comfortable customer lounge with amenities</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};