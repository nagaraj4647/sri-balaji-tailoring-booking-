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
import { Calendar, Settings, RefreshCw, ExternalLink, Loader2, LogOut, Lock, Menu, X, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings'>('bookings');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <header className="maroon-gradient-bg text-cream-50 px-3.5 sm:px-6 py-3 sm:py-4 border-b-2 border-gold-400/40 shadow-luxury sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2.5">
          
          {/* Logo & Compact Business Title */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 shrink-0">
              <Image
                src="/logo.png"
                alt="Sri Balaji Tailoring Centre Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-sm sm:text-xl font-bold tracking-wide text-cream-50 leading-tight truncate">
                  {BUSINESS_NAME}
                </h1>
                {/* Desktop Admin Portal Badge */}
                <span className="hidden sm:inline-flex text-[10px] font-mono bg-gold-500 text-maroon-950 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                  Admin Portal
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gold-400 font-medium tracking-wide truncate mt-0.5">
                Manage Appointments & Daily Slot Capacity
              </p>
            </div>
          </div>

          {/* Desktop Right Navigation (Hidden on Mobile) */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Customer Website Link */}
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cream-200 hover:text-gold-300 bg-maroon-900/60 hover:bg-maroon-900 border border-gold-500/20 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Customer View</span>
              <ExternalLink className="w-3 h-3 text-gold-400" />
            </Link>

            {/* Logout / Lock Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-200 hover:text-white bg-red-950/60 hover:bg-red-900 border border-red-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Lock Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button (Shown ONLY on Mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl text-cream-100 hover:text-gold-300 bg-maroon-900/80 hover:bg-maroon-900 border border-gold-500/30 focus:outline-none focus:ring-2 focus:ring-gold-400/40 transition-all shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gold-400" />
            ) : (
              <Menu className="w-5 h-5 text-gold-400" />
            )}
          </button>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-gold-500/30 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Admin Portal Status Indicator */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-maroon-950/70 border border-gold-500/20 text-xs">
              <span className="text-cream-200 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Dashboard Mode</span>
              </span>
              <span className="text-[10px] font-mono bg-gold-500 text-maroon-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Admin Portal
              </span>
            </div>

            {/* Customer View Link */}
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold text-cream-100 hover:text-gold-300 bg-maroon-900/80 hover:bg-maroon-900 border border-gold-500/30 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-gold-400" />
                <span>Customer View Website</span>
              </span>
              <span className="text-[10px] text-gold-400/80 font-mono">↗</span>
            </Link>

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold text-red-200 hover:text-white bg-red-950/80 hover:bg-red-900 border border-red-500/40 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout Admin Session</span>
              </span>
            </button>
          </div>
        )}
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
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mb-2">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-maroon-950">
                Performance & Booking Stats
              </h2>

              <button
                type="button"
                onClick={fetchData}
                disabled={refreshing}
                className="px-3 py-1.5 rounded-lg bg-white border border-cream-300 text-xs font-semibold text-maroon-900 hover:bg-cream-100 transition-colors flex items-center gap-1.5 shadow-sm min-h-[36px]"
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
