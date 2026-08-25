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
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Progress Steps Indicator (Only visible during steps 1-4) */}
      {step < 5 && (
        <div className="bg-white rounded-2xl p-4 border border-cream-300 shadow-luxury">
          <div className="flex items-center justify-between relative px-2">
            
            {/* Background Line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-cream-300 -z-0" />
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-gold-500 transition-all duration-300 -z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {/* Step 1 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step >= 1
                    ? 'maroon-gradient-bg text-gold-300 border-2 border-gold-400 shadow-md'
                    : 'bg-cream-100 text-gray-400 border border-cream-300'
                }`}
              >
                1
              </div>
              <span className="text-[10px] font-semibold text-maroon-900 hidden xs:inline">Service</span>
            </div>

            {/* Step 2 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step >= 2
                    ? 'maroon-gradient-bg text-gold-300 border-2 border-gold-400 shadow-md'
                    : 'bg-cream-100 text-gray-400 border border-cream-300'
                }`}
              >
                2
              </div>
              <span className="text-[10px] font-semibold text-maroon-900 hidden xs:inline">Date</span>
            </div>

            {/* Step 3 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step >= 3
                    ? 'maroon-gradient-bg text-gold-300 border-2 border-gold-400 shadow-md'
                    : 'bg-cream-100 text-gray-400 border border-cream-300'
                }`}
              >
                3
              </div>
              <span className="text-[10px] font-semibold text-maroon-900 hidden xs:inline">Time Slot</span>
            </div>

            {/* Step 4 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step >= 4
                    ? 'maroon-gradient-bg text-gold-300 border-2 border-gold-400 shadow-md'
                    : 'bg-cream-100 text-gray-400 border border-cream-300'
                }`}
              >
                4
              </div>
              <span className="text-[10px] font-semibold text-maroon-900 hidden xs:inline">Confirm</span>
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
