import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, onStepClick }) => {
  const steps = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Category' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Interests' },
    { num: 5, label: 'Background' },
    { num: 6, label: 'Review' },
  ];

  return (
    <div className="w-full bg-white border border-stone-200/80 rounded-2xl p-3 sm:px-6 sm:py-3.5 shadow-sm mb-6">
      {/* Mobile Bar Progress */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#081d36] text-white inline-flex items-center justify-center text-[11px] font-bold">
              {currentStep}
            </span>
            <span>{steps[currentStep - 1]?.label}</span>
          </span>
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

      {/* Desktop Stepper matching Reference Image */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, idx) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <React.Fragment key={step.num}>
              <button
                type="button"
                onClick={() => onStepClick && onStepClick(step.num)}
                className="flex items-center gap-2.5 group transition text-left cursor-pointer hover:opacity-90"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    isCurrent
                      ? 'bg-[#081d36] text-white shadow-sm ring-2 ring-[#081d36]/20'
                      : isDone
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'border border-slate-300 text-slate-500 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {isDone ? '✓' : step.num}
                </div>
                <div>
                  <div
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-[#081d36]'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-[10px] leading-tight ${
                      isCurrent
                        ? 'text-amber-700 font-semibold'
                        : isDone
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {isCurrent ? 'In Progress' : isDone ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div className="flex-1 h-[1.5px] mx-3 bg-stone-200" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
