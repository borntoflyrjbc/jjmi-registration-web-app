import React from 'react';
import { COUNTRIES } from '@/lib/countries';
import { User, Phone, Mail, Globe, Calendar, MessageSquare } from 'lucide-react';

interface StepPersonalProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors?: Record<string, string>;
}

export const StepPersonal: React.FC<StepPersonalProps> = ({ formData, updateFormData }) => {
  const [sameAsMobile, setSameAsMobile] = React.useState(
    formData.whatsapp_number === formData.phone_number && !!formData.phone_number
  );

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    updateFormData({
      phone_number: val,
      ...(sameAsMobile ? { whatsapp_number: val } : {}),
    });
  };

  const handleSameAsMobileToggle = (checked: boolean) => {
    setSameAsMobile(checked);
    if (checked) {
      updateFormData({
        whatsapp_country_code: formData.phone_country_code || '+91',
        whatsapp_number: formData.phone_number || '',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner matching reference image */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-stone-200/80">
        <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 shadow-xs">
          <User className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-[#081d36] tracking-tight">
            Personal Information • व्यक्तिगत जानकारी
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Please enter your primary details for registration and spiritual communications.
          </p>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
          Full Name / पूरा नाम
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="e.g. Rahul Sharma"
            value={formData.full_name || ''}
            onChange={(e) => updateFormData({ full_name: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs"
          />
        </div>
      </div>

      {/* Phone Number with Country Code */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            Country Code
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            <select
              value={formData.phone_country_code || '+91'}
              onChange={(e) => {
                const code = e.target.value;
                updateFormData({
                  phone_country_code: code,
                  ...(sameAsMobile ? { whatsapp_country_code: code } : {}),
                });
              }}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300/80 rounded-xl text-xs sm:text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-2xs"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.dialCode}>
                  {c.dialCode} ({c.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            Mobile Number (Calling)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              placeholder="e.g. 9479492992"
              value={formData.phone_number || ''}
              onChange={handleMobileChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Sync Checkbox */}
      <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-700 select-none">
          <input
            type="checkbox"
            checked={sameAsMobile}
            onChange={(e) => handleSameAsMobileToggle(e.target.checked)}
            className="w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-500 accent-amber-700"
          />
          <span className="font-medium">WhatsApp number is same as calling number (व्हाट्सएप नंबर समान है)</span>
        </label>
      </div>

      {/* WhatsApp Number (if different) */}
      {!sameAsMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              WhatsApp Country Code
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <select
                value={formData.whatsapp_country_code || '+91'}
                onChange={(e) => updateFormData({ whatsapp_country_code: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300/80 rounded-xl text-xs sm:text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-2xs"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.dialCode}>
                    {c.dialCode} ({c.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              WhatsApp Number
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="e.g. 9479492992"
                value={formData.whatsapp_number || ''}
                onChange={(e) => updateFormData({ whatsapp_number: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Email Address */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
          Email Address / ईमेल
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="email"
            placeholder="e.g. devotee@example.com"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs"
          />
        </div>
      </div>

      {/* Date of Birth / Age */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
          Date of Birth / जन्मतिथि
        </label>
        <div className="relative">
          <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="date"
            value={formData.date_of_birth || ''}
            onChange={(e) => updateFormData({ date_of_birth: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs text-slate-700"
          />
        </div>
      </div>
    </div>
  );
};
