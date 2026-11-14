import { NextRequest, NextResponse } from 'next/server';
import { listRegistrations } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const paymentStatus = searchParams.get('paymentStatus') || undefined;
    const registrationStatus = searchParams.get('registrationStatus') || undefined;
    const limit = Number(searchParams.get('limit')) || 100;
    const offset = Number(searchParams.get('offset')) || 0;

    const { records, total } = listRegistrations({
      search,
      category,
      paymentStatus,
      registrationStatus,
      limit,
      offset,
    });

    // Normalize records with compatible field names for Admin UI
    const normalized = records.map((r: any) => ({
      ...r,
      mobile_number: r.phone_number,
      country_code: r.phone_country_code,
      category: r.category_name,
      calculated_fee: r.fee_amount_minor ? r.fee_amount_minor / 100 : (r.feeINR || 0),
      payment_utr: r.payment_reference || '',
    }));

    return NextResponse.json({
      success: true,
      records: normalized,
      registrations: normalized, // Provide both keys for 100% compatibility
      total,
      limit,
      offset,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
