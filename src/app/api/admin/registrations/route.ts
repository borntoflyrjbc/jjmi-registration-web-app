import { NextRequest, NextResponse } from 'next/server';
import { listRegistrations } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const paymentStatus = searchParams.get('paymentStatus') || undefined;
    const registrationStatus = searchParams.get('registrationStatus') || undefined;
    const limit = Number(searchParams.get('limit')) || 50;
    const offset = Number(searchParams.get('offset')) || 0;

    const { records, total } = listRegistrations({
      search,
      category,
      paymentStatus,
      registrationStatus,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      records,
      total,
      limit,
      offset,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

