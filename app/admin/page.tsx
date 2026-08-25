'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Booking, ShopSettings } from '@/lib/types';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { BookingTable } from '@/components/admin/BookingTable';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { BUSINESS_NAME } from '@/lib/constants';
import { Calendar, Settings, RefreshCw, ExternalLink, Loader2, LogOut, Lock } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings'>('bookings');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check admin authentication session cookie
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((c) => c.trim().startsWith('sbtc_admin_session='));

    if (!authCookie) {
      // Redirect to password login page
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      const [bookingsRes, settingsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/admin/settings'),
      ]);

      if (bookingsRes.ok) {
        const bData = await bookingsRes.json();
        setBookings(bData.bookings || []);
      }

      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        setSettings(sData.settings || null);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'sbtc_admin_session=; Max-Age=0; path=/;';
    router.push('/admin/login');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
        <p className="text-sm font-medium text-maroon-900">Verifying admin access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col text-gray-900">
      
      {/* Admin Top Navigation Bar */}
      <header className="maroon-gradient-bg text-cream-50 px-4 py-4 border-b-2 border-gold-400/40 shadow-luxury">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 shrink-0">
              <Image src="/logo.png" alt="Logo" width={56} height={56} className="w-full h-full object-contain drop-shadow-lg" priority />
            </div>
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-cream-50 flex items-center gap-2">
                <span>{BUSINESS_NAME}</span>
                <span className="text-[10px] font-mono bg-gold-500 text-maroon-950 px-2 py-0.5 rounded font-bold uppercase">
                  Admin Portal
                </span>
              </h1>
              <p className="text-[10px] text-gold-400">Manage Appointments & Daily Slot Capacity</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Customer Website Link */}
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cream-200 hover:text-gold-300 bg-maroon-900/60 hover:bg-maroon-900 border border-gold-500/20 flex items-center gap-1.5 transition-colors"
            >
              <span>Customer View</span>
              <ExternalLink className="w-3 h-3 text-gold-400" />
            </Link>

            {/* Logout / Lock Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-200 hover:text-white bg-red-950/60 hover:bg-red-900 border border-red-500/30 flex items-center gap-1.5 transition-colors"
              title="Lock Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 flex-1 w-full">
        
        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            <p className="text-sm font-medium text-maroon-900">Loading admin dashboard metrics...</p>
          </div>
        ) : (
          <>
            {/* Realtime Stats Overview */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                Performance & Booking Stats
              </h2>

              <button
                type="button"
                onClick={fetchData}
                disabled={refreshing}
                className="px-3 py-1.5 rounded-lg bg-white border border-cream-300 text-xs font-semibold text-maroon-900 hover:bg-cream-100 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-gold-600 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <StatsOverview
              bookings={bookings}
              maxDailyBookings={settings?.maxDailyBookings || 10}
            />

            {/* Admin Tabs */}
            <div className="flex items-center gap-2 border-b border-cream-300 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={`px-5 py-2.5 font-serif font-bold text-sm sm:text-base transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'bookings'
                    ? 'border-gold-500 text-maroon-950'
                    : 'border-transparent text-gray-500 hover:text-maroon-900'
                }`}
              >
                <Calendar className="w-4 h-4 text-gold-600" />
                <span>Booking Management</span>
                <span className="text-xs bg-maroon-900 text-gold-300 font-sans px-2 py-0.5 rounded-full font-bold">
                  {bookings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-5 py-2.5 font-serif font-bold text-sm sm:text-base transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'border-gold-500 text-maroon-950'
                    : 'border-transparent text-gray-500 hover:text-maroon-900'
                }`}
              >
                <Settings className="w-4 h-4 text-gold-600" />
                <span>Slot & Daily Limit Settings</span>
              </button>
            </div>

            {/* Tab Views */}
            <div>
              {activeTab === 'bookings' && (
                <BookingTable bookings={bookings} onRefresh={fetchData} />
              )}

              {activeTab === 'settings' && settings && (
                <SettingsForm settings={settings} onSave={fetchData} />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
