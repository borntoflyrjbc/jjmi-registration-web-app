import { NextResponse } from 'next/server';
import { exportRegistrationsToCSV, listRegistrations } from '@/lib/db';
import { fetchCloudRegistrations } from '@/lib/cloudStore';

export async function GET() {
  try {
    let records: any[] = [];
    try {
      records = await fetchCloudRegistrations();
    } catch (e) {
      // fallback
    }

    if (!records || records.length === 0) {
      try {
        const local = listRegistrations({ limit: 1000, offset: 0 });
        records = local.records || [];
      } catch (e) {
        records = [];
      }
    }

    const headers = [
      'Application Number',
      'Submitted At',
      'Full Name',
      'Email',
      'Country Code',
      'Mobile',
      'WhatsApp',
      'Country',
      'State',
      'City',
      'Postal Code',
      'Address',
      'Category',
      'Fee (INR)',
      'Fee Basis',
      'Payment Status',
      'Payment Method',
      'Payment Reference (UTR)',
      'Registration Status',
      'Service Interests',
      'Joining Purpose',
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = "'" + str;
      }
      return `"${str}"`;
    };

    const rows = records.map((r: any) => [
      escapeCSV(r.application_number),
      escapeCSV(r.created_at),
      escapeCSV(r.full_name),
      escapeCSV(r.email),
      escapeCSV(r.phone_country_code || '+91'),
      escapeCSV(r.phone_number),
      escapeCSV(r.whatsapp_number || r.phone_number),
      escapeCSV(r.country || 'India'),
      escapeCSV(r.state_region || ''),
      escapeCSV(r.city || ''),
      escapeCSV(r.postal_code || ''),
      escapeCSV(r.street_address || ''),
      escapeCSV(r.category_name || r.participation_category),
      escapeCSV(r.fee_amount_minor ? r.fee_amount_minor / 100 : (r.feeINR || 0)),
      escapeCSV(r.fee_basis || 'Annual'),
      escapeCSV(r.payment_status),
      escapeCSV(r.payment_method || 'UPI'),
      escapeCSV(r.payment_reference || ''),
      escapeCSV(r.registration_status),
      escapeCSV(r.service_interests),
      escapeCSV(r.joining_purpose),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const filename = `JJMI_Devotees_Roster_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse('\uFEFF' + csvContent, {
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
