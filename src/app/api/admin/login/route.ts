import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL || 'borntoflyrj2026@gmail.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'purshottamtiwari';

    if (email?.trim().toLowerCase() === adminEmail.toLowerCase() && password === adminPass) {
      const response = NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        user: { email: adminEmail, role: 'admin' },
      });

      // Set auth cookie
      response.cookies.set('jjmi_admin_session', 'authenticated_admin', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

