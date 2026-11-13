import React from 'react';
import { SERVICE_INTEREST_OPTIONS } from '@/lib/categories';
import { Check, Sparkles, HeartHandshake } from 'lucide-react';

interface StepInterestsProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export const StepInterests: React.FC<StepInterestsProps> = ({ formData, updateFormData }) => {
  const selectedInterests: string[] = formData.service_interests || [];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      updateFormData({ service_interests: selectedInterests.filter((item) => item !== id) });
    } else {
      updateFormData({ service_interests: [...selectedInterests, id] });
    }
  };

  const selectAll = () => {
    updateFormData({ service_interests: SERVICE_INTEREST_OPTIONS.map((o) => o.id) });
  };

  const clearAll = () => {
    updateFormData({ service_interests: [] });
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">4</span>
            Areas of Service Interest • सेवा रुचि के क्षेत्र
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose the seva areas where you wish to contribute or participate. (Multi-select)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={selectAll}
            className="text-amber-700 hover:text-amber-800 font-semibold px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 transition"
          >
            Select All
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={clearAll}
            className="text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Grid of Interests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICE_INTEREST_OPTIONS.map((item) => {
          const isSelected = selectedInterests.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => toggleInterest(item.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 flex items-start gap-3 select-none ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/70 text-slate-900 shadow-sm ring-1 ring-amber-400'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition flex-shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'border-slate-300 bg-slate-50'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="text-xs sm:text-sm font-medium leading-snug">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Counter */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-amber-600" />
          <span>Total Selected Seva Streams:</span>
        </span>
        <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
          {selectedInterests.length} of {SERVICE_INTEREST_OPTIONS.length}
        </span>
      </div>
    </div>
  );
};

