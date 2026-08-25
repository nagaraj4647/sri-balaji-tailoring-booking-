'use client';

import React, { useEffect } from 'react';
import { Booking } from '@/lib/types';
import { downloadICSFile, formatDatePretty } from '@/lib/utils';
import { CheckCircle2, CalendarPlus, RotateCcw, MessageCircle, Scissors, Phone, User, Calendar, Clock, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BUSINESS_NAME, BUSINESS_ADDRESS, BUSINESS_PHONE } from '@/lib/constants';

interface BookingSuccessProps {
  booking: Booking;
  onBookAnother: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({
  booking,
  onBookAnother,
}) => {
  useEffect(() => {
    // Trigger celebratory confetti effect on successful booking
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#4A0E17', '#FAF7F2', '#E5C158'],
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hello Sri Balaji Tailoring Centre, I have booked an appointment!\n\n` +
    `📌 Booking ID: ${booking.bookingId}\n` +
    `✂️ Service: ${booking.service}\n` +
    `📅 Date: ${formatDatePretty(booking.date)}\n` +
    `⏰ Time: ${booking.time}\n` +
    `👤 Customer: ${booking.customerName}\n` +
    `📱 Mobile: ${booking.mobileNumber}`
  );

  const whatsappUrl = `https://wa.me/91${booking.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="space-y-6 text-center animate-fade-in">
      {/* Confirmation Badge Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-400/60 shadow-luxury space-y-4">
        
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
            ✓ Appointment Confirmed
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
            Thank You, {booking.customerName}!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Your tailoring appointment has been successfully scheduled.
          </p>
        </div>

        {/* Highlighted Booking ID Badge */}
        <div className="inline-flex flex-col items-center justify-center px-6 py-3 rounded-2xl maroon-gradient-bg text-cream-50 border border-gold-400 shadow-gold-glow">
          <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest">
            Booking ID
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-black text-gold-300 tracking-wider">
            {booking.bookingId}
          </span>
        </div>

        {/* Appointment Details Summary Grid */}
        <div className="bg-cream-50 rounded-2xl p-4 sm:p-5 border border-cream-300 text-left text-sm space-y-3 mt-4">
          <div className="flex items-center justify-between border-b border-cream-200 pb-2">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <Scissors className="w-4 h-4 text-gold-600" />
              Service:
            </span>
            <span className="font-serif font-bold text-maroon-950 text-base">
              {booking.service}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-cream-200 pb-2">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-600" />
              Date:
            </span>
            <span className="font-bold text-maroon-900">
              {formatDatePretty(booking.date)}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-cream-200 pb-2">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-600" />
              Time:
            </span>
            <span className="font-bold text-maroon-900 bg-gold-500/20 px-2.5 py-0.5 rounded border border-gold-400/40">
              {booking.time}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-cream-200 pb-2">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-gold-600" />
              Customer Name:
            </span>
            <span className="font-semibold text-gray-900">{booking.customerName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold-600" />
              Mobile Number:
            </span>
            <span className="font-mono text-gray-900">{booking.mobileNumber}</span>
          </div>
        </div>

        {/* Shop Address & Guidance */}
        <div className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-400/30 text-left text-xs text-maroon-900 flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{BUSINESS_NAME}</p>
            <p className="text-gray-600 mt-0.5">{BUSINESS_ADDRESS}</p>
            <p className="text-[11px] text-gold-700 font-semibold mt-1">
              Please arrive 5 minutes prior to your time slot. No advance online payment required.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Add to Calendar Button */}
          <button
            type="button"
            onClick={() => downloadICSFile(booking)}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-white text-maroon-900 border-2 border-gold-400 hover:bg-gold-500/10 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <CalendarPlus className="w-4 h-4 text-gold-600" />
            <span>Add to Calendar</span>
          </button>

          {/* Send to WhatsApp Confirmation */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Share on WhatsApp</span>
          </a>
        </div>

        {/* Secondary Action: Book Another Appointment */}
        <div className="pt-3 border-t border-cream-200">
          <button
            type="button"
            onClick={onBookAnother}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm maroon-gradient-bg text-cream-50 hover:brightness-110 active:scale-[0.99] border border-gold-500/40 shadow-luxury transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-gold-400" />
            <span>Book Another Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
