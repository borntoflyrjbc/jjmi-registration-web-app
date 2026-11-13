export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'NP', name: 'Nepal', dialCode: '+977' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'KE', name: 'Kenya', dialCode: '+254' },
  { code: 'QA', name: 'Qatar', dialCode: '+974' },
  { code: 'OM', name: 'Oman', dialCode: '+968' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94' },
  { code: 'TH', name: 'Thailand', dialCode: '+66' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'OTHER', name: 'Other Countries', dialCode: '+1' },
];

