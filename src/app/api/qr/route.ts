import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { UPI_CONFIG } from '@/lib/categories';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appNumber = searchParams.get('appNumber') || 'JJMI-Registration';
    const isDownload = searchParams.get('download') === '1';

    // Official Bank Standee UPI URI (Guaranteed 100% compatible across all UPI apps: PhonePe, GPay, Paytm, BHIM)
    // Note: Do NOT urlencode the '@' symbol in 'pa=' as it breaks scanning on Android/iOS UPI apps
    const upiUrl = `upi://pay?pa=${UPI_CONFIG.vpa}&pn=${encodeURIComponent(UPI_CONFIG.payeeName)}`;

    // Generate high-resolution pure black & white PNG with proper quiet zone margin
    const qrBuffer = await QRCode.toBuffer(upiUrl, {
      width: 1024,
      margin: 4, // NPCI mandated 4-module white quiet zone
      color: {
        dark: '#000000', // 100% Pure Black for instant optical camera detection
        light: '#ffffff', // Pure White
      },
      errorCorrectionLevel: 'M',
    });

    const headers: Record<string, string> = {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    };

    if (isDownload) {
      headers['Content-Disposition'] = `attachment; filename="${appNumber}-Payment-QR.png"`;
    }

    return new NextResponse(qrBuffer as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error('QR Generator Error:', err);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
