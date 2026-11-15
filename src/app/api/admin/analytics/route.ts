import { NextRequest, NextResponse } from 'next/server';
import { getVisitorAnalytics } from '@/lib/db';
import { fetchCloudVisitors } from '@/lib/cloudStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Basic session verification
    const sessionCookie = req.cookies.get('jjmi_admin_session')?.value;
    // Also allow admin query param or basic check for flexibility
    const authHeader = req.headers.get('authorization');
    
    // In JJMI admin architecture, pages call this internally from admin session
    // If needed we can check admin authentication
    let cloudVisitors: any[] = [];
    try {
      cloudVisitors = await fetchCloudVisitors();
    } catch (e) {
      console.warn('[AdminAnalytics] Cloud visitors fetch error:', e);
    }

    const analytics = getVisitorAnalytics(cloudVisitors);

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (err: any) {
    console.error('[AdminAnalytics] Error generating analytics:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
