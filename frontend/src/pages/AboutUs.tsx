// src/pages/AboutUs.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Target, Award, HeartHandshake } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const team = [
  {
    name: "John Doe",
    role: "Founder & CEO",
    description:
      "Leading the vision and strategy with passion for cars and technology.",
  },
  {
    name: "Sarah Johnson",
    role: "Head of Design",
    description:
      "Creating seamless experiences with elegant design and innovation.",
  },
  {
    name: "David Smith",
    role: "Lead Engineer",
    description:
      "Driving technical excellence and performance-focused solutions.",
  },
];

export const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold text-white text-center mb-6"
        >
          About Us
        </motion.h1>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-14"
        >
          We are dedicated to redefining automotive excellence with innovation,
          performance, and customer satisfaction at the heart of everything we
          do.
        </motion.p>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Target,
              title: "Our Mission",
              text: "Deliver world-class automotive services and performance upgrades.",
            },
            {
              icon: Award,
              title: "Our Vision",
              text: "Become the leading name in luxury and high-performance cars.",
            },
            {
              icon: HeartHandshake,
              title: "Our Values",
              text: "Customer-first, innovation-driven, and excellence in every step.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="p-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition text-center">
                <item.icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-white text-center mb-10"
        >
          Meet Our Team
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="p-6 bg-gray-800 border border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition text-center">
                <Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-red-400 mb-3">{member.role}</p>
                <p className="text-gray-300">{member.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={() => navigate("/contact")}
            className="px-8 py-4 text-lg bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md"
          >
            Contact Us
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
