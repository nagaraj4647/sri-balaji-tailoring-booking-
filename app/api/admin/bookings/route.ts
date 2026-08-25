import { NextRequest, NextResponse } from 'next/server';
import { rescheduleBooking, updateBookingStatus } from '@/lib/db';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, bookingId, status, newDate, newTime } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    if (action === 'update_status') {
      if (!status || !['Confirmed', 'Completed', 'Cancelled'].includes(status)) {
        return NextResponse.json({ error: 'Invalid booking status' }, { status: 400 });
      }
      const updated = await updateBookingStatus(bookingId, status);
      return NextResponse.json({ success: true, booking: updated });
    }

    if (action === 'reschedule') {
      if (!newDate || !newTime) {
        return NextResponse.json({ error: 'New date and time are required for rescheduling' }, { status: 400 });
      }
      const rescheduled = await rescheduleBooking(bookingId, newDate, newTime);
      return NextResponse.json({ success: true, booking: rescheduled });
    }

    return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 400 }
    );
  }
}
