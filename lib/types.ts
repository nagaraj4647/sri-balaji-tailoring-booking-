export type BookingStatus = 'Confirmed' | 'Completed' | 'Cancelled';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  iconName: 'blouse' | 'embroidery' | 'design' | 'consultation' | 'other';
  badge?: string;
}

export interface Booking {
  bookingId: string; // e.g. SBTC-9A4F
  customerName: string;
  mobileNumber: string;
  whatsappNumber: string;
  service: string;
  date: string; // YYYY-MM-DD format
  time: string; // e.g. "10:00 AM"
  notes?: string;
  status: BookingStatus;
  createdAt: string; // ISO String
}

export interface TimeSlot {
  time: string; // "10:00 AM"
  available: boolean;
  booked: boolean;
  reason?: 'booked' | 'past' | 'closed' | 'limit_reached';
}

export interface ShopSettings {
  openingTime: string; // "10:00 AM"
  closingTime: string; // "08:00 PM"
  slotDurationMinutes: number; // 60
  maxDailyBookings: number; // 10
  closedDaysOfWeek: number[]; // [0] for Sunday (0=Sun, 6=Sat)
  blockedDates: string[]; // ['2026-08-30', ...]
}

export interface DailySlotSummary {
  date: string;
  totalSlots: number;
  availableCount: number;
  bookedCount: number;
  isFull: boolean;
  isClosed: boolean;
  maxDailyLimit: number;
}
