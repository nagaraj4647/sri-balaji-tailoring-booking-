'use client';

import React, { useState } from 'react';
import { StepServices } from './StepServices';
import { StepDatePicker } from './StepDatePicker';
import { StepTimeSlots } from './StepTimeSlots';
import { StepCustomerForm } from './StepCustomerForm';
import { BookingSuccess } from './BookingSuccess';
import { Booking } from '@/lib/types';
import { Scissors } from 'lucide-react';

export const BookingFlow: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string>(''); // "10:00 AM"
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const resetForm = () => {
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setConfirmedBooking(null);
    setStep(1);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-5 sm:space-y-6">
      
      {/* Progress Steps Indicator (Only visible during steps 1-4) */}
      {step < 5 && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-cream-300 shadow-luxury overflow-hidden">
          <div className="flex items-center justify-between relative px-2 sm:px-4">
            
            {/* Progress Line */}
            <div className="absolute left-6 right-6 sm:left-8 sm:right-8 top-3.5 -translate-y-1/2 h-0.5 bg-cream-300 -z-0" />
            <div
              className="absolute left-6 sm:left-8 top-3.5 -translate-y-1/2 h-0.5 bg-gold-500 transition-all duration-300 -z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {/* Step 1 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step > 1
                    ? 'bg-emerald-600 text-white border-2 border-emerald-500 shadow-sm'
                    : step === 1
                    ? 'maroon-gradient-bg text-gold-300 border-2 border-gold-400 shadow-md ring-2 ring-gold-400/30'
                    : 'bg-cream-100 text-gray-400 border border-cream-300'
                }`}
              >
                {step > 1 ? '✓' : '1'}
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-bold tracking-tight ${
                  step >= 1 ? 'text-maroon-950' : 'text-gray-400'
                }`}
              >
                Service
              </span>
            </div>

            {/* Step 2 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step > 2
                    ? 'bg-emerald-600 text-white border-2 border-emerald-500 shadow-sm'
                    : step === 2
                    ? 'maroon-gradient-bg text-gold-300 border-2 border-gold-400 shadow-md ring-2 ring-gold-400/30'
                    : 'bg-cream-100 text-gray-400 border border-cream-300'
                }`}
              >
                {step > 2 ? '✓' : '2'}
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-bold tracking-tight ${
                  step >= 2 ? 'text-maroon-950' : 'text-gray-400'
                }`}
              >
                Date
              </span>
            </div>

            {/* Step 3 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step > 3
                    ? 'bg-emerald-600 text-white border-2 border-emerald-500 shadow-sm'
                    : step === 3
                    ? 'maroon-gradient-bg text-gold-300 border-2 border-gold-400 shadow-md ring-2 ring-gold-400/30'
                    : 'bg-cream-100 text-gray-400 border border-cream-300'
                }`}
              >
                {step > 3 ? '✓' : '3'}
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-bold tracking-tight ${
                  step >= 3 ? 'text-maroon-950' : 'text-gray-400'
                }`}
              >
                Time
              </span>
            </div>

            {/* Step 4 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === 4
                    ? 'maroon-gradient-bg text-gold-300 border-2 border-gold-400 shadow-md ring-2 ring-gold-400/30'
                    : 'bg-cream-100 text-gray-400 border border-cream-300'
                }`}
              >
                4
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-bold tracking-tight ${
                  step >= 4 ? 'text-maroon-950' : 'text-gray-400'
                }`}
              >
                Confirm
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Step Views */}
      <main>
        {step === 1 && (
          <StepServices
            selectedService={selectedService}
            onSelectService={setSelectedService}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepDatePicker
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              // Reset time if date changes
              setSelectedTime('');
            }}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepTimeSlots
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepCustomerForm
            service={selectedService}
            date={selectedDate}
            time={selectedTime}
            onSuccess={(booking) => {
              setConfirmedBooking(booking);
              setStep(5);
            }}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && confirmedBooking && (
          <BookingSuccess
            booking={confirmedBooking}
            onBookAnother={resetForm}
          />
        )}
      </main>

      {/* Footer Branding Accent */}
      <footer className="text-center pt-4 text-xs text-maroon-900/70 space-y-1">
        <p className="font-serif font-semibold">SRI BALAJI TAILORING CENTRE</p>
        <p className="text-[11px] text-gray-500">
          Fast & Easy Online Tailoring Appointment System • Double-Booking Protected
        </p>
      </footer>
    </div>
  );
};
