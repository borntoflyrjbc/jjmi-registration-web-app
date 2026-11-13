'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StepIndicator } from '@/components/StepIndicator';
import { StepPersonal } from '@/components/StepPersonal';
import { StepCategory } from '@/components/StepCategory';
import { StepLocation } from '@/components/StepLocation';
import { StepInterests } from '@/components/StepInterests';
import { StepBackground } from '@/components/StepBackground';
import { StepReview } from '@/components/StepReview';
import { PaymentPanel } from '@/components/PaymentPanel';
import { getCategoryById } from '@/lib/categories';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Heart, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [createdRegistration, setCreatedRegistration] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    full_name: '',
    email: '',
    phone_country_code: '+91',
    phone_number: '',
    whatsapp_country_code: '+91',
    whatsapp_number: '',
    country: 'India',
    state_region: '',
    city: '',
    postal_code: '',
    street_address: '',
    date_of_birth: '',
    participation_category: 'general',
    service_interests: [
      'spiritual_programs',
      'kirtan_satsang',
      'man_samvad',
      'annadan_service',
    ],
    qualification_experience: '',
    availability: 'Weekends Only',
    joining_purpose: '',
    rulesAccepted: false,
    privacyAcknowledged: false,
    photo_publicity_consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (fields: any) => {
    setFormData((prev: any) => ({ ...prev, ...fields }));
    // Clear relevant errors
    const keys = Object.keys(fields);
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((k) => delete next[k]);
      return next;
    });
  };

  const validateStep = (s: number): boolean => {
    const err: Record<string, string> = {};

    if (s === 1) {
      if (!formData.full_name?.trim()) err.full_name = 'Please enter your full name.';
      if (!formData.phone_number?.trim() || formData.phone_number.trim().length < 8) {
        err.phone_number = 'Please enter a valid mobile number.';
      }
      if (!formData.email?.trim() || !formData.email.includes('@')) {
        err.email = 'Please enter a valid email address.';
      }
    } else if (s === 2) {
      if (!formData.participation_category) {
        err.participation_category = 'Please select a participation category.';
      }
    } else if (s === 3) {
      if (!formData.country?.trim()) err.country = 'Please select your country.';
      if (!formData.state_region?.trim()) err.state_region = 'Please enter your state / province.';
      if (!formData.city?.trim()) err.city = 'Please enter your city / town.';
    } else if (s === 6) {
      if (!formData.rulesAccepted) {
        err.rulesAccepted = 'You must read and agree to the participation rules.';
      }
      if (!formData.privacyAcknowledged) {
        err.privacyAcknowledged = 'You must acknowledge the privacy notice to register.';
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setCreatedRegistration(data.registration);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      // Move to Step 7 (Payment or Free Success)
      setStep(7);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } catch (err: any) {
      setSubmissionError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const category = getCategoryById(formData.participation_category);
  const isFree = category?.id === 'well_wisher' || category?.feeINR === 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      {/* Hero Visual Banner Strip */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-6 sm:py-10 border-b border-amber-600/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Column: Mission Message */}
            <div className="md:col-span-7 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Global Spiritual & Humanitarian Movement</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
                Connect with Mahaprabhu Jagannath
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Join the global Jagannath movement for spirituality, service, Man Samvad inner guidance, and human welfare under the spiritual guidance of Dr. Purshottam Tiwari.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Organization</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant Unique Application No.</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Official UPI QR Integration</span>
                </span>
              </div>
            </div>

            {/* Right Column: Visual Artwork Cards */}
            <div className="md:col-span-5 flex items-center justify-center gap-3">
              <div className="relative w-40 h-44 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-slate-950 flex-shrink-0 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/jagannath_deities.png"
                  alt="Lord Jagannath Balabhadra Subhadra"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-[10px] font-bold text-amber-300">
                  श्री जगन्नाथ • बलभद्र • सुभद्रा
                </div>
              </div>

              <div className="relative w-40 h-44 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-slate-950 flex-shrink-0 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/jagannath_temple.png"
                  alt="Puri Sri Jagannath Temple"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-[10px] font-bold text-amber-300">
                  श्री जगन्नाथ धाम, पुरी
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-10">
        {step < 7 ? (
          <div>
            {/* Step Progress Bar */}
            <StepIndicator
              currentStep={step}
              totalSteps={6}
              onStepClick={(s) => {
                if (s < step) setStep(s);
              }}
            />

            {/* Form Container Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-8 relative">
              {submissionError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Submission Error</div>
                    <div>{submissionError}</div>
                  </div>
                </div>
              )}

              {/* Step Forms */}
              {step === 1 && (
                <StepPersonal
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {step === 2 && (
                <StepCategory
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {step === 3 && (
                <StepLocation
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {step === 4 && (
                <StepInterests
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {step === 5 && (
                <StepBackground
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                />
              )}

              {step === 6 && (
                <StepReview
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                  onEditStep={(s) => setStep(s)}
                />
              )}

              {/* Navigation Controls */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 6 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition shadow-sm ml-auto"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm sm:text-base transition shadow-md disabled:opacity-50 ml-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Registration...</span>
                      </>
                    ) : (
                      <>
                        <span>{isFree ? 'Complete Free Registration' : 'Proceed to Payment'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Step 7: Completed Registration / Payment Screen */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-8">
            {isFree ? (
              /* Free Well-Wisher Success State */
              <div className="text-center py-6 space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Registration Confirmed (निःशुल्क पंजीकरण)
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 pt-2">
                    जय जगन्नाथ! Welcome to the Mission
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Dear <strong className="text-slate-800">{createdRegistration?.full_name}</strong>, your well-wisher registration has been successfully recorded.
                  </p>
                </div>

                {/* Application Certificate Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs text-slate-500 font-medium">Application Number:</span>
                    <span className="font-mono font-bold text-amber-800 text-sm sm:text-base bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {createdRegistration?.application_number}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Category:</span>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">{createdRegistration?.category_name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Registered Email:</span>
                    <span className="text-slate-700 text-xs">{createdRegistration?.email}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Mobile Number:</span>
                    <span className="text-slate-700 text-xs">
                      {createdRegistration?.phone_country_code} {createdRegistration?.phone_number}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Status:</span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Confirmed (Active)
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition"
                  >
                    Print Registration Slip
                  </button>
                  <Link
                    href={`/success?appNumber=${createdRegistration?.application_number}`}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition text-center"
                  >
                    View Official Confirmation Card
                  </Link>
                </div>
              </div>
            ) : (
              /* Paid Category: UPI QR & Verification Panel */
              createdRegistration && (
                <PaymentPanel
                  registration={createdRegistration}
                  onPaymentVerified={() => {
                    // Optional callback
                  }}
                />
              )
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

