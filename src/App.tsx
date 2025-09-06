import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import { InventoryDetails } from './pages/InventoryDetails';
import { TestDrive } from './pages/TestDrive';
import { AIReceptionist } from './pages/AIReceptionist';
import { Finance } from './pages/Finance';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';

// Placeholder components for missing pages
const About = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">About Fast & Furious</h1>
      <p className="text-xl text-gray-400">This page is under construction. Coming soon!</p>
    </div>
  </div>
);

const Testimonials = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Customer Testimonials</h1>
      <p className="text-xl text-gray-400">This page is under construction. Coming soon!</p>
    </div>
  </div>
);

const Services = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
      <p className="text-xl text-gray-400">This page is under construction. Coming soon!</p>
    </div>
  </div>
);

const Contact = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
      <p className="text-xl text-gray-400">This page is under construction. Coming soon!</p>
    </div>
  </div>
);

const Account = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Your Account</h1>
      <p className="text-xl text-gray-400">This page is under construction. Coming soon!</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/:id" element={<InventoryDetails />} />
                <Route path="/ai-receptionist" element={<AIReceptionist />} />
                <Route path="/test-drive" element={<TestDrive />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/about" element={<About />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/account" element={<Account />} />
                <Route path="/auth/signin" element={<SignIn />} />
                <Route path="/auth/signup" element={<SignUp />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;