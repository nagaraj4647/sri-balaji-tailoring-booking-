import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_DEFAULT_CREDENTIALS } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: 'Please enter the admin password.' }, { status: 400 });
    }

    if (password.trim() === ADMIN_DEFAULT_CREDENTIALS.password) {
      const response = NextResponse.json({ success: true, message: 'Admin authenticated successfully' });
      // Set admin session cookie
      response.cookies.set('sbtc_admin_session', 'authenticated_token_sbtc', {
        httpOnly: false, // Accessible to client-side cookie check
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days session
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'Incorrect admin password. Please try again.' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
