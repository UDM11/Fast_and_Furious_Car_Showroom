// src/pages/legal/Terms.tsx
import React, { useState } from 'react';
import { 
  FileText, 
  Shield, 
  User, 
  CreditCard, 
  Car, 
  Settings,
  AlertCircle,
  ChevronRight,
  Bookmark,
  Clock,
  ArrowUp
} from 'lucide-react';

export const Terms: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: FileText },
    { id: 'definitions', title: 'Definitions', icon: Bookmark },
    { id: 'user-accounts', title: 'User Accounts', icon: User },
    { id: 'vehicle-sales', title: 'Vehicle Sales', icon: Car },
    { id: 'financing', title: 'Financing Terms', icon: CreditCard },
    { id: 'services', title: 'Services', icon: Settings },
    { id: 'warranty', title: 'Warranty', icon: Shield },
    { id: 'liability', title: 'Liability', icon: AlertCircle },
    { id: 'privacy', title: 'Privacy', icon: Shield },
    { id: 'changes', title: 'Changes to Terms', icon: Clock }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <FileText className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 sticky top-32">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-cyan-400" />
              Table of Contents
            </h2>
            <nav className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center ${
                      activeSection === section.id
                        ? 'bg-cyan-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    <span className="text-sm">{section.title}</span>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                      activeSection === section.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 md:p-8">
            {/* Introduction */}
            {activeSection === 'introduction' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-cyan-400" />
                  Introduction
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 mb-4">
                    Welcome to Fast & Furious. These Terms of Service ("Terms") govern your access to and use of 
                    our website, services, and vehicle purchases. Please read these Terms carefully before using our services.
                  </p>
                  
                  <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-cyan-400 mb-2">Important Notice</h3>
                    <p className="text-sm text-gray-300">
                      By accessing our website or using our services, you agree to be bound by these Terms and our Privacy Policy. 
                      If you do not agree to these Terms, please do not use our services.
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">1.1 Agreement to Terms</h3>
                  <p className="text-gray-300 mb-4">
                    These Terms constitute a legally binding agreement between you and Fast & Furious regarding your use of our services. 
                    We may modify these Terms at any time, and such modifications will be effective upon posting.
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">1.2 Eligibility</h3>
                  <p className="text-gray-300 mb-4">
                    You must be at least 18 years old and have the legal capacity to enter into contracts to use our services. 
                    By using our services, you represent and warrant that you meet these requirements.
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">1.3 Service Description</h3>
                  <p className="text-gray-300">
                    Fast & Furious provides luxury vehicle sales, financing options, maintenance services, and related automotive services 
                    through our physical locations and online platform.
                  </p>
                </div>
              </div>
            )}

            {/* Definitions */}
            {activeSection === 'definitions' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Bookmark className="w-6 h-6 mr-2 text-cyan-400" />
                  Definitions
                </h2>
                <div className="prose prose-invert max-w-none">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <dt className="font-semibold text-cyan-400">"Website"</dt>
                      <dd className="text-gray-300 text-sm">Refers to fastfuries.com and associated domains</dd>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <dt className="font-semibold text-cyan-400">"Services"</dt>
                      <dd className="text-gray-300 text-sm">All services provided by Fast & Furious</dd>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <dt className="font-semibold text-cyan-400">"Vehicle"</dt>
                      <dd className="text-gray-300 text-sm">Any automobile offered for sale or service</dd>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <dt className="font-semibold text-cyan-400">"User"</dt>
                      <dd className="text-gray-300 text-sm">Any individual accessing our services</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* User Accounts */}
            {activeSection === 'user-accounts' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2 text-cyan-400" />
                  User Accounts
                </h2>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">3.1 Account Creation</h3>
                  <p className="text-gray-300 mb-4">
                    To access certain features, you must create an account with accurate and complete information. 
                    You are responsible for maintaining the confidentiality of your account credentials.
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">3.2 Account Security</h3>
                  <p className="text-gray-300 mb-4">
                    You are responsible for all activities that occur under your account. Notify us immediately of any 
                    unauthorized use or security breaches.
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">3.3 Account Termination</h3>
                  <p className="text-gray-300">
                    We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activities.
                  </p>
                </div>
              </div>
            )}

            {/* Vehicle Sales */}
            {activeSection === 'vehicle-sales' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Car className="w-6 h-6 mr-2 text-cyan-400" />
                  Vehicle Sales
                </h2>
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">4.1 Pricing and Availability</h3>
                  <p className="text-gray-300 mb-4">
                    All prices are subject to change without notice. Vehicle availability is not guaranteed until purchase is completed.
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">4.2 Purchase Process</h3>
                  <p className="text-gray-300 mb-4">
                    Vehicle purchases require signed contracts, down payment, and completion of all required documentation.
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">4.3 Delivery</h3>
                  <p className="text-gray-300">
                    Delivery timelines are estimates and subject to manufacturing and logistical constraints.
                  </p>
                </div>
              </div>
            )}

            {/* Add more sections following the same pattern */}
            {activeSection === 'financing' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2 text-cyan-400" />
                  Financing Terms
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">Financing terms content...</p>
                </div>
              </div>
            )}

            {activeSection === 'services' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-cyan-400" />
                  Services
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">Services terms content...</p>
                </div>
              </div>
            )}

            {activeSection === 'warranty' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-cyan-400" />
                  Warranty
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">Warranty terms content...</p>
                </div>
              </div>
            )}

            {activeSection === 'liability' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2 text-cyan-400" />
                  Liability
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">Liability terms content...</p>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-cyan-400" />
                  Privacy
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">Privacy terms content...</p>
                </div>
              </div>
            )}

            {activeSection === 'changes' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-cyan-400" />
                  Changes to Terms
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">Changes to terms content...</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Notice */}
          <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-400 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-2">Legal Disclaimer</h3>
                <p className="text-gray-300 text-sm">
                  This Terms of Service agreement is a legal document. We recommend reviewing it carefully and 
                  consulting with legal counsel if you have any questions. Your use of our services constitutes 
                  acceptance of these terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center shadow-lg transition-all"
      >
        <ArrowUp className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};