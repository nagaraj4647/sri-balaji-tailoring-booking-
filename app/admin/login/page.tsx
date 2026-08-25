'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { BUSINESS_NAME } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Incorrect password.');
      }

      // Successful login
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-3xl border-2 border-gold-400/60 shadow-luxury overflow-hidden">
        
        {/* Header with Large Logo */}
        <div className="maroon-gradient-bg p-6 text-center text-cream-50 space-y-3 border-b-2 border-gold-400/40">
          <div className="w-24 h-24 mx-auto drop-shadow-lg">
            <Image
              src="/logo.png"
              alt="Sri Balaji Tailoring Centre Logo"
              width={96}
              height={96}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide">
              {BUSINESS_NAME}
            </h1>
            <p className="text-[11px] text-gold-400 font-semibold tracking-wider uppercase mt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              Admin Portal
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-maroon-950 uppercase tracking-wider mb-2 text-center">
                Enter Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-600">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password..."
                  className="w-full pl-10 pr-4 py-3.5 bg-cream-50/70 rounded-xl border border-cream-300 text-base font-bold text-center text-maroon-950 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30 placeholder-gray-400 tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-luxury ${
                password
                  ? 'maroon-gradient-bg text-cream-50 hover:brightness-110 active:scale-[0.99] border border-gold-400'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 text-gold-400 animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
