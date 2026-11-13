import { NextRequest, NextResponse } from 'next/server';
import { updatePaymentReference, getRegistrationByAppNumber } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const appNum = body.applicationNumber || body.application_number;
    const ref = body.reference || body.payment_utr || body.utr;
    const method = body.method || body.payment_method || 'UPI';

    if (!appNum || !ref) {
      return NextResponse.json(
        { error: 'Application number and payment reference (UTR) are required.' },
        { status: 400 }
      );
    }

    const trimmedRef = String(ref).trim();
    if (trimmedRef.length < 3) {
      return NextResponse.json(
        { error: 'Please enter a valid UPI UTR or Transaction Reference.' },
        { status: 400 }
      );
    }

    const reg = getRegistrationByAppNumber(appNum);
    if (!reg) {
      return NextResponse.json({ error: 'Registration record not found.' }, { status: 404 });
    }

    const success = updatePaymentReference(appNum, trimmedRef, method);
    if (!success) {
      return NextResponse.json({ error: 'Failed to update payment status.' }, { status: 500 });
    }

    const updated = getRegistrationByAppNumber(appNum);

    return NextResponse.json({
      success: true,
      message: 'Payment reference submitted successfully. Our team will verify and confirm.',
      registration: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
