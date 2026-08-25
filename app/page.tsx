import { Header } from '@/components/Header';
import { BookingFlow } from '@/components/booking/BookingFlow';

export const metadata = {
  title: 'Book Appointment | Sri Balaji Tailoring Centre',
  description: 'Book your blouse stitching, embroidery work, and custom tailoring appointment at Sri Balaji Tailoring Centre in a few simple steps.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Header />
      <div className="flex-1">
        <BookingFlow />
      </div>
    </div>
  );
}
