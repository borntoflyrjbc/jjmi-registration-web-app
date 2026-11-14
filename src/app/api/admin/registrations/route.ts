import { NextRequest, NextResponse } from 'next/server';
import { listRegistrations } from '@/lib/db';
import { fetchCloudRegistrations } from '@/lib/cloudStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || undefined;
    const paymentStatus = searchParams.get('paymentStatus') || undefined;

    // 1. Fetch from local SQLite DB
    let localRecords: any[] = [];
    try {
      const res = listRegistrations({ limit: 500, offset: 0 });
      localRecords = res.records || [];
    } catch (e) {
      console.warn('[AdminRegistrations] Local DB read failed:', e);
    }

    // 2. Fetch from Permanent Cloud Store
    let cloudRecords: any[] = [];
    try {
      cloudRecords = await fetchCloudRegistrations();
    } catch (e) {
      console.warn('[AdminRegistrations] Cloud store read failed:', e);
    }

    // 3. Merge without duplicates (Keyed by application_number)
    const map = new Map<string, any>();

    // Add local records first
    for (const r of localRecords) {
      if (r.application_number) {
        map.set(r.application_number, r);
      }
    }

    // Overlay cloud records (authoritative for live Vercel deployments)
    for (const r of cloudRecords) {
      if (r.application_number) {
        const existing = map.get(r.application_number);
        map.set(r.application_number, { ...existing, ...r });
      }
    }

    let allRecords = Array.from(map.values());

    // Filter by paymentStatus if specified
    if (paymentStatus && paymentStatus !== 'all') {
      allRecords = allRecords.filter((r) => r.payment_status === paymentStatus);
    }

    // Filter by search query if specified (Name, App#, Email, Phone, City, State)
    if (search) {
      allRecords = allRecords.filter((r) => {
        return (
          r.full_name?.toLowerCase().includes(search) ||
          r.application_number?.toLowerCase().includes(search) ||
          r.email?.toLowerCase().includes(search) ||
          r.phone_number?.includes(search) ||
          r.city?.toLowerCase().includes(search) ||
          r.state_region?.toLowerCase().includes(search) ||
          r.payment_reference?.toLowerCase().includes(search)
        );
      });
    }

    // Sort by created_at descending (newest first)
    allRecords.sort((a, b) => {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return db - da;
    });

    // Normalize records for Admin UI
    const normalized = allRecords.map((r: any) => ({
      ...r,
      mobile_number: r.phone_number,
      country_code: r.phone_country_code || '+91',
      category: r.category_name,
      calculated_fee: r.fee_amount_minor ? r.fee_amount_minor / 100 : (r.feeINR || 0),
      payment_utr: r.payment_reference || '',
      city: r.city || '',
      state_region: r.state_region || '',
      country: r.country || 'India',
      postal_code: r.postal_code || '',
      street_address: r.street_address || '',
    }));

    return NextResponse.json({
      success: true,
      records: normalized,
      registrations: normalized,
      total: normalized.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
