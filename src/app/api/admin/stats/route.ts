import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/db';
import { fetchCloudRegistrations } from '@/lib/cloudStore';

export async function GET() {
  try {
    const cloudRecords = await fetchCloudRegistrations();
    if (cloudRecords && cloudRecords.length > 0) {
      const total = cloudRecords.length;
      let verified = 0;
      let under_review = 0;
      let pending = 0;
      let total_revenue = 0;

      for (const r of cloudRecords) {
        const payStatus = String(r.payment_status || '');
        const regStatus = String(r.registration_status || '');

        if (payStatus === 'verified' || payStatus === 'paid' || regStatus === 'confirmed') {
          verified++;
          total_revenue += r.fee_amount_minor ? r.fee_amount_minor / 100 : 0;
        } else if (payStatus === 'under_review' || regStatus === 'under_review') {
          under_review++;
        } else {
          pending++;
        }
      }

      return NextResponse.json({
        success: true,
        stats: {
          total,
          verified,
          under_review,
          pending,
          total_revenue,
        },
      });
    }

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
