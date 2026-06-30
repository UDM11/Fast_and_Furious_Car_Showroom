import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ArrowLeft, Search, Gauge, Disc } from "lucide-react";
import { Button } from "../components/ui/Button";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [needleRotate, setNeedleRotate] = useState(-120);

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 45,
        y: (e.clientY - window.innerHeight / 2) / 45,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Needle revving animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate revving the engine
      const randomRev = Math.random() * 60 + 60; // Rev between 60deg and 120deg
      setNeedleRotate(randomRev);
      setTimeout(() => {
        setNeedleRotate(randomRev - 20); // Rev down slightly
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 flex items-center justify-center px-4 py-16 relative overflow-hidden text-white select-none">
      
      {/* Background Cyber Glows */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: mousePos.x * -1.5,
          y: mousePos.y * -1.5,
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"
        animate={{
          x: mousePos.x * -1.2,
          y: mousePos.y * -1.2,
        }}
      />

      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      <div className="max-w-4xl w-full mx-auto text-center relative z-10">
        
        {/* Parallax Container */}
        <motion.div
          animate={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex flex-col items-center justify-center mb-6"
        >
          {/* Animated Interactive Tachometer (Dashboard Speedometer) */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 mb-8 flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex items-center justify-center bg-gray-950/40 backdrop-blur-sm">
              {/* Inner Glowing Ring */}
              <div className="absolute w-[92%] h-[92%] rounded-full border border-cyan-500/20" />
            </div>

            {/* Gauge Marks */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 200 200">
              {/* Scale Ticks */}
              {[...Array(9)].map((_, i) => {
                const angle = (i * 30) - 120; // -120 to 120 degrees
                const rad = (angle * Math.PI) / 180;
                const x1 = 100 + 80 * Math.cos(rad);
                const y1 = 100 + 80 * Math.sin(rad);
                const x2 = 100 + 88 * Math.cos(rad);
                const y2 = 100 + 88 * Math.sin(rad);
                const isRedline = i >= 7;

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isRedline ? "#ef4444" : "#06b6d4"}
                    strokeWidth={isRedline ? "2.5" : "2"}
                    opacity={0.8}
                  />
                );
              })}

              {/* Glowing Redline Zone */}
              <path
                d="M 178.6 150 A 90 90 0 0 0 178.6 50"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray="4 8"
                opacity={0.4}
              />
            </svg>

            {/* Big Center Display */}
            <div className="absolute flex flex-col items-center justify-center">
              <motion.h1 
                className="text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[size:200%] animate-pulse"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                404
              </motion.h1>
              <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 font-bold -mt-1 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Connection Lost
              </span>
            </div>

            {/* Gauge Needle */}
            <motion.div
              className="absolute w-2 h-32 origin-bottom pb-16 flex items-start justify-center"
              style={{ bottom: "50%" }}
              animate={{ rotate: needleRotate }}
              transition={{ type: "spring", stiffness: 80, damping: 10 }}
            >
              <div className="w-1.5 h-20 bg-gradient-to-t from-red-500 to-orange-500 rounded-full shadow-[0_0_15px_#ef4444]" />
            </motion.div>
            
            {/* Needle Cap */}
            <div className="absolute w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-700 shadow-xl flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            </div>

            {/* Speed Unit */}
            <span className="absolute bottom-10 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-semibold">
              Error / RPM
            </span>
          </div>
        </motion.div>

        {/* Text Details */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10 px-4"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            You've Gone Off-Track
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            The page you are looking for has driven off the map. It might have been relocated, deleted, or never existed in this garage.
          </p>
        </motion.div>

        {/* Main Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 border border-transparent hover:shadow-cyan-500/35 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Return to Showroom
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2.5 px-8 py-4 bg-gray-900/60 border border-gray-700 hover:border-gray-500 hover:bg-gray-800 text-gray-300 font-bold rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Reverse Gear (Back)
            </Button>
          </motion.div>
        </motion.div>

        {/* Showroom Sitemap / Popular Sections */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="border-t border-gray-800/80 pt-10"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 font-semibold mb-6">
            Quick Navigation Links
          </p>
          <div className="flex flex-wrap justify-center gap-4 px-4">
            {[
              { label: "Browse Inventory", path: "/inventory" },
              { label: "Premium Services", path: "/services" },
              { label: "Contact Sales", path: "/contact" },
              { label: "Book Test Drive", path: "/test-drive" },
            ].map((link, index) => (
              <motion.button
                key={link.path}
                onClick={() => navigate(link.path)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="px-6 py-3 text-sm text-gray-300 font-medium bg-gray-800/20 hover:bg-cyan-500/10 border border-gray-800/80 hover:border-cyan-500/35 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                {link.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Ambient Moving Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -150],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;