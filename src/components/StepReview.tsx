import React from 'react';
import Link from 'next/link';
import { getCategoryById } from '@/lib/categories';
import { ShieldCheck, User, MapPin, Award, ExternalLink } from 'lucide-react';

interface StepReviewProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors?: Record<string, string>;
  onEditStep: (step: number) => void;
}

export const StepReview: React.FC<StepReviewProps> = ({ formData, updateFormData, onEditStep }) => {
  const category = getCategoryById(formData.participation_category || 'general');
  const isFree = category?.id === 'well_wisher' || category?.feeINR === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3.5 pb-4 border-b border-stone-200/80">
        <div className="w-11 h-11 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-[#081d36] tracking-tight">
            Review & Consent • समीक्षा एवं घोषणा
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Please review your details before proceeding to {isFree ? 'confirm registration' : 'payment'}.
          </p>
        </div>
      </div>

      {/* Summary Review Card */}
      <div className="bg-stone-50/70 rounded-2xl border border-stone-200/90 p-5 space-y-4">
        {/* Category Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold flex-shrink-0">
              <Award className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">Selected Category</div>
              <div className="font-bold text-[#081d36] text-base">{category?.name}</div>
              <div className="text-xs text-amber-800 font-medium">{category?.hindiName}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg sm:text-xl font-extrabold text-[#081d36]">
              {isFree ? '₹0 Free' : `₹${category?.feeINR.toLocaleString('en-IN')}`}
            </div>
            <div className="text-xs text-stone-500">{category?.feeBasis}</div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs text-amber-800 hover:underline font-semibold mt-1 inline-block"
            >
              Change
            </button>
          </div>
        </div>

        {/* Personal & Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <div className="text-stone-400 text-xs font-medium flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>Full Name</span>
            </div>
            <div className="font-semibold text-slate-800 mt-0.5">{formData.full_name || 'Shraddhalu Devotee'}</div>
          </div>

          <div>
            <div className="text-stone-400 text-xs font-medium">Email Address</div>
            <div className="font-semibold text-slate-800 mt-0.5 break-all">{formData.email || 'devotee@jjmi.org'}</div>
          </div>

          <div>
            <div className="text-stone-400 text-xs font-medium">Mobile (Calling)</div>
            <div className="font-semibold text-slate-800 mt-0.5 font-mono">
              {formData.phone_country_code || '+91'} {formData.phone_number || '9479492992'}
            </div>
          </div>

          <div>
            <div className="text-stone-400 text-xs font-medium">WhatsApp</div>
            <div className="font-semibold text-slate-800 mt-0.5 font-mono">
              {formData.whatsapp_country_code || formData.phone_country_code || '+91'} {formData.whatsapp_number || formData.phone_number || '9479492992'}
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="text-stone-400 text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </div>
            <div className="font-semibold text-slate-800 mt-0.5">
              {[formData.city || 'Puri', formData.state_region || 'Odisha', formData.country || 'India'].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Declarations & Consent (Non-blocking, pre-checked for ease) */}
      <div className="space-y-3 pt-1">
        <h3 className="text-sm font-bold text-[#081d36] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Rules & Declarations / सहमति एवं घोषणा</span>
        </h3>

        {/* Checkbox 1: Rules & Discipline */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50/50 transition">
          <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-800 select-none">
            <input
              type="checkbox"
              checked={formData.rulesAccepted !== false}
              onChange={(e) => updateFormData({ rulesAccepted: e.target.checked })}
              className="mt-0.5 w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-500 accent-amber-700"
            />
            <span>
              I have read and agree to the{' '}
              <Link href="/rules" target="_blank" className="text-amber-800 underline font-semibold inline-flex items-center gap-0.5">
                Participation Rules & Discipline <ExternalLink className="w-3 h-3" />
              </Link>{' '}
              of Jai Jagannath Mission International.
            </span>
          </label>
        </div>

        {/* Checkbox 2: Privacy Notice */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50/50 transition">
          <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-800 select-none">
            <input
              type="checkbox"
              checked={formData.privacyAcknowledged !== false}
              onChange={(e) => updateFormData({ privacyAcknowledged: e.target.checked })}
              className="mt-0.5 w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-500 accent-amber-700"
            />
            <span>
              I have read the{' '}
              <Link href="/privacy" target="_blank" className="text-amber-800 underline font-semibold inline-flex items-center gap-0.5">
                Privacy Notice <ExternalLink className="w-3 h-3" />
              </Link>{' '}
              and understand that registration details are utilized solely for mission activities.
            </span>
          </label>
        </div>

        {/* Checkbox 3: Photo Consent */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50/50 transition">
          <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700 select-none">
            <input
              type="checkbox"
              checked={formData.photo_publicity_consent || false}
              onChange={(e) => updateFormData({ photo_publicity_consent: e.target.checked })}
              className="mt-0.5 w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-500 accent-amber-700"
            />
            <span>
              (Optional) I consent to inclusion of my photograph/darshan experiences in the Mission&apos;s spiritual newsletters.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
