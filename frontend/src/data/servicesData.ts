import { Service } from '../types';

export const servicesData: Service[] = [
  {
    id: '1',
    title: 'Luxury Car Maintenance',
    description: 'Premium maintenance services for all luxury vehicles',
    icon: '🔧',
    slug: "maintenance",
    features: [
      'Certified technicians',
      'OEM parts guarantee',
      'Luxury lounge waiting area',
      'Pickup & delivery service',
      'Digital service reports'
    ],
    price: 'Starting from NPR 299'
  },
  {
    id: '2',
    title: 'Trade-In Evaluation',
    description: 'Get the best value for your current vehicle',
    icon: '🔄',
    slug: "trade-in",
    features: [
      'AI-powered valuation',
      'Instant quote generation',
      'Market analysis reports',
      'Condition assessment',
      'Flexible trade options'
    ],
    price: 'Free evaluation'
  },
  {
    id: '3',
    title: 'Extended Warranty',
    description: 'Comprehensive protection for your investment',
    icon: '🛡️',
    slug: "warranty",
    features: [
      'Bumper-to-bumper coverage',
      'Roadside assistance 24/7',
      'Rental car allowance',
      'Transferable warranties',
      'No deductible options'
    ],
    price: 'Starting from NPR 89/month'
  },
  {
    id: '4',
    title: 'Custom Financing',
    description: 'Tailored financing solutions for every budget',
    icon: '💰',
    slug: "financing",
    features: [
      'Competitive interest rates',
      'Flexible terms up to 84 months',
      'Pre-approval in minutes',
      'Bad credit programs available',
      'Lease options'
    ],
    price: 'Rates from 2.9% APR'
  },
  {
    id: '5',
    title: 'Concierge Service',
    description: 'White-glove service for VIP customers',
    icon: '👔',
    slug: "concierge",
    features: [
      'Personal shopping assistant',
      'Home delivery service',
      'Priority scheduling',
      'Exclusive events access',
      '24/7 customer support'
    ],
    price: 'Complimentary for premium purchases'
  },
  {
    id: '6',
    title: 'Performance Upgrades',
    description: 'Enhance your vehicle\'s performance and aesthetics',
    icon: '⚡',
    slug: "performance",
    features: [
      'ECU tuning and remapping',
      'Exhaust system upgrades',
      'Suspension modifications',
      'Aesthetic enhancements',
      'Track-ready packages'
    ],
    price: 'Custom quotes available'
  }
];