import db from './db';
import { RegistrationRecord } from './types';

export interface SyncResult {
  syncedCount: number;
  failedCount: number;
  message: string;
}

// Official Live Google Form endpoint for Jai Jagannath Mission International
export const JJMI_GOOGLE_FORM_RESPONSE_URL =
  process.env.JJMI_GOOGLE_FORM_RESPONSE_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSdpFH_-B7koBlaUEfSRWQLlqpgvFJthxXnix9sHEphDIh9o-g/formResponse';

/**
 * Submits a single registration directly to the official Google Form & CRM Sheet pipeline
 */
export async function submitRegistrationToGooglePipe(record: RegistrationRecord): Promise<boolean> {
  let formSuccess = false;

  // 1. Dispatch to Official Google Form (Directly links to CRM Google Sheet 1J0SarYkXukFWbzoCrIMeJDviYCdvZ7-GOeI0t4KMZQo)
  try {
    const feeINR = record.fee_amount_minor ? Math.round(record.fee_amount_minor / 100) : 0;
    const fullIdentity = `${record.full_name} | ${record.application_number} | ${record.category_name} (₹${feeINR})`;
    const locationInfo = `${record.city}, ${record.state_region}${record.email ? ` | ${record.email}` : ''}`;
    const contactPhone = `${record.phone_country_code || '+91'} ${record.phone_number}`;

    const formParams = new URLSearchParams();
    formParams.append('entry.1521514084', fullIdentity);
    formParams.append('entry.100718320', contactPhone);
    formParams.append('entry.1141492986', locationInfo);
    formParams.append('entry.527376033', 'श्री जगन्नाथ दर्शन एवं आध्यात्मिक अनुभव');
    formParams.append('entry.419857382', 'रेल / बस द्वारा');
    formParams.append('entry.29063017', 'हाँ, मैं शिविर के नियमों एवं सहयोग राशि विवरण से सहमत हूँ तथा सम्मिलित होना चाहता/चाहती हूँ।');

    const formResp = await fetch(JJMI_GOOGLE_FORM_RESPONSE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      body: formParams.toString(),
    });

    if (formResp.ok || formResp.status === 200) {
      formSuccess = true;
    }
  } catch (formErr) {
    console.error('[JJMI Google Form Sync Error]:', formErr);
  }

  // 2. Dispatch to optional Webhook URL if configured
  const sheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (sheetWebhookUrl) {
    try {
      await fetch(sheetWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_number: record.application_number,
          full_name: record.full_name,
          phone_number: `${record.phone_country_code} ${record.phone_number}`,
          city: record.city,
          state_region: record.state_region,
          category_name: record.category_name,
          fee_inr: record.fee_amount_minor ? Math.round(record.fee_amount_minor / 100) : 0,
          fee_basis: record.fee_basis,
          email: record.email,
          registration_status: record.registration_status,
          created_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      });
    } catch (whErr) {
      console.error('[GoogleSheetWebhookSync Error]:', whErr);
    }
  }

  // If successful, update database status
  if (formSuccess) {
    const now = new Date().toISOString();
    try {
      db.prepare(`
        UPDATE registrations
        SET google_sheet_sync_status = 'synced',
            google_sheet_synced_at = ?
        WHERE id = ?
      `).run(now, record.id);
    } catch (dbErr) {
      // Non-blocking
    }
  }

  return formSuccess;
}

export async function syncPendingRegistrationsToGoogleSheets(): Promise<SyncResult> {
  const pendingRows = db
    .prepare("SELECT * FROM registrations WHERE google_sheet_sync_status = 'pending' LIMIT 50")
    .all() as RegistrationRecord[];

  if (pendingRows.length === 0) {
    return {
      syncedCount: 0,
      failedCount: 0,
      message: 'All registrations are already synchronized with Google Sheets.',
    };
  }

  let synced = 0;
  let failed = 0;

  for (const row of pendingRows) {
    const success = await submitRegistrationToGooglePipe(row);
    if (success) {
      synced++;
    } else {
      failed++;
    }
  }

  return {
    syncedCount: synced,
    failedCount: failed,
    message: `Successfully synchronized ${synced} record(s) to Dr. Purshottam Tiwari's Google Sheet CRM.`,
  };
}
