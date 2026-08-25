'use client';

import React, { useState } from 'react';
import { Booking, BookingStatus } from '@/lib/types';
import { formatDatePretty } from '@/lib/utils';
import { Search, MessageSquare, Phone, Calendar, Clock, CheckCircle2, XCircle, RotateCcw, Eye, X, Loader2 } from 'lucide-react';

interface BookingTableProps {
  bookings: Booking[];
  onRefresh: () => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');
  
  // Reschedule Modal State
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [updating, setUpdating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Detail Modal State
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.mobileNumber.includes(searchTerm) ||
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          bookingId,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update booking status.');
      }

      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking || !newDate || !newTime) return;

    setUpdating(true);
    setModalError(null);

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reschedule',
          bookingId: rescheduleBooking.bookingId,
          newDate,
          newTime,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Reschedule failed.');
      }

      setRescheduleBooking(null);
      onRefresh();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-cream-300 shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Name, Phone, ID..."
            className="w-full pl-9 pr-4 py-2 bg-cream-50 rounded-xl border border-cream-300 text-xs font-medium focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-cream-100/70 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(['All', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-maroon-900 text-gold-300 shadow-sm'
                  : 'text-gray-600 hover:text-maroon-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Desktop Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-cream-300 shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="maroon-gradient-bg text-cream-50 font-serif text-sm">
                <th className="py-3.5 px-4 font-semibold">Booking ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Service</th>
                <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                    No bookings found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.bookingId} className="hover:bg-cream-50/60 transition-colors">
                    
                    {/* Booking ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-maroon-950">
                      {b.bookingId}
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 text-sm">{b.customerName}</div>
                      <div className="flex items-center gap-2 text-gray-500 text-[11px] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gold-600" />
                          {b.mobileNumber}
                        </span>
                        <a
                          href={`https://wa.me/91${b.whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 font-semibold"
                          title="WhatsApp Chat"
                        >
                          [WA]
                        </a>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4 font-serif font-semibold text-sm text-maroon-900">
                      {b.service}
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">
                        {formatDatePretty(b.date)}
                      </div>
                      <div className="text-[11px] font-bold text-gold-700 bg-gold-500/10 px-2 py-0.5 rounded w-max mt-0.5">
                        {b.time}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>

                    {/* Admin Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setViewBooking(b)}
                          className="p-1.5 rounded-lg bg-cream-100 text-gray-700 hover:bg-gold-500/20 hover:text-maroon-900 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Mark Completed */}
                        {b.status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(b.bookingId, 'Completed')}
                            className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                            title="Mark Completed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Reschedule */}
                        <button
                          type="button"
                          onClick={() => {
                            setRescheduleBooking(b);
                            setNewDate(b.date);
                            setNewTime(b.time);
                          }}
                          className="p-1.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                          title="Reschedule"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Cancel */}
                        {b.status !== 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Cancel booking ${b.bookingId} for ${b.customerName}?`)) {
                                handleUpdateStatus(b.bookingId, 'Cancelled');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleBooking && (
        <div className="fixed inset-0 bg-maroon-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-gold-400 shadow-luxury space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-maroon-950">
                Reschedule Appointment
              </h3>
              <button
                type="button"
                onClick={() => setRescheduleBooking(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Rescheduling for <span className="font-bold">{rescheduleBooking.customerName}</span> ({rescheduleBooking.bookingId})
            </p>

            {modalError && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg">
                {modalError}
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-cream-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  New Time Slot
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-cream-300 text-sm"
                >
                  {[
                    '10:00 AM',
                    '11:00 AM',
                    '12:00 PM',
                    '01:00 PM',
                    '02:00 PM',
                    '03:00 PM',
                    '04:00 PM',
                    '05:00 PM',
                    '06:00 PM',
                    '07:00 PM',
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold maroon-gradient-bg text-cream-50 border border-gold-400"
                >
                  {updating ? 'Updating...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {viewBooking && (
        <div className="fixed inset-0 bg-maroon-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-cream-300 shadow-luxury space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-maroon-950">
                Booking #{viewBooking.bookingId}
              </h3>
              <button
                type="button"
                onClick={() => setViewBooking(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p><span className="font-bold">Customer:</span> {viewBooking.customerName}</p>
              <p><span className="font-bold">Mobile:</span> {viewBooking.mobileNumber}</p>
              <p><span className="font-bold">WhatsApp:</span> {viewBooking.whatsappNumber}</p>
              <p><span className="font-bold">Service:</span> {viewBooking.service}</p>
              <p><span className="font-bold">Date:</span> {formatDatePretty(viewBooking.date)}</p>
              <p><span className="font-bold">Time:</span> {viewBooking.time}</p>
              <p><span className="font-bold">Status:</span> {viewBooking.status}</p>
              <p><span className="font-bold">Notes:</span> {viewBooking.notes || 'None'}</p>
              <p><span className="font-bold">Created At:</span> {new Date(viewBooking.createdAt).toLocaleString()}</p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setViewBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-maroon-900 text-cream-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
