import React from 'react';
import { PARTICIPATION_CATEGORIES } from '@/lib/categories';
import { Check, Sparkles } from 'lucide-react';

interface StepCategoryProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export const StepCategory: React.FC<StepCategoryProps> = ({ formData, updateFormData, errors }) => {
  const selectedCat = formData.participation_category || 'general';

  const handleSelect = (catId: string) => {
    updateFormData({ participation_category: catId });
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">2</span>
          Participation Category • सहभागिता श्रेणी
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select how you wish to associate with Jai Jagannath Mission International.
        </p>
      </div>

      {errors.participation_category && (
        <p className="text-red-600 text-xs font-semibold bg-red-50 p-2 rounded-lg border border-red-200">
          {errors.participation_category}
        </p>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {PARTICIPATION_CATEGORIES.map((cat) => {
          const isSelected = selectedCat === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {cat.tag && (
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5 ${
                          cat.popular
                            ? 'bg-amber-600 text-white'
                            : cat.feeINR === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cat.tag}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                      {cat.name}
                    </h3>
                    <div className="text-xs text-amber-800 font-medium">{cat.hindiName}</div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition flex-shrink-0 mt-1 ${
                      isSelected
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'border-slate-300 bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Price & Billing Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-base sm:text-lg font-extrabold text-slate-900">
                    {cat.feeINR === 0 ? 'Free (निःशुल्क)' : `₹${cat.feeINR.toLocaleString('en-IN')}`}
                  </span>
                  {cat.feeINR > 0 && (
                    <span className="text-xs text-slate-500 ml-1">/ {cat.feeBasis}</span>
                  )}
                </div>
                <div className="text-[11px] font-medium text-slate-500">
                  {cat.feeINR === 0 ? 'No Payment Required' : `${cat.feeBasis} Contribution`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Summary Note */}
      <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Selected:{' '}
            <strong className="text-amber-300">
              {PARTICIPATION_CATEGORIES.find((c) => c.id === selectedCat)?.name}
            </strong>
          </span>
        </div>
        <div className="font-bold text-amber-400">
          {PARTICIPATION_CATEGORIES.find((c) => c.id === selectedCat)?.feeINR === 0
            ? '₹0 (Free Registration)'
            : `₹${PARTICIPATION_CATEGORIES.find((c) => c.id === selectedCat)?.feeINR} ${
                PARTICIPATION_CATEGORIES.find((c) => c.id === selectedCat)?.feeBasis
              }`}
        </div>
      </div>
    </div>
  );
};

