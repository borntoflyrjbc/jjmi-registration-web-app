'use client';

import React from 'react';
import { Phone, Users } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#fcf8f2] border-b border-[#e8dec8] relative">
      {/* 1. Deep Navy Top Micro-Bar */}
      <div className="bg-[#0a223e] text-amber-100/90 text-[11px] sm:text-xs py-2 px-4 sm:px-6 tracking-wide border-b border-[#0f2e54]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-serif">🌐</span>
            <span className="font-medium text-slate-200">
              Official Global Registration Portal
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a
              href="tel:+919479492992"
              className="flex items-center gap-1.5 hover:text-amber-300 transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 9479492992</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Worldwide Applicants</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Royal Header with Ivory Parchment */}
      <div className="py-5 px-4 sm:px-6 max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left Decorative Balancing Spacer / Watermark */}
          <div className="hidden lg:flex items-center gap-2 w-52 opacity-20 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/temple_sketch_watermark.png"
              alt=""
              className="w-40 h-16 object-contain filter grayscale"
            />
          </div>

          {/* Center Brand Identity (Lord Jagannath Mission) */}
          <div className="flex flex-col items-center text-center flex-1">
            {/* Sanskrit Invocation */}
            <div className="text-[#991b1b] font-serif-royal font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 mb-1.5">
              <span>ॐ श्री जगन्नाथाय नमः</span>
              <span className="text-amber-600/60 font-sans">|</span>
              <span className="tracking-widest text-[#7f1d1d] text-[11px] sm:text-xs font-semibold">
                EST. PURI DHAM
              </span>
            </div>

            {/* Golden Medallion Logo & Title */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-0.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#d4af37] shadow-md overflow-hidden bg-amber-950 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/jjmi_round_logo.png"
                  alt="Lord Jagannath Emblem"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/jjmi_logo.jpg';
                  }}
                />
              </div>

              <div className="text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif-royal font-black text-[#0f284e] tracking-tight leading-none">
                  JAI JAGANNATH MISSION
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#b45309]"></span>
                  <span className="text-[#92400e] font-serif tracking-[0.26em] text-[11px] sm:text-xs uppercase font-bold">
                    INTERNATIONAL
                  </span>
                  <span className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#b45309]"></span>
                </div>
              </div>
            </div>

            {/* Subheading Badge (Clean & Professional) */}
            <div className="mt-3 flex items-center justify-center gap-2.5">
              <div className="bg-[#0a2540] text-amber-100 px-4 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-xs border border-[#0d345a]">
                DIGITAL PARTICIPANT APPLICATION FORM
              </div>
              <span className="text-amber-600 text-sm hidden sm:inline" title="Sacred Lotus">
                🪷
              </span>
            </div>
          </div>

          {/* Right: Spiritual Guide Card (Dr. Purushottam Tiwari Flipped) */}
          <div className="flex items-center gap-3 bg-white/95 border border-amber-300/80 rounded-2xl p-2 sm:p-2.5 pr-4 shadow-sm hover:shadow-md transition flex-shrink-0">
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full overflow-hidden border-2 border-[#d4af37] bg-amber-950 flex-shrink-0 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/dr_tiwari_flipped.png"
                alt="Dr. Purshottam Tiwari in Namaste"
                className="w-full h-full object-cover object-top scale-110"
              />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold block">
                Spiritual Guide & Mentor
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0f284e] font-serif block leading-tight">
                Dr. Purshottam Tiwari
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium block">
                Founder, Man Samvad
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
