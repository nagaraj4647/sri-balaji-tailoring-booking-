import { Booking } from './types';

/**
 * Server-side SMS notification to the business owner via Fast2SMS.
 *
 * IMPORTANT: This runs only AFTER the booking is successfully saved.
 * The API key lives in the FAST2SMS_API_KEY server env var and is never
 * exposed to the browser. SMS failure never affects the confirmed booking.
 */
export async function sendBookingNotificationSMS(booking: Booking): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const notifyNumber = (process.env.FAST2SMS_NOTIFY_NUMBER || '916379835744').replace(/\D/g, '');

  if (!apiKey) {
    console.warn('[Fast2SMS] FAST2SMS_API_KEY not set. Skipping SMS notification.');
    return false;
  }

  const message =
    `New Booking - Sri Balaji Tailoring\n` +
    `ID: ${booking.bookingId}\n` +
    `Name: ${booking.customerName}\n` +
    `Phone: ${booking.mobileNumber}\n` +
    `Service: ${booking.service}\n` +
    `Date: ${booking.date} ${booking.time}` +
    (booking.notes ? `\nNotes: ${booking.notes}` : '');

  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',
        message,
        language: 'english',
        flash: 0,
        numbers: notifyNumber,
      }),
    });

    const result: any = await response.json().catch(() => ({}));
    if (response.ok && result?.return === true) {
      console.log('[Fast2SMS] Booking notification SMS sent:', result?.request_id || 'ok');
      return true;
    }

    console.error('[Fast2SMS] SMS failed:', response.status, JSON.stringify(result));
    return false;
  } catch (error: any) {
    console.error('[Fast2SMS] Failed to send booking notification SMS:', error?.message || error);
    return false;
  }
}
