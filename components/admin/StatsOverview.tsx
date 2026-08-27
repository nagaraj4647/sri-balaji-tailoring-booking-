'use client';

import React from 'react';
import { Booking } from '@/lib/types';
import { CalendarCheck, Clock, CheckCircle, XCircle, Users } from 'lucide-react';

interface StatsOverviewProps {
  bookings: Booking[];
  maxDailyBookings: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  bookings,
  maxDailyBookings,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const todaysBookings = bookings.filter(
    (b) => b.date === todayStr && b.status !== 'Cancelled'
  );

  const upcomingBookings = bookings.filter((b) => {
    return b.date >= todayStr && b.status === 'Confirmed';
  });

  const completedBookings = bookings.filter((b) => b.status === 'Completed');
  const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled');

  const todayAvailableSlots = Math.max(0, maxDailyBookings - todaysBookings.length);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      
      {/* Today's Bookings Card */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-cream-300 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-maroon-800 mb-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Today</span>
          <div className="p-1.5 sm:p-2 rounded-lg bg-maroon-100 text-maroon-900 shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="font-bold tabular-nums text-2xl sm:text-3xl text-maroon-950">
            {todaysBookings.length}
          </span>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">Booked for today</p>
        </div>
      </div>

      {/* Available Slots Today */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-cream-300 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-gold-600 mb-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Available</span>
          <div className="p-1.5 sm:p-2 rounded-lg bg-gold-500/20 text-gold-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="font-bold tabular-nums text-2xl sm:text-3xl text-gold-700">
            {todayAvailableSlots}
          </span>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">Slots left (cap: {maxDailyBookings})</p>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-cream-300 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-blue-600 mb-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Upcoming</span>
          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50 text-blue-700 shrink-0">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="font-bold tabular-nums text-2xl sm:text-3xl text-blue-950">
            {upcomingBookings.length}
          </span>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">Confirmed future visits</p>
        </div>
      </div>

      {/* Completed Bookings */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-cream-300 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-emerald-600 mb-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Completed</span>
          <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="font-bold tabular-nums text-2xl sm:text-3xl text-emerald-950">
            {completedBookings.length}
          </span>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">Stitching finished</p>
        </div>
      </div>

      {/* Cancelled Bookings */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-cream-300 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-red-600 mb-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Cancelled</span>
          <div className="p-1.5 sm:p-2 rounded-lg bg-red-50 text-red-700 shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="font-bold tabular-nums text-2xl sm:text-3xl text-red-950">
            {cancelledBookings.length}
          </span>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">Cancelled slots</p>
        </div>
      </div>
    </div>
  );
};
