import { Booking, ShopSettings, TimeSlot } from './types';

export function generateBookingId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SBTC-${result}`;
}

export function parseTimeToMinutes(timeStr: string): number {
  // Parses "10:00 AM" or "08:00 PM" or "20:00" to minutes from midnight
  const normalized = timeStr.trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (!match) return 600; // default 10:00 AM (600 mins)

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function formatMinutesTo12Hr(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  let displayHours = hours % 12;
  if (displayHours === 0) displayHours = 12;
  
  const strHours = displayHours < 10 ? `0${displayHours}` : `${displayHours}`;
  const strMins = minutes < 10 ? `0${minutes}` : `${minutes}`;
  
  return `${strHours}:${strMins} ${period}`;
}

export function generateDailyTimeSlots(
  settings: ShopSettings,
  bookedTimeSlots: string[], // e.g. ["10:00 AM", "02:00 PM"]
  selectedDateStr: string, // YYYY-MM-DD
  activeBookingsCountForDate: number
): { slots: TimeSlot[]; isFull: boolean; isClosed: boolean } {
  const startMins = parseTimeToMinutes(settings.openingTime);
  const endMins = parseTimeToMinutes(settings.closingTime);
  const duration = settings.slotDurationMinutes || 60;

  // Check if date is blocked or is a closed day of week
  const dateObj = new Date(selectedDateStr + 'T00:00:00');
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday
  const isClosed = 
    settings.closedDaysOfWeek.includes(dayOfWeek) ||
    settings.blockedDates.includes(selectedDateStr);

  const maxLimitReached = activeBookingsCountForDate >= settings.maxDailyBookings;

  const slots: TimeSlot[] = [];

  // Determine current date/time to disable past time slots for TODAY
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMinsToday = now.getHours() * 60 + now.getMinutes();

  for (let mins = startMins; mins < endMins; mins += duration) {
    const slotTimeStr = formatMinutesTo12Hr(mins);
    const isBooked = bookedTimeSlots.includes(slotTimeStr);

    let available = true;
    let reason: TimeSlot['reason'] = undefined;

    if (isClosed) {
      available = false;
      reason = 'closed';
    } else if (isBooked) {
      available = false;
      reason = 'booked';
    } else if (maxLimitReached) {
      available = false;
      reason = 'limit_reached';
    } else if (selectedDateStr === todayStr && mins <= currentMinsToday + 30) {
      // Slot is in past or too close for today
      available = false;
      reason = 'past';
    }

    slots.push({
      time: slotTimeStr,
      available,
      booked: isBooked,
      reason,
    });
  }

  return {
    slots,
    isFull: maxLimitReached,
    isClosed,
  };
}

export function formatDatePretty(dateStr: string): string {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr + 'T00:00:00');
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return target < today;
}

export function downloadICSFile(booking: Booking) {
  const start = new Date(`${booking.date}T${formatTimeTo24(booking.time)}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hr duration

  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sri Balaji Tailoring Centre//Appointment System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${booking.bookingId}@sribalajitailoring.com`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:Tailoring Appointment - ${booking.service} (${booking.bookingId})`,
    `DESCRIPTION:Appointment at Sri Balaji Tailoring Centre for ${booking.service}. Customer: ${booking.customerName} (${booking.mobileNumber}). Notes: ${booking.notes || 'None'}`,
    'LOCATION:Sri Balaji Tailoring Centre',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Tailoring_Appointment_${booking.bookingId}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatTimeTo24(time12: string): string {
  const mins = parseTimeToMinutes(time12);
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}
