export type ParticipationCategoryId =
  | 'well_wisher'
  | 'general'
  | 'sevak'
  | 'youth'
  | 'women'
  | 'life'
  | 'international'
  | 'institutional';

export interface ParticipationCategory {
  id: ParticipationCategoryId;
  name: string;
  hindiName: string;
  feeINR: number;
  feeBasis: 'Free' | 'Annual' | 'One-time';
  description: string;
  tag?: string;
  popular?: boolean;
}

export type RegistrationStatus =
  | 'draft'
  | 'pending_payment'
  | 'registered_free'
  | 'under_review'
  | 'confirmed'
  | 'rejected';

export type PaymentStatus =
  | 'not_required'
  | 'pending'
  | 'paid'
  | 'under_review'
  | 'failed';

export interface RegistrationRecord {
  id: string;
  application_number: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  whatsapp_country_code?: string;
  whatsapp_number?: string;
  country: string;
  state_region: string;
  city: string;
  postal_code?: string;
  street_address?: string;
  date_of_birth?: string;
  participation_category: ParticipationCategoryId;
  category_name: string;
  fee_amount_minor: number; // in paise (e.g. 50000 for ₹500)
  fee_currency: string;
  fee_basis: string;
  service_interests: string; // JSON string of string[]
  qualification_experience?: string;
  availability?: string;
  joining_purpose?: string;
  photo_storage_path?: string;
  rules_accepted_at: string;
  privacy_acknowledged_at: string;
  photo_publicity_consent: number; // 0 or 1
  registration_status: RegistrationStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_reference?: string; // UTR or Txn ID
  payment_date?: string;
  google_sheet_sync_status: 'pending' | 'synced' | 'failed';
  google_sheet_synced_at?: string;
  admin_notes?: string;
}

export interface AdminStats {
  total: number;
  paid: number;
  free: number;
  pendingPayment: number;
  underReview: number;
  confirmed: number;
  totalCollectedINR: number;
}

export interface VisitorEvent {
  id: string;
  visitor_id: string;
  visited_at: string;
  visited_at_ist: string;
  date_ist: string;
  page_url: string;
  referrer: string;
  referrer_source: string;
  device_type: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  os: string;
  user_agent?: string;
  ip_hash?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
}

export interface VisitorAnalyticsSummary {
  totalVisits: number;
  todayVisits: number;
  yesterdayVisits: number;
  uniqueVisitors: number;
  last7DaysVisits: number;
  thisMonthVisits: number;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  sources: {
    source: string;
    count: number;
  }[];
  dailyBreakdown: {
    date: string;
    fullDate: string;
    totalVisits: number;
    uniqueVisitors: number;
    mobile: number;
    desktop: number;
    tablet: number;
  }[];
}


