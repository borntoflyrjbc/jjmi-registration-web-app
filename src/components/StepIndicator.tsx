import React from 'react';
import { User, Award, MapPin, HeartHandshake, BookOpen, CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, onStepClick }) => {
  const steps = [
    { num: 1, label: 'Personal', icon: User },
    { num: 2, label: 'Category', icon: Award },
    { num: 3, label: 'Location', icon: MapPin },
    { num: 4, label: 'Interests', icon: HeartHandshake },
    { num: 5, label: 'Background', icon: BookOpen },
    { num: 6, label: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
      {/* Mobile Bar Progress */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
          <span>Step {currentStep} of {totalSteps}: {steps[currentStep - 1]?.label}</span>
          <span className="text-amber-600 font-bold">{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <React.Fragment key={step.num}>
              <button
                type="button"
                onClick={() => isDone && onStepClick && onStepClick(step.num)}
                disabled={!isDone}
                className={`flex items-center gap-2 group transition text-left ${
                  isDone ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isDone ? '✓' : step.num}
                </div>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-amber-700 font-bold'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </div>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded ${
                    currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-200'
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

