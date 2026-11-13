import { NextRequest, NextResponse } from 'next/server';
import { updatePaymentReference, getRegistrationByAppNumber } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { applicationNumber, reference, method } = await req.json();

    if (!applicationNumber || !reference) {
      return NextResponse.json(
        { error: 'Application number and payment reference (UTR) are required.' },
        { status: 400 }
      );
    }

    const trimmedRef = reference.trim();
    if (trimmedRef.length < 6) {
      return NextResponse.json(
        { error: 'Please enter a valid 12-digit UPI UTR or Transaction Reference.' },
        { status: 400 }
      );
    }

    const reg = getRegistrationByAppNumber(applicationNumber);
    if (!reg) {
      return NextResponse.json({ error: 'Registration record not found.' }, { status: 404 });
    }

    const success = updatePaymentReference(applicationNumber, trimmedRef, method || 'UPI');
    if (!success) {
      return NextResponse.json({ error: 'Failed to update payment status.' }, { status: 500 });
    }

    const updated = getRegistrationByAppNumber(applicationNumber);

    return NextResponse.json({
      success: true,
      message: 'Payment reference submitted successfully. Our team will verify and confirm.',
      registration: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

