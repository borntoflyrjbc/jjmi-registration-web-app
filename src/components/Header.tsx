'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Phone, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white border-b border-amber-600/40 shadow-xl relative overflow-hidden">
      {/* Top micro bar */}
      <div className="bg-amber-600/90 text-amber-50 text-xs py-1.5 px-4 font-medium flex justify-between items-center tracking-wide">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <span>Official Global Registration Portal • Sri Jagannath Dham, Puri</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <a href="tel:+919479492992" className="flex items-center gap-1 hover:text-white transition">
            <Phone className="w-3.5 h-3.5" />
            <span>+91 9479492992</span>
          </a>
          <span className="text-amber-300/60">|</span>
          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Worldwide Applicants</span>
          </span>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Deities and Logo */}
          <div className="flex items-center gap-3 sm:gap-5 text-center sm:text-left">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-500 overflow-hidden shadow-lg bg-amber-950 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/jjmi_logo.jpg"
                alt="Jai Jagannath Mission International"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div>
              <div className="text-amber-400 font-serif text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center sm:justify-start gap-1.5">
                <span>ॐ श्री जगन्नाथाय नमः</span>
                <span className="text-amber-500/60">•</span>
                <span>Est. Puri Dham</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif tracking-tight text-white mt-0.5">
                JAI JAGANNATH MISSION
                <span className="block sm:inline sm:ml-2 text-amber-400 font-light text-base sm:text-xl tracking-wider">
                  INTERNATIONAL
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 tracking-wide">
                Spirituality • Service • Human Values • Global Harmony
              </p>
            </div>
          </div>

          {/* Right Trust Badge */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div className="text-left text-xs">
              <div className="font-semibold text-slate-200">100% Verified Portal</div>
              <div className="text-slate-400">Dr. Purshottam Tiwari Guidance</div>
            </div>
          </div>
        </div>

        {/* Global Banner Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
              FORM JJMI-2026
            </span>
            <span className="font-medium text-slate-200">DIGITAL PARTICIPANT APPLICATION FORM</span>
          </div>
          <div className="text-slate-400 text-[11px] sm:text-xs">
            Open for Applicants from All Countries (Worldwide)
          </div>
        </div>
      </div>
    </header>
  );
};
