import emailjs from '@emailjs/browser';
import { Booking } from './types';

export const isEmailJSConfigured = Boolean(
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
);

/**
 * Send a booking notification email to the business owner via EmailJS.
 *
 * IMPORTANT: This is called ONLY AFTER the booking is successfully saved in Firestore.
 * If EmailJS fails, the booking remains valid and confirmed in Firestore,
 * and the customer still sees the success screen.
 */
export async function sendBookingNotificationEmail(booking: Booking): Promise<boolean> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('[EmailJS] Configuration missing (SERVICE_ID, TEMPLATE_ID, or PUBLIC_KEY). Skipping email notification.');
    return false;
  }

  try {
    const templateParams = {
      to_email: 'sribalajitailoring7010@gmail.com',
      booking_id: booking.bookingId,
      customer_name: booking.customerName,
      mobile_number: booking.mobileNumber,
      service: booking.service,
      appointment_date: booking.date,
      appointment_time: booking.time,
      notes: booking.notes || 'No special notes',
      status: 'Confirmed',
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      {
        publicKey: publicKey,
      }
    );

    console.log('[EmailJS] Booking notification email sent successfully:', response.status, response.text);
    return true;
  } catch (error: any) {
    // Log the EmailJS error for debugging, but do NOT throw so the booking stays saved
    console.error('[EmailJS] Failed to send booking notification email:', error?.text || error?.message || error);
    return false;
  }
}
