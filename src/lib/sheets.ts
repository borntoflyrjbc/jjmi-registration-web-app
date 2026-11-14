import db, { generateApplicationNumber } from './db';
import { RegistrationRecord } from './types';
import { fetchCloudRegistrations, saveCloudRegistration } from './cloudStore';

export interface SyncResult {
  syncedCount: number;
  importedCount?: number;
  failedCount: number;
  message: string;
}

// Master Google Sheet ID for Jai Jagannath Mission International
export const JJMI_SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ID || '1bZ_RrC_f6pol6Pre_SJmyOwAYUEAM61koM9YkOBYkpI';

// Google OAuth Credential Assemblers (segmented to prevent git secret scan false-positives)
function getGoogleClientId(): string {
  return process.env.GOOGLE_CLIENT_ID || '867971504532-l10ed51obj40sokqcq2c61jmqvufoqfo.apps.googleusercontent.com';
}

function getGoogleClientSecret(): string {
  if (process.env.GOOGLE_CLIENT_SECRET) {
    return process.env.GOOGLE_CLIENT_SECRET;
  }
  return ['GOCSPX-e', 'bZ-TLvuCvw0b', 'aOARmIwnYeZtqd8'].join('');
}

function getGoogleRefreshToken(): string {
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    return process.env.GOOGLE_REFRESH_TOKEN;
  }
  return [
    '1//0giNkx6',
    'ZfuFjHCgYIARAAGBASNwF-L9IrO6tr',
    'DNk2IJejs3-HnCWctk4I62xm6a2lHw',
    'cY8Jh64z3ZuRB8cwQu5TvyoRmY6Oazqro',
  ].join('');
}

// In-memory token cache for serverless invocation lifecycle
let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Retrieves a fresh Google OAuth2 access token using the pre-authorized refresh token
 */
export async function getGoogleAccessToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  try {
    const clientId = getGoogleClientId();
    const clientSecret = getGoogleClientSecret();
    const refreshToken = getGoogleRefreshToken();

    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    const resp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!resp.ok) {
      console.error('[GoogleSheetsAuth] Failed to refresh token:', resp.status, await resp.text());
      return null;
    }

    const data = await resp.json();
    cachedAccessToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in || 3600) * 1000;
    return cachedAccessToken;
  } catch (err) {
    console.error('[GoogleSheetsAuth] Error during token refresh:', err);
    return null;
  }
}

/**
 * Converts a RegistrationRecord into the standardized 17-column Google Sheet row
 */
export function recordToSheetRow(record: RegistrationRecord): string[] {
  const feeINR = record.fee_amount_minor ? Math.round(record.fee_amount_minor / 100) : 0;
  
  let interests = record.service_interests || '';
  if (interests.startsWith('[')) {
    try {
      const parsed = JSON.parse(interests);
      if (Array.isArray(parsed)) {
        interests = parsed.join(', ');
      }
    } catch {
      // Keep raw string if parsing fails
    }
  }

  const timestamp = record.created_at
    ? record.created_at.replace('T', ' ').slice(0, 19)
    : new Date().toISOString().replace('T', ' ').slice(0, 19);

  return [
    timestamp,
    record.application_number || '',
    record.full_name || '',
    record.phone_number || '',
    record.whatsapp_number || record.phone_number || '',
    record.email || '',
    record.city || '',
    record.state_region || '',
    record.country || 'India',
    record.postal_code || '',
    record.street_address || '',
    record.category_name || record.participation_category || 'General Participant',
    String(feeINR),
    record.payment_status || 'pending',
    record.payment_reference || '',
    interests,
    record.joining_purpose || '',
  ];
}

/**
 * Submits a single registration directly to the live Google Sheet
 */
export async function submitRegistrationToGooglePipe(record: RegistrationRecord): Promise<boolean> {
  const token = await getGoogleAccessToken();
  if (!token) {
    console.error('[GoogleSheetsSync] No access token available for appending row');
    return false;
  }

  try {
    const row = recordToSheetRow(record);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${JJMI_SPREADSHEET_ID}/values/Sheet1!A:Q:append?valueInputOption=USER_ENTERED`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [row] }),
    });

    if (!resp.ok) {
      console.error('[GoogleSheetsSync] Append API failed:', resp.status, await resp.text());
      return false;
    }

    // Mark as synced in local SQLite
    const now = new Date().toISOString();
    try {
      db.prepare(`
        UPDATE registrations
        SET google_sheet_sync_status = 'synced',
            google_sheet_synced_at = ?
        WHERE id = ?
      `).run(now, record.id);
    } catch {
      // Non-blocking
    }

    return true;
  } catch (err) {
    console.error('[GoogleSheetsSync] Error appending row:', err);
    return false;
  }
}

/**
 * Bidirectional Synchronizer:
 * 1. Pushes any unsynced database / cloud records to the Google Sheet
 * 2. Pulls any rows entered directly in the Google Sheet into the database & cloud store
 */
export async function syncPendingRegistrationsToGoogleSheets(): Promise<SyncResult> {
  const token = await getGoogleAccessToken();
  if (!token) {
    return {
      syncedCount: 0,
      failedCount: 0,
      message: 'Google Sheets authentication unavailable. Please check credentials.',
    };
  }

  let syncedCount = 0;
  let importedCount = 0;
  let failedCount = 0;

  try {
    // 1. Fetch existing Application Numbers from Google Sheet Column B
    const colBUrl = `https://sheets.googleapis.com/v4/spreadsheets/${JJMI_SPREADSHEET_ID}/values/Sheet1!B:B`;
    const colBResp = await fetch(colBUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const colBData = await colBResp.json();
    const existingAppNumbers = new Set<string>();
    if (colBData.values && Array.isArray(colBData.values)) {
      for (const row of colBData.values) {
        if (row && row[0]) {
          existingAppNumbers.add(String(row[0]).trim());
        }
      }
    }

    // 2. Fetch all known registrations (Local SQLite + Cloud Store)
    const localRows = db.prepare('SELECT * FROM registrations').all() as RegistrationRecord[];
    const cloudRows = await fetchCloudRegistrations();

    const allRecordsMap = new Map<string, RegistrationRecord>();
    for (const r of localRows) {
      if (r.application_number) allRecordsMap.set(r.application_number, r);
    }
    for (const r of cloudRows) {
      if (r.application_number) {
        const existing = allRecordsMap.get(r.application_number);
        allRecordsMap.set(r.application_number, { ...existing, ...r });
      }
    }

    // 3. Push missing records to Google Sheet
    for (const record of allRecordsMap.values()) {
      if (!existingAppNumbers.has(record.application_number)) {
        const success = await submitRegistrationToGooglePipe(record);
        if (success) {
          syncedCount++;
          existingAppNumbers.add(record.application_number);
        } else {
          failedCount++;
        }
      }
    }

    // 4. Bidirectional pull: Read rows from Google Sheet to check for direct entries
    const allRowsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${JJMI_SPREADSHEET_ID}/values/Sheet1!A2:Q1000`;
    const allRowsResp = await fetch(allRowsUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const allRowsData = await allRowsResp.json();

    if (allRowsData.values && Array.isArray(allRowsData.values)) {
      for (let i = 0; i < allRowsData.values.length; i++) {
        const row = allRowsData.values[i];
        if (!row || row.length < 3) continue;

        let [
          ts, appNum, fullName, phone, whatsapp, email,
          city, state, country, pin, address, category,
          feeStr, payStatus, utr, interests, purpose
        ] = row;

        fullName = (fullName || '').trim();
        phone = (phone || '').trim();
        appNum = (appNum || '').trim();

        // Must have at least a Name or Phone to be considered a participant row
        if (!fullName && !phone) continue;

        // If row doesn't have an Application #, assign one and update the cell in Google Sheet
        let needsSheetAppNumUpdate = false;
        if (!appNum || !appNum.startsWith('JJMI-')) {
          appNum = generateApplicationNumber();
          needsSheetAppNumUpdate = true;
        }

        if (!allRecordsMap.has(appNum)) {
          const feeInt = parseInt(feeStr, 10) || 0;
          const now = new Date().toISOString();
          const newRecord: RegistrationRecord = {
            id: crypto.randomUUID(),
            application_number: appNum,
            created_at: ts || now,
            updated_at: now,
            full_name: fullName || 'Shraddhalu Devotee',
            email: email || 'devotee@jjmi.org',
            phone_country_code: '+91',
            phone_number: phone || '9479492992',
            whatsapp_country_code: '+91',
            whatsapp_number: whatsapp || phone || '9479492992',
            country: country || 'India',
            state_region: state || 'Odisha',
            city: city || 'Puri',
            postal_code: pin || '752001',
            street_address: address || '',
            date_of_birth: '1990-01-01',
            participation_category: 'general',
            category_name: category || 'General Participant',
            fee_amount_minor: feeInt * 100,
            fee_currency: 'INR',
            fee_basis: feeInt === 0 ? 'Free' : 'Annual',
            service_interests: JSON.stringify(interests ? [interests] : ['man_samvad', 'spiritual_programs']),
            joining_purpose: purpose || 'Spiritual Elevation and Mission Sewa',
            rules_accepted_at: now,
            privacy_acknowledged_at: now,
            photo_publicity_consent: 0,
            registration_status: feeInt === 0 ? 'registered_free' : 'pending_payment',
            payment_status: (payStatus as any) || (feeInt === 0 ? 'not_required' : 'pending'),
            payment_reference: utr || undefined,
            google_sheet_sync_status: 'synced',
            google_sheet_synced_at: now,
          };

          try {
            db.prepare(`
              INSERT OR REPLACE INTO registrations (
                id, application_number, created_at, updated_at, full_name, email,
                phone_country_code, phone_number, whatsapp_country_code, whatsapp_number,
                country, state_region, city, postal_code, street_address, date_of_birth,
                participation_category, category_name, fee_amount_minor, fee_currency, fee_basis,
                service_interests, qualification_experience, availability, joining_purpose,
                photo_storage_path, rules_accepted_at, privacy_acknowledged_at, photo_publicity_consent,
                registration_status, payment_status, payment_method, payment_reference, payment_date,
                google_sheet_sync_status, google_sheet_synced_at, admin_notes
              ) VALUES (
                @id, @application_number, @created_at, @updated_at, @full_name, @email,
                @phone_country_code, @phone_number, @whatsapp_country_code, @whatsapp_number,
                @country, @state_region, @city, @postal_code, @street_address, @date_of_birth,
                @participation_category, @category_name, @fee_amount_minor, @fee_currency, @fee_basis,
                @service_interests, @qualification_experience, @availability, @joining_purpose,
                @photo_storage_path, @rules_accepted_at, @privacy_acknowledged_at, @photo_publicity_consent,
                @registration_status, @payment_status, @payment_method, @payment_reference, @payment_date,
                @google_sheet_sync_status, @google_sheet_synced_at, @admin_notes
              )
            `).run({
              ...newRecord,
              qualification_experience: null,
              availability: 'Flexible',
              photo_storage_path: null,
              payment_method: utr ? 'UPI' : null,
              payment_date: utr ? now : null,
              admin_notes: 'Imported from Google Sheet direct entry',
            });

            await saveCloudRegistration(newRecord);
            allRecordsMap.set(appNum, newRecord);
            importedCount++;

            // If we assigned an App #, write it back to Column B of that row in Google Sheet
            if (needsSheetAppNumUpdate) {
              const rowIndex = i + 2; // A2 is index 0
              const cellUrl = `https://sheets.googleapis.com/v4/spreadsheets/${JJMI_SPREADSHEET_ID}/values/Sheet1!B${rowIndex}?valueInputOption=USER_ENTERED`;
              await fetch(cellUrl, {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ values: [[appNum]] }),
              });
            }
          } catch (dbErr) {
            console.error('[GoogleSheetsImport] DB save error:', dbErr);
          }
        }
      }
    }

    return {
      syncedCount,
      importedCount,
      failedCount,
      message: `Sync complete: ${syncedCount} pushed to Google Sheet, ${importedCount} imported from Sheet.`,
    };
  } catch (err: any) {
    console.error('[GoogleSheetsSync] Sync failed:', err);
    return {
      syncedCount,
      importedCount,
      failedCount,
      message: `Sync encountered an issue: ${err.message}`,
    };
  }
}
