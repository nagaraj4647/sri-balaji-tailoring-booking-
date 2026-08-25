import { NextRequest, NextResponse } from 'next/server';
import { createBookingTransaction, getAllBookings, getBookingById } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('bookingId');

    if (bookingId) {
      const booking = await getBookingById(bookingId);
      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      return NextResponse.json({ booking });
    }

    const bookings = await getAllBookings();
    return NextResponse.json({ bookings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, mobileNumber, whatsappNumber, service, date, time, notes } = body;

    // Server-side strict input validations
    if (!service) {
      return NextResponse.json(
        { error: 'Please select a tailoring service.' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'Please select a date.' },
        { status: 400 }
      );
    }

    if (!time) {
      return NextResponse.json(
        { error: 'Please select a time slot.' },
        { status: 400 }
      );
    }

    if (!customerName || customerName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name.' },
        { status: 400 }
      );
    }

    const cleanMobile = (mobileNumber || '').replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const finalWhatsapp = whatsappNumber
      ? whatsappNumber.replace(/\D/g, '')
      : cleanMobile;

    // Execute atomic server-side booking transaction
    const booking = await createBookingTransaction({
      customerName: customerName.trim(),
      mobileNumber: cleanMobile,
      whatsappNumber: finalWhatsapp,
      service,
      date,
      time,
      notes: notes || '',
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    console.error('Booking Creation Error:', error.message);

    const errorMessage = error.message || 'Something went wrong. Please try again.';
    
    // Status 409 Conflict for double booking, 422 for daily limit, 400 for bad input
    let status = 400;
    if (errorMessage.includes('booked by another customer')) {
      status = 409;
    } else if (errorMessage.includes('limit') || errorMessage.includes('capacity')) {
      status = 422;
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
