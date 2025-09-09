// src/components/Chatbot.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/Card";
import { Bot, X, Send, Loader2, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm the AI Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("inventory") || input.includes("car") || input.includes("vehicle")) {
      return "We have a wide selection of premium vehicles. Browse by model, price, or availability?";
    }

    if (input.includes("test drive") || input.includes("drive")) {
      return "You can schedule a test drive online. Want me to open the booking form?";
    }

    if (input.includes("price") || input.includes("cost") || input.includes("finance")) {
      return "We offer transparent pricing and financing. Do you want EMI, lease, or purchase details?";
    }

    if (input.includes("service") || input.includes("maintenance") || input.includes("repair")) {
      return "We provide certified service and maintenance. Should I connect you to our service center?";
    }

    if (input.includes("warranty") || input.includes("guarantee")) {
      return "All vehicles come with warranty options up to 5 years. Want me to list them?";
    }

    if (input.includes("contact") || input.includes("phone") || input.includes("email")) {
      return "📞 (555) 123-4567\n📧 info@fastandfurious.com\n📍 123 Speed Street, Los Angeles, CA";
    }

    if (input.includes("hours") || input.includes("open") || input.includes("time")) {
      return "Showroom hours:\nMon-Fri: 9AM - 8PM\nSat: 10AM - 6PM\nSun: 11AM - 5PM";
    }

    return "I'm here to help with inventory, test drives, financing, or service. Ask me anything!";
  };

  return (
    <>
      {/* Floating Button with Label */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-center gap-1 sm:gap-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: [0, -3, 0], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-blue-600 text-white font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm select-none whitespace-nowrap"
            >
              <Bot size={12} /> AI Assistant
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 p-3 sm:p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label="AI Assistant"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X size={24} color="white" /> : <Bot size={24} color="white" />}
        </motion.button>
      </div>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 w-auto max-w-md mx-auto sm:w-96 h-96 z-50"
          >
            <Card className="h-full w-full flex flex-col bg-gray-900 border border-gray-700 shadow-xl rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-600 rounded-full">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.text}</p>
                      <p className="text-[10px] opacity-70 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-1 bg-gray-800 px-3 py-2 rounded-2xl text-gray-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Typing...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    aria-label="Type your message"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};