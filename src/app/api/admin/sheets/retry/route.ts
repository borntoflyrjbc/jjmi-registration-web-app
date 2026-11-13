import { NextResponse } from 'next/server';
import { syncPendingRegistrationsToGoogleSheets } from '@/lib/sheets';

export async function POST() {
  try {
    const result = await syncPendingRegistrationsToGoogleSheets();
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

