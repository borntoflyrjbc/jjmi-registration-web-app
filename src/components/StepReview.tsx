import React from 'react';
import Link from 'next/link';
import { getCategoryById } from '@/lib/categories';
import { ShieldCheck, User, MapPin, Award, CheckCircle, ExternalLink } from 'lucide-react';

interface StepReviewProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
  onEditStep: (step: number) => void;
}

export const StepReview: React.FC<StepReviewProps> = ({ formData, updateFormData, errors, onEditStep }) => {
  const category = getCategoryById(formData.participation_category || 'general');
  const isFree = category?.id === 'well_wisher' || category?.feeINR === 0;

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">6</span>
          Review & Consent • समीक्षा एवं घोषणा
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Please review your details before proceeding to {isFree ? 'confirm registration' : 'payment'}.
        </p>
      </div>

      {/* Summary Review Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
        {/* Category Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold flex-shrink-0">
              <Award className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Selected Category</div>
              <div className="font-bold text-slate-900 text-base">{category?.name}</div>
              <div className="text-xs text-amber-700 font-medium">{category?.hindiName}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">
              {isFree ? '₹0 Free' : `₹${category?.feeINR.toLocaleString('en-IN')}`}
            </div>
            <div className="text-xs text-slate-500">{category?.feeBasis}</div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs text-amber-700 hover:underline font-semibold mt-1 inline-block"
            >
              Change
            </button>
          </div>
        </div>

        {/* Personal & Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>Full Name</span>
            </div>
            <div className="font-semibold text-slate-800 mt-0.5">{formData.full_name || '—'}</div>
          </div>

          <div>
            <div className="text-slate-400 text-xs font-medium">Email Address</div>
            <div className="font-semibold text-slate-800 mt-0.5 break-all">{formData.email || '—'}</div>
          </div>

          <div>
            <div className="text-slate-400 text-xs font-medium">Mobile (Calling)</div>
            <div className="font-semibold text-slate-800 mt-0.5">
              {formData.phone_country_code} {formData.phone_number}
            </div>
          </div>

          <div>
            <div className="text-slate-400 text-xs font-medium">WhatsApp</div>
            <div className="font-semibold text-slate-800 mt-0.5">
              {formData.whatsapp_country_code || formData.phone_country_code} {formData.whatsapp_number || formData.phone_number}
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </div>
            <div className="font-semibold text-slate-800 mt-0.5">
              {[formData.city, formData.state_region, formData.country].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Declarations & Consent */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Rules & Declarations / सहमति एवं घोषणा</span>
        </h3>

        {/* Checkbox 1: Rules & Discipline (Mandatory) */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            errors.rulesAccepted ? 'border-red-400 bg-red-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-800 select-none">
            <input
              type="checkbox"
              required
              checked={formData.rulesAccepted || false}
              onChange={(e) => updateFormData({ rulesAccepted: e.target.checked })}
              className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
            />
            <span>
              I have read and agree to the{' '}
              <Link href="/rules" target="_blank" className="text-amber-700 underline font-semibold inline-flex items-center gap-0.5">
                Participation Rules & Discipline <ExternalLink className="w-3 h-3" />
              </Link>{' '}
              of Jai Jagannath Mission International. <span className="text-red-500 font-bold">*</span>
            </span>
          </label>
          {errors.rulesAccepted && <p className="text-red-600 text-xs mt-1 font-semibold ml-7">{errors.rulesAccepted}</p>}
        </div>

        {/* Checkbox 2: Privacy Notice (Mandatory) */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            errors.privacyAcknowledged ? 'border-red-400 bg-red-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-800 select-none">
            <input
              type="checkbox"
              required
              checked={formData.privacyAcknowledged || false}
              onChange={(e) => updateFormData({ privacyAcknowledged: e.target.checked })}
              className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
            />
            <span>
              I have read the{' '}
              <Link href="/privacy" target="_blank" className="text-amber-700 underline font-semibold inline-flex items-center gap-0.5">
                Privacy Notice <ExternalLink className="w-3 h-3" />
              </Link>{' '}
              and understand how my registration data is stored and utilized solely for mission activities. <span className="text-red-500 font-bold">*</span>
            </span>
          </label>
          {errors.privacyAcknowledged && <p className="text-red-600 text-xs mt-1 font-semibold ml-7">{errors.privacyAcknowledged}</p>}
        </div>

        {/* Checkbox 3: Photo Consent (Optional) */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
          <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700 select-none">
            <input
              type="checkbox"
              checked={formData.photo_publicity_consent || false}
              onChange={(e) => updateFormData({ photo_publicity_consent: e.target.checked })}
              className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
            />
            <span>
              (Optional) I consent to the inclusion of my photograph/darshan experiences in the Mission&apos;s spiritual newsletters and community updates.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

