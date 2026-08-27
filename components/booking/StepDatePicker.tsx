'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle, CalendarOff } from 'lucide-react';
import { formatDatePretty } from '@/lib/utils';

interface StepDatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  onNext: () => void;
  onBack: () => void;
  blockedDates?: string[];
  closedDaysOfWeek?: number[];
}

export const StepDatePicker: React.FC<StepDatePickerProps> = ({
  selectedDate,
  onSelectDate,
  onNext,
  onBack,
  blockedDates = [],
  closedDaysOfWeek = [0], // Default Sunday
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    return selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Calculate days in month
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="text-center sm:text-left">
        <span className="inline-block text-[11px] font-semibold tracking-widest text-gold-600 uppercase mb-1">
          Step 2 of 4
        </span>
        <h2 className="font-serif text-xl sm:text-3xl font-bold text-maroon-950">
          Select Appointment Date
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Choose a future date when you wish to visit our tailoring shop.
        </p>
      </div>

      {/* Modern Luxury Calendar Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-cream-300 shadow-luxury overflow-hidden w-full">
        {/* Calendar Header / Month Switcher */}
        <div className="maroon-gradient-bg text-cream-50 px-3.5 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 shrink-0" />
            <span className="font-serif text-base sm:text-xl font-bold tracking-wide truncate">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 min-w-[44px] min-h-[44px] rounded-lg text-cream-200 hover:text-gold-300 hover:bg-maroon-900 transition-colors flex items-center justify-center"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 min-w-[44px] min-h-[44px] rounded-lg text-cream-200 hover:text-gold-300 hover:bg-maroon-900 transition-colors flex items-center justify-center"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-cream-100/70 border-b border-cream-200 text-center py-2 text-[10px] sm:text-xs font-bold text-maroon-900">
          {daysOfWeek.map((day, idx) => (
            <div key={day} className={closedDaysOfWeek.includes(idx) ? 'text-maroon-500/70' : ''}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1.5 p-1.5 sm:p-4 text-center bg-cream-50/30">
          {/* Blank offset days */}
          {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-9 xs:h-10 sm:h-12" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateObj = new Date(year, month, dayNum);
            dateObj.setHours(0, 0, 0, 0);

            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const formattedDateStr = `${year}-${monthStr}-${dayStr}`;

            const isPast = dateObj < today;
            const isClosed =
              closedDaysOfWeek.includes(dateObj.getDay()) ||
              blockedDates.includes(formattedDateStr);

            const isSelected = selectedDate === formattedDateStr;
            const isToday = dateObj.getTime() === today.getTime();

            const isDisabled = isPast || isClosed;

            return (
              <button
                key={formattedDateStr}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelectDate(formattedDateStr)}
                className={`relative h-9 xs:h-10 sm:h-12 w-full rounded-md sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-maroon-900 text-gold-300 ring-2 ring-gold-400 shadow-luxury font-bold z-10'
                    : isPast
                    ? 'text-gray-300 cursor-not-allowed bg-transparent'
                    : isClosed
                    ? 'text-gray-400/50 cursor-not-allowed bg-gray-100/60 line-through'
                    : 'text-maroon-950 bg-white hover:bg-gold-500/20 hover:text-maroon-900 border border-cream-200 hover:border-gold-400'
                }`}
              >
                <span>{dayNum}</span>

                {/* Status Dot / Today indicator */}
                {isToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 absolute bottom-0.5" />
                )}
                {isClosed && (
                  <span className="text-[7px] sm:text-[9px] text-gray-400 absolute bottom-0.5 leading-none">Off</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="bg-cream-100/50 px-3 py-2.5 border-t border-cream-200 flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-gray-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-white border border-gold-400" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-maroon-900 border border-gold-400" />
            <span className="font-semibold text-maroon-900">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-gray-100 border border-gray-300" />
            <span>Closed</span>
          </div>
        </div>
      </div>

      {/* Selected Date Summary Display */}
      {selectedDate && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-gold-500/10 border border-gold-400/40 text-maroon-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold-500/20 flex items-center justify-center text-gold-700 shrink-0">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] text-gray-600 font-medium">Selected Date</p>
              <p className="font-serif font-bold text-sm sm:text-base text-maroon-900">
                {formatDatePretty(selectedDate)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 min-h-[48px] py-3.5 px-3 rounded-xl font-bold text-xs sm:text-sm bg-white text-maroon-900 border border-cream-300 hover:bg-cream-100 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center"
        >
          ← Back
        </button>

        <button
          type="button"
          disabled={!selectedDate}
          onClick={onNext}
          className={`w-2/3 min-h-[48px] py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 shadow-luxury transition-all duration-200 ${
            selectedDate
              ? 'maroon-gradient-bg text-cream-50 hover:brightness-110 active:scale-[0.99] border border-gold-500/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
          }`}
        >
          <span>Select Time Slot</span>
          <span className="text-gold-400 font-bold">→</span>
        </button>
      </div>
    </div>
  );
};
