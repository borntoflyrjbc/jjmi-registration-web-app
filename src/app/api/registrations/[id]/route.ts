import { NextRequest, NextResponse } from 'next/server';
import { getRegistrationByAppNumber, getRegistrationById } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID or Application Number required' }, { status: 400 });
    }

    let record = getRegistrationByAppNumber(id);
    if (!record) {
      record = getRegistrationById(id);
    }

    if (!record) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      registration: record,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

