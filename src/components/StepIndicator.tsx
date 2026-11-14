import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps = 3, 
  onStepClick 
}) => {
  const steps = [
    { num: 1, label: 'Your Details', hindi: 'आपकी जानकारी' },
    { num: 2, label: 'Category', hindi: 'सहभागिता श्रेणी' },
    { num: 3, label: 'Review & Pay', hindi: 'समीक्षा एवं पुष्टि' },
  ];

  return (
    <div className="w-full bg-white border border-stone-200/90 rounded-2xl p-3 sm:px-6 sm:py-3.5 shadow-2xs mb-5">
      {/* Mobile Bar Progress with tapable back indicator */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#081d36] text-white inline-flex items-center justify-center text-[11px] font-bold">
              {currentStep}
            </span>
            <span className="font-bold text-[#081d36]">{steps[currentStep - 1]?.label}</span>
            <span className="text-stone-400 font-normal">({steps[currentStep - 1]?.hindi})</span>
          </div>
          <span className="text-amber-700 font-bold text-[11px]">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#081d36] to-[#b45309] transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper: Tap any previous step to jump back instantly */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, idx) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          const isClickable = true; // User can click any step to rectify or review

          return (
            <React.Fragment key={step.num}>
              <button
                type="button"
                onClick={() => onStepClick && onStepClick(step.num)}
                className={`flex items-center gap-3 transition text-left cursor-pointer group ${
                  isClickable ? 'hover:opacity-90' : 'cursor-default'
                }`}
                title={`Go to Step ${step.num}: ${step.label}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition shadow-2xs ${
                    isCurrent
                      ? 'bg-[#081d36] text-white ring-2 ring-[#081d36]/20'
                      : isDone
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-500 border border-stone-200'
                  }`}
                >
                  {isDone ? '✓' : step.num}
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${
                    isCurrent ? 'text-[#081d36]' : isDone ? 'text-emerald-900' : 'text-stone-500'
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-[10px] text-stone-400 leading-tight">
                    {step.hindi}
                  </div>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-4 transition ${
                    currentStep > idx + 1 ? 'bg-emerald-600' : 'bg-stone-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
