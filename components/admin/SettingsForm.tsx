'use client';

import React, { useState } from 'react';
import { ShopSettings } from '@/lib/types';
import { Settings, Save, Clock, Lock, CalendarX, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsFormProps {
  settings: ShopSettings;
  onSave: () => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  onSave,
}) => {
  const [openingTime, setOpeningTime] = useState(settings.openingTime || '10:00 AM');
  const [closingTime, setClosingTime] = useState(settings.closingTime || '08:00 PM');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(settings.slotDurationMinutes || 60);
  const [maxDailyBookings, setMaxDailyBookings] = useState(settings.maxDailyBookings || 10);
  const [blockedDates, setBlockedDates] = useState<string[]>(settings.blockedDates || []);
  const [newBlockDate, setNewBlockDate] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddBlockedDate = () => {
    if (!newBlockDate) return;
    if (blockedDates.includes(newBlockDate)) {
      setErrorMsg('This date is already in the blocked list.');
      return;
    }
    setBlockedDates([...blockedDates, newBlockDate]);
    setNewBlockDate('');
  };

  const handleRemoveBlockedDate = (dateStr: string) => {
    setBlockedDates(blockedDates.filter((d) => d !== dateStr));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          openingTime,
          closingTime,
          slotDurationMinutes: Number(slotDurationMinutes),
          maxDailyBookings: Number(maxDailyBookings),
          blockedDates,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update shop settings.');
      }

      setSuccessMsg('Shop settings & daily limit updated successfully!');
      onSave();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-300 shadow-luxury p-6 space-y-6">
      
      <div className="flex items-center justify-between border-b border-cream-200 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-maroon-950 flex items-center gap-2">
            <Settings className="w-6 h-6 text-gold-600" />
            Slot & Capacity Management
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Configure opening hours, slot durations, daily limits, and closed shop dates.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Slot Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Opening Time */}
          <div>
            <label className="block text-xs font-bold text-maroon-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-600" />
              Opening Time
            </label>
            <input
              type="text"
              required
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              placeholder="e.g. 10:00 AM"
              className="w-full p-3 rounded-xl border border-cream-300 text-sm font-medium bg-cream-50/50"
            />
          </div>

          {/* Closing Time */}
          <div>
            <label className="block text-xs font-bold text-maroon-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-600" />
              Closing Time
            </label>
            <input
              type="text"
              required
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              placeholder="e.g. 08:00 PM"
              className="w-full p-3 rounded-xl border border-cream-300 text-sm font-medium bg-cream-50/50"
            />
          </div>

          {/* Slot Duration */}
          <div>
            <label className="block text-xs font-bold text-maroon-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-600" />
              Slot Duration (Minutes)
            </label>
            <select
              value={slotDurationMinutes}
              onChange={(e) => setSlotDurationMinutes(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-cream-300 text-sm font-medium bg-cream-50/50"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (1 Hour)</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>

          {/* Maximum Daily Bookings */}
          <div>
            <label className="block text-xs font-bold text-maroon-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-600" />
              Maximum Daily Customers (Capacity)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              required
              value={maxDailyBookings}
              onChange={(e) => setMaxDailyBookings(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-cream-300 text-sm font-bold text-maroon-900 bg-gold-500/10"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Limits confirmed appointments per day. Shows &quot;Booking Full&quot; after this limit is reached.
            </p>
          </div>
        </div>

        {/* Blocked Dates Section */}
        <div className="border-t border-cream-200 pt-5 space-y-3">
          <h3 className="font-serif text-lg font-bold text-maroon-950 flex items-center gap-2">
            <CalendarX className="w-5 h-5 text-red-600" />
            Block Shop Closed Dates
          </h3>
          <p className="text-xs text-gray-600">
            Block specific dates when the tailor shop is closed for holidays or maintenance.
          </p>

          <div className="flex items-center gap-2 max-w-md">
            <input
              type="date"
              value={newBlockDate}
              onChange={(e) => setNewBlockDate(e.target.value)}
              className="p-2.5 rounded-xl border border-cream-300 text-xs w-full"
            />
            <button
              type="button"
              onClick={handleAddBlockedDate}
              className="px-4 py-2.5 rounded-xl bg-maroon-900 text-cream-50 font-bold text-xs flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4 text-gold-400" />
              <span>Block Date</span>
            </button>
          </div>

          {/* List of blocked dates */}
          <div className="flex flex-wrap gap-2 pt-2">
            {blockedDates.length === 0 ? (
              <span className="text-xs text-gray-400 italic">No dates blocked currently.</span>
            ) : (
              blockedDates.map((dateStr) => (
                <span
                  key={dateStr}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-900 border border-red-200"
                >
                  <span>{dateStr}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(dateStr)}
                    className="hover:text-red-600 text-red-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="pt-4 border-t border-cream-200 text-right">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3.5 rounded-xl font-bold text-sm maroon-gradient-bg text-cream-50 border border-gold-400 shadow-luxury hover:brightness-110 active:scale-[0.99] transition-all inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-gold-400" />
            <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
