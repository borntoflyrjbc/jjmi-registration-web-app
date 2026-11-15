'use client';

import React from 'react';
import { Phone, Users } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#fcf8f2] border-b border-[#e8dec8] relative overflow-hidden">
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
      <div className="py-3 sm:py-4 px-4 sm:px-6 max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
          
          {/* Left Decorative Watermark (Subtle Balance on desktop) */}
          <div className="hidden lg:flex items-center gap-2 w-48 opacity-20 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/temple_sketch_watermark.png"
              alt=""
              className="w-36 h-14 object-contain filter grayscale"
            />
          </div>

          {/* Center: Official Mission Brand Identity with User-Provided PNG Logo */}
          <div className="flex flex-col items-center text-center flex-1">
            {/* Sanskrit Invocation */}
            <div className="text-[#991b1b] font-serif-royal font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 mb-1">
              <span>ॐ श्री जगन्नाथाय नमः</span>
              <span className="text-amber-600/60 font-sans">|</span>
              <span className="tracking-widest text-[#7f1d1d] text-[11px] sm:text-xs font-semibold">
                EST. PURI DHAM
              </span>
            </div>

            {/* Official PNG Logo & Title */}
            <div className="flex items-center justify-center gap-3.5 sm:gap-4 my-0.5">
              {/* User-Provided Official PNG Logo (No heavy circular crop, 100% authentic) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 flex-shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/official_mission_logo.png"
                  alt="Jai Jagannath Mission International Emblem"
                  className="w-full h-full object-contain filter drop-shadow-md"
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
            <div className="mt-2.5 flex items-center justify-center gap-2.5">
              <div className="bg-[#0a2540] text-amber-100 px-4 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-xs border border-[#0d345a]">
                DIGITAL PARTICIPANT APPLICATION FORM
              </div>
              <span className="text-amber-600 text-sm hidden sm:inline" title="Sacred Lotus">
                🪷
              </span>
            </div>
          </div>

          {/* Right: Dr. Purushottam Tiwari (Photo on Right, Hindi credentials on Left, Inward Facing) */}
          <div className="flex items-end gap-3 sm:gap-4 flex-shrink-0 self-center lg:self-end pt-2 lg:pt-0">
            {/* Exact Hindi credentials on the left */}
            <div className="text-right pb-2 sm:pb-3 select-none">
              <div className="text-sm sm:text-base lg:text-lg font-bold text-[#0f284e] font-serif tracking-tight leading-snug">
                डॉ. पुरुषोत्तम तिवारी
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-amber-800 leading-tight mt-0.5">
                आध्यात्मिक मार्गदर्शक संस्थापक
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-600 font-medium leading-tight mt-0.5">
                जय जगन्नाथ मिशन अन्तर्राष्ट्रीय
              </div>
            </div>

            {/* Full transparent cutout image on the right */}
            <div className="h-28 sm:h-32 lg:h-36 w-auto flex-shrink-0 flex items-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/dr_tiwari_flipped.png"
                alt="डॉ. पुरुषोत्तम तिवारी"
                className="h-full w-auto object-contain object-bottom filter drop-shadow-md transition-transform hover:scale-105 duration-300"
              />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
