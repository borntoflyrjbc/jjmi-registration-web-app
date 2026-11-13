import { NextRequest, NextResponse } from 'next/server';
import { createRegistration } from '@/lib/db';
import { getCategoryById } from '@/lib/categories';
import { ParticipationCategoryId } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Required fields validation
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

    if (!full_name || !email || !phone_country_code || !phone_number || !country || !state_region || !city || !participation_category) {
      return NextResponse.json(
        { error: 'Missing required registration fields. Please complete all required steps.' },
        { status: 400 }
      );
    }

    // Server-side category & fee validation
    const categoryConfig = getCategoryById(participation_category);
    if (!categoryConfig) {
      return NextResponse.json(
        { error: 'Invalid participation category selected.' },
        { status: 400 }
      );
    }

    const isFree = categoryConfig.id === 'well_wisher' || categoryConfig.feeINR === 0;
    const feeAmountMinor = categoryConfig.feeINR * 100; // in paise
    const feeBasis = categoryConfig.feeBasis;

    const registrationStatus = isFree ? 'registered_free' : 'pending_payment';
    const paymentStatus = isFree ? 'not_required' : 'pending';

    const now = new Date().toISOString();

    const record = createRegistration({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone_country_code: phone_country_code.trim(),
      phone_number: phone_number.trim(),
      whatsapp_country_code: whatsapp_country_code || phone_country_code,
      whatsapp_number: whatsapp_number || phone_number,
      country: country.trim(),
      state_region: state_region.trim(),
      city: city.trim(),
      postal_code: postal_code?.trim() || undefined,
      street_address: street_address?.trim() || undefined,
      date_of_birth: date_of_birth?.trim() || undefined,
      participation_category: categoryConfig.id as ParticipationCategoryId,
      category_name: categoryConfig.name,
      fee_amount_minor: feeAmountMinor,
      fee_currency: 'INR',
      fee_basis: feeBasis,
      service_interests: Array.isArray(service_interests) ? JSON.stringify(service_interests) : '[]',
      qualification_experience: qualification_experience?.trim() || undefined,
      availability: availability?.trim() || undefined,
      joining_purpose: joining_purpose?.trim() || undefined,
      rules_accepted_at: now,
      privacy_acknowledged_at: now,
      photo_publicity_consent: photo_publicity_consent ? 1 : 0,
      registration_status: registrationStatus,
      payment_status: paymentStatus,
      google_sheet_sync_status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: isFree ? 'Registration completed successfully!' : 'Registration created. Please complete payment.',
      registration: record,
    });
  } catch (err: any) {
    console.error('Registration API Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while processing registration.' },
      { status: 500 }
    );
  }
}

