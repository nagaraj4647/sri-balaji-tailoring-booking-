'use client';

import React, { useState } from 'react';
import { Booking } from '@/lib/types';
import { formatDatePretty } from '@/lib/utils';
import { User, Phone, MessageSquare, FileText, Calendar, Clock, Scissors, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

import { sendBookingNotificationEmail } from '@/lib/email';

interface StepCustomerFormProps {
  service: string;
  date: string;
  time: string;
  onSuccess: (booking: Booking) => void;
  onBack: () => void;
}

export const StepCustomerForm: React.FC<StepCustomerFormProps> = ({
  service,
  date,
  time,
  onSuccess,
  onBack,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic frontend validations
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const finalWhatsapp = sameAsMobile ? cleanMobile : whatsappNumber.replace(/\D/g, '');
    if (!finalWhatsapp || finalWhatsapp.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Save booking to database with server-side double booking & daily capacity validation
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          mobileNumber: cleanMobile,
          whatsappNumber: finalWhatsapp,
          service,
          date,
          time,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm appointment.');
      }

      // 2. Booking saved successfully! Now trigger EmailJS notification to owner
      // Failure to send email does NOT cancel or alter the confirmed booking
      try {
        await sendBookingNotificationEmail(data.booking);
      } catch (emailErr) {
        console.error('EmailJS background notification failed:', emailErr);
      }

      // 3. Show booking success screen to customer
      onSuccess(data.booking);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <span className="inline-block text-[11px] font-semibold tracking-widest text-gold-600 uppercase mb-1">
          Step 4 of 4
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
          Customer Details & Summary
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter your contact details to finalize your tailoring appointment.
        </p>
      </div>

      {/* Booking Summary Card */}
      <div className="bg-white rounded-2xl border-2 border-gold-400/50 shadow-luxury overflow-hidden">
        <div className="maroon-gradient-bg px-5 py-3 text-cream-50 flex items-center justify-between">
          <span className="font-serif font-bold text-base tracking-wide flex items-center gap-2">
            <Scissors className="w-4 h-4 text-gold-400 rotate-45" />
            Appointment Summary
          </span>
          <span className="text-[11px] bg-gold-500 text-maroon-950 font-bold px-2.5 py-0.5 rounded-full uppercase">
            No Payment Required
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-3 bg-cream-50/40 text-sm">
          <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
            <span className="text-gray-600 font-medium">Service:</span>
            <span className="font-bold text-maroon-950 font-serif text-base">{service}</span>
          </div>

          <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
            <span className="text-gray-600 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-600" />
              Date:
            </span>
            <span className="font-bold text-maroon-900">{formatDatePretty(date)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-600" />
              Time Slot:
            </span>
            <span className="font-bold text-maroon-900 bg-gold-500/15 px-3 py-1 rounded-lg border border-gold-400/30">
              {time}
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Booking Error</p>
            <p className="text-xs text-red-800 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Customer Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-maroon-950 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Anitha Sharma"
              className="w-full pl-10 pr-4 py-3.5 bg-white rounded-xl border border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-maroon-950 uppercase tracking-wider mb-1.5">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              required
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full pl-10 pr-4 py-3.5 bg-white rounded-xl border border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* WhatsApp Checkbox & Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-maroon-950 uppercase tracking-wider">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sameAsMobile}
              onChange={(e) => setSameAsMobile(e.target.checked)}
              className="w-4 h-4 rounded text-maroon-900 focus:ring-gold-500 border-gray-300"
            />
            <span>Same as Mobile Number</span>
          </label>

          {!sameAsMobile && (
            <div className="relative pt-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 pt-1 flex items-center pointer-events-none text-gray-400">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="10-digit WhatsApp number"
                className="w-full pl-10 pr-4 py-3.5 bg-white rounded-xl border border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Special Notes (Optional) */}
        <div>
          <label className="block text-xs font-bold text-maroon-950 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Special Notes / Design Requests</span>
            <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bringing heavy silk saree fabric, need boat neck style..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <button
            type="button"
            disabled={submitting}
            onClick={onBack}
            className="w-1/3 py-4 px-4 rounded-xl font-semibold text-sm bg-white text-maroon-900 border border-cream-300 hover:bg-cream-100 transition-colors shadow-sm"
          >
            ← Back
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-2/3 py-4 px-6 rounded-xl font-bold text-base tracking-wide maroon-gradient-bg text-cream-50 hover:brightness-110 active:scale-[0.99] border border-gold-500/40 shadow-luxury transition-all duration-200 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 text-gold-400 animate-spin" />
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-gold-400" />
                <span>Confirm Appointment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
