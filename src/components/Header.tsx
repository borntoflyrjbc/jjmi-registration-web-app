'use client';

import React from 'react';
import { Globe, Phone, Users } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#fcf8f2] border-b border-[#e8dec8] relative">
      {/* 1. Deep Navy Top Micro-Bar */}
      <div className="bg-[#0a223e] text-amber-100/90 text-[11px] sm:text-xs py-2 px-4 tracking-wide border-b border-[#0f2e54]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-serif">🌐</span>
            <span className="font-medium text-slate-200">
              Official Global Registration Portal • Sri Jagannath Dham, Puri
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

      {/* 2. Main Royal Header with Ivory & Temple Sketch Watermark */}
      <div className="relative py-6 px-4 max-w-6xl mx-auto overflow-hidden">
        {/* Subtle Temple Line-Art Watermarks on Sides */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-24 opacity-15 pointer-events-none hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/temple_sketch_watermark.png"
            alt=""
            className="w-full h-full object-contain filter grayscale"
          />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-24 opacity-15 pointer-events-none hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/temple_sketch_watermark.png"
            alt=""
            className="w-full h-full object-contain filter grayscale scale-x-[-1]"
          />
        </div>

        {/* Center Brand Identity */}
        <div className="flex flex-col items-center text-center relative z-10">
          {/* Sanskrit Invocation */}
          <div className="text-[#991b1b] font-serif-royal font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 mb-2">
            <span>ॐ श्री जगन्नाथाय नमः</span>
            <span className="text-amber-600/60 font-sans">|</span>
            <span className="tracking-widest text-[#7f1d1d] text-[11px] sm:text-xs font-semibold">
              EST. PURI DHAM
            </span>
          </div>

          {/* Golden Medallion Logo & Title */}
          <div className="flex items-center justify-center gap-3.5 sm:gap-4 my-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#d4af37] shadow-md overflow-hidden bg-amber-950 flex-shrink-0">
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-royal font-black text-[#0f284e] tracking-tight leading-none">
                JAI JAGANNATH MISSION
              </h1>
              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="h-[1.5px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#b45309]"></span>
                <span className="text-[#92400e] font-serif tracking-[0.28em] text-xs sm:text-sm uppercase font-bold">
                  INTERNATIONAL
                </span>
                <span className="h-[1.5px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#b45309]"></span>
              </div>
            </div>
          </div>

          {/* Subheading Badge (Clean & Professional, No Clutter) */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="bg-[#0a2540] text-amber-100 px-5 py-1.5 rounded-full text-xs sm:text-xs font-bold tracking-wider uppercase shadow-sm border border-[#0d345a]">
              DIGITAL PARTICIPANT APPLICATION FORM
            </div>
            <span className="text-amber-600 text-sm hidden sm:inline" title="Sacred Lotus">
              🪷
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
