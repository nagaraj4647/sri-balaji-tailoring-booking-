import { NextRequest, NextResponse } from 'next/server';
import { getShopSettings, updateShopSettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = await getShopSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { openingTime, closingTime, slotDurationMinutes, maxDailyBookings, blockedDates } = body;

    const updated = await updateShopSettings({
      ...(openingTime && { openingTime }),
      ...(closingTime && { closingTime }),
      ...(slotDurationMinutes && { slotDurationMinutes: Number(slotDurationMinutes) }),
      ...(maxDailyBookings !== undefined && { maxDailyBookings: Number(maxDailyBookings) }),
      ...(blockedDates && { blockedDates }),
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
