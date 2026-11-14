'use client';

import React, { useState } from 'react';
import { UPI_CONFIG, MISSION_WHATSAPP_NUMBER } from '@/lib/categories';
import { 
  QrCode, Download, ShieldCheck, 
  Copy, ArrowRight, Eye, MessageCircle, ArrowLeft, ExternalLink, Smartphone
} from 'lucide-react';

interface PaymentPanelProps {
  registration: any;
  onPaymentVerified?: () => void;
  onBackToEdit?: () => void;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({ 
  registration, 
  onBackToEdit 
}) => {
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [viewMode, setViewMode] = useState<'qr' | 'standee'>('qr');

  const feeNumber = registration.feeINR !== undefined 
    ? registration.feeINR 
    : (registration.fee_amount_minor ? registration.fee_amount_minor / 100 : 500);
  const amountINR = String(feeNumber);
  const feeBasis = registration.feeBasis || registration.fee_basis || 'Annual';
  const appNumber = registration.application_number;
  const applicantName = registration.full_name || 'Participant';
  const categoryName = registration.category_name || 'General Participant';

  // Standard Universal UPI Intent Link (Tapping opens GPay / PhonePe / Paytm / BHIM)
  const upiIntentUrl = `upi://pay?pa=${UPI_CONFIG.vpa}&pn=${encodeURIComponent(UPI_CONFIG.payeeName)}`;

  // Pure high-contrast scannable QR (Zero moving lines, maximum contrast)
  const qrImageUrl = `/api/qr?appNumber=${encodeURIComponent(appNumber)}`;
  const qrDownloadUrl = `/api/qr?appNumber=${encodeURIComponent(appNumber)}&download=1`;

  // WhatsApp Pre-filled Confirmation Message
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
    ];

    return lines.join('\n');
  };

  const whatsappUrl = `https://wa.me/${MISSION_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;

  const copyVpa = () => {
    navigator.clipboard.writeText(UPI_CONFIG.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* 0. Top Back Button so user can easily rectify mistakes */}
      {onBackToEdit && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Edit Details (विवरण बदलें)</span>
          </button>
          <span className="text-[11px] text-stone-500 font-mono">
            App #{appNumber}
          </span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
        <span className="inline-block bg-[#081d36] text-amber-300 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider mb-1.5 border border-amber-500/30">
          Payment & Verification
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#081d36]">
          Complete Your Contribution • सहयोग राशि
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-lg mx-auto">
          Scan the QR code below or tap on it to pay directly via Google Pay, PhonePe, Paytm, or BHIM.
        </p>
      </div>

      {/* 2. Order Summary Card */}
      <div className="bg-[#081d36] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-amber-500/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="text-center sm:text-left">
            <div className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">Application Number</div>
            <div className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider mt-0.5">
              {appNumber}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Applicant: <span className="text-white font-medium">{applicantName}</span> ({categoryName})
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-[11px] text-slate-300 uppercase tracking-wider">Contribution Amount</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">
              ₹{Number(amountINR).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-amber-200/80">{feeBasis} Participation</div>
          </div>
        </div>

        {/* 1-Tap Auto-Open UPI Button for Mobile */}
        <div className="mt-3.5">
          <a
            href={upiIntentUrl}
            className="w-full min-h-[46px] flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 px-4 rounded-xl shadow-xs transition text-sm cursor-pointer"
          >
            <Smartphone className="w-5 h-5" />
            <span>Pay ₹{amountINR} via Any UPI App (GPay / PhonePe / Paytm)</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
          </a>
          <p className="text-[11px] text-amber-200/80 text-center mt-1.5">
            Tap above to automatically open your installed payment app on phone.
          </p>
        </div>
      </div>

      {/* 3. Main Payment Grid (Clickable Auto-Payment QR Code + Beneficiary & WhatsApp) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Code Container (Clickable to automatically launch UPI payment) */}
        <div className="md:col-span-5 bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs text-center flex flex-col items-center">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center p-1 bg-stone-100 rounded-xl mb-3 w-full max-w-[240px]">
            <button
              type="button"
              onClick={() => setViewMode('qr')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === 'qr'
                  ? 'bg-white text-[#081d36] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Pure QR Code
            </button>
            <button
              type="button"
              onClick={() => setViewMode('standee')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === 'standee'
                  ? 'bg-white text-[#081d36] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Bank Standee
            </button>
          </div>

          {/* Interactive Tap-to-Pay Notification */}
          <div className="mb-2 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
            <span>👆 Tap QR to Pay with Any UPI App</span>
          </div>

          {/* Clickable QR Box: Clicking or tapping opens UPI app directly! */}
          <a
            href={upiIntentUrl}
            title="Click or tap to automatically open Google Pay, PhonePe, or Paytm"
            className="block p-3 bg-white border-2 border-stone-200 hover:border-amber-500 rounded-2xl shadow-inner mx-auto transition-transform hover:scale-[1.02] cursor-pointer group"
          >
            {viewMode === 'standee' ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/assets/purushottam_tiwari_official_qr.jpg"
                alt="Official HDFC Bank Standee - Tap to Pay"
                className="w-52 h-auto max-h-72 object-contain rounded-lg mx-auto group-hover:opacity-95 transition"
              />
            ) : (
              <div className="w-52 h-52 sm:w-56 sm:h-56 mx-auto bg-white flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl}
                  alt={`Universal Scannable QR Code - Tap to Pay ${appNumber}`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </a>

          {/* Instruction Helper Text */}
          <p className="text-xs text-stone-600 mt-2.5 font-medium leading-relaxed">
            Scan with your phone or tap the QR to open your payment app.
          </p>

          {/* Download QR to manually do payment */}
          <div className="w-full mt-3 pt-3 border-t border-stone-100 flex flex-col gap-1">
            <a
              href={qrDownloadUrl}
              download={`JJMI-Payment-${appNumber}.png`}
              className="min-h-[42px] w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl transition border border-stone-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Download QR to manually do payment</span>
            </a>
          </div>
        </div>

        {/* Right Column: Beneficiary Details + WhatsApp 1-Tap Confirmation */}
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
                <span className="font-mono font-bold text-slate-900 text-sm">{UPI_CONFIG.vpa}</span>
              </div>
              <button
                type="button"
                onClick={copyVpa}
                className="flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedVpa ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 font-medium">Official Mobile / Helpline:</span>
              <span className="font-bold text-slate-900">+91 9479492992</span>
            </div>
          </div>

          {/* Prominent WhatsApp Confirmation Button */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5 text-center space-y-3 shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-[#166534] font-bold text-xs uppercase tracking-wider">
              <MessageCircle className="w-4 h-4 text-[#16a34a]" />
              <span>Instant Verification on WhatsApp</span>
            </div>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition text-sm sm:text-base cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
              <span>Payment Done? Confirm on WhatsApp</span>
            </a>
            
            <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
              After payment, tap above to send your confirmation to Mission team on WhatsApp.
            </p>
          </div>

          {/* Bottom Back to Edit Option */}
          {onBackToEdit && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToEdit}
                className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Need to change your name or details? Click here to edit form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
