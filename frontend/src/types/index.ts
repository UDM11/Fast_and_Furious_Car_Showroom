export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  type: 'sedan' | 'suv' | 'sports';
  mileage: number;
  fuel: string;
  transmission: string;
  engine: string;
  features: string[];
  images: string[];
  description: string;
  isNew: boolean;
  rating: number;
  reviews: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface TestDriveBooking {
  id: string;
  carId: string;
  userId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isVoice?: boolean;
}

export interface FinanceCalculation {
  carPrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  rating: number;
  text: string;
  date: string;
  carPurchased?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  price?: string;
}