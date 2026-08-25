import { Booking, BookingStatus, ShopSettings } from './types';
import { DEFAULT_SHOP_SETTINGS } from './constants';
import { generateBookingId } from './utils';
import { db, hasFirebaseConfig } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';

// Global server-side fallback store for seamless dev/fallback operation
declare global {
  var __sbtc_bookings_store: Booking[] | undefined;
  var __sbtc_settings_store: ShopSettings | undefined;
}

if (!globalThis.__sbtc_settings_store) {
  globalThis.__sbtc_settings_store = { ...DEFAULT_SHOP_SETTINGS };
}

if (!globalThis.__sbtc_bookings_store) {
  const today = new Date().toISOString().split('T')[0];
  globalThis.__sbtc_bookings_store = [
    {
      bookingId: 'SBTC-8F3K',
      customerName: 'Anitha Sharma',
      mobileNumber: '9876543210',
      whatsappNumber: '9876543210',
      service: 'Blouse Stitching',
      date: today,
      time: '11:00 AM',
      notes: 'Need neck piping design with gold thread accent.',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      bookingId: 'SBTC-9M2P',
      customerName: 'Priya Sundaram',
      mobileNumber: '9823456789',
      whatsappNumber: '9823456789',
      service: 'Embroidery Work',
      date: today,
      time: '02:00 PM',
      notes: 'Aari work on silk blouse.',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];
}

let bookingLockPromise = Promise.resolve();

export async function getShopSettings(): Promise<ShopSettings> {
  if (hasFirebaseConfig && db) {
    try {
      const docRef = doc(db, 'settings', 'config');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ShopSettings;
        return {
          ...DEFAULT_SHOP_SETTINGS,
          ...data,
        };
      }
    } catch (e) {
      console.error('Firestore getShopSettings Error:', e);
    }
  }
  return { ...globalThis.__sbtc_settings_store! };
}

export async function updateShopSettings(newSettings: Partial<ShopSettings>): Promise<ShopSettings> {
  const updated = {
    ...globalThis.__sbtc_settings_store!,
    ...newSettings,
  };
  globalThis.__sbtc_settings_store = updated;

  if (hasFirebaseConfig && db) {
    try {
      const docRef = doc(db, 'settings', 'config');
      await setDoc(docRef, updated, { merge: true });
    } catch (e) {
      console.error('Firestore updateShopSettings Error:', e);
    }
  }
  return updated;
}

export async function getBookingsForDate(dateStr: string): Promise<Booking[]> {
  if (hasFirebaseConfig && db) {
    try {
      const bookingsCol = collection(db, 'bookings');
      const q = query(
        bookingsCol,
        where('date', '==', dateStr),
        where('status', '!=', 'Cancelled')
      );
      const snapshot = await getDocs(q);
      const results: Booking[] = [];
      snapshot.forEach((doc) => {
        results.push(doc.data() as Booking);
      });
      return results;
    } catch (e) {
      console.error('Firestore getBookingsForDate Error:', e);
    }
  }
  const store = globalThis.__sbtc_bookings_store || [];
  return store.filter(
    (b) => b.date === dateStr && b.status !== 'Cancelled'
  );
}

export async function getAllBookings(): Promise<Booking[]> {
  if (hasFirebaseConfig && db) {
    try {
      const bookingsCol = collection(db, 'bookings');
      const snapshot = await getDocs(bookingsCol);
      const results: Booking[] = [];
      snapshot.forEach((doc) => {
        results.push(doc.data() as Booking);
      });
      return results.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (e) {
      console.error('Firestore getAllBookings Error:', e);
    }
  }
  const store = globalThis.__sbtc_bookings_store || [];
  return [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createBookingTransaction(data: {
  customerName: string;
  mobileNumber: string;
  whatsappNumber: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // "10:00 AM"
  notes?: string;
}): Promise<Booking> {
  return new Promise((resolve, reject) => {
    bookingLockPromise = bookingLockPromise.then(async () => {
      try {
        const settings = await getShopSettings();
        const existingBookings = await getBookingsForDate(data.date);

        // 1. Check if shop is closed on this date
        const dateObj = new Date(data.date + 'T00:00:00');
        const dayOfWeek = dateObj.getDay();
        if (
          settings.closedDaysOfWeek.includes(dayOfWeek) ||
          settings.blockedDates.includes(data.date)
        ) {
          throw new Error('The tailoring shop is closed on the selected date. Please choose another date.');
        }

        // 2. Check Daily Booking Capacity Limit
        if (existingBookings.length >= settings.maxDailyBookings) {
          throw new Error(`Today's booking limit (${settings.maxDailyBookings} customers) has been reached for this date.`);
        }

        // 3. Double Booking Check: Check if exact DATE + TIME slot is already reserved
        const isSlotBooked = existingBookings.some(
          (b) => b.time.trim().toUpperCase() === data.time.trim().toUpperCase()
        );

        if (isSlotBooked) {
          throw new Error('That slot has just been booked by another customer. Please choose another time.');
        }

        // Create booking object
        const newBooking: Booking = {
          bookingId: generateBookingId(),
          customerName: data.customerName.trim(),
          mobileNumber: data.mobileNumber.trim(),
          whatsappNumber: data.whatsappNumber.trim(),
          service: data.service,
          date: data.date,
          time: data.time,
          notes: data.notes?.trim() || '',
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
        };

        // Save to Firestore if connected
        if (hasFirebaseConfig && db) {
          try {
            const bookingDocRef = doc(db, 'bookings', newBooking.bookingId);
            const slotLockDocRef = doc(
              db,
              'slots',
              `${data.date}_${data.time.replace(/\s+/g, '')}`
            );

            await runTransaction(db, async (transaction) => {
              const slotSnap = await transaction.get(slotLockDocRef);
              if (slotSnap.exists()) {
                throw new Error('That slot has just been booked by another customer. Please choose another time.');
              }
              transaction.set(bookingDocRef, newBooking);
              transaction.set(slotLockDocRef, {
                bookingId: newBooking.bookingId,
                date: data.date,
                time: data.time,
                createdAt: Timestamp.now(),
              });
            });
          } catch (fsErr: any) {
            console.error('Firestore Booking Transaction Error:', fsErr);
            if (fsErr.message?.includes('booked')) {
              throw fsErr;
            }
          }
        }

        globalThis.__sbtc_bookings_store!.push(newBooking);
        resolve(newBooking);
      } catch (err: any) {
        reject(err);
      }
    });
  });
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<Booking> {
  const store = globalThis.__sbtc_bookings_store || [];
  const index = store.findIndex((b) => b.bookingId === bookingId);
  
  if (hasFirebaseConfig && db) {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status });
    } catch (e) {
      console.error('Firestore updateBookingStatus Error:', e);
    }
  }

  if (index !== -1) {
    store[index].status = status;
    return store[index];
  }

  return {
    bookingId,
    customerName: '',
    mobileNumber: '',
    whatsappNumber: '',
    service: '',
    date: '',
    time: '',
    status,
    createdAt: new Date().toISOString(),
  };
}

export async function rescheduleBooking(
  bookingId: string,
  newDate: string,
  newTime: string
): Promise<Booking> {
  const store = globalThis.__sbtc_bookings_store || [];
  const existingOnDate = await getBookingsForDate(newDate);

  const collision = existingOnDate.some(
    (b) => b.bookingId !== bookingId && b.time.trim().toUpperCase() === newTime.trim().toUpperCase()
  );

  if (collision) {
    throw new Error('The destination slot is already booked by another customer.');
  }

  if (hasFirebaseConfig && db) {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { date: newDate, time: newTime, status: 'Confirmed' });
    } catch (e) {
      console.error('Firestore rescheduleBooking Error:', e);
    }
  }

  const index = store.findIndex((b) => b.bookingId === bookingId);
  if (index !== -1) {
    store[index].date = newDate;
    store[index].time = newTime;
    store[index].status = 'Confirmed';
    return store[index];
  }

  return {
    bookingId,
    customerName: '',
    mobileNumber: '',
    whatsappNumber: '',
    service: '',
    date: newDate,
    time: newTime,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  if (hasFirebaseConfig && db) {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as Booking;
      }
    } catch (e) {
      console.error('Firestore getBookingById Error:', e);
    }
  }
  const store = globalThis.__sbtc_bookings_store || [];
  return store.find((b) => b.bookingId === bookingId) || null;
}
