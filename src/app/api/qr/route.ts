import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { UPI_CONFIG } from '@/lib/categories';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = searchParams.get('amount');
    const appNumber = searchParams.get('appNumber') || 'JJMI-Registration';
    const isDownload = searchParams.get('download') === '1';

    // Construct NPCI standard UPI URI
    let upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_CONFIG.vpa)}&pn=${encodeURIComponent(UPI_CONFIG.payeeName)}`;
    if (amount && Number(amount) > 0) {
      upiUrl += `&am=${encodeURIComponent(Number(amount).toFixed(2))}&cu=INR`;
    }
    upiUrl += `&tn=${encodeURIComponent(appNumber)}`;

    // Generate high-resolution PNG buffer
    const qrBuffer = await QRCode.toBuffer(upiUrl, {
      width: 1024,
      margin: 3,
      color: {
        dark: '#0a192f', // Deep Jagannath Navy
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
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

