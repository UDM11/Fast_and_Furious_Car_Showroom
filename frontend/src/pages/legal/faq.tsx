import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Car, 
  CreditCard, 
  Settings, 
  Shield,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'general', name: 'General Questions', icon: HelpCircle },
    { id: 'vehicles', name: 'Vehicles & Inventory', icon: Car },
    { id: 'financing', name: 'Financing & Payments', icon: CreditCard },
    { id: 'services', name: 'Services & Maintenance', icon: Settings },
    { id: 'warranty', name: 'Warranty & Support', icon: Shield },
    { id: 'legal', name: 'Legal & Documentation', icon: FileText }
  ];

  const faqs = {
    general: [
      { question: 'What are your business hours?', answer: 'We are open Monday through Saturday from 8:00 AM to 8:00 PM, and Sunday from 10:00 AM to 6:00 PM. Our service center hours may vary.' },
      { question: 'Where are you located?', answer: 'Our main showroom is located at Kathmandu, Nepal. We have multiple service centers throughout the region. Please visit our contact page for detailed addresses and directions.' },
      { question: 'Do I need an appointment for a test drive?', answer: 'While walk-ins are welcome, we recommend scheduling an appointment for a test drive to ensure the vehicle you\'re interested in is available and a specialist is ready to assist you.' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, bank transfers, cash, and offer various financing options. For large transactions, we recommend using secure bank transfers.' },
      { question: 'Do you offer delivery services?', answer: 'Yes, we offer home delivery within 50km of our showroom. Remote delivery options are also available with additional fees.' }
    ],
    vehicles: [
      { question: 'How often do you update your inventory?', answer: 'We update our inventory weekly with new arrivals. Subscribe to our newsletter to receive updates about new vehicles and special offers.' },
      { question: 'Can I reserve a vehicle before it arrives?', answer: 'Yes, you can place a refundable deposit to reserve upcoming vehicles. Contact our sales team for availability and reservation terms.' },
      { question: 'Do you offer vehicle history reports?', answer: 'Yes, we provide comprehensive vehicle history reports for all pre-owned vehicles, including service records and accident history.' },
      { question: 'What is your return policy?', answer: 'We offer a 7-day/500-mile return policy on most vehicles. Some conditions apply, and certain vehicles may be excluded. Please review our return policy for details.' },
      { question: 'Do you source specific vehicle models?', answer: 'Yes, we offer vehicle sourcing services. If we don\'t have what you\'re looking for, our network can help find your dream car.' }
    ],
    financing: [
      { question: 'What credit score do I need for financing?', answer: 'We work with all credit scores. While rates vary based on creditworthiness, we have programs available for various financial situations.' },
      { question: 'How long does loan approval take?', answer: 'Most applications receive preliminary approval within 30 minutes. Full approval typically takes 2-4 hours during business days.' },
      { question: 'What documents are required for financing?', answer: 'Typically, you\'ll need: government-issued ID, proof of income, proof of residence, and insurance information. Additional documents may be required based on your situation.' },
      { question: 'Do you offer pre-approval?', answer: 'Yes, you can get pre-approved online in about 10 minutes. This helps you know your budget before shopping.' },
      { question: 'Can I finance aftermarket upgrades?', answer: 'Yes, most aftermarket upgrades and accessories can be included in your financing package.' }
    ],
    services: [
      { question: 'How often should I service my vehicle?', answer: 'We recommend following the manufacturer\'s schedule, typically every 5,000-7,500 miles or 6 months, whichever comes first.' },
      { question: 'Do you service vehicles not purchased from you?', answer: 'Yes, our service center is open to all vehicles regardless of where they were purchased.' },
      { question: 'What is your turnaround time for maintenance?', answer: 'Most routine maintenance services are completed within 2-4 hours. Major services may take 1-2 days.' },
      { question: 'Do you offer loaner vehicles?', answer: 'Yes, we provide complimentary loaner vehicles for service appointments lasting more than 4 hours (subject to availability).' },
      { question: 'Can I schedule service online?', answer: 'Yes, you can schedule service appointments through our website or mobile app 24/7.' }
    ],
    warranty: [
      { question: 'What does the standard warranty cover?', answer: 'Our standard warranty covers 3 years/36,000 miles and includes bumper-to-bumper protection for most mechanical and electrical components.' },
      { question: 'Can I transfer my warranty to a new owner?', answer: 'Yes, most warranties are transferable to subsequent owners for a small fee. This adds value when selling your vehicle.' },
      { question: 'What is not covered under warranty?', answer: 'Normal wear items (brakes, tires, wipers), damage from accidents, modifications, and improper maintenance are typically not covered.' },
      { question: 'How do I make a warranty claim?', answer: 'Contact our service department directly. We\'ll schedule an inspection and handle the claim process for you.' },
      { question: 'Do you offer extended warranty options?', answer: 'Yes, we offer various extended warranty plans that can extend coverage up to 7 years/100,000 miles.' }
    ],
    legal: [
      { question: 'What documentation is required for purchase?', answer: 'You\'ll need valid ID, proof of insurance, and financing documents if applicable. We handle all DMV paperwork for you.' },
      { question: 'What is your privacy policy?', answer: 'We take privacy seriously. Your personal information is never sold to third parties. Review our full privacy policy on our website.' },
      { question: 'Are there any hidden fees?', answer: 'No hidden fees. All costs are transparently disclosed before purchase. This includes taxes, registration, and documentation fees.' },
      { question: 'What are your terms and conditions?', answer: 'Our terms and conditions cover purchase agreements, service contracts, and website usage. They are available for review before any transaction.' },
      { question: 'How do you handle disputes?', answer: 'We prioritize customer satisfaction. Most disputes are resolved through direct communication. We also participate in industry mediation programs.' }
    ]
  };

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  const filteredFaqs = faqs[activeCategory].filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allFaqs = Object.values(faqs).flat();
  const searchResults = allFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 sm:px-6 md:px-12 lg:px-16 pb-16 text-white">
      {/* Header Section */}
      <div className="text-center mb-12 px-2">
        <div className="flex justify-center mb-4">
          <HelpCircle className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto">
          Find answers to common questions about our vehicles, services, financing, and more.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12 px-2 sm:px-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setOpenItem(null);
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex justify-start sm:justify-center mb-8 overflow-x-auto px-2">
        <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg min-w-max sm:min-w-0">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setOpenItem(null);
                }}
                className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-all text-sm sm:text-base ${
                  activeCategory === category.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        {searchTerm ? (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Search Results ({searchResults.length})</h2>
            {searchResults.length > 0 ? (
              searchResults.map((faq, index) => (
                <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                  >
                    <span className="font-medium text-sm sm:text-base">{faq.question}</span>
                    {openItem === index ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    )}
                  </button>
                  {openItem === index && (
                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-750 border-t border-gray-700">
                      <p className="text-gray-300 text-sm sm:text-base">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-sm sm:text-base">No results found for "{searchTerm}"</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">Try different keywords or browse by category</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">
              {categories.find(cat => cat.id === activeCategory)?.name}
            </h2>
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-sm sm:text-base">{faq.question}</span>
                  {openItem === index ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  )}
                </button>
                {openItem === index && (
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-750 border-t border-gray-700">
                    <p className="text-gray-300 text-sm sm:text-base">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="max-w-4xl mx-auto mt-16 bg-gray-800 rounded-lg border border-gray-700 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Still Need Help?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Call Us</h3>
            <p className="text-cyan-400 text-sm sm:text-base">+977-9800000000</p>
            <p className="text-gray-400 text-xs sm:text-sm">Mon-Sat: 8AM-8PM</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Email Us</h3>
            <p className="text-cyan-400 text-sm sm:text-base">support@fastfuries.com</p>
            <p className="text-gray-400 text-xs sm:text-sm">24/7 Response</p>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Live Chat</h3>
            <p className="text-cyan-400 text-sm sm:text-base">Available 24/7</p>
            <p className="text-gray-400 text-xs sm:text-sm">Instant Support</p>
          </div>
        </div>

        <div className="mt-8 p-4 sm:p-6 bg-gray-700 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Support Form</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your Name"
              className="bg-gray-600 border border-gray-500 rounded px-3 sm:px-4 py-2 text-sm sm:text-base text-white placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="bg-gray-600 border border-gray-500 rounded px-3 sm:px-4 py-2 text-sm sm:text-base text-white placeholder-gray-400"
            />
          </div>
          <div className="relative mb-4">
            <select className="w-full bg-gray-600 border border-gray-500 rounded px-3 sm:px-4 py-2 pr-8 text-sm sm:text-base text-white appearance-none">
              <option>Select Question Category</option>
              <option>General Inquiry</option>
              <option>Vehicle Information</option>
              <option>Financing</option>
              <option>Service & Maintenance</option>
              <option>Warranty</option>
              <option>Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 pointer-events-none" />
          </div>
          <textarea
            placeholder="Your question or message..."
            rows={3}
            className="w-full bg-gray-600 border border-gray-500 rounded px-3 sm:px-4 py-2 text-sm sm:text-base text-white placeholder-gray-400 mb-4"
          />
          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 sm:py-3 rounded font-semibold text-sm sm:text-base transition-colors">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}