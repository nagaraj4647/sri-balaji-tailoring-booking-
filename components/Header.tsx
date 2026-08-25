'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { BUSINESS_NAME, BUSINESS_TAGLINE } from '@/lib/constants';

interface HeaderProps {
  showAdminLink?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showAdminLink = true }) => {
  return (
    <header className="w-full maroon-gradient-bg text-cream-50 border-b-2 border-gold-500/40 shadow-luxury py-3 px-4 sticky top-0 z-40">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        
        {/* Brand Identification with Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Sri Balaji Tailoring Centre Logo"
              width={96}
              height={96}
              className="w-full h-full object-contain drop-shadow-lg"
              priority
            />
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-2xl font-bold tracking-wider leading-none text-cream-50 group-hover:text-gold-300 transition-colors">
              {BUSINESS_NAME}
            </h1>
            <p className="text-[10px] sm:text-xs text-gold-400 font-medium tracking-wide mt-1 opacity-90">
              {BUSINESS_TAGLINE}
            </p>
          </div>
        </Link>

        {/* Admin Login Shortcut */}
        {showAdminLink && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-cream-200 hover:text-gold-300 bg-maroon-900/60 hover:bg-maroon-900 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-200 shadow-sm"
            title="Admin Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden xs:inline">Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
};
