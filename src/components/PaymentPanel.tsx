import React, { useState } from 'react';
import { UPI_CONFIG } from '@/lib/categories';
import { QrCode, Download, ExternalLink, CheckCircle2, ShieldCheck, Copy, ArrowRight, AlertCircle, RefreshCw, Eye } from 'lucide-react';

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

  const amountINR = (registration.fee_amount_minor / 100).toFixed(0);
  const appNumber = registration.application_number;

  // NPCI Standard UPI Link
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(UPI_CONFIG.vpa)}&pn=${encodeURIComponent(
    UPI_CONFIG.payeeName
  )}&am=${encodeURIComponent(amountINR)}&cu=INR&tn=${encodeURIComponent(appNumber)}`;

  // Dynamic QR Code Endpoint
  const qrImageUrl = `/api/qr?amount=${amountINR}&appNumber=${encodeURIComponent(appNumber)}`;
  const qrDownloadUrl = `/api/qr?amount=${amountINR}&appNumber=${encodeURIComponent(appNumber)}&download=1`;

  const copyVpa = () => {
    navigator.clipboard.writeText(UPI_CONFIG.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setErrorMsg('Please enter a valid 12-digit UPI UTR or Transaction ID.');
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
      {/* Top Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
        <span className="inline-block bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          Step 7: Payment & Verification
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
          Complete Your Registration
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto">
          Scan the verified UPI QR code below with Google Pay, PhonePe, Paytm or any banking app to complete your contribution.
        </p>
      </div>

      {/* Payment Summary Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Application Reference</div>
            <div className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider mt-0.5">
              {appNumber}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Applicant: <span className="text-slate-200 font-medium">{registration.full_name}</span> ({registration.category_name})
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-xs text-slate-400">Total Payable Amount</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              ₹{Number(amountINR).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400">{registration.fee_basis} Contribution</div>
          </div>
        </div>

        {/* Mobile Fast UPI Intent Button */}
        <div className="mt-4 pt-1 sm:hidden">
          <a
            href={upiIntentUrl}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition"
          >
            <QrCode className="w-5 h-5" />
            <span>Pay ₹{amountINR} via Any UPI App</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
          <p className="text-[11px] text-center text-slate-400 mt-2">
            Opens Google Pay, PhonePe, Paytm, or BHIM directly on your mobile.
          </p>
        </div>
      </div>

      {/* QR Code & Payee Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Dynamic QR Code Container */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center flex flex-col items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-amber-600" />
                <span>Official UPI QR</span>
              </span>
              <button
                type="button"
                onClick={() => setShowOriginalCard(!showOriginalCard)}
                className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showOriginalCard ? 'Show Dynamic QR' : 'View Tiwari Ji Original QR'}</span>
              </button>
            </div>

            {/* QR Card Frame */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block shadow-inner mx-auto">
              {showOriginalCard ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/assets/tiwari_ji_upi_qr.jpg"
                  alt="Dr. Purshottam Tiwari Official UPI QR"
                  className="w-56 h-auto max-h-64 object-contain rounded-lg mx-auto"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={qrImageUrl}
                  alt={`UPI QR for ${appNumber}`}
                  className="w-56 h-56 object-contain rounded-lg mx-auto"
                />
              )}
            </div>

            <div className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified NPCI UPI • Purushottam Tiwari</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-4 pt-3 border-t border-slate-100 flex gap-2">
            <a
              href={qrDownloadUrl}
              download={`${appNumber}-Payment-QR.png`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-xl transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download QR</span>
            </a>
            <a
              href={upiIntentUrl}
              className="hidden sm:flex flex-1 items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open UPI App</span>
            </a>
          </div>
        </div>

        {/* Right: Verified Account Details & UTR Form */}
        <div className="space-y-4">
          {/* Beneficiary Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Beneficiary Account Information</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payee Name:</span>
              <span className="font-bold text-slate-800">{UPI_CONFIG.payeeName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">UPI ID / VPA:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                  {UPI_CONFIG.vpa}
                </span>
                <button
                  type="button"
                  onClick={copyVpa}
                  className="p-1 text-slate-600 hover:text-amber-700 hover:bg-amber-100 rounded transition"
                  title="Copy UPI ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {copiedVpa && <div className="text-right text-[11px] text-emerald-600 font-semibold">UPI ID Copied!</div>}

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mission Bank:</span>
              <span className="font-medium text-slate-700">{UPI_CONFIG.bankName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Helpline / Support:</span>
              <span className="font-medium text-slate-700">{UPI_CONFIG.helplinePhone}</span>
            </div>
          </div>

          {/* Step 2: Post-Payment Reference Submission Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Confirm Your Payment • भुगतान पुष्टि</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              After paying via UPI, enter your 12-digit UPI Reference Number / UTR below to confirm your registration.
            </p>

            {submitSuccess ? (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Payment Reference Submitted!</span>
                </div>
                <p className="mt-1">
                  Thank you! Your reference is under verification by Jai Jagannath Mission team. You can check status anytime with your application number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerifySubmit} className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UPI Reference / UTR Number (12 Digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    placeholder="e.g. 431289562104"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                  {errorMsg && <p className="text-red-600 text-xs mt-1 font-semibold">{errorMsg}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Reference...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Submit Payment Reference</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

