import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from 'framer-motion';
import { 
  Star, 
  Quote, 
  User, 
  Calendar,
  Filter,
  Play,
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Award,
  Heart,
  Sparkles,
  X
} from 'lucide-react';

// Floating particles component for testimonials
const TestimonialsParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-cyan-400/25 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Animated counter component
const AnimatedCounter: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ 
  value, 
  suffix = '', 
  duration = 2000 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView && value > 0) {
      const increment = value / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);
  
  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

export const Testimonials: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowScrollTop(latest > 400);
  });

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Shrestha',
      role: 'Business Owner',
      rating: 5,
      text: 'The service at Fast & Furious is exceptional! They helped me find the perfect luxury SUV for my family. The entire process was smooth and professional.',
      date: '2024-01-15',
      category: 'sales',
      image: '/api/placeholder/80/80',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 2,
      name: 'Sita Gurung',
      role: 'Software Engineer',
      rating: 5,
      text: 'Amazing maintenance service! My BMW has never run better. The technicians are knowledgeable and the facilities are top-notch.',
      date: '2024-01-10',
      category: 'service',
      image: '/api/placeholder/80/80',
      video: null
    },
    {
      id: 3,
      name: 'Amit Kumar',
      role: 'Doctor',
      rating: 5,
      text: 'Best financing options in town! Got my dream Mercedes with a great interest rate. The finance team made everything easy to understand.',
      date: '2024-01-08',
      category: 'financing',
      image: '/api/placeholder/80/80',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 4,
      name: 'Priya Sharma',
      role: 'Architect',
      rating: 5,
      text: 'Incredible experience from start to finish. The AI receptionist was helpful and the test drive was arranged seamlessly.',
      date: '2024-01-05',
      category: 'experience',
      image: '/api/placeholder/80/80',
      video: null
    },
    {
      id: 5,
      name: 'Bikash Rai',
      role: 'Entrepreneur',
      rating: 5,
      text: 'The performance upgrades transformed my car! It feels like a completely different vehicle now. Highly recommended!',
      date: '2024-01-03',
      category: 'performance',
      image: '/api/placeholder/80/80',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 6,
      name: 'Anjali Thapa',
      role: 'Lawyer',
      rating: 5,
      text: 'Outstanding warranty service! They honored everything without any questions. This is how customer service should be.',
      date: '2024-01-01',
      category: 'warranty',
      image: '/api/placeholder/80/80',
      video: null
    }
  ];

  const filters = [
    { id: 'all', label: 'All Testimonials', count: testimonials.length },
    { id: 'sales', label: 'Vehicle Sales', count: testimonials.filter(t => t.category === 'sales').length },
    { id: 'service', label: 'Maintenance Service', count: testimonials.filter(t => t.category === 'service').length },
    { id: 'financing', label: 'Financing', count: testimonials.filter(t => t.category === 'financing').length },
    { id: 'performance', label: 'Performance Upgrades', count: testimonials.filter(t => t.category === 'performance').length }
  ];

  const filteredTestimonials = activeFilter === 'all' 
    ? testimonials 
    : testimonials.filter(testimonial => testimonial.category === activeFilter);

  const testimonialsPerPage = 6;
  const totalPages = Math.ceil(filteredTestimonials.length / testimonialsPerPage);
  const startIndex = (currentPage - 1) * testimonialsPerPage;
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, startIndex + testimonialsPerPage);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4 md:px-16 pb-16 text-white relative overflow-hidden">
      <TestimonialsParticles />
      
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          style={{ y: y1 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Testimonials</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Discover what our valued customers have to say about their experience with Fast & Furious.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: 500, suffix: '+', label: 'Happy Customers' },
            { value: 4.9, suffix: '/5', label: 'Average Rating', isFloat: true },
            { value: 98, suffix: '%', label: 'Would Recommend' },
            { value: 24, suffix: 'h', label: 'Avg. Response Time' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:border-cyan-500/30 transition-colors"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 mb-2">
                {stat.isFloat ? (
                  <span>4.9{stat.suffix}</span>
                ) : (
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-wrap gap-3 mb-10 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                setCurrentPage(1);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-800/50 border-gray-700/60 text-gray-300 hover:bg-gray-700/60 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4 mr-2 opacity-70" />
              {filter.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeFilter === filter.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {filter.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {paginatedTestimonials.map((testimonial) => (
              <motion.div
                layout
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 flex flex-col justify-between shadow-xl hover:shadow-cyan-500/5 hover:border-cyan-500/40 transition-all duration-300 group relative overflow-hidden"
              >
                <div>
                  {/* Rating & Quote Indicator */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-1 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-800">
                      {renderStars(testimonial.rating)}
                    </div>
                    <Quote className="w-8 h-8 text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors duration-300" />
                  </div>

                  {/* Text */}
                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed italic">"{testimonial.text}"</p>
                  </div>
                </div>

                <div>
                  {/* Video Thumbnail */}
                  {testimonial.video && (
                    <div className="mb-5 relative rounded-xl overflow-hidden group/video border border-gray-700/30">
                      <div
                        className="aspect-video bg-gradient-to-br from-gray-800 to-gray-950 cursor-pointer relative flex items-center justify-center"
                        onClick={() => setSelectedVideo(testimonial.id)}
                      >
                        <div className="absolute inset-0 bg-black/50 group-hover/video:bg-black/35 transition-all flex items-center justify-center">
                          <motion.div 
                            className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/50 text-white"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </motion.div>
                        </div>
                        <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-md bg-black/60 text-cyan-300 backdrop-blur-sm flex items-center border border-cyan-500/20">
                          Watch Video Review
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer (User Info) */}
                  <div className="flex items-center justify-between border-t border-gray-800/80 pt-4">
                    <div className="flex items-center">
                      <div className="w-11 h-11 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30 flex items-center justify-center mr-3 text-cyan-400 font-bold uppercase shadow-inner">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors">{testimonial.name}</h3>
                        <p className="text-gray-500 text-xs mt-0.5">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1.5 text-xs text-gray-500">
                      <span className="flex items-center text-[11px]">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-gray-600" />
                        {formatDate(testimonial.date)}
                      </span>
                      <div className="flex items-center space-x-2.5 text-gray-400">
                        <button className="hover:text-cyan-400 transition-colors p-1 rounded-md hover:bg-gray-800/30">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="hover:text-cyan-400 transition-colors p-1 rounded-md hover:bg-gray-800/30">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button className="hover:text-cyan-400 transition-colors p-1 rounded-md hover:bg-gray-800/30">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center space-x-2 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700/60 transition-all text-gray-300 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all border ${
                  currentPage === index + 1
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-lg shadow-cyan-500/20'
                    : 'bg-gray-800/60 border-gray-700/50 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700/60 transition-all text-gray-300 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div 
          className="relative rounded-3xl p-10 text-center overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-cyan-900/40 backdrop-blur-md z-0" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4 text-white">Share Your Experience</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed text-base">
              Loved your experience with Fast & Furious? Share your story and help others discover premium automotive service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle className="w-5 h-5 mr-2.5" />
                Write a Review
              </motion.button>
              <motion.button 
                className="w-full sm:w-auto border-2 border-gray-600 text-gray-300 font-bold px-8 py-3.5 rounded-xl hover:bg-white hover:text-gray-950 hover:border-white transition-all flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Heart className="w-5 h-5 mr-2.5 text-red-500 fill-red-500/20 group-hover:fill-red-500" />
                Share Your Story
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-lg shadow-cyan-500/25 z-50 pointer-events-auto"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronRight className="w-6 h-6 -rotate-90" />
      </motion.button>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-4xl w-full shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center">
                  <Play className="w-5 h-5 mr-2 text-cyan-400" /> Customer Testimonial
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-gray-800">
                <iframe
                  width="100%"
                  height="100%"
                  src={testimonials.find(t => t.id === selectedVideo)?.video || ''}
                  title="Customer Testimonial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Testimonials;