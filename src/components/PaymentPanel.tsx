'use client';

import React, { useState } from 'react';
import { UPI_CONFIG, MISSION_WHATSAPP_NUMBER } from '@/lib/categories';
import { 
  QrCode, Download, ExternalLink, CheckCircle2, ShieldCheck, 
  Copy, ArrowRight, AlertCircle, RefreshCw, Eye, MessageCircle 
} from 'lucide-react';

interface PaymentPanelProps {
  registration: any;
  onPaymentVerified?: () => void;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({ registration, onPaymentVerified }) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [showOriginalCard, setShowOriginalCard] = useState(false);

  const feeNumber = registration.feeINR !== undefined 
    ? registration.feeINR 
    : (registration.fee_amount_minor ? registration.fee_amount_minor / 100 : 500);
  const amountINR = String(feeNumber);
  const feeBasis = registration.feeBasis || registration.fee_basis || 'Annual';
  const appNumber = registration.application_number;
  const applicantName = registration.full_name || 'Participant';
  const categoryName = registration.category_name || 'General Participant';

  // NPCI Standard UPI Link
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(UPI_CONFIG.vpa)}&pn=${encodeURIComponent(
    UPI_CONFIG.payeeName
  )}&am=${encodeURIComponent(amountINR)}&cu=INR&tn=${encodeURIComponent(appNumber)}`;

  // Dynamic QR Code Endpoints
  const qrImageUrl = `/api/qr?amount=${amountINR}&appNumber=${encodeURIComponent(appNumber)}`;
  const qrDownloadUrl = `/api/qr?amount=${amountINR}&appNumber=${encodeURIComponent(appNumber)}&download=1`;

  // WhatsApp Pre-filled Confirmation Message per Guidelines
  const buildWhatsAppMessage = () => {
    const lines = [
      'Hello Jai Jagannath Mission International Team,',
      '',
      'I have completed the payment for my participant application. Kindly verify the payment and confirm my registration.',
      '',
      `Application Number: ${appNumber}`,
      `Name: ${applicantName}`,
      `Participation Category: ${categoryName}`,
      `Amount Paid: ₹${Number(amountINR).toLocaleString('en-IN')} INR`,
      utrNumber.trim() ? `Payment Reference / UTR: ${utrNumber.trim()}` : null,
    ].filter(Boolean);

    return lines.join('\n');
  };

  const whatsappUrl = `https://wa.me/${MISSION_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;

  const copyVpa = () => {
    navigator.clipboard.writeText(UPI_CONFIG.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 4) {
      setErrorMsg('Please enter a valid UPI UTR or Transaction Reference number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationNumber: appNumber,
          reference: utrNumber.trim(),
          method: 'UPI',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit verification');
      }

      setSubmitSuccess(true);
      if (onPaymentVerified) {
        onPaymentVerified();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting payment verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-center">
        <span className="inline-block bg-[#081d36] text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-amber-500/30">
          Payment & Verification
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#081d36]">
          Complete Your Payment
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-lg mx-auto">
          Scan the official UPI QR code below with Google Pay, PhonePe, Paytm, BHIM, or any banking app to complete your contribution.
        </p>
      </div>

      {/* 2. Order Summary Card */}
      <div className="bg-[#081d36] text-white rounded-2xl p-4 sm:p-5 shadow-md border border-amber-500/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="text-center sm:text-left">
            <div className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">Application Reference</div>
            <div className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider mt-0.5">
              {appNumber}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Applicant: <span className="text-white font-medium">{applicantName}</span> ({categoryName})
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-[11px] text-slate-300 uppercase tracking-wider">Total Payable Amount</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">
              ₹{Number(amountINR).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-amber-200/80">{feeBasis} Contribution</div>
          </div>
        </div>

        {/* Mobile Fast Pay Button */}
        <div className="mt-3.5 sm:hidden">
          <a
            href={upiIntentUrl}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition"
          >
            <QrCode className="w-5 h-5" />
            <span>Pay ₹{amountINR} via Any UPI App</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>

      {/* 3. Main Payment Grid (QR Code + Official Details & WhatsApp Action) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Code Container */}
        <div className="md:col-span-5 bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center">
          <div className="flex items-center justify-between w-full border-b border-stone-100 pb-2 mb-3 text-xs">
            <span className="font-bold text-[#081d36] flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-amber-700" />
              <span>Scan QR to Pay</span>
            </span>
            <button
              type="button"
              onClick={() => setShowOriginalCard(!showOriginalCard)}
              className="text-amber-800 hover:underline flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showOriginalCard ? 'Show QR Code' : 'View Bank Standee'}</span>
            </button>
          </div>

          {/* Genuine QR Box with Scanning Indicator */}
          <div className="relative p-2.5 bg-white border-2 border-stone-200 rounded-2xl shadow-inner group overflow-hidden">
            {showOriginalCard ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/assets/purushottam_tiwari_official_qr.jpg"
                alt="Official HDFC Bank Standee QR"
                className="w-56 h-auto max-h-72 object-contain rounded-lg mx-auto"
              />
            ) : (
              <div className="relative w-52 h-52 sm:w-56 sm:h-56 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl}
                  alt={`Payment QR Code for Application ${appNumber}`}
                  className="w-full h-full object-contain rounded-lg"
                />
                {/* Restrained Scanner Line Animation */}
                <div 
                  className="absolute inset-x-0 h-[2px] bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.8)] pointer-events-none animate-[scanline_2.8s_ease-in-out_infinite]"
                  style={{ top: '15%' }}
                />
              </div>
            )}
          </div>

          {/* Instruction Helper Text */}
          <p className="text-xs text-stone-500 mt-2.5 leading-relaxed">
            Open your UPI app and scan this QR code to complete your payment.
          </p>

          {/* Download QR Button (Exact file per prompt guidelines) */}
          <div className="w-full mt-3 pt-3 border-t border-stone-100 flex flex-col gap-1.5">
            <a
              href={qrDownloadUrl}
              download={`JJMI-Payment-${appNumber}.png`}
              className="min-h-[44px] w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-xl transition border border-stone-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Download QR</span>
            </a>
            <p className="text-[10px] text-stone-400">
              After downloading, find the QR in your Downloads folder or save it to your Gallery.
            </p>
          </div>
        </div>

        {/* Right Column: Beneficiary Details + WhatsApp Confirmation + UTR Submit */}
        <div className="md:col-span-7 space-y-4">
          {/* Beneficiary Details Card */}
          <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="font-bold text-[#081d36] text-sm flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Official Beneficiary Information</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                HDFC Bank
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 font-medium">Beneficiary Name:</span>
              <span className="font-bold text-slate-900">{UPI_CONFIG.payeeName}</span>
            </div>

            <div className="flex justify-between items-center py-1 bg-white p-2.5 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Official UPI ID / VPA</span>
                <span className="font-mono font-bold text-[#081d36] text-xs sm:text-sm select-all">
                  {UPI_CONFIG.vpa}
                </span>
              </div>
              <button
                type="button"
                onClick={copyVpa}
                className="flex items-center gap-1 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200 font-semibold transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedVpa ? 'Copied!' : 'Copy UPI'}</span>
              </button>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 font-medium">Mission Contact:</span>
              <a href="tel:+919479492992" className="font-semibold text-amber-800 hover:underline">
                {UPI_CONFIG.helplinePhone}
              </a>
            </div>
          </div>

          {/* Prominent WhatsApp Confirmation Button per Add-on Prompt */}
          <div className="bg-emerald-50/70 border-2 border-emerald-500/40 rounded-2xl p-4 text-center space-y-2">
            <div className="text-xs font-bold text-emerald-900">
              Instant Payment Confirmation via WhatsApp
            </div>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-5 rounded-xl shadow-md transition text-sm sm:text-base cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Payment Done? Confirm on WhatsApp</span>
            </a>

            <p className="text-[11px] text-emerald-800 leading-tight">
              After completing your payment, tap here to send your confirmation to our team.
            </p>
            <p className="text-[10px] text-stone-500 italic">
              Note: Payment verification will be completed separately by the Mission office.
            </p>
          </div>

          {/* Optional UTR / Reference Submission Form */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-[#081d36] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Submit 12-Digit UPI Ref / UTR (Optional)</span>
            </h4>

            {submitSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">UTR Reference Submitted!</div>
                  <div className="text-[11px]">
                    Your reference <span className="font-mono font-bold">{utrNumber}</span> is recorded. Our team will verify and update your status.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerifySubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 12-digit UTR (e.g. 947949299201)"
                    value={utrNumber}
                    onChange={(e) => {
                      setUtrNumber(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl font-mono focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-[40px] px-4 py-2 bg-[#081d36] hover:bg-[#0c2a4d] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Submit UTR</span>
                    )}
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-red-600 text-[11px] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
