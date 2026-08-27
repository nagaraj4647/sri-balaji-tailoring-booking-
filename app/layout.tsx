import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sri Balaji Tailoring Centre - Appointment Booking',
  description: 'Book tailored blouse stitching, embroidery, and custom designer outfits at Sri Balaji Tailoring Centre.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream-50 text-gray-900 font-sans antialiased selection:bg-gold-500 selection:text-maroon-950 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
