import { NextRequest, NextResponse } from 'next/server';
import { updateRegistrationStatus, getRegistrationById } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { id, registrationStatus, paymentStatus, adminNotes } = await req.json();

    if (!id || !registrationStatus || !paymentStatus) {
      return NextResponse.json({ error: 'Missing required status update fields.' }, { status: 400 });
    }

    const updated = updateRegistrationStatus(id, registrationStatus, paymentStatus, adminNotes);
    if (!updated) {
      return NextResponse.json({ error: 'Registration record not found or update failed.' }, { status: 404 });
    }

    const record = getRegistrationById(id);
    return NextResponse.json({ success: true, message: 'Status updated successfully', record });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

