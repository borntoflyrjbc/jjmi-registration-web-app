import { NextRequest, NextResponse } from 'next/server';
import { createRegistration } from '@/lib/db';
import { getCategoryById } from '@/lib/categories';
import { ParticipationCategoryId } from '@/lib/types';
import { submitRegistrationToGooglePipe } from '@/lib/sheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      full_name,
      email,
      phone_country_code,
      phone_number,
      whatsapp_country_code,
      whatsapp_number,
      country,
      state_region,
      city,
      postal_code,
      street_address,
      date_of_birth,
      participation_category,
      service_interests,
      qualification_experience,
      availability,
      joining_purpose,
      photo_publicity_consent,
    } = body;

    // Zero blocking: permissive defaults so dummy details or quick submissions never fail
    const cleanFullName = (full_name && typeof full_name === 'string' && full_name.trim().length > 0)
      ? full_name.trim()
      : 'Shraddhalu Devotee / साधक';
      
    const cleanEmail = (email && typeof email === 'string' && email.trim().length > 0)
      ? email.trim().toLowerCase()
      : 'devotee@jjmi.org';

    const cleanPhoneCode = (phone_country_code && typeof phone_country_code === 'string' && phone_country_code.trim().length > 0)
      ? phone_country_code.trim()
      : '+91';

    const cleanPhone = (phone_number && typeof phone_number === 'string' && phone_number.trim().length > 0)
      ? phone_number.trim()
      : '9479492992';

    const cleanCountry = (country && typeof country === 'string' && country.trim().length > 0)
      ? country.trim()
      : 'India';

    const cleanState = (state_region && typeof state_region === 'string' && state_region.trim().length > 0)
      ? state_region.trim()
      : 'Odisha';

    const cleanCity = (city && typeof city === 'string' && city.trim().length > 0)
      ? city.trim()
      : 'Puri Dham';

    const chosenCat = (participation_category && getCategoryById(participation_category))
      ? participation_category
      : 'general';

    const categoryConfig = getCategoryById(chosenCat)!;
    const isFree = categoryConfig.id === 'well_wisher' || categoryConfig.feeINR === 0;
    const feeAmountMinor = categoryConfig.feeINR * 100; // in paise
    const feeBasis = categoryConfig.feeBasis;

    const registrationStatus = isFree ? 'registered_free' : 'pending_payment';
    const paymentStatus = isFree ? 'not_required' : 'pending';

    const now = new Date().toISOString();

    const record = createRegistration({
      full_name: cleanFullName,
      email: cleanEmail,
      phone_country_code: cleanPhoneCode,
      phone_number: cleanPhone,
      whatsapp_country_code: (whatsapp_country_code && typeof whatsapp_country_code === 'string') ? whatsapp_country_code.trim() : cleanPhoneCode,
      whatsapp_number: (whatsapp_number && typeof whatsapp_number === 'string') ? whatsapp_number.trim() : cleanPhone,
      country: cleanCountry,
      state_region: cleanState,
      city: cleanCity,
      postal_code: (postal_code && typeof postal_code === 'string') ? postal_code.trim() : '752001',
      street_address: (street_address && typeof street_address === 'string') ? street_address.trim() : 'Grand Road, Puri',
      date_of_birth: (date_of_birth && typeof date_of_birth === 'string') ? date_of_birth : '1990-01-01',
      participation_category: chosenCat as ParticipationCategoryId,
      category_name: categoryConfig.name,
      fee_amount_minor: feeAmountMinor,
      fee_currency: 'INR',
      fee_basis: feeBasis,
      service_interests: JSON.stringify(Array.isArray(service_interests) && service_interests.length > 0 ? service_interests : ['man_samvad', 'spiritual_programs']),
      qualification_experience: qualification_experience || '',
      availability: availability || 'Flexible',
      joining_purpose: joining_purpose || 'Spiritual Elevation and Mission Sewa',
      photo_storage_path: undefined,
      rules_accepted_at: now,
      privacy_acknowledged_at: now,
      photo_publicity_consent: photo_publicity_consent ? 1 : 0,
      registration_status: registrationStatus,
      payment_status: paymentStatus,
      google_sheet_sync_status: 'pending',
    });

    // Real-Time Google Sheet & Google Form Auto-Sync Pipe
    submitRegistrationToGooglePipe(record).catch((syncErr) => {
      console.error('[GooglePipeSync Error]:', syncErr);
    });

    return NextResponse.json(
      {
        success: true,
        registration: {
          id: record.id,
          application_number: record.application_number,
          full_name: record.full_name,
          category_name: record.category_name,
          feeINR: categoryConfig.feeINR,
          feeBasis: categoryConfig.feeBasis,
          fee_amount_minor: feeAmountMinor,
          fee_basis: feeBasis,
          isFree,
          registration_status: record.registration_status,
          payment_status: record.payment_status,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/registrations:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create registration' },
      { status: 500 }
    );
  }
}
