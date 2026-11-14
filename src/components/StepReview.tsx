import React from 'react';
import { getCategoryById, SERVICE_INTEREST_OPTIONS } from '@/lib/categories';
import { ShieldCheck, User, MapPin, Award, HeartHandshake } from 'lucide-react';

interface StepReviewProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors?: Record<string, string>;
  onEditStep: (step: number) => void;
}

export const StepReview: React.FC<StepReviewProps> = ({ formData, updateFormData, onEditStep }) => {
  const category = getCategoryById(formData.participation_category || 'general');
  const isFree = category?.id === 'well_wisher' || category?.feeINR === 0;

  const selectedInterests = Array.isArray(formData.service_interests) ? formData.service_interests : [];
  const selectedInterestLabels = SERVICE_INTEREST_OPTIONS.filter((opt) =>
    selectedInterests.includes(opt.id)
  );

  return (
    <div className="space-y-5">
      {/* Step Header */}
      <div className="flex items-start gap-3 pb-4 border-b border-stone-200/80">
        <div className="w-10 h-10 rounded-xl bg-amber-100/90 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-[#081d36] tracking-tight">
            Review Your Details • समीक्षा एवं पुष्टि
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            कृपया अपनी जानकारी की समीक्षा करें (Please verify before {isFree ? 'confirming registration' : 'proceeding to payment'}):
          </p>
        </div>
      </div>

      {/* Summary Review Card */}
      <div className="bg-stone-50/80 rounded-2xl border border-stone-200/90 p-4 sm:p-5 space-y-4">
        {/* Category Highlight */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-stone-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-300 flex items-center justify-center text-xl flex-shrink-0">
              {category?.emoji || '🪷'}
            </div>
            <div>
              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">सहभागिता श्रेणी (Category)</div>
              <div className="font-bold text-[#081d36] text-sm sm:text-base">{category?.hindiName}</div>
              <div className="text-xs text-stone-500 font-medium">{category?.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base sm:text-lg font-extrabold text-[#081d36]">
              {isFree ? 'निःशुल्क (Free)' : `₹${category?.feeINR.toLocaleString('en-IN')}`}
            </div>
            <div className="text-[10px] text-stone-500">
              {category?.feeBasis === 'Free' ? 'Free' : category?.feeBasis === 'One-time' ? 'एकमुश्त' : 'वार्षिक'}
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs text-amber-800 hover:underline font-bold mt-0.5 inline-block cursor-pointer"
            >
              श्रेणी बदलें
            </button>
          </div>
        </div>

        {/* Personal & Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <div className="text-stone-400 text-xs font-medium flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>Full Name (नाम)</span>
            </div>
            <div className="font-bold text-slate-800 mt-0.5">
              {formData.full_name || 'Shraddhalu Devotee'}
            </div>
          </div>

          <div>
            <div className="text-stone-400 text-xs font-medium">Mobile Number (मोबाइल)</div>
            <div className="font-bold text-slate-800 mt-0.5 font-mono">
              +91 {formData.phone_number || '9479492992'}
            </div>
          </div>

          <div>
            <div className="text-stone-400 text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location (स्थान)</span>
            </div>
            <div className="font-medium text-slate-800 mt-0.5">
              {[formData.city || 'Puri', formData.state_region || 'Odisha'].filter(Boolean).join(', ')}
            </div>
          </div>

          {formData.email && (
            <div>
              <div className="text-stone-400 text-xs font-medium">Email (ईमेल)</div>
              <div className="font-medium text-slate-800 mt-0.5 truncate">
                {formData.email}
              </div>
            </div>
          )}
        </div>

        {/* Selected Service Interests (Section C) */}
        {selectedInterestLabels.length > 0 && (
          <div className="pt-3 border-t border-stone-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                <span>सेवा में रुचि (Selected Service Interests):</span>
              </span>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-[11px] text-amber-800 hover:underline font-semibold cursor-pointer"
              >
                संशोधन करें
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {selectedInterestLabels.map((item) => (
                <span
                  key={item.id}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-100/70 text-amber-900 border border-amber-200/80 flex items-center gap-1"
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Edit Details Button */}
        <div className="pt-2 border-t border-stone-200/70 flex justify-end">
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-xs text-amber-800 hover:text-amber-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Edit Personal Info (नाम/नंबर बदलें)</span>
          </button>
        </div>
      </div>

      {/* Simple 1-line Declaration */}
      <div className="p-3.5 rounded-xl border border-stone-200 bg-white shadow-2xs">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-800 select-none">
          <input
            type="checkbox"
            checked={formData.rulesAccepted !== false}
            onChange={(e) => updateFormData({ rulesAccepted: e.target.checked })}
            className="mt-0.5 w-4 h-4 text-amber-700 rounded border-stone-300 focus:ring-amber-500 accent-amber-700"
          />
          <span>
            मैं <strong>जय जगन्नाथ मिशन अन्तर्राष्ट्रीय</strong> की आध्यात्मिक, सेवा एवं सांस्कृतिक कल्याणकारी गतिविधियों में सम्मिलित होने हेतु पूर्णतः सहमत हूँ।
          </span>
        </label>
      </div>
    </div>
  );
};
