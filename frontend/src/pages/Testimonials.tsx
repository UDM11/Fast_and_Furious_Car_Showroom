import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  User, 
  Car, 
  Calendar,
  Filter,
  Play,
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Award,
  Heart
} from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-24 px-4 md:px-16 pb-16 text-white">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Quote className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Customer Testimonials</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Discover what our valued customers have to say about their experience with Fast & Furious
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">500+</div>
          <div className="text-gray-300">Happy Customers</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">4.9/5</div>
          <div className="text-gray-300">Average Rating</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">98%</div>
          <div className="text-gray-300">Would Recommend</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">24h</div>
          <div className="text-gray-300">Avg. Response Time</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveFilter(filter.id);
              setCurrentPage(1);
            }}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeFilter === filter.id
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {filter.label}
            <span className="ml-2 bg-gray-700 px-2 py-1 rounded-full text-xs">
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-cyan-500 transition-all group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(testimonial.rating)}
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <Quote className="w-6 h-6 text-cyan-400 mb-2 opacity-50" />
              <p className="text-gray-300 italic">"{testimonial.text}"</p>
            </div>

            {/* Video Thumbnail */}
            {testimonial.video && (
              <div className="mb-4 relative">
                <div
                  className="aspect-video bg-gray-700 rounded-lg cursor-pointer relative overflow-hidden group/video"
                  onClick={() => setSelectedVideo(testimonial.id)}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover/video:bg-opacity-20 transition-all" />
                  <Play className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white" />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(testimonial.date)}
              </div>
              <div className="flex items-center space-x-3">
                <button className="hover:text-cyan-400 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button className="hover:text-cyan-400 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="hover:text-cyan-400 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mb-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-10 h-10 rounded-lg transition-all ${
                currentPage === index + 1
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Customer Testimonial</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src={testimonials.find(t => t.id === selectedVideo)?.video}
                title="Customer Testimonial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-8 text-center">
        <Award className="w-12 h-12 text-white mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
        <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
          Loved your experience with Fast & Furious? Share your story and help others discover premium automotive service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Write a Review
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition-colors flex items-center justify-center">
            <Heart className="w-5 h-5 mr-2" />
            Share Your Story
          </button>
        </div>
      </div>
    </div>
  );
};