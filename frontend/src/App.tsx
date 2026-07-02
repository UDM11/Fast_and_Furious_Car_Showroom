// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { InventoryProvider } from './context/InventoryContext';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { Chatbot } from './components/Chatbot/Chatbot';

// Pages
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import { InventoryDetails } from './pages/InventoryDetails';
import { TestDrive } from './pages/TestDrive';
import AIReceptionist from './pages/AIReceptionist';
import { Finance } from './pages/Finance';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { Dashboard } from './pages/dashboard/Dashboard';
import ContactUs from './pages/ContactUs';
import { Services } from './pages/Services';
import { Maintenance } from './pages/services/Maintenance';
import { TradeIn } from './pages/services/TradeIn';
import { Warranty } from './pages/services/Warranty';
import { FinancingService } from './pages/services/FinancingService';
import { ConciergeService } from './pages/services/ConciergeService';
import { PerformanceUpgrades } from './pages/services/PerformanceUpgrades';
import { AboutUs } from './pages/AboutUs';
import { FAQ } from './pages/legal/faq';
import { Terms } from './pages/legal/Terms';
import { Privacy } from './pages/legal/Privacy';
import { Testimonials } from './pages/Testimonials';
import { NotFound } from './pages/NotFound';



function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <BookingProvider>
          <Router>
            <div className="App min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/:id" element={<InventoryDetails />} />
                <Route path="/ai-receptionist" element={<AIReceptionist />} />
                <Route path="/test-drive" element={<TestDrive />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Services Routes */}
                <Route path="/services" element={<Services />} /> 
                <Route path="/services/maintenance" element={<Maintenance />} />
                <Route path="/services/trade-in" element={<TradeIn />} />
                <Route path="/services/warranty" element={<Warranty />} /> 
                <Route path="/services/financing" element={<FinancingService />} />
                <Route path="/services/concierge" element={<ConciergeService />} />
                <Route path="/services/performance" element={<PerformanceUpgrades />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Additional service routes can be added here */}
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/account" element={<Dashboard />} />
                <Route path="/auth/signin" element={<SignIn />} />
                <Route path="/auth/signup" element={<SignUp />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
            </div>
          </Router>
        </BookingProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;