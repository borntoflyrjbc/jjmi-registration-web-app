import { NextRequest, NextResponse } from 'next/server';
import { updateRegistrationStatus, getRegistrationById } from '@/lib/db';
import { updateCloudRegistrationStatus } from '@/lib/cloudStore';

export async function POST(req: NextRequest) {
  try {
    const { id, registrationStatus, paymentStatus, adminNotes } = await req.json();

    if (!id || (!paymentStatus && !registrationStatus)) {
      return NextResponse.json({ error: 'Missing required status update fields.' }, { status: 400 });
    }

    const regStatus = registrationStatus || (paymentStatus === 'verified' ? 'confirmed' : 'pending_payment');
    const payStatus = paymentStatus || 'pending';

    // 1. Update Cloud Store
    await updateCloudRegistrationStatus(id, payStatus, regStatus, adminNotes);

    // 2. Update Local SQLite DB
    try {
      updateRegistrationStatus(id, regStatus, payStatus, adminNotes);
    } catch (e) {
      // Non-blocking on serverless
    }

    const record = getRegistrationById(id);
    return NextResponse.json({ success: true, message: 'Status updated successfully', record });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
