import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  Shield, 
  User, 
  Database, 
  Cookie,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Trash2,
  Download,
  ChevronRight,
  ArrowUp,
  FileText,
  Globe,
  Bell,
  Server
} from 'lucide-react';

export const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [showConsentManager, setShowConsentManager] = useState(false);

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: Shield },
    { id: 'data-collection', title: 'Data Collection', icon: Database },
    { id: 'data-usage', title: 'Data Usage', icon: Eye },
    { id: 'data-sharing', title: 'Data Sharing', icon: Globe },
    { id: 'cookies', title: 'Cookies', icon: Cookie },
    { id: 'user-rights', title: 'Your Rights', icon: User },
    { id: 'data-security', title: 'Data Security', icon: Lock },
    { id: 'retention', title: 'Data Retention', icon: Server },
    { id: 'children', title: "Children's Privacy", icon: User },
    { id: 'changes', title: 'Policy Changes', icon: Bell },
    { id: 'contact', title: 'Contact Us', icon: Mail }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowScrollTop(latest > 400);
  });

  const handleConsentUpdate = (consentType: string, granted: boolean) => {
    // Handle consent preferences
    console.log(`Consent for ${consentType}: ${granted}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Shield className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p className="text-gray-400 text-sm mt-2 max-w-2xl mx-auto">
          We are committed to protecting your privacy and ensuring transparency about how we handle your personal information.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setShowConsentManager(true)}
          className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
        >
          <Cookie className="w-4 h-4 mr-2" />
          Manage Consent
        </button>
        <button className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
        <button className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4 mr-2" />
          Data Request
        </button>
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
                  <Shield className="w-6 h-6 mr-2 text-cyan-400" />
                  Introduction
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 mb-4">
                    At Fast & Furious, we respect your privacy and are committed to protecting your personal data. 
                    This privacy policy explains how we collect, use, and safeguard your information when you use our services.
                  </p>
                  
                  <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-cyan-400 mb-2">Scope of This Policy</h3>
                    <p className="text-sm text-gray-300">
                      This policy applies to all personal data collected through our website, mobile applications, 
                      showroom interactions, test drives, and any other services we provide.
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">1.1 Data Controller</h3>
                  <p className="text-gray-300 mb-4">
                    Fast & Furious is the data controller responsible for your personal data. Our contact information 
                    is provided in the "Contact Us" section of this policy.
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">1.2 Legal Basis</h3>
                  <p className="text-gray-300">
                    We process your personal data based on one or more of the following legal grounds: consent, 
                    contract performance, legal obligation, legitimate interests, or vital interests.
                  </p>
                </div>
              </div>
            )}

            {/* Data Collection */}
            {activeSection === 'data-collection' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-2 text-cyan-400" />
                  Data We Collect
                </h2>
                <div className="prose prose-invert max-w-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-cyan-400 mb-2">Personal Information</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Name and contact details</li>
                        <li>• Identification documents</li>
                        <li>• Payment information</li>
                        <li>• Driving license information</li>
                      </ul>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-cyan-400 mb-2">Technical Data</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• IP address and device information</li>
                        <li>• Browser type and version</li>
                        <li>• Usage data and analytics</li>
                        <li>• Cookies and tracking data</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-400">2.1 Collection Methods</h3>
                  <p className="text-gray-300 mb-4">
                    We collect data through various methods including website forms, customer interactions, 
                    test drive registrations, service appointments, and third-party sources.
                  </p>
                </div>
              </div>
            )}

            {/* Data Usage */}
            {activeSection === 'data-usage' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-cyan-400" />
                  How We Use Your Data
                </h2>
                <div className="prose prose-invert max-w-none">
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-cyan-400 mb-3">Purposes of Processing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-white mb-2">Service Delivery</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Vehicle sales and financing</li>
                          <li>• Maintenance services</li>
                          <li>• Customer support</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-2">Business Operations</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Marketing communications</li>
                          <li>• Analytics and improvement</li>
                          <li>• Legal compliance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Sharing */}
            {activeSection === 'data-sharing' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-cyan-400" />
                  Data Sharing
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 mb-4">
                    We may share your data with trusted third parties under the following circumstances:
                  </p>
                  
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-cyan-400 mb-2">Service Providers</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Financing institutions</li>
                          <li>• Insurance companies</li>
                          <li>• Marketing agencies</li>
                          <li>• IT service providers</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-cyan-400 mb-2">Legal Requirements</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Regulatory authorities</li>
                          <li>• Law enforcement</li>
                          <li>• Legal proceedings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cookies */}
            {activeSection === 'cookies' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Cookie className="w-6 h-6 mr-2 text-cyan-400" />
                  Cookies & Tracking
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 mb-4">
                    We use cookies and similar technologies to enhance your experience and analyze website usage.
                  </p>
                  
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-cyan-400 mb-3">Cookie Types</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-white">Essential Cookies</h5>
                        <p className="text-gray-300 text-sm">Required for basic website functionality</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-white">Analytics Cookies</h5>
                        <p className="text-gray-300 text-sm">Help us understand how visitors interact</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-white">Marketing Cookies</h5>
                        <p className="text-gray-300 text-sm">Used for personalized advertising</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add more sections following the same pattern */}
            {activeSection === 'user-rights' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2 text-cyan-400" />
                  Your Rights
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">User rights content...</p>
                </div>
              </div>
            )}

            {/* Continue with other sections... */}

            {activeSection === 'contact' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-cyan-400" />
                  Contact Us
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">Contact information...</p>
                </div>
              </div>
            )}
          </div>

          {/* Data Protection Notice */}
          <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-start">
              <Lock className="w-6 h-6 text-green-400 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-2">Data Protection Commitment</h3>
                <p className="text-gray-300 text-sm">
                  We implement appropriate technical and organizational measures to ensure a level of security 
                  appropriate to the risk, including encryption, access controls, and regular security assessments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Manager Modal */}
      {showConsentManager && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Cookie className="w-5 h-5 mr-2 text-cyan-400" />
              Cookie Preferences
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Essential Cookies</h4>
                  <p className="text-gray-400 text-sm">Required for basic functionality</p>
                </div>
                <div className="w-12 h-6 bg-cyan-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Analytics Cookies</h4>
                  <p className="text-gray-400 text-sm">Help us improve our services</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Cookies</h4>
                  <p className="text-gray-400 text-sm">Personalized advertising</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConsentManager(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConsentManager(false)}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-lg shadow-cyan-500/25 z-50 pointer-events-auto"
      >
        <ChevronRight className="w-6 h-6 -rotate-90" />
      </motion.button>
    </div>
  );
};