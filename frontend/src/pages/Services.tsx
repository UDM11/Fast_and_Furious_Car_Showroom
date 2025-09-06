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
      <h1 className="text-4xl font-bold text-center mb-4">
        Our Premium Services
      </h1>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
        Explore our wide range of luxury car services designed for your comfort
        and peace of mind.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service) => (
          <Card
            key={service.id}
            id={service.slug}
            className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4 text-white">{service.icon}</div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {service.title}
              </h2>
              <p className="text-gray-300 mb-4">{service.description}</p>

              {/* Features List */}
              <ul className="mb-4 text-gray-300 list-disc list-inside space-y-1 text-left">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Price & Button */}
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700">
              <span className="font-semibold text-white">{service.price}</span>
              <Link to={`/services/${service.slug}`}>
                <Button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded border border-gray-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Why Choose Us Section */}
      <section className="mt-16 bg-gray-800 p-8 rounded-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Why Choose Fast & Furious?
        </h2>
        <ul className="space-y-3 text-gray-300 max-w-3xl mx-auto">
          <li>✅ Certified & professional technicians</li>
          <li>✅ Premium OEM parts guarantee</li>
          <li>✅ Personalized VIP experience</li>
          <li>✅ Transparent pricing & no hidden fees</li>
          <li>✅ 24/7 customer support & roadside assistance</li>
        </ul>
      </section>
    </div>
  );
};
