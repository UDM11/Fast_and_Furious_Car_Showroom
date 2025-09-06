import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX,
  User,
  MessageCircle,
  Sparkles,
  Clock,
  Car,
  Calculator,
  Calendar,
  Phone,
  Settings
} from 'lucide-react';
import { ChatMessage } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AIReceptionist: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your AI receptionist at Fast & Furious Car Showroom. I'm here to help you find your perfect vehicle, answer questions, or assist with booking services. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    { icon: Car, text: "Browse Inventory", action: "show me available cars" },
    { icon: Calendar, text: "Book Test Drive", action: "I want to book a test drive" },
    { icon: Calculator, text: "Finance Options", action: "tell me about financing" },
    { icon: Phone, text: "Contact Info", action: "what are your contact details?" }
  ];

  const aiResponses = {
    "show me available cars": "I'd be happy to show you our incredible inventory! We have luxury sports cars like Ferrari and Lamborghini, premium SUVs including Porsche Cayenne and Range Rover Sport, and high-performance sedans like BMW M5 and Audi RS7. What type of vehicle interests you most?",
    "I want to book a test drive": "Excellent! I can help you book a test drive. We have available slots from Monday to Saturday, 9 AM to 6 PM. Which vehicle would you like to test drive, and do you have a preferred date and time?",
    "tell me about financing": "We offer competitive financing options with rates starting from 2.9% APR. Our finance calculator can help you estimate monthly payments. We also have lease options and accept trade-ins. Would you like me to connect you with our finance specialist?",
    "what are your contact details?": "You can reach us at: 📍 123 Speed Avenue, Racing District, RD 12345 📞 +1 (234) 567-8900 📧 info@fastfurious.com We're open Monday-Saturday 9 AM-8 PM, Sunday 10 AM-6 PM."
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return response;
      }
    }
    
    // Keyword-based responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Welcome to Fast & Furious Car Showroom. I'm here to help you with anything related to our luxury vehicles, test drives, financing, or services. What can I do for you today?";
    }
    
    if (lowerMessage.includes('car') || lowerMessage.includes('vehicle')) {
      return "We have an amazing selection of premium vehicles! Our inventory includes sports cars, luxury SUVs, and high-performance sedans. Would you like me to show you specific models or help you filter by your preferences?";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our vehicles range from luxury sedans starting around $85,000 to exclusive supercars up to $330,000. I can help you find options within your budget and explain our financing options. What's your price range?";
    }
    
    if (lowerMessage.includes('test drive')) {
      return "I'd be happy to help you schedule a test drive! We have slots available Monday through Saturday. Which vehicle interests you, and when would you prefer to visit our showroom?";
    }
    
    if (lowerMessage.includes('finance') || lowerMessage.includes('loan')) {
      return "We offer excellent financing options with competitive rates starting from 2.9% APR. Our finance team can work with various credit situations. Would you like to use our finance calculator or speak with a specialist?";
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
      return "We're located at 123 Speed Avenue, Racing District, RD 12345. We're easily accessible with ample parking for your visit. Would you like directions or information about our hours?";
    }
    
    if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
      return "We're open Monday-Saturday from 9:00 AM to 8:00 PM, and Sunday from 10:00 AM to 6:00 PM. Our service department has slightly different hours. Would you like specific department hours?";
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('maintenance')) {
      return "We offer comprehensive automotive services including maintenance, repairs, warranty extensions, and performance upgrades. Our certified technicians work on all luxury brands. What type of service do you need?";
    }
    
    // Default response
    return "I'm here to help with any questions about our vehicles, services, test drives, or financing options. Could you please tell me more about what you're looking for so I can assist you better?";
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const aiResponse = generateAIResponse(text);
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);

    // Simulate text-to-speech for AI response
    if ('speechSynthesis' in window && isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge for voice features.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      setIsVoiceActive(false);
    } else {
      setIsListening(true);
      setIsVoiceActive(true);
      
      // Simulate voice recognition (in a real app, you'd use the Web Speech API)
      setTimeout(() => {
        setIsListening(false);
        setIsVoiceActive(false);
        setInputMessage("I'm interested in sports cars in your inventory");
      }, 3000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Bot className="w-16 h-16 text-cyan-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
              />
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Receptionist
          </h1>
          <p className="text-xl text-gray-400">
            Your intelligent assistant for all car shopping needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Bot className="w-8 h-8 text-cyan-400" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">AI Assistant</h3>
                    <p className="text-green-400 text-xs">Online • Responds instantly</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSpeaking(!isSpeaking)}
                    className={isSpeaking ? 'text-cyan-400' : 'text-gray-400'}
                  >
                    {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Settings className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'ai' 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                            : 'bg-gradient-to-r from-pink-500 to-red-600'
                        }`}>
                          {message.sender === 'ai' ? (
                            <Bot className="w-4 h-4 text-white" />
                          ) : (
                            <User className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        {/* Message Bubble */}
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.sender === 'ai'
                            ? 'bg-gray-800/80 text-gray-100'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'ai' ? 'text-gray-400' : 'text-cyan-100'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-800/80 rounded-2xl px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={isListening ? 'Listening...' : 'Type your message...'}
                      disabled={isListening}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-12"
                    />
                    {isListening && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </motion.div>
                    )}
                  </div>
                  
                  <Button
                    variant={isVoiceActive ? 'secondary' : 'outline'}
                    onClick={handleVoiceToggle}
                    className={`p-3 ${isListening ? 'animate-pulse' : ''}`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isListening}
                    className="p-3"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-cyan-400" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage(action.action)}
                    className="w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all duration-300 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-5 h-5 text-cyan-400" />
                      <span className="text-white text-sm">{action.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* AI Features */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Natural Language Processing</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Voice Recognition</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Instant Responses</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Multilingual Support</span>
                </div>
              </div>
            </Card>

            {/* Contact Support */}
            <Card className="p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">Need Human Help?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Connect with our sales team for personalized assistance
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};