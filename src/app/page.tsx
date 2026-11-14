'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StepIndicator } from '@/components/StepIndicator';
import { StepPersonal } from '@/components/StepPersonal';
import { StepCategory } from '@/components/StepCategory';
import { StepReview } from '@/components/StepReview';
import { PaymentPanel } from '@/components/PaymentPanel';
import { getCategoryById } from '@/lib/categories';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
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
    postal_code: '752001',
    street_address: 'Grand Road, Puri',
    date_of_birth: '1995-01-01',
    participation_category: 'general',
    service_interests: [
      'spiritual_programs',
      'kirtan_satsang',
      'man_samvad',
      'annadan_service',
    ],
    rulesAccepted: true,
    privacyAcknowledged: true,
  });

  const updateFormData = (fields: any) => {
    setFormData((prev: any) => ({ ...prev, ...fields }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      // Graceful spiritual fallbacks for any blank or dummy fields
      const submissionPayload = {
        ...formData,
        full_name: formData.full_name?.trim() || 'Shraddhalu Devotee / साधक',
        email: formData.email?.trim() || 'devotee@jjmi.org',
        phone_number: formData.phone_number?.trim() || '9479492992',
        phone_country_code: formData.phone_country_code || '+91',
        country: formData.country || 'India',
        state_region: formData.state_region || 'Odisha',
        city: formData.city || 'Puri Dham',
        participation_category: formData.participation_category || 'general',
        rulesAccepted: true,
        privacyAcknowledged: true,
      };

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setCreatedRegistration(data.registration);

      // Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      // Move to Step 4 (Payment or Free Success)
      setStep(4);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err: any) {
      setSubmissionError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const category = getCategoryById(formData.participation_category);
  const isFree = category?.id === 'well_wisher' || category?.feeINR === 0;

  return (
    <div className="min-h-screen bg-[#faf6ee] flex flex-col font-sans">
      <Header />

      {/* Royal Navy Hero Banner Strip - Big Edge-to-Edge Artwork */}
      <section className="relative bg-[#081d36] text-white overflow-hidden border-b-2 border-amber-500/30 shadow-md">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Desktop Edge-to-Edge Artwork Container (Fills Right Half from top to bottom flush) */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[50%] lg:w-[52%] h-full overflow-hidden z-0">
          {/* Smooth left-edge fade into navy background */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#081d36] via-[#081d36]/60 to-transparent z-10 pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hero_banner_jagannath_edge_to_edge.png"
            alt="Mahaprabhu Jagannath & Puri Sri Mandir"
            className="w-full h-full object-cover object-center filter drop-shadow-2xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between min-h-[300px] sm:min-h-[340px] md:min-h-[360px]">
            {/* Left Column: Mission & Divine Connection */}
            <div className="w-full md:w-[48%] lg:w-[46%] py-8 sm:py-10 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-400/15 text-amber-300 px-3.5 py-1 rounded-full text-xs font-semibold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Global Spiritual & Humanitarian Movement</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-serif font-black text-white tracking-tight leading-tight">
                Connect with Mahaprabhu Jagannath
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto md:mx-0">
                Join the global Jagannath movement for spirituality, service, Man Samvad inner guidance, and human welfare under the spiritual guidance of Dr. Purshottam Tiwari.
              </p>

              {/* Golden Lotus Divider */}
              <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
                <span className="text-amber-400 text-sm">🪷</span>
                <span className="h-[1px] w-24 bg-gradient-to-l from-transparent to-amber-400/60" />
              </div>
            </div>

            {/* Mobile Edge-to-Edge Artwork (Full Width below text) */}
            <div className="md:hidden w-full -mx-4 w-[calc(100%+2rem)] h-52 sm:h-64 overflow-hidden relative border-t border-amber-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hero_banner_jagannath_edge_to_edge.png"
                alt="Mahaprabhu Jagannath & Puri Sri Mandir"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Working Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-9">
        {step < 4 ? (
          <div>
            {/* 3-Step Progress Bar: Click any step to jump directly */}
            <StepIndicator
              currentStep={step}
              totalSteps={3}
              onStepClick={(s) => setStep(s)}
            />

            {/* Form Container Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-8 relative">
              {/* Top Navigation Row: Back Button on Step 2 & 3 */}
              {step > 1 && (
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>← Back (पिछला कदम)</span>
                  </button>
                  <span className="text-xs text-stone-500 font-medium">
                    Step {step} of 3
                  </span>
                </div>
              )}

              {submissionError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Submission Notice</div>
                    <div>{submissionError}</div>
                  </div>
                </div>
              )}

              {/* 3 Clean Steps */}
              {step === 1 && (
                <StepPersonal
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}

              {step === 2 && (
                <StepCategory
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={{}}
                />
              )}

              {step === 3 && (
                <StepReview
                  formData={formData}
                  updateFormData={updateFormData}
                  onEditStep={(s) => setStep(s)}
                />
              )}

              {/* Bottom Navigation Controls */}
              <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-slate-700 hover:bg-stone-50 font-semibold text-xs sm:text-sm transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back (पिछला)</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-1.5 px-7 py-2.5 rounded-xl bg-[#081d36] hover:bg-[#0c2a4d] text-white font-bold text-xs sm:text-sm transition shadow-2xs ml-auto cursor-pointer"
                  >
                    <span>{step === 1 ? 'Next: Choose Category' : 'Next: Review Details'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold text-sm sm:text-base transition shadow-sm disabled:opacity-50 ml-auto cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Registration...</span>
                      </>
                    ) : (
                      <>
                        <span>{isFree ? 'Complete Free Registration' : 'Proceed to Payment (भुगतान करें)'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Step 4: Completed Registration / Payment Screen */
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-8">
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
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 text-left space-y-3">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <span className="text-xs text-stone-500 font-medium">Application Number:</span>
                    <span className="font-mono font-bold text-amber-800 text-sm sm:text-base bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {createdRegistration?.application_number}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500">Category:</span>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">{createdRegistration?.category_name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500">Registered Email:</span>
                    <span className="text-slate-700 text-xs">{createdRegistration?.email}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500">Mobile Number:</span>
                    <span className="text-slate-700 text-xs font-mono">
                      +91 {createdRegistration?.phone_number}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500">Status:</span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Confirmed (Active)
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCreatedRegistration(null);
                      setStep(1);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition border border-stone-300 cursor-pointer"
                  >
                    ← Register Another Person
                  </button>
                  <Link
                    href={`/success?appNumber=${createdRegistration?.application_number}`}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition text-center"
                  >
                    View Official Confirmation Card
                  </Link>
                </div>
              </div>
            ) : (
              /* Paid Category: UPI QR & Verification Panel with Back to Edit support */
              createdRegistration && (
                <PaymentPanel
                  registration={createdRegistration}
                  onPaymentVerified={() => {
                    // Refresh or celebratory update
                  }}
                  onBackToEdit={() => {
                    setCreatedRegistration(null);
                    setStep(1);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
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
