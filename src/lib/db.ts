import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { RegistrationRecord, AdminStats } from './types';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'jjmi_master.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    application_number TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_country_code TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    whatsapp_country_code TEXT,
    whatsapp_number TEXT,
    country TEXT NOT NULL,
    state_region TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    street_address TEXT,
    date_of_birth TEXT,
    participation_category TEXT NOT NULL,
    category_name TEXT NOT NULL,
    fee_amount_minor INTEGER NOT NULL,
    fee_currency TEXT NOT NULL DEFAULT 'INR',
    fee_basis TEXT NOT NULL,
    service_interests TEXT NOT NULL,
    qualification_experience TEXT,
    availability TEXT,
    joining_purpose TEXT,
    photo_storage_path TEXT,
    rules_accepted_at TEXT NOT NULL,
    privacy_acknowledged_at TEXT NOT NULL,
    photo_publicity_consent INTEGER NOT NULL DEFAULT 0,
    registration_status TEXT NOT NULL DEFAULT 'pending_payment',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    payment_reference TEXT,
    payment_date TEXT,
    google_sheet_sync_status TEXT NOT NULL DEFAULT 'pending',
    google_sheet_synced_at TEXT,
    admin_notes TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_registrations_app_num ON registrations(application_number);
  CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
  CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(registration_status);
  CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    registration_id TEXT NOT NULL,
    amount_minor INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    method TEXT,
    reference_id TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(registration_id) REFERENCES registrations(id)
  );

  CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id TEXT PRIMARY KEY,
    admin_user TEXT NOT NULL,
    action TEXT NOT NULL,
    target_id TEXT,
    details TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  // Get count for sequence
  const row = db.prepare('SELECT COUNT(*) as count FROM registrations').get() as { count: number };
  const nextSeq = (row?.count || 0) + 101;
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `JJMI-${year}-${String(nextSeq).padStart(4, '0')}${randomSuffix}`;
}

export function createRegistration(data: Omit<RegistrationRecord, 'id' | 'application_number' | 'created_at' | 'updated_at'>): RegistrationRecord {
  const id = crypto.randomUUID();
  const application_number = generateApplicationNumber();
  const now = new Date().toISOString();

  const record: RegistrationRecord = {
    ...data,
    id,
    application_number,
    created_at: now,
    updated_at: now,
  };

  const recordToInsert = {
    id,
    application_number,
    created_at: now,
    updated_at: now,
    full_name: data.full_name,
    email: data.email,
    phone_country_code: data.phone_country_code,
    phone_number: data.phone_number,
    whatsapp_country_code: data.whatsapp_country_code ?? null,
    whatsapp_number: data.whatsapp_number ?? null,
    country: data.country,
    state_region: data.state_region,
    city: data.city,
    postal_code: data.postal_code ?? null,
    street_address: data.street_address ?? null,
    date_of_birth: data.date_of_birth ?? null,
    participation_category: data.participation_category,
    category_name: data.category_name,
    fee_amount_minor: data.fee_amount_minor,
    fee_currency: data.fee_currency ?? 'INR',
    fee_basis: data.fee_basis,
    service_interests: data.service_interests ?? '[]',
    qualification_experience: data.qualification_experience ?? null,
    availability: data.availability ?? null,
    joining_purpose: data.joining_purpose ?? null,
    photo_storage_path: data.photo_storage_path ?? null,
    rules_accepted_at: data.rules_accepted_at,
    privacy_acknowledged_at: data.privacy_acknowledged_at,
    photo_publicity_consent: data.photo_publicity_consent ?? 0,
    registration_status: data.registration_status,
    payment_status: data.payment_status,
    payment_method: data.payment_method ?? null,
    payment_reference: data.payment_reference ?? null,
    payment_date: data.payment_date ?? null,
    google_sheet_sync_status: data.google_sheet_sync_status ?? 'pending',
    google_sheet_synced_at: data.google_sheet_synced_at ?? null,
    admin_notes: data.admin_notes ?? null,
  };

  const stmt = db.prepare(`
    INSERT INTO registrations (
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
  `);

  stmt.run(recordToInsert);
  return record;
}

export function getRegistrationByAppNumber(appNumber: string): RegistrationRecord | undefined {
  return db.prepare('SELECT * FROM registrations WHERE application_number = ?').get(appNumber) as RegistrationRecord | undefined;
}

export function getRegistrationById(id: string): RegistrationRecord | undefined {
  return db.prepare('SELECT * FROM registrations WHERE id = ?').get(id) as RegistrationRecord | undefined;
}

export function updatePaymentReference(appNumber: string, reference: string, method: string = 'UPI'): boolean {
  const now = new Date().toISOString();
  const info = db.prepare(`
    UPDATE registrations
    SET payment_reference = ?,
        payment_method = ?,
        payment_date = ?,
        payment_status = 'under_review',
        registration_status = 'under_review',
        updated_at = ?
    WHERE application_number = ?
  `).run(reference, method, now, now, appNumber);

  return info.changes > 0;
}

export function updateRegistrationStatus(id: string, regStatus: string, payStatus: string, adminNotes?: string): boolean {
  const now = new Date().toISOString();
  let query = `
    UPDATE registrations
    SET registration_status = ?,
        payment_status = ?,
        updated_at = ?
  `;
  const params: any[] = [regStatus, payStatus, now];

  if (adminNotes !== undefined) {
    query += `, admin_notes = ?`;
    params.push(adminNotes);
  }

  query += ` WHERE id = ?`;
  params.push(id);

  const info = db.prepare(query).run(...params);
  return info.changes > 0;
}

export interface ListRegistrationsParams {
  search?: string;
  category?: string;
  paymentStatus?: string;
  registrationStatus?: string;
  limit?: number;
  offset?: number;
}

export function listRegistrations(params: ListRegistrationsParams = {}): { records: RegistrationRecord[]; total: number } {
  const { search, category, paymentStatus, registrationStatus, limit = 50, offset = 0 } = params;

  let whereClauses: string[] = [];
  let queryParams: any[] = [];

  if (search) {
    whereClauses.push('(application_number LIKE ? OR full_name LIKE ? OR email LIKE ? OR phone_number LIKE ? OR payment_reference LIKE ?)');
    const searchTerm = `%${search}%`;
    queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (category && category !== 'ALL') {
    whereClauses.push('participation_category = ?');
    queryParams.push(category);
  }

  if (paymentStatus && paymentStatus !== 'ALL') {
    whereClauses.push('payment_status = ?');
    queryParams.push(paymentStatus);
  }

  if (registrationStatus && registrationStatus !== 'ALL') {
    whereClauses.push('registration_status = ?');
    queryParams.push(registrationStatus);
  }

  const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const countRow = db.prepare(`SELECT COUNT(*) as count FROM registrations ${whereStr}`).get(...queryParams) as { count: number };
  const total = countRow?.count || 0;

  const records = db.prepare(`
    SELECT * FROM registrations
    ${whereStr}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(...queryParams, limit, offset) as RegistrationRecord[];

  return { records, total };
}

export function getAdminStats(): AdminStats {
  const total = (db.prepare('SELECT COUNT(*) as count FROM registrations').get() as any)?.count || 0;
  const paid = (db.prepare("SELECT COUNT(*) as count FROM registrations WHERE payment_status = 'paid'").get() as any)?.count || 0;
  const free = (db.prepare("SELECT COUNT(*) as count FROM registrations WHERE payment_status = 'not_required'").get() as any)?.count || 0;
  const pendingPayment = (db.prepare("SELECT COUNT(*) as count FROM registrations WHERE payment_status = 'pending'").get() as any)?.count || 0;
  const underReview = (db.prepare("SELECT COUNT(*) as count FROM registrations WHERE registration_status = 'under_review' OR payment_status = 'under_review'").get() as any)?.count || 0;
  const confirmed = (db.prepare("SELECT COUNT(*) as count FROM registrations WHERE registration_status = 'confirmed'").get() as any)?.count || 0;

  const sumRow = db.prepare("SELECT SUM(fee_amount_minor) as totalMinor FROM registrations WHERE payment_status = 'paid'").get() as any;
  const totalCollectedINR = (sumRow?.totalMinor || 0) / 100;

  return {
    total,
    paid,
    free,
    pendingPayment,
    underReview,
    confirmed,
    totalCollectedINR,
  };
}

export function exportRegistrationsToCSV(): string {
  const records = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all() as RegistrationRecord[];

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
    'Category',
    'Fee (INR)',
    'Fee Basis',
    'Payment Status',
    'Payment Method',
    'Payment Reference (UTR)',
    'Payment Date',
    'Registration Status',
    'Service Interests',
    'Joining Purpose',
    'Admin Notes',
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '';
    let str = String(val).replace(/"/g, '""');
    // Anti-formula injection check
    if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
      str = "'" + str;
    }
    return `"${str}"`;
  };

  const rows = records.map((r) => [
    escapeCSV(r.application_number),
    escapeCSV(r.created_at),
    escapeCSV(r.full_name),
    escapeCSV(r.email),
    escapeCSV(r.phone_country_code),
    escapeCSV(r.phone_number),
    escapeCSV(r.whatsapp_number || ''),
    escapeCSV(r.country),
    escapeCSV(r.state_region),
    escapeCSV(r.city),
    escapeCSV(r.postal_code || ''),
    escapeCSV(r.category_name),
    escapeCSV((r.fee_amount_minor / 100).toFixed(2)),
    escapeCSV(r.fee_basis),
    escapeCSV(r.payment_status),
    escapeCSV(r.payment_method || ''),
    escapeCSV(r.payment_reference || ''),
    escapeCSV(r.payment_date || ''),
    escapeCSV(r.registration_status),
    escapeCSV(r.service_interests),
    escapeCSV(r.joining_purpose || ''),
    escapeCSV(r.admin_notes || ''),
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

export default db;
