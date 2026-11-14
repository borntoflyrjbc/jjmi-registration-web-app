import React from 'react';
import { PARTICIPATION_CATEGORIES, SERVICE_INTEREST_OPTIONS } from '@/lib/categories';
import {
  Check,
  Sparkles,
  HeartHandshake,
  CheckSquare,
  Square,
  Music,
  Compass,
  Users,
  ShieldCheck,
  Sun,
  Video,
  Building,
  Globe,
} from 'lucide-react';

interface StepCategoryProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors?: Record<string, string>;
}

// Icon mapper for the 10 service interests
const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4 text-amber-600" />,
  Music: <Music className="w-4 h-4 text-purple-600" />,
  HeartHandshake: <HeartHandshake className="w-4 h-4 text-rose-600" />,
  Compass: <Compass className="w-4 h-4 text-blue-600" />,
  Users: <Users className="w-4 h-4 text-pink-600" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
  Sun: <Sun className="w-4 h-4 text-amber-500" />,
  Video: <Video className="w-4 h-4 text-indigo-600" />,
  Building: <Building className="w-4 h-4 text-stone-600" />,
  Globe: <Globe className="w-4 h-4 text-teal-600" />,
};

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
    <div className="space-y-7">
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
            अपनी सहभागिता श्रेणी एवं सहयोग राशि का चयन करें (Choose your participation tier):
          </p>
        </div>
      </div>

      {/* Grid of All 8 Participation Categories */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            उपलब्ध श्रेणियां (8 Categories)
          </span>
          <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            किसी एक श्रेणी का चयन करें
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PARTICIPATION_CATEGORIES.map((cat) => {
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
                    <div className="flex-1">
                      {cat.popular && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 bg-amber-600 text-white shadow-2xs">
                          लोकप्रिय • Most Popular
                        </span>
                      )}
                      {cat.feeINR === 0 && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 bg-emerald-100 text-emerald-800 border border-emerald-200">
                          निःशुल्क • Free
                        </span>
                      )}
                      {cat.feeINR === 11000 && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 bg-purple-100 text-purple-800 border border-purple-200">
                          आजीवन सम्मान • Lifetime
                        </span>
                      )}

                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                        {cat.hindiName}
                      </h3>
                      <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                        {cat.name}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-base sm:text-lg font-bold font-serif text-[#081d36]">
                        {cat.feeINR === 0 ? 'निःशुल्क' : `₹${cat.feeINR.toLocaleString('en-IN')}`}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        {cat.feeBasis === 'Free'
                          ? 'Free'
                          : cat.feeBasis === 'One-time'
                          ? 'एकमुश्त'
                          : '/ वार्षिक'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-stone-600">
                    {isSelected ? (
                      <span className="text-amber-800 font-bold">✓ चयनित (Selected)</span>
                    ) : (
                      'चुनने के लिए क्लिक करें'
                    )}
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
      </div>

      {/* Section C: सेवा में रुचि (Checkboxes) */}
      <div className="bg-gradient-to-br from-stone-50 to-amber-50/30 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-start justify-between gap-2 border-b border-stone-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-300 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#081d36]">
                सेक्शन C — सेवा में रुचि (Service Interests)
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-600">
                जिन सेवा प्रकल्पों में आप सम्मिलित होना चाहते हैं, उन पर टिक करें (Multiple Select):
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200 flex-shrink-0">
            {selectedInterests.length} चयनित
          </span>
        </div>

        {/* 10 Checkboxes in a Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {SERVICE_INTEREST_OPTIONS.map((opt) => {
            const isChecked = selectedInterests.includes(opt.id);

            return (
              <div
                key={opt.id}
                onClick={() => toggleInterest(opt.id)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-white border-amber-500 shadow-2xs ring-1 ring-amber-500/30 text-slate-900'
                    : 'bg-white/80 border-stone-200 hover:border-stone-300 text-stone-700 hover:bg-white'
                }`}
              >
                <div className="flex-shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-amber-600 fill-amber-50" />
                  ) : (
                    <Square className="w-5 h-5 text-stone-300" />
                  )}
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="flex-shrink-0">{iconMap[opt.icon] || <Sparkles className="w-4 h-4 text-amber-600" />}</span>
                  <span className="text-xs sm:text-sm font-medium leading-tight truncate">
                    {opt.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-stone-500 text-right italic pt-1">
          * आप एक या एक से अधिक सेवा क्षेत्रों का चयन कर सकते हैं।
        </p>
      </div>
    </div>
  );
};
