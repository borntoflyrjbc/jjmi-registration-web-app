'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle2, Printer, ArrowLeft, Download, ShieldCheck, Sparkles, MapPin, Phone, Mail, QrCode } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const appNumber = searchParams.get('appNumber');
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appNumber) {
      fetch(`/api/registrations/${appNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setRecord(data.registration);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [appNumber]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading Official Registration Card...
      </div>
    );
  }

  if (!record && !appNumber) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800">No Application Number Provided</h2>
        <p className="text-sm text-slate-500">Please complete the registration form or check your email.</p>
        <Link href="/" className="inline-block mt-3 px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-semibold">
          Go to Registration
        </Link>
      </div>
    );
  }

  const qrImageUrl = `/api/qr?appNumber=${encodeURIComponent(appNumber || 'JJMI')}`;

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
      <div className="no-print flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Certificate</span>
        </button>
      </div>

      {/* Official Certificate Card */}
      <div className="bg-white border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Background Decorative Temple Seal */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center pb-6 border-b border-amber-500/30">
          <div className="flex items-center justify-center gap-2 text-amber-600 text-xs font-serif font-bold uppercase tracking-widest">
            <span>ॐ श्री जगन्नाथाय नमः</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 mt-1">
            JAI JAGANNATH MISSION INTERNATIONAL
          </h1>
          <p className="text-xs text-slate-500">
            Digital Participant Registration Card • Puri Dham, Odisha
          </p>

          <div className="mt-3 inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
            ✓ Registration Recorded Successfully
          </div>
        </div>

        {/* Certificate Body */}
        <div className="mt-6 space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Application Reference ID</span>
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-800 tracking-wider mt-0.5">
                {record?.application_number || appNumber}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Issued on: {record?.created_at ? new Date(record.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' }) : new Date().toLocaleDateString('en-IN')}
              </div>
            </div>

            {/* Micro QR on card */}
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl}
                alt="QR Code"
                className="w-20 h-20 rounded-lg border border-slate-300 mx-auto"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Scan to Verify</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <span className="text-slate-400 text-xs">Participant Name:</span>
              <div className="font-bold text-slate-900 text-sm">{record?.full_name || 'Participant'}</div>
            </div>

            <div>
              <span className="text-slate-400 text-xs">Category:</span>
              <div className="font-bold text-amber-700 text-sm">{record?.category_name || 'General Participant'}</div>
            </div>

            <div>
              <span className="text-slate-400 text-xs">Registered Mobile:</span>
              <div className="font-medium text-slate-800">
                {record?.phone_country_code} {record?.phone_number}
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-xs">Email Address:</span>
              <div className="font-medium text-slate-800 break-all">{record?.email}</div>
            </div>

            <div>
              <span className="text-slate-400 text-xs">Location:</span>
              <div className="font-medium text-slate-800">
                {[record?.city, record?.state_region, record?.country].filter(Boolean).join(', ')}
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-xs">Payment / Status:</span>
              <div className="font-bold text-slate-800 capitalize">
                {record?.payment_status === 'paid' ? (
                  <span className="text-emerald-700">✓ Paid (Verified)</span>
                ) : record?.payment_status === 'not_required' ? (
                  <span className="text-emerald-700">✓ Free (No Fee)</span>
                ) : (
                  <span className="text-amber-700">Under Review ({record?.payment_status || 'Pending'})</span>
                )}
              </div>
            </div>
          </div>

          {record?.payment_reference && (
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
              <span className="text-slate-600 font-medium">Submitted UPI UTR / Reference:</span>{' '}
              <strong className="font-mono text-amber-900">{record.payment_reference}</strong>
            </div>
          )}
        </div>

        {/* Certificate Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Record of Jai Jagannath Mission International</span>
          </div>
          <div>Founder Guidance: Dr. Purshottam Tiwari</div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

