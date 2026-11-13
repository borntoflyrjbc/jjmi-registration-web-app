import React from 'react';
import { COUNTRIES } from '@/lib/countries';
import { MapPin, Building2, Navigation, Compass } from 'lucide-react';

interface StepLocationProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors?: Record<string, string>;
}

export const StepLocation: React.FC<StepLocationProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3.5 pb-4 border-b border-stone-200/80">
        <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 shadow-xs">
          <MapPin className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-[#081d36] tracking-tight">
            Location & Address • निवास एवं पता
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Open for devotees from India and all countries worldwide.
          </p>
        </div>
      </div>

      {/* Country Selection */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
          Country of Residence / देश
        </label>
        <div className="relative">
          <Compass className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <select
            value={formData.country || 'India'}
            onChange={(e) => updateFormData({ country: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-2xs"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* State & City Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            State / Province / राज्य
          </label>
          <div className="relative">
            <Navigation className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. Odisha / Madhya Pradesh / California"
              value={formData.state_region || ''}
              onChange={(e) => updateFormData({ state_region: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-2xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            City / Town / शहर
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. Puri / Bhubaneswar / Indore"
              value={formData.city || ''}
              onChange={(e) => updateFormData({ city: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Postal Code & Street */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            Postal / PIN Code
          </label>
          <input
            type="text"
            placeholder="e.g. 752001"
            value={formData.postal_code || ''}
            onChange={(e) => updateFormData({ postal_code: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 font-mono shadow-2xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            Street Address / Residential Area (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Near Grand Road, Puri"
            value={formData.street_address || ''}
            onChange={(e) => updateFormData({ street_address: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-stone-300/80 rounded-xl text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};
