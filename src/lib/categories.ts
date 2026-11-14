import { ParticipationCategory, ParticipationCategoryId } from './types';

export const PARTICIPATION_CATEGORIES: ParticipationCategory[] = [
  {
    id: 'well_wisher',
    name: 'Jagannath Well-Wisher (जगन्नाथ शुभचिंतक)',
    hindiName: 'जगन्नाथ शुभचिंतक',
    feeINR: 0,
    feeBasis: 'Free',
    description: 'मिशन के शुभचिंतक। नियमित आध्यात्मिक सत्संग, दर्शन लिंक एवं पावन संदेश प्राप्त करें।',
    tag: 'निःशुल्क',
  },
  {
    id: 'general',
    name: 'General Participant (सामान्य सहभागी)',
    hindiName: 'सामान्य सहभागी',
    feeINR: 500,
    feeBasis: 'Annual',
    description: 'आधिकारिक डिजिटल सहभागी। ऑनलाइन सत्संग, मासिक वेबिनार एवं वार्षिक मिशन पत्रिका।',
    popular: true,
    tag: '₹500 वार्षिक',
  },
  {
    id: 'sevak',
    name: 'Active Sevak (सक्रिय सेवक)',
    hindiName: 'सक्रिय सेवक',
    feeINR: 1100,
    feeBasis: 'Annual',
    description: 'समर्पित सेवा सहभागी। सेवा मंडल दायित्व, स्वयंसेवक पहचान पत्र व शिविरों में सेवा अवसर।',
    tag: '₹1,100 वार्षिक',
  },
  {
    id: 'youth',
    name: 'Youth Chetna Participant (युवा चेतना सहभागी)',
    hindiName: 'युवा चेतना सहभागी',
    feeINR: 250,
    feeBasis: 'Annual',
    description: 'युवा जागरण, नेतृत्व विकास, नशामुक्ति अभियान एवं करियर-आध्यात्मिक मार्गदर्शन।',
    tag: '₹250 वार्षिक',
  },
  {
    id: 'women',
    name: 'Women Chetna Participant (महिला चेतना सहभागी)',
    hindiName: 'महिला चेतना सहभागी',
    feeINR: 250,
    feeBasis: 'Annual',
    description: 'महिला सशक्तिकरण, परिवार कल्याण, भारतीय संस्कृति-संस्कार एवं सत्संग मंडली।',
    tag: '₹250 वार्षिक',
  },
  {
    id: 'life',
    name: 'Life Participant (आजीवन सहभागी)',
    hindiName: 'आजीवन सहभागी',
    feeINR: 11000,
    feeBasis: 'One-time',
    description: 'मिशन से आजीवन पावन संबंध, विशेष दर्शन-साधना समन्वय एवं स्थाई संरक्षक सम्मान।',
    tag: '₹11,000 एकमुश्त',
  },
  {
    id: 'international',
    name: 'International Participant (अंतर्राष्ट्रीय सहभागी)',
    hindiName: 'अंतर्राष्ट्रीय सहभागी',
    feeINR: 2500,
    feeBasis: 'Annual',
    description: 'विश्वभर के प्रवासी भक्त (NRI / Global)। वैश्विक आध्यात्मिक नेटवर्किंग एवं ऑनलाइन प्रसादम।',
    tag: '₹2,500 वार्षिक',
  },
  {
    id: 'institutional',
    name: 'Institutional Partner (संस्थागत सहयोगी)',
    hindiName: 'संस्थागत सहयोगी',
    feeINR: 5100,
    feeBasis: 'Annual',
    description: 'न्यास, मंदिर, आश्रम, व्यापारिक प्रतिष्ठान व सामाजिक संस्थाओं हेतु सामूहिक सेवा सहभागिता।',
    tag: '₹5,100 वार्षिक',
  },
];

export const SERVICE_INTEREST_OPTIONS = [
  { id: 'spiritual_programs', label: 'जगन्नाथ चेतना एवं आध्यात्मिक कार्यक्रम', icon: 'Sparkles' },
  { id: 'kirtan_satsang', label: 'भजन, कीर्तन एवं सत्संग', icon: 'Music' },
  { id: 'annadan_service', label: 'अन्नदान एवं सामाजिक सेवा', icon: 'HeartHandshake' },
  { id: 'youth_awakening', label: 'युवा जागरण एवं नशामुक्ति', icon: 'Compass' },
  { id: 'women_welfare', label: 'महिला एवं परिवार कल्याण', icon: 'Users' },
  { id: 'man_samvad', label: 'मन संवाद एवं मानसिक स्वास्थ्य जागरूकता', icon: 'ShieldCheck' },
  { id: 'yoga_meditation', label: 'योग एवं ध्यान शिविर', icon: 'Sun' },
  { id: 'media_pr', label: 'मीडिया एवं जनसंपर्क', icon: 'Video' },
  { id: 'admin_service', label: 'संगठनात्मक एवं प्रशासनिक सेवा', icon: 'Building' },
  { id: 'international_expansion', label: 'अंतर्राष्ट्रीय विस्तार', icon: 'Globe' },
];

export function getCategoryById(id: string): ParticipationCategory | undefined {
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
