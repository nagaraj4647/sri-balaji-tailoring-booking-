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
    <header className="w-full maroon-gradient-bg text-cream-50 border-b-2 border-gold-500/40 shadow-luxury py-2.5 sm:py-3 px-3 sm:px-4 sticky top-0 z-40">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Identification with Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1">
          <div className="relative w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Sri Balaji Tailoring Centre Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-lg"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-xs xs:text-sm sm:text-xl font-bold tracking-wider leading-tight text-cream-50 group-hover:text-gold-300 transition-colors truncate">
              {BUSINESS_NAME}
            </h1>
            <p className="text-[10px] sm:text-xs text-gold-400 font-medium tracking-wide mt-0.5 opacity-95 leading-tight truncate">
              Ladies Tailoring & Custom Embroidery
            </p>
          </div>
        </Link>

        {/* Admin Login Shortcut */}
        {showAdminLink && (
          <Link
            href="/admin"
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs font-medium text-cream-200 hover:text-gold-300 bg-maroon-900/60 hover:bg-maroon-900 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-200 shadow-sm shrink-0 min-h-[44px] min-w-[44px]"
            title="Admin Portal"
          >
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span className="hidden xs:inline font-semibold">Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
};

