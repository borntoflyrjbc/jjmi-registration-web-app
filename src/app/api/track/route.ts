import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { recordVisitorEvent, getISTDateString, getISTFormatted } from '@/lib/db';
import { saveCloudVisitor } from '@/lib/cloudStore';

export const dynamic = 'force-dynamic';

function getDeviceType(ua: string, width?: number): 'Mobile' | 'Desktop' | 'Tablet' {
  if (width && width <= 768) return 'Mobile';
  if (width && width > 768 && width <= 1024) return 'Tablet';
  const uaLower = ua.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(uaLower)) return 'Tablet';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(uaLower)) return 'Mobile';
  return 'Desktop';
}

function getBrowserInfo(ua: string): { browser: string; os: string } {
  const uaLower = ua.toLowerCase();
  let browser = 'Unknown';
  if (uaLower.includes('edg/')) browser = 'Microsoft Edge';
  else if (uaLower.includes('chrome/') || uaLower.includes('crios/')) browser = 'Google Chrome';
  else if (uaLower.includes('safari/') && !uaLower.includes('chrome')) browser = 'Apple Safari';
  else if (uaLower.includes('firefox/') || uaLower.includes('fxios/')) browser = 'Mozilla Firefox';
  else if (uaLower.includes('samsungbrowser/')) browser = 'Samsung Internet';
  else if (uaLower.includes('opera/') || uaLower.includes('opr/')) browser = 'Opera';

  let os = 'Unknown';
  if (uaLower.includes('windows')) os = 'Windows';
  else if (uaLower.includes('android')) os = 'Android';
  else if (uaLower.includes('iphone') || uaLower.includes('ipad') || uaLower.includes('ios')) os = 'iOS';
  else if (uaLower.includes('mac os') || uaLower.includes('macintosh')) os = 'macOS';
  else if (uaLower.includes('linux')) os = 'Linux';

  return { browser, os };
}

function getReferrerSource(referrer: string, pageUrl: string): string {
  const urlLower = (pageUrl + ' ' + referrer).toLowerCase();

  if (
    urlLower.includes('fbclid') ||
    urlLower.includes('utm_source=meta') ||
    urlLower.includes('utm_source=facebook') ||
    referrer.includes('facebook.com') ||
    referrer.includes('fb.me')
  ) {
    return 'Meta Ads (Facebook)';
  }
  if (
    urlLower.includes('utm_source=ig') ||
    urlLower.includes('utm_source=instagram') ||
    referrer.includes('instagram.com')
  ) {
    return 'Instagram (Meta)';
  }
  if (
    urlLower.includes('gclid') ||
    urlLower.includes('utm_source=google') ||
    referrer.includes('google.com') ||
    referrer.includes('google.co.in')
  ) {
    return 'Google (Search/Ads)';
  }
  if (
    urlLower.includes('utm_source=whatsapp') ||
    referrer.includes('whatsapp') ||
    referrer.includes('wa.me')
  ) {
    return 'WhatsApp Share';
  }
  if (referrer.includes('youtube.com') || referrer.includes('youtu.be')) {
    return 'YouTube';
  }
  if (referrer.includes('twitter.com') || referrer.includes('x.com') || referrer.includes('t.co')) {
    return 'X (Twitter)';
  }
  if (!referrer || referrer === 'direct' || referrer.trim() === '') {
    return 'Direct Link';
  }
  try {
    const host = new URL(referrer).hostname.replace('www.', '');
    return host;
  } catch {
    return 'Direct / Referral';
  }
}

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get('user-agent') || '';

    // 1. Basic bot & crawler detection
    const isBot =
      /bot|crawl|spider|slurp|facebookexternalhit|meta-externalagent|mediapartners-google|lighthouse|headlesschrome|pingdom|curl|wget|python|postman/i.test(
        ua
      );
    if (isBot) {
      return NextResponse.json({ success: true, ignored: 'bot' });
    }

    const body = await req.json().catch(() => ({}));
    const pageUrl = String(body.pageUrl || '/');

    // 2. Exclude Admin panel visits from public traffic stats
    if (pageUrl.startsWith('/admin') || pageUrl.includes('/admin/')) {
      return NextResponse.json({ success: true, ignored: 'admin' });
    }

    const visitorId = String(body.visitorId || 'v_anon_' + crypto.randomUUID().slice(0, 8));
    const referrer = String(body.referrer || '');
    const screenWidth = typeof body.screenWidth === 'number' ? body.screenWidth : undefined;

    // 3. Privacy-safe salted IP hash (never stores raw IP)
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const ipHash = crypto
      .createHash('sha256')
      .update(rawIp + '_jjmi_salt')
      .digest('hex')
      .slice(0, 16);

    const now = new Date();
    const visitedAt = now.toISOString();
    const dateIst = getISTDateString(now);
    const visitedAtIst = getISTFormatted(now);

    const deviceType = getDeviceType(ua, screenWidth);
    const { browser, os } = getBrowserInfo(ua);
    const referrerSource = getReferrerSource(referrer, pageUrl);

    let utmSource = '';
    let utmMedium = '';
    let utmCampaign = '';
    try {
      const parsedUrl = new URL(pageUrl, 'https://jjmi-registration-web-app.vercel.app');
      utmSource = parsedUrl.searchParams.get('utm_source') || '';
      utmMedium = parsedUrl.searchParams.get('utm_medium') || '';
      utmCampaign = parsedUrl.searchParams.get('utm_campaign') || '';
    } catch {}

    const eventData = {
      visitor_id: visitorId,
      visited_at: visitedAt,
      visited_at_ist: visitedAtIst,
      date_ist: dateIst,
      page_url: pageUrl,
      referrer,
      referrer_source: referrerSource,
      device_type: deviceType,
      browser,
      os,
      user_agent: ua.slice(0, 255),
      ip_hash: ipHash,
      utm_source: utmSource || undefined,
      utm_medium: utmMedium || undefined,
      utm_campaign: utmCampaign || undefined,
    };

    const savedEvent = recordVisitorEvent(eventData);

    // Asynchronously record into permanent cloud store (Gist)
    saveCloudVisitor(savedEvent).catch((err) => {
      console.warn('[Track] Cloud store async save error:', err);
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Track] Error tracking visitor:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
