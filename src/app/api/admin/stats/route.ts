import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/db';

export async function GET() {
  try {
    const rawStats = getAdminStats();

    const stats = {
      ...rawStats,
      total: rawStats.total,
      verified: rawStats.paid + rawStats.confirmed,
      under_review: rawStats.underReview,
      pending: rawStats.pendingPayment,
      total_revenue: rawStats.totalCollectedINR,
    };

    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
