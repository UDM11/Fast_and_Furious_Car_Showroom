import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  carModel: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    carModel: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLabel, setShowLabel] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowLabel(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      setTimeout(() => {
        setSuccess("Your message has been sent successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          carModel: "",
        });
        setLoading(false);
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again later.");
      setLoading(false);
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const carModels = ["Select Car Model", "Luxury Sedan", "SUV", "Sports Car", "Electric Car"];

  return (
    <div className="min-h-screen relative text-white pt-24 pb-16 px-4 md:px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <motion.div
        ref={formRef}
        className="relative max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Contact Info */}
        <div className="flex-1 space-y-8 md:space-y-10">
          <h2 className="text-4xl md:text-5xl font-bold text-cyan-400">Contact Us</h2>
          <p className="text-gray-300 text-base md:text-lg">
            Questions, test drives, or more info? Fill the form or reach us directly below.
          </p>

          <div className="space-y-4 md:space-y-6 mt-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Mail className="text-cyan-400 w-5 h-5 md:w-6 md:h-6" aria-label="Email" />
              <span>support@fastfuries.com</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <Phone className="text-cyan-400 w-5 h-5 md:w-6 md:h-6" aria-label="Phone" />
              <span>+977-9800000000</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <MapPin className="text-cyan-400 w-5 h-5 md:w-6 md:h-6" aria-label="Location" />
              <span>Kathmandu, Nepal (Open Today: 10 AM - 7 PM)</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex gap-4 md:gap-6 mt-4 md:mt-6">
            <a href="#" title="Facebook" className="hover:text-cyan-400 transition transform hover:scale-110">
              <Facebook size={24} />
            </a>
            <a href="#" title="Twitter" className="hover:text-cyan-400 transition transform hover:scale-110">
              <Twitter size={24} />
            </a>
            <a href="#" title="Instagram" className="hover:text-cyan-400 transition transform hover:scale-110">
              <Instagram size={24} />
            </a>
          </div>

          {/* Map */}
          <div className="mt-6 md:mt-10 rounded-2xl overflow-hidden shadow-lg border border-gray-700">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0271715608636!2d85.32216601506141!3d27.71724573168342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1909b0c12b2d%3A0xe0f02a2f07d7cabc!2sKathmandu!5e0!3m2!1sen!2snp!4v1617850684530!5m2!1sen!2snp"
              className="w-full h-64 sm:h-72 md:h-80 border-0"
              loading="lazy"
            ></iframe>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Kathmandu,Nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block w-full text-center bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-2 md:py-3 rounded-lg shadow-md transition-all"
            >
              Get Directions
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-1 bg-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Name */}
            <div className="relative">
              <Input
                type="text"
                name="name"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                required
                className="peer hover:shadow-md transition-shadow"
              />
              <label className="absolute left-3 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-cyan-400 peer-focus:text-sm transition-all">
                Your Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <Input
                type="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
                className="peer hover:shadow-md transition-shadow"
              />
              <label className="absolute left-3 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-cyan-400 peer-focus:text-sm transition-all">
                Your Email
              </label>
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>

            {/* Subject */}
            <div className="relative">
              <Input
                type="text"
                name="subject"
                placeholder=" "
                value={formData.subject}
                onChange={handleChange}
                required
                className="peer hover:shadow-md transition-shadow"
              />
              <label className="absolute left-3 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-cyan-400 peer-focus:text-sm transition-all">
                Subject
              </label>
            </div>

            {/* Car Model */}
            <div className="relative">
              <select
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                required
                className="peer w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none hover:shadow-md transition-shadow"
              >
                {carModels.map((model) => (
                  <option key={model} value={model === "Select Car Model" ? "" : model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                name="message"
                placeholder=" "
                value={formData.message}
                onChange={handleChange}
                required
                rows={12}
                className="peer w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none resize-none hover:shadow-md transition-shadow"
              ></textarea>
              <label className="absolute left-3 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-cyan-400 peer-focus:text-sm transition-all">
                Your Message
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              {loading ? "Sending..." : <>Send Message <Send size={18} /></>}
            </Button>

            {success && <p className="text-green-400 text-sm mt-2 animate-pulse">{success}</p>}
          </form>
        </div>
      </motion.div>

      {/* Responsive Floating WhatsApp Button */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-center gap-1 sm:gap-2">
        <AnimatePresence>
          {showLabel && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: [0, -3, 0], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-cyan-400 text-black font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm select-none whitespace-nowrap"
            >
              <MessageCircle size={12} /> WhatsApp
            </motion.div>
          )}
        </AnimatePresence>
        <a
          href="https://wa.me/9779800000000"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-cyan-400 p-3 sm:p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={28} color="white" />
        </a>
      </div>
    </div>
  );
};

export default ContactUs;