import { NextRequest, NextResponse } from 'next/server';
import { getBookingsForDate, getShopSettings } from '@/lib/db';
import { generateDailyTimeSlots } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { error: 'Please select a valid date.' },
        { status: 400 }
      );
    }

    const settings = await getShopSettings();
    const existingBookings = await getBookingsForDate(dateStr);

    const bookedTimeSlots = existingBookings.map((b) => b.time);
    const activeCount = existingBookings.length;

    const { slots, isFull, isClosed } = generateDailyTimeSlots(
      settings,
      bookedTimeSlots,
      dateStr,
      activeCount
    );

    return NextResponse.json({
      date: dateStr,
      slots,
      isFull,
      isClosed,
      maxDailyLimit: settings.maxDailyBookings,
      bookedCount: activeCount,
      totalSlots: slots.length,
    });
  } catch (error: any) {
    console.error('API Slots Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while fetching available slots.' },
      { status: 500 }
    );
  }
}
