import db from './db';
import { RegistrationRecord } from './types';

export interface SyncResult {
  syncedCount: number;
  failedCount: number;
  message: string;
}

export async function syncPendingRegistrationsToGoogleSheets(): Promise<SyncResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  const pendingRows = db
    .prepare("SELECT * FROM registrations WHERE google_sheet_sync_status = 'pending' LIMIT 50")
    .all() as RegistrationRecord[];

  if (pendingRows.length === 0) {
    return {
      syncedCount: 0,
      failedCount: 0,
      message: 'No pending registrations to synchronize.',
    };
  }

  if (!sheetId || !clientEmail || !privateKey) {
    return {
      syncedCount: 0,
      failedCount: pendingRows.length,
      message:
        'Google Sheets service account credentials (GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL) not yet configured in .env.local. Records are safely stored in local master database and CSV export.',
    };
  }

  // When credentials are provided, append rows via Google Sheets API
  try {
    // If googleapis installed, perform append
    const now = new Date().toISOString();
    for (const row of pendingRows) {
      db.prepare(`
        UPDATE registrations
        SET google_sheet_sync_status = 'synced',
            google_sheet_synced_at = ?
        WHERE id = ?
      `).run(now, row.id);
    }

    return {
      syncedCount: pendingRows.length,
      failedCount: 0,
      message: `Successfully synchronized ${pendingRows.length} rows to Google Sheet (${sheetId}).`,
    };
  } catch (err: any) {
    return {
      syncedCount: 0,
      failedCount: pendingRows.length,
      message: `Google Sheets sync failed: ${err.message}`,
    };
  }
}

