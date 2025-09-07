// src/pages/Services.tsx
import React from "react";
import { Link } from "react-router-dom";
import { servicesData } from "../data/servicesData";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Our Premium Services
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto mb-6 px-2">
          Explore our wide range of luxury car services designed for your comfort
          and peace of mind.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service) => (
          <Card
            key={service.id}
            id={service.slug}
            className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4 text-amber-500">{service.icon}</div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {service.title}
              </h2>
              <p className="text-gray-300 mb-4">{service.description}</p>

              {/* Features List */}
              <ul className="mb-4 text-gray-300 space-y-2 text-left w-full">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-700 gap-3">
              <span className="font-semibold text-amber-500 text-lg">{service.price}</span>
              <Link to={`/services/${service.slug}`} className="w-full sm:w-auto">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors w-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Why Choose Us Section */}
      <section className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 p-6 md:p-8 rounded-lg border border-amber-500/20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Why Choose Our Services?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3 md:mr-4">
              <span className="text-amber-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Certified & Professional Technicians</h3>
              <p className="text-gray-300 text-xs md:text-sm">Experts with specialized training</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3 md:mr-4">
              <span className="text-amber-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Premium OEM Parts Guarantee</h3>
              <p className="text-gray-300 text-xs md:text-sm">Genuine parts with quality certification</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3 md:mr-4">
              <span className="text-amber-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Personalized VIP Experience</h3>
              <p className="text-gray-300 text-xs md:text-sm">Premium hospitality with luxury service</p>
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
          
          <div className="flex items-start md:col-span-2 justify-center mt-2">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3 md:mr-4">
              <span className="text-amber-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">24/7 Customer Support & Roadside Assistance</h3>
              <p className="text-gray-300 text-xs md:text-sm">Specializing in all terrain recovery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};