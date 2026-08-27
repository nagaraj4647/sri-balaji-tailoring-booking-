'use client';

import React, { useEffect, useState } from 'react';
import { TimeSlot } from '@/lib/types';
import { Clock, AlertTriangle, Lock, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { formatDatePretty } from '@/lib/utils';

interface StepTimeSlotsProps {
  selectedDate: string; // YYYY-MM-DD
  selectedTime: string;
  onSelectTime: (timeStr: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepTimeSlots: React.FC<StepTimeSlotsProps> = ({
  selectedDate,
  selectedTime,
  onSelectTime,
  onNext,
  onBack,
}) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFull, setIsFull] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchSlots() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const res = await fetch(`/api/slots?date=${selectedDate}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load time slots.');
        }

        if (isMounted) {
          setSlots(data.slots || []);
          setIsFull(data.isFull || false);
          setIsClosed(data.isClosed || false);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || 'Unable to fetch available time slots.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="text-center sm:text-left">
        <span className="inline-block text-[11px] font-semibold tracking-widest text-gold-600 uppercase mb-1">
          Step 3 of 4
        </span>
        <h2 className="font-serif text-xl sm:text-3xl font-bold text-maroon-950">
          Select Appointment Time
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Available slots for <span className="font-bold text-maroon-900">{formatDatePretty(selectedDate)}</span>
        </p>
      </div>

      {/* Loading State Spinner */}
      {loading && (
        <div className="py-10 sm:py-12 bg-white rounded-xl sm:rounded-2xl border border-cream-300 shadow-sm flex flex-col items-center justify-center text-center p-6 space-y-3">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
          <p className="text-xs sm:text-sm font-medium text-maroon-900">
            Checking real-time slot availability...
          </p>
        </div>
      )}

      {/* Error Banner */}
      {!loading && errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Booking Full Warning Card */}
      {!loading && isFull && (
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold font-serif text-base sm:text-lg">
            <Lock className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Booking Full for this Date</span>
          </div>
          <p className="text-xs text-amber-800/90 leading-relaxed">
            Our daily tailoring appointment limit for {formatDatePretty(selectedDate)} has been reached. Please click Back and choose another date.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-lg bg-amber-700 text-white font-semibold text-xs shadow hover:bg-amber-800 transition-colors min-h-[44px]"
            >
              ← Choose Another Date
            </button>
          </div>
        </div>
      )}

      {/* Shop Closed Warning */}
      {!loading && isClosed && !isFull && (
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gray-100 border border-gray-300 text-gray-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-gray-900 font-bold font-serif text-base sm:text-lg">
            <AlertTriangle className="w-5 h-5 text-gray-600 shrink-0" />
            <span>Shop Closed on Selected Date</span>
          </div>
          <p className="text-xs text-gray-600">
            Sri Balaji Tailoring Centre is closed on this date. Please choose an active working day.
          </p>
        </div>
      )}

      {/* Time Slots Grid */}
      {!loading && !isClosed && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {slots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              const isBooked = slot.booked;
              const isDisabled = !slot.available;

              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectTime(slot.time)}
                  className={`relative min-h-[52px] p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 active:scale-[0.98] ${
                    isSelected
                      ? 'bg-maroon-900 text-cream-50 border-gold-400 ring-2 ring-gold-400/50 shadow-luxury'
                      : isBooked
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-85'
                      : isDisabled
                      ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-maroon-950 border-cream-300 hover:border-gold-400 hover:bg-gold-500/10 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-base font-serif">
                    <Clock
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected
                          ? 'text-gold-400'
                          : isBooked
                          ? 'text-gray-400'
                          : 'text-maroon-800'
                      }`}
                    />
                    <span>{slot.time}</span>
                  </div>

                  {/* Status Badges */}
                  {isBooked ? (
                    <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-red-600 uppercase px-1.5 py-0.5 rounded-full bg-red-100/80 border border-red-200 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 shrink-0" />
                      Booked
                    </span>
                  ) : slot.reason === 'past' ? (
                    <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase">Passed</span>
                  ) : isSelected ? (
                    <span className="text-[9px] sm:text-[10px] font-bold text-gold-300 uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                      Selected
                    </span>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] text-emerald-700 font-medium">Available</span>
                  )}
                </button>
              );
            })}
          </div>

          {!isFull && slots.length === 0 && (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
              No time slots available for this date.
            </p>
          )}
        </div>
      )}

      {/* Selected Time Box */}
      {selectedTime && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-gold-500/10 border border-gold-400/40 text-maroon-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold-500/20 flex items-center justify-center text-gold-700 font-bold shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] text-gray-600 font-medium">Selected Time Slot</p>
              <p className="font-serif font-bold text-sm sm:text-base text-maroon-900">
                {selectedTime}
              </p>
            </div>
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-200">
            Available
          </span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 min-h-[48px] py-3.5 px-3 rounded-xl font-bold text-xs sm:text-sm bg-white text-maroon-900 border border-cream-300 hover:bg-cream-100 active:scale-[0.99] transition-colors shadow-sm flex items-center justify-center"
        >
          ← Back
        </button>

        <button
          type="button"
          disabled={!selectedTime || isFull}
          onClick={onNext}
          className={`w-2/3 min-h-[48px] py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 shadow-luxury transition-all duration-200 ${
            selectedTime && !isFull
              ? 'maroon-gradient-bg text-cream-50 hover:brightness-110 active:scale-[0.99] border border-gold-500/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
          }`}
        >
          <span>Enter Details</span>
          <span className="text-gold-400 font-bold">→</span>
        </button>
      </div>
    </div>
  );
};
