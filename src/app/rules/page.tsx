import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RulesPage() {
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
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Official Constitution & Code of Conduct
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">
              Participation Rules & Discipline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Jai Jagannath Mission International • Sri Jagannath Dham, Puri
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-700">
            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>1. Foundational Mission Philosophy</span>
            </h2>
            <p>
              Jai Jagannath Mission International is established under the spiritual inspiration of Lord Jagannath and the guidance of Dr. Purshottam Tiwari to foster universal brotherhood, spiritual awakening, inner dialogue (Man Samvad), and dedicated humanitarian service across the globe.
            </p>

            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>2. Code of Conduct & Devotional Discipline</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Respect for Sanatan Values:</strong> All participants, sevaks, and volunteers shall maintain highest standards of humility, truthfulness, mutual respect, and reverence for Mahaprabhu Sri Jagannath.
              </li>
              <li>
                <strong>Non-Political Character:</strong> The Mission is purely spiritual, cultural, and humanitarian. No partisan political or divisive sectarian activities shall be conducted under the name of the Mission.
              </li>
              <li>
                <strong>Integrity in Service:</strong> Active volunteers and Sevaks are expected to carry out assigned duties with honesty and selfless devotion (Nishkama Seva).
              </li>
              <li>
                <strong>Financial Transparency:</strong> All membership fees and contributions are received directly through official Mission accounts (Beneficiary: Purushottam Tiwari, HDFC Bank) and applied strictly toward spiritual programs, food charity (Annadan), and retreat arrangements.
              </li>
            </ul>

            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span>3. Participation Categories & Benefits</span>
            </h2>
            <p>
              Membership is open to individuals from all walks of life, regardless of nationality, gender, or background. Categories range from free well-wisher support to annual and life contributions. Each participant receives regular spiritual guidance, event invitations, and digital satsang access.
            </p>

            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              <span>4. Man Samvad & Spiritual Counseling Disclaimer</span>
            </h2>
            <p>
              Man Samvad programs and discussions offer spiritual, life-philosophy, and meditative guidance aimed at mental tranquility and emotional balance. These programs do not constitute clinical psychological or medical treatment.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Approved by Board of Trustees, Puri Dham</span>
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

