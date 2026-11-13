import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Database, UserCheck, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 mb-6 group transition"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span>Back to Registration Form</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Privacy & Data Protection Notice
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">
              Privacy Notice & Data Security
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Jai Jagannath Mission International • Commitment to Participant Trust
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-700">
            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you submit a participant application, we collect only necessary identifying and contact information, including your full name, telephone number, WhatsApp number, email address, city, state, country, and chosen seva interests.
            </p>

            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" />
              <span>2. Purpose of Data Storage</span>
            </h2>
            <p>
              Your information is stored in an encrypted and secure database solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Issuing your unique digital participant application certificate and ID.</li>
              <li>Connecting you with regional seva circles and volunteering opportunities.</li>
              <li>Transmitting spiritual updates, satsang links, and Puri Dham festival schedules.</li>
              <li>Administrative communication and payment verification.</li>
            </ul>

            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-blue-600" />
              <span>3. Zero Commercial Exploitation</span>
            </h2>
            <p>
              <strong>We never sell, trade, rent, or lease your personal information to third parties or marketing brokers.</strong> Your data remains confidential within the trusted administration of Jai Jagannath Mission International.
            </p>

            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-700" />
              <span>4. Payment & Banking Data Security</span>
            </h2>
            <p>
              All payments are processed securely via NPCI Unified Payments Interface (UPI). We do not record or request your UPI PIN, banking passwords, or debit/credit card numbers at any time on this website.
            </p>

            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>5. Data Access & Deletion Inquiries</span>
            </h2>
            <p>
              Participants may request an update or deletion of their registration records at any time by contacting our official helpline at <strong>+91 9479492992</strong> or writing to <strong>jaijagannathmissioninternation@gmail.com</strong>.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Last Updated: November 2026</span>
            <Link href="/" className="text-amber-700 font-semibold hover:underline">
              Continue to Registration →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

