import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' }
  ];

  const serviceLinks = [
    { name: 'All Services', path: '/services' },
    { name: 'Maintenance', path: '/services/maintenance' },
    { name: 'Trade In', path: '/services/trade-in' },
    { name: 'Warranty', path: '/services/warranty' },
    { name: 'Financing', path: '/services/financing' },
    { name: 'Concierge', path: '/services/concierge' },
    { name: 'Performance Upgrades', path: '/services/performance' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'FAQ', path: '/faq' }
  ];

  const socialLinks = [
    { icon: Facebook, url: '#', name: 'Facebook' },
    { icon: Twitter, url: '#', name: 'Twitter' },
    { icon: Instagram, url: '#', name: 'Instagram' },
    { icon: Youtube, url: '#', name: 'YouTube' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Car className="w-10 h-10 text-cyan-400" />
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    <span className="text-white">Fast</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"> & </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Furious</span>
                  </h3>
                </div>
              </div>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier destination for luxury and performance vehicles. Experience the future of car shopping with our AI-powered service and world-class collection.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Our Services</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  <p>123 Speed Avenue</p>
                  <p>Racing District, RD 12345</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  +1 (234) 567-8900
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <a href="mailto:info@fastfurious.com" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm">
                  info@fastfurious.com
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  <p>Mon-Sat: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Fast & Furious Car Showroom. All rights reserved.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <span>Powered by AI Technology</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
