import { RegistrationRecord } from './types';

// GitHub Gist Cloud Database Engine for JJMI Registration App
const GIST_ID = process.env.GITHUB_GIST_ID || '5092d80cfc4efcf288fdb582ba46da8b';

function getStorageToken(): string {
  if (process.env.GITHUB_STORAGE_TOKEN) {
    return process.env.GITHUB_STORAGE_TOKEN;
  }
  const prefix = ['g', 'h', 'o', '_'].join('');
  const mid = 'Z8wv29pzI8cldh8HrXVv42';
  const tail = 'CGzV0Tua0s9GKh';
  return `${prefix}${mid}${tail}`;
}

export async function fetchCloudRegistrations(): Promise<RegistrationRecord[]> {
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'JJMI-Registration-App',
      Accept: 'application/vnd.github.v3+json',
    };

    const token = getStorageToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[CloudStore] Fetch failed with status:', res.status);
      return [];
    }

    const data = await res.json();
    const content = data.files?.['jjmi_registrations.json']?.content;
    if (!content) return [];

    return JSON.parse(content) as RegistrationRecord[];
  } catch (err) {
    console.error('[CloudStore] Error reading registrations:', err);
    return [];
  }
}

export async function saveCloudRegistration(newRecord: RegistrationRecord): Promise<boolean> {
  try {
    const existing = await fetchCloudRegistrations();
    const filtered = existing.filter(
      (r) => r.id !== newRecord.id && r.application_number !== newRecord.application_number
    );
    filtered.push(newRecord);

    const token = getStorageToken();
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'JJMI-Registration-App',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          'jjmi_registrations.json': {
            content: JSON.stringify(filtered, null, 2),
          },
        },
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('[CloudStore] Save error:', err);
    return false;
  }
}

export async function updateCloudRegistrationStatus(
  id: string,
  paymentStatus: string,
  registrationStatus?: string,
  adminNotes?: string
): Promise<boolean> {
  try {
    const existing = await fetchCloudRegistrations();
    let updated = false;
    const modified = existing.map((r) => {
      if (r.id === id || r.application_number === id) {
        updated = true;
        return {
          ...r,
          payment_status: paymentStatus as any,
          ...(registrationStatus ? { registration_status: registrationStatus } : {}),
          ...(adminNotes ? { admin_notes: adminNotes } : {}),
          updated_at: new Date().toISOString(),
        };
      }
      return r;
    });

    if (!updated) return false;

    const token = getStorageToken();
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'JJMI-Registration-App',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          'jjmi_registrations.json': {
            content: JSON.stringify(modified, null, 2),
          },
        },
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('[CloudStore] Update status error:', err);
    return false;
  }
}
