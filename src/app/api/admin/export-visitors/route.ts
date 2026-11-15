import { NextRequest, NextResponse } from 'next/server';
import { exportVisitorsToCSV } from '@/lib/db';
import { fetchCloudVisitors } from '@/lib/cloudStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let cloudVisitors: any[] = [];
    try {
      cloudVisitors = await fetchCloudVisitors();
    } catch (e) {
      console.warn('[ExportVisitors] Cloud visitors fetch error:', e);
    }

    const csvContent = exportVisitorsToCSV(cloudVisitors);
    const dateStr = new Date().toISOString().slice(0, 10);

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="jjmi_visitors_${dateStr}.csv"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err: any) {
    console.error('[ExportVisitors] Error generating CSV:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
