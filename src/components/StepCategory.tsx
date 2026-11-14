import React from 'react';
import { PARTICIPATION_CATEGORIES, SERVICE_INTEREST_OPTIONS } from '@/lib/categories';
import {
  Check,
  Sparkles,
  HeartHandshake,
  CheckSquare,
  Square,
} from 'lucide-react';

interface StepCategoryProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors?: Record<string, string>;
}

export const StepCategory: React.FC<StepCategoryProps> = ({ formData, updateFormData }) => {
  const selectedCat = formData.participation_category || 'general';
  const selectedInterests: string[] = Array.isArray(formData.service_interests)
    ? formData.service_interests
    : ['spiritual_programs', 'man_samvad'];

  const handleSelect = (catId: string) => {
    updateFormData({ participation_category: catId });
  };

  const toggleInterest = (interestId: string) => {
    const updated = selectedInterests.includes(interestId)
      ? selectedInterests.filter((id: string) => id !== interestId)
      : [...selectedInterests, interestId];
    updateFormData({ service_interests: updated });
  };

  return (
    <div className="space-y-5">
      {/* Step Header (Compact & Clean) */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-800 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-[#081d36] leading-tight">
              सहभागिता श्रेणी एवं सहयोग राशि
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500">
              अपनी श्रेणी चुनें (8 विकल्प उपलब्ध):
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200/90 flex-shrink-0">
          चरण 2 / 3
        </span>
      </div>

      {/* Grid of All 8 Categories: 2 Columns on Mobile, 4 Columns on Desktop */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {PARTICIPATION_CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`relative cursor-pointer rounded-xl p-2.5 sm:p-3 border transition-all flex flex-col justify-between text-left select-none ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/90 shadow-sm ring-2 ring-amber-500/30'
                    : 'border-stone-200/90 bg-white hover:border-amber-300 hover:shadow-2xs'
                }`}
              >
                {/* Popular / Lifetime Badge */}
                {cat.popular && (
                  <span className="absolute -top-2 right-2 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-600 text-white shadow-2xs">
                    लोकप्रिय
                  </span>
                )}
                {cat.feeINR === 11000 && (
                  <span className="absolute -top-2 right-2 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-600 text-white shadow-2xs">
                    आजीवन
                  </span>
                )}

                <div>
                  {/* Top Row: Emoji + Price Tag */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-lg sm:text-xl leading-none">{cat.emoji}</span>
                    <span
                      className={`text-xs sm:text-sm font-bold font-serif px-1.5 py-0.5 rounded ${
                        cat.feeINR === 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : isSelected
                          ? 'bg-amber-700 text-white'
                          : 'bg-stone-100 text-slate-800'
                      }`}
                    >
                      {cat.feeINR === 0
                        ? 'निःशुल्क'
                        : `₹${cat.feeINR >= 1000 ? cat.feeINR.toLocaleString('en-IN') : cat.feeINR}`}
                    </span>
                  </div>

                  {/* Category Title */}
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                    {cat.hindiName}
                  </h3>
                  <div className="text-[10px] text-stone-400 font-medium truncate">
                    {cat.name}
                  </div>

                  {/* 1-Line Benefit Tagline */}
                  <p className="text-[10px] text-stone-500 mt-1 line-clamp-1 leading-tight">
                    {cat.shortDesc}
                  </p>
                </div>

                {/* Bottom Selection Radio */}
                <div className="mt-2 pt-1.5 border-t border-stone-200/50 flex items-center justify-between text-[10px]">
                  <span className="text-stone-400 text-[9px]">
                    {cat.feeBasis === 'Free'
                      ? 'Free'
                      : cat.feeBasis === 'One-time'
                      ? 'एकमुश्त'
                      : '/ वार्षिक'}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-amber-700 text-white shadow-2xs'
                        : 'border border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section C: सेवा में रुचि (Compact Mobile-Friendly Checkbox Grid with Emojis) */}
      <div className="bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-50 border border-stone-200/90 rounded-2xl p-3 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between border-b border-stone-200/70 pb-2">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs sm:text-sm font-bold text-[#081d36]">
              सेक्शन C — सेवा में रुचि (Service Interests)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200 flex-shrink-0">
            {selectedInterests.length} चयनित (Multiple)
          </span>
        </div>

        <p className="text-[11px] text-stone-500 leading-tight">
          जिन सेवा प्रकल्पों में आप सम्मिलित होना चाहते हैं, उन पर टिक करें:
        </p>

        {/* 10 Compact Checkbox Pills: 2 Columns on Mobile & Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
          {SERVICE_INTEREST_OPTIONS.map((opt) => {
            const isChecked = selectedInterests.includes(opt.id);

            return (
              <div
                key={opt.id}
                onClick={() => toggleInterest(opt.id)}
                className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-white border-amber-500 shadow-2xs ring-1 ring-amber-500/30 text-slate-900 font-semibold'
                    : 'bg-white/80 border-stone-200 hover:border-stone-300 text-stone-700 hover:bg-white'
                }`}
              >
                <div className="flex-shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-700 fill-amber-50" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-300" />
                  )}
                </div>

                <span className="text-base leading-none flex-shrink-0">{opt.emoji}</span>

                <span className="text-xs font-medium leading-tight truncate">
                  {opt.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
