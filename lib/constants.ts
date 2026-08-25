import { ServiceItem, ShopSettings } from './types';

export const BUSINESS_NAME = "SRI BALAJI TAILORING CENTRE";
export const BUSINESS_TAGLINE = "Boutique Ladies Tailoring & Custom Embroidery";
export const BUSINESS_PHONE = "+91 98765 43210";
export const BUSINESS_ADDRESS = "Main Road, Near Temple Street, City";

export const TAILORING_SERVICES: ServiceItem[] = [
  {
    id: 'blouse-stitching',
    name: 'Blouse Stitching',
    description: 'Perfectly tailored custom blouses with precision fitting & exquisite necklines.',
    estimatedTime: '45-60 mins measurement & design setup',
    iconName: 'blouse',
    badge: 'Popular',
  },
  {
    id: 'embroidery-work',
    name: 'Embroidery Work',
    description: 'Intricate Aari, Zardosi, cutwork, and hand embroidery customized to your fabric.',
    estimatedTime: '60 mins consultation & pattern sample',
    iconName: 'embroidery',
    badge: 'Luxury',
  },
  {
    id: 'new-design-creation',
    name: 'New Design Creation',
    description: 'Exclusive custom outfit creation from fresh fabric and couture concepts.',
    estimatedTime: '60 mins designer session',
    iconName: 'design',
  },
  {
    id: 'blouse-design-consultation',
    name: 'Blouse Design Consultation',
    description: 'Expert styling session to choose neck designs, borders, sleeves & back patterns.',
    estimatedTime: '30-45 mins session',
    iconName: 'consultation',
  },
  {
    id: 'other',
    name: 'Other Tailoring Work',
    description: 'Alterations, dress stitching, lehengas, dupattas, or special custom requests.',
    estimatedTime: '30 mins measurement',
    iconName: 'other',
  },
];

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  openingTime: '10:00 AM',
  closingTime: '08:00 PM',
  slotDurationMinutes: 60,
  maxDailyBookings: 10,
  closedDaysOfWeek: [0], // Sunday closed by default
  blockedDates: [],
};

export const ADMIN_DEFAULT_CREDENTIALS = {
  email: "admin@sribalajitailoring.com",
  password: "sundari",
};
