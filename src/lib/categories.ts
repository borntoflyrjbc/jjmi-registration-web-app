import { ParticipationCategory, ParticipationCategoryId } from './types';

export const PARTICIPATION_CATEGORIES: ParticipationCategory[] = [
  {
    id: 'well_wisher',
    name: 'Well-wisher (No Fee)',
    hindiName: 'शुभचिंतक (निःशुल्क)',
    feeINR: 0,
    feeBasis: 'Free',
    description: 'Supporter of Jagannath Mission. Receive spiritual updates, newsletters, and darshan links.',
    tag: 'No Fee',
  },
  {
    id: 'general',
    name: 'General Participant',
    hindiName: 'सामान्य प्रतिभागी',
    feeINR: 500,
    feeBasis: 'Annual',
    description: 'Official digital participant. Access to online satsangs, monthly webinars, and annual mission report.',
    popular: true,
    tag: 'Popular',
  },
  {
    id: 'sevak',
    name: 'Active Sevak (Volunteer)',
    hindiName: 'सक्रिय सेवक (स्वयंसेवक)',
    feeINR: 1100,
    feeBasis: 'Annual',
    description: 'Dedicated seva participant. Assigned service circles, seva ID card, and retreat priority.',
    tag: 'Dedicated Seva',
  },
  {
    id: 'youth',
    name: 'Youth Participant (Age 15–35)',
    hindiName: 'युवा प्रतिभागी (आयु 15-35)',
    feeINR: 250,
    feeBasis: 'Annual',
    description: 'Youth awakening, leadership retreats, de-addiction awareness, and career-spiritual guidance.',
    tag: 'Subsidized',
  },
  {
    id: 'women',
    name: 'Women Participant',
    hindiName: 'महिला प्रतिभागी',
    feeINR: 250,
    feeBasis: 'Annual',
    description: 'Women empowerment, family wellness, sanskar circles, and devotional workshops.',
    tag: 'Subsidized',
  },
  {
    id: 'life',
    name: 'Life Participant',
    hindiName: 'आजीवन प्रतिभागी',
    feeINR: 11000,
    feeBasis: 'One-time',
    description: 'Lifetime association with Jagannath Mission, VIP darshan coordination, permanent donor recognition.',
    tag: 'Lifetime Honor',
  },
  {
    id: 'international',
    name: 'International Participant',
    hindiName: 'अंतर्राष्ट्रीय प्रतिभागी',
    feeINR: 2500,
    feeBasis: 'Annual',
    description: 'Global devotees (NRI / International). Worldwide spiritual networking, online prasad, and translation wings.',
    tag: 'Global Devotees',
  },
  {
    id: 'institutional',
    name: 'Institutional Partner',
    hindiName: 'संस्थागत भागीदार',
    feeINR: 5100,
    feeBasis: 'Annual',
    description: 'Trusts, ashrams, businesses, and NGOs partnering for collective humanitarian and cultural welfare.',
    tag: 'Organizations',
  },
];

export const SERVICE_INTEREST_OPTIONS = [
  { id: 'spiritual_programs', label: 'Jagannath Spiritual Programs & Discourses', icon: 'Sparkles' },
  { id: 'kirtan_satsang', label: 'Bhajan, Kirtan & Satsang', icon: 'Music' },
  { id: 'annadan_service', label: 'Food Charity (Annadan) & Social Service', icon: 'HeartHandshake' },
  { id: 'youth_awakening', label: 'Youth Awakening & De-addiction', icon: 'Compass' },
  { id: 'women_empowerment', label: 'Women Empowerment & Family Well-being', icon: 'Users' },
  { id: 'man_samvad', label: 'Man Samvad (Inner Peace & Life Guidance)', icon: 'ShieldCheck' },
  { id: 'yoga_meditation', label: 'Yoga & Meditation Camps', icon: 'Sun' },
  { id: 'media_pr', label: 'Media, Communication & Public Relations', icon: 'Video' },
  { id: 'admin_service', label: 'Organizational & Administrative Service', icon: 'Building' },
  { id: 'international_expansion', label: 'International Expansion & Global Networking', icon: 'Globe' },
];

export function getCategoryById(id: string): ParticipationCategory | undefined {
  return PARTICIPATION_CATEGORIES.find((c) => c.id === id);
}

export const UPI_CONFIG = {
  vpa: '9479492992@pthdfc',
  payeeName: 'PURUSHOTTAM TIWARI',
  organization: 'JAI JAGANNATH MISSION INTERNATIONAL',
  helplinePhone: '+91 9479492992',
  helplineEmail: 'jaijagannathmissioninternation@gmail.com',
  bankName: 'HDFC Bank (UPI Handle: @pthdfc)',
};

