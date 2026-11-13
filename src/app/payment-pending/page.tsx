'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Search, ArrowLeft, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { PaymentPanel } from '@/components/PaymentPanel';

export default function PaymentPendingPage() {
  const [appNumber, setAppNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appNumber.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setRecord(null);

    try {
      const res = await fetch(`/api/registrations/${appNumber.trim()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration not found with this application number.');
      }
      setRecord(data.registration);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error looking up registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 mb-6 group transition"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Check Registration / Payment Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Enter your unique Application Reference Number (e.g. JJMI-2026-000101) to verify your payment status or submit your UPI UTR.
            </p>

            {/* Lookup Form */}
            <form onSubmit={handleSearch} className="mt-6 flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter Application Number (JJMI-2026-...)"
                value={appNumber}
                onChange={(e) => setAppNumber(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </form>

            {errorMsg && (
              <p className="text-red-600 text-xs mt-3 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Results Area */}
          {record && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Application Number</span>
                    <div className="font-mono font-bold text-lg text-slate-900">{record.application_number}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Status:</span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        record.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : record.payment_status === 'under_review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {record.payment_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
                  <div>
                    <span className="text-slate-400">Applicant:</span>
                    <div className="font-bold text-slate-800">{record.full_name}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Category:</span>
                    <div className="font-bold text-slate-800">{record.category_name}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Fee Amount:</span>
                    <div className="font-bold text-amber-700">₹{(record.fee_amount_minor / 100).toFixed(0)}</div>
                  </div>
                </div>
              </div>

              {/* Show payment panel if still pending or under review */}
              {record.payment_status !== 'paid' && record.payment_status !== 'not_required' && (
                <PaymentPanel
                  registration={record}
                  onPaymentVerified={() => {
                    // refresh
                    fetch(`/api/registrations/${record.application_number}`)
                      .then((r) => r.json())
                      .then((d) => d.success && setRecord(d.registration));
                  }}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

