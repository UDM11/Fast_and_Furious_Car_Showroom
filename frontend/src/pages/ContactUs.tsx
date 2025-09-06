import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      // API call can be added here
      setTimeout(() => {
        setSuccess("Your message has been sent successfully!");
        setLoading(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col pt-24 pb-16">
      <motion.div
        className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Contact Info */}
        <div className="space-y-10">
          <h2 className="text-4xl font-bold text-cyan-400">Contact Us</h2>
          <p className="text-gray-400">
            Have questions or want to schedule a test drive? Fill out the form or reach us directly through the details below.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-cyan-400 w-6 h-6" />
              <span>support@fastfuries.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-cyan-400 w-6 h-6" />
              <span>+977-9800000000</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-cyan-400 w-6 h-6" />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex gap-6 mt-6">
            <a href="#" className="hover:text-cyan-400 transition">
              <Facebook size={24} />
            </a>
            <a href="#" className="hover:text-cyan-400 transition">
              <Twitter size={24} />
            </a>
            <a href="#" className="hover:text-cyan-400 transition">
              <Instagram size={24} />
            </a>
          </div>

          {/* Map */}
          <div className="mt-10">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0271715608636!2d85.32216601506141!3d27.71724573168342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1909b0c12b2d%3A0xe0f02a2f07d7cabc!2sKathmandu!5e0!3m2!1sen!2snp!4v1617850684530!5m2!1sen!2snp"
              className="w-full h-64 md:h-80 rounded-lg shadow-lg border-0"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none resize-none"
            ></textarea>

            <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2">
              {loading ? "Sending..." : <>Send Message <Send size={18} /></>}
            </Button>

            {success && <p className="text-green-400 text-sm">{success}</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;
