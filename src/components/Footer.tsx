import React from 'react';
import Link from 'next/link';
import { Heart, Shield, Lock, FileText, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-16 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission Info */}
          <div>
            <h3 className="text-white font-serif font-bold text-base sm:text-lg flex items-center gap-2">
              <span className="text-amber-500">🕉️</span> जय जगन्नाथ मिशन अन्तर्राष्ट्रीय
            </h3>
            <p className="mt-2 text-slate-400 text-xs leading-relaxed">
              महाप्रभु श्री जगन्नाथ जी की भक्ति, संस्कृति, मन संवाद साधना और समाज सेवा का वैश्विक अभियान। मानवता, आत्मिक शांति और विश्व कल्याण के लिए समर्पित।
            </p>
            <div className="mt-4 flex items-center gap-2 text-slate-300 text-xs">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>श्री जगन्नाथ धाम, पुरी, ओडिशा (भारत)</span>
            </div>
          </div>

          {/* Quick Links & Policies */}
          <div>
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-xs">Policies & Principles</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/rules" className="hover:text-amber-400 flex items-center gap-1.5 transition">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Participation Rules & Discipline</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 flex items-center gap-1.5 transition">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Privacy Notice & Data Protection</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 flex items-center gap-1.5 transition text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorized Mission Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Helpline */}
          <div>
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-xs">Official Contact & Support</h4>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a href="tel:+919479492992" className="text-slate-200 hover:text-white font-medium">
                  +91 9479492992 (Helpline)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <a href="mailto:jaijagannathmissioninternation@gmail.com" className="text-slate-200 hover:text-white break-all">
                  jaijagannathmissioninternation@gmail.com
                </a>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 mt-2">
                All contributions & fees directly support mission activities, spiritual retreats, and social welfare programs under the guidance of Dr. Purshottam Tiwari.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Jai Jagannath Mission International. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with devotion & care</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Global Devotees</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

