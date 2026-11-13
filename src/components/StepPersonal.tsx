import React from 'react';
import { COUNTRIES } from '@/lib/countries';
import { User, Phone, Mail, Globe, Calendar, MessageSquare } from 'lucide-react';

interface StepPersonalProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export const StepPersonal: React.FC<StepPersonalProps> = ({ formData, updateFormData, errors }) => {
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
        whatsapp_country_code: formData.phone_country_code,
        whatsapp_number: formData.phone_number,
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">1</span>
          Personal Information • व्यक्तिगत जानकारी
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Please enter your primary details for registration and spiritual communications.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
          Full Name / पूरा नाम <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            required
            placeholder="e.g. Rahul Sharma"
            value={formData.full_name || ''}
            onChange={(e) => updateFormData({ full_name: e.target.value })}
            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
              errors.full_name ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-amber-200 focus:border-amber-500'
            }`}
          />
        </div>
        {errors.full_name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.full_name}</p>}
      </div>

      {/* Phone Number with Country Code */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            Country Code <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <select
              value={formData.phone_country_code || '+91'}
              onChange={(e) => {
                const code = e.target.value;
                updateFormData({
                  phone_country_code: code,
                  ...(sameAsMobile ? { whatsapp_country_code: code } : {}),
                });
              }}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
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
            Mobile Number (Calling) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              required
              maxLength={15}
              placeholder="e.g. 9479492992"
              value={formData.phone_number || ''}
              onChange={handleMobileChange}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                errors.phone_number ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-amber-200 focus:border-amber-500'
              }`}
            />
          </div>
          {errors.phone_number && <p className="text-red-600 text-xs mt-1 font-medium">{errors.phone_number}</p>}
        </div>
      </div>

      {/* WhatsApp Checkbox & Input */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
        <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={sameAsMobile}
            onChange={(e) => handleSameAsMobileToggle(e.target.checked)}
            className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
          />
          <span>WhatsApp number is the same as calling mobile number</span>
        </label>

        {!sameAsMobile && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <select
                value={formData.whatsapp_country_code || '+91'}
                onChange={(e) => updateFormData({ whatsapp_country_code: e.target.value })}
                className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.dialCode}>
                    {c.dialCode} ({c.name})
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 relative">
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                placeholder="WhatsApp Number"
                value={formData.whatsapp_number || ''}
                onChange={(e) => updateFormData({ whatsapp_number: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
          Email Address / ईमेल <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="email"
            required
            placeholder="e.g. devotee@jagannathmission.org"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
              errors.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-amber-200 focus:border-amber-500'
            }`}
          />
        </div>
        {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>}
      </div>

      {/* Date of Birth (Optional) */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
          <span>Date of Birth / जन्मतिथि</span>
          <span className="text-slate-400 text-xs font-normal">Optional (Required for Youth Category)</span>
        </label>
        <div className="relative">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="date"
            value={formData.date_of_birth || ''}
            onChange={(e) => updateFormData({ date_of_birth: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>
    </div>
  );
};

