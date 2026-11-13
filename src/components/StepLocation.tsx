import React from 'react';
import { COUNTRIES } from '@/lib/countries';
import { MapPin, Building2, Navigation, Compass } from 'lucide-react';

interface StepLocationProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export const StepLocation: React.FC<StepLocationProps> = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">3</span>
          Location & Address • निवास एवं पता
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Open for devotees from India and all countries worldwide.
        </p>
      </div>

      {/* Country Selection */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
          Country of Residence / देश <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <select
            value={formData.country || 'India'}
            onChange={(e) => updateFormData({ country: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
        </div>
        {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
      </div>

      {/* State & City Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            State / Province / Region / राज्य <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Navigation className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="e.g. Odisha / Madhya Pradesh / California"
              value={formData.state_region || ''}
              onChange={(e) => updateFormData({ state_region: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                errors.state_region ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-amber-200 focus:border-amber-500'
              }`}
            />
          </div>
          {errors.state_region && <p className="text-red-600 text-xs mt-1">{errors.state_region}</p>}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
            City / Town / शहर <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="e.g. Puri / Jabalpur / New York"
              value={formData.city || ''}
              onChange={(e) => updateFormData({ city: e.target.value })}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
                errors.city ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-amber-200 focus:border-amber-500'
              }`}
            />
          </div>
          {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* Postal Code (Optional) */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
          <span>PIN / Postal / ZIP Code</span>
          <span className="text-slate-400 text-xs font-normal">Optional</span>
        </label>
        <input
          type="text"
          placeholder="e.g. 752001 or 482001"
          value={formData.postal_code || ''}
          onChange={(e) => updateFormData({ postal_code: e.target.value })}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
        />
      </div>

      {/* Street Address (Optional) */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
          <span>Street Address / पूरा पता</span>
          <span className="text-slate-400 text-xs font-normal">Optional</span>
        </label>
        <textarea
          rows={2}
          placeholder="House/Apartment, Street, Landmark"
          value={formData.street_address || ''}
          onChange={(e) => updateFormData({ street_address: e.target.value })}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
        />
      </div>
    </div>
  );
};

