import React from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';

interface StepPersonalProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors?: Record<string, string>;
}

export const StepPersonal: React.FC<StepPersonalProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-5">
      {/* Step Header */}
      <div className="flex items-start gap-3 pb-4 border-b border-stone-200/80">
        <div className="w-10 h-10 rounded-xl bg-amber-100/90 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 shadow-2xs">
          <User className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-[#081d36] tracking-tight">
            Your Details • आपकी प्राथमिक जानकारी
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Fill in your name and mobile number to connect with the mission.
          </p>
        </div>
      </div>

      <div className="space-y-4">
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
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs"
            />
          </div>
        </div>

        {/* Mobile / WhatsApp Number */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            Mobile / WhatsApp Number • मोबाइल नंबर
          </label>
          <div className="flex gap-2">
            <div className="w-24 flex-shrink-0">
              <input
                type="text"
                readOnly
                value="+91 (India)"
                className="w-full px-2 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-center text-stone-600 cursor-default"
              />
            </div>
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="10-digit mobile number (e.g. 9876543210)"
                maxLength={10}
                value={formData.phone_number || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  updateFormData({ 
                    phone_number: val,
                    whatsapp_number: val,
                  });
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs font-mono"
              />
            </div>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Important updates & registration receipts will be sent to this number.
          </p>
        </div>

        {/* City & State (Two Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              City / Town • शहर या कस्बा
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. Puri / Bhubaneswar / Delhi"
                value={formData.city || ''}
                onChange={(e) => updateFormData({ city: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              State / Region • राज्य
            </label>
            <input
              type="text"
              placeholder="e.g. Odisha / Madhya Pradesh / Maharashtra"
              value={formData.state_region || ''}
              onChange={(e) => updateFormData({ state_region: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs"
            />
          </div>
        </div>

        {/* Optional Email */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-800">
              Email Address • ईमेल
            </label>
            <span className="text-[11px] text-stone-400 font-medium">Optional (वैकल्पिक)</span>
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              placeholder="e.g. devotee@example.com"
              value={formData.email || ''}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition shadow-2xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
