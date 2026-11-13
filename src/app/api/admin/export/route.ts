import { NextResponse } from 'next/server';
import { exportRegistrationsToCSV } from '@/lib/db';

export async function GET() {
  try {
    const csvData = exportRegistrationsToCSV();
    const filename = `JJMI_Registrations_Export_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

