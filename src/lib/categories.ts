import { ParticipationCategory, ParticipationCategoryId } from './types';

export interface EnrichedCategory extends ParticipationCategory {
  emoji: string;
  shortDesc: string;
}

export const PARTICIPATION_CATEGORIES: EnrichedCategory[] = [
  {
    id: 'well_wisher',
    name: 'Jagannath Well-Wisher',
    hindiName: 'जगन्नाथ शुभचिंतक',
    emoji: '🪷',
    feeINR: 0,
    feeBasis: 'Free',
    description: 'मिशन के शुभचिंतक। नियमित आध्यात्मिक सत्संग व दर्शन लिंक प्राप्त करें।',
    shortDesc: 'आध्यात्मिक सत्संग व दर्शन अपडेट्स',
    tag: 'निःशुल्क',
  },
  {
    id: 'general',
    name: 'General Participant',
    hindiName: 'सामान्य सहभागी',
    emoji: '🕉️',
    feeINR: 500,
    feeBasis: 'Annual',
    description: 'आधिकारिक डिजिटल सहभागी। ऑनलाइन सत्संग, वेबिनार एवं वार्षिक पत्रिका।',
    shortDesc: 'ऑनलाइन सत्संग व मासिक वेबिनार',
    popular: true,
    tag: 'लोकप्रिय',
  },
  {
    id: 'sevak',
    name: 'Active Sevak',
    hindiName: 'सक्रिय सेवक',
    emoji: '🤝',
    feeINR: 1100,
    feeBasis: 'Annual',
    description: 'समर्पित सेवा सहभागी। सेवा मंडल दायित्व व स्वयंसेवक पहचान पत्र।',
    shortDesc: 'समर्पित सेवा मंडल व स्वयंसेवक कार्ड',
    tag: 'समर्पित सेवा',
  },
  {
    id: 'youth',
    name: 'Youth Chetna Participant',
    hindiName: 'युवा चेतना सहभागी',
    emoji: '⚡',
    feeINR: 250,
    feeBasis: 'Annual',
    description: 'युवा जागरण, नेतृत्व विकास, नशामुक्ति व करियर-आध्यात्मिक मार्गदर्शन।',
    shortDesc: 'युवा जागरण व नशामुक्ति अभियान',
    tag: 'रियायती',
  },
  {
    id: 'women',
    name: 'Women Chetna Participant',
    hindiName: 'महिला चेतना सहभागी',
    emoji: '🌸',
    feeINR: 250,
    feeBasis: 'Annual',
    description: 'महिला सशक्तिकरण, परिवार कल्याण व भारतीय संस्कृति-संस्कार सत्संग।',
    shortDesc: 'महिला सशक्तिकरण व संस्कार सत्संग',
    tag: 'रियायती',
  },
  {
    id: 'life',
    name: 'Life Participant',
    hindiName: 'आजीवन सहभागी',
    emoji: '👑',
    feeINR: 11000,
    feeBasis: 'One-time',
    description: 'मिशन से आजीवन पावन संबंध, विशेष दर्शन-साधना समन्वय व स्थाई संरक्षक।',
    shortDesc: 'आजीवन संबंध व स्थाई संरक्षक सम्मान',
    tag: 'आजीवन सम्मान',
  },
  {
    id: 'international',
    name: 'International Participant',
    hindiName: 'अंतर्राष्ट्रीय सहभागी',
    emoji: '🌐',
    feeINR: 2500,
    feeBasis: 'Annual',
    description: 'विश्वभर के प्रवासी भक्त (NRI)। वैश्विक नेटवर्किंग व ऑनलाइन प्रसादम।',
    shortDesc: 'वैश्विक भक्त (NRI) व प्रसादम',
    tag: 'वैश्विक भक्त',
  },
  {
    id: 'institutional',
    name: 'Institutional Partner',
    hindiName: 'संस्थागत सहयोगी',
    emoji: '🏛️',
    feeINR: 5100,
    feeBasis: 'Annual',
    description: 'न्यास, आश्रम, व्यापारिक प्रतिष्ठान व सामाजिक संस्थाओं हेतु सामूहिक सेवा।',
    shortDesc: 'संस्थान, ट्रस्ट व सामूहिक सेवा',
    tag: 'संस्था / ट्रस्ट',
  },
];

export const SERVICE_INTEREST_OPTIONS = [
  { id: 'spiritual_programs', label: 'जगन्नाथ चेतना एवं आध्यात्मिक कार्यक्रम', emoji: '🕉️', icon: 'Sparkles' },
  { id: 'kirtan_satsang', label: 'भजन, कीर्तन एवं सत्संग', emoji: '🎵', icon: 'Music' },
  { id: 'annadan_service', label: 'अन्नदान एवं सामाजिक सेवा', emoji: '🍲', icon: 'HeartHandshake' },
  { id: 'youth_awakening', label: 'युवा जागरण एवं नशामुक्ति', emoji: '⚡', icon: 'Compass' },
  { id: 'women_welfare', label: 'महिला एवं परिवार कल्याण', emoji: '🌸', icon: 'Users' },
  { id: 'man_samvad', label: 'मन संवाद एवं मानसिक स्वास्थ्य जागरूकता', emoji: '🧘', icon: 'ShieldCheck' },
  { id: 'yoga_meditation', label: 'योग एवं ध्यान शिविर', emoji: '🌿', icon: 'Sun' },
  { id: 'media_pr', label: 'मीडिया एवं जनसंपर्क', emoji: '📢', icon: 'Video' },
  { id: 'admin_service', label: 'संगठनात्मक एवं प्रशासनिक सेवा', emoji: '🏛️', icon: 'Building' },
  { id: 'international_expansion', label: 'अंतर्राष्ट्रीय विस्तार', emoji: '🌐', icon: 'Globe' },
];

export function getCategoryById(id: string): EnrichedCategory | undefined {
  return PARTICIPATION_CATEGORIES.find((c) => c.id === id);
}

export const MISSION_WHATSAPP_NUMBER = '919479492992';

export const UPI_CONFIG = {
  vpa: '9479492992@pthdfc',
  payeeName: 'PURUSHOTTAM TIWARI',
  organization: 'JAI JAGANNATH MISSION INTERNATIONAL',
  helplinePhone: '+91 9479492992',
  helplineEmail: 'jaijagannathmissioninternation@gmail.com',
  bankName: 'HDFC Bank (UPI Handle: @pthdfc)',
};
