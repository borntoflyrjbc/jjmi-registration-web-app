import React from 'react';
import { PARTICIPATION_CATEGORIES } from '@/lib/categories';
import { Check, Sparkles, Heart } from 'lucide-react';

interface StepCategoryProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors?: Record<string, string>;
}

export const StepCategory: React.FC<StepCategoryProps> = ({ formData, updateFormData }) => {
  const selectedCat = formData.participation_category || 'general';

  // 4 Primary interest tags
  const interestOptions = [
    { id: 'spiritual_programs', label: 'Satsang & Spiritual Discourses (सत्संग एवं प्रवचन)' },
    { id: 'kirtan_satsang', label: 'Bhajan & Kirtan (भजन एवं संकीर्तन)' },
    { id: 'annadan_service', label: 'Food Charity & Social Service (अन्नदान एवं मानव सेवा)' },
    { id: 'man_samvad', label: 'Man Samvad Inner Guidance (मन संवाद मार्गदर्शन)' },
  ];

  const handleSelect = (catId: string) => {
    updateFormData({ participation_category: catId });
  };

  const toggleInterest = (interestId: string) => {
    const current = formData.service_interests || [];
    const updated = current.includes(interestId)
      ? current.filter((id: string) => id !== interestId)
      : [...current, interestId];
    updateFormData({ service_interests: updated });
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex items-start gap-3 pb-4 border-b border-stone-200/80">
        <div className="w-10 h-10 rounded-xl bg-amber-100/90 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 shadow-2xs">
          <Sparkles className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-[#081d36] tracking-tight">
            Select Category • सहभागिता श्रेणी
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Choose your category to contribute and participate in mission initiatives.
          </p>
        </div>
      </div>

      {/* Grid of Main Categories (Clear, simple cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {PARTICIPATION_CATEGORIES.slice(0, 4).map((cat) => {
          const isSelected = selectedCat === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {cat.popular && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 bg-amber-600 text-white">
                        Most Popular • लोकप्रिय
                      </span>
                    )}
                    {cat.feeINR === 0 && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 bg-emerald-100 text-emerald-800">
                        Free • निःशुल्क
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                      {cat.name}
                    </h3>
                    <div className="text-xs text-amber-900 font-medium mt-0.5">
                      {cat.hindiName}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                      {cat.feeINR === 0 ? 'Free' : `₹${cat.feeINR}`}
                    </span>
                    {cat.feeINR > 0 && (
                      <span className="text-[10px] text-stone-500 block">/ annual</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                <span className="text-[11px] font-medium text-stone-500">
                  {isSelected ? 'Selected • चुना गया' : 'Click to select'}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition ${
                    isSelected ? 'bg-amber-600 text-white' : 'border border-stone-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Seva Interest Tags */}
      <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Heart className="w-4 h-4 text-amber-600" />
          <span>Areas of Interest • सेवा एवं रुचि के क्षेत्र (Optional)</span>
        </div>
        <p className="text-[11px] text-stone-500">
          Tap the areas where you would love to participate or receive updates:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {interestOptions.map((opt) => {
            const isChecked = (formData.service_interests || []).includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleInterest(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border ${
                  isChecked
                    ? 'bg-[#081d36] text-white border-[#081d36] shadow-2xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                {isChecked ? '✓ ' : '+ '}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
