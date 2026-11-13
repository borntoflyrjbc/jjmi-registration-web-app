import React from 'react';
import { BookOpen, Clock, Heart } from 'lucide-react';

interface StepBackgroundProps {
  formData: any;
  updateFormData: (fields: any) => void;
  errors: Record<string, string>;
}

export const StepBackground: React.FC<StepBackgroundProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">5</span>
          Background & Availability • पृष्ठभूमि एवं समय
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Optional details to help align your skills with mission projects.
        </p>
      </div>

      {/* Qualification / Experience */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
          <span>Profession / Qualification / Special Skills</span>
          <span className="text-slate-400 text-xs font-normal">Optional</span>
        </label>
        <div className="relative">
          <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="e.g. Teacher, Doctor, IT Professional, Student, Business, Musician"
            value={formData.qualification_experience || ''}
            onChange={(e) => updateFormData({ qualification_experience: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      {/* Availability Dropdown */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
          <span>Time Available for Mission Service</span>
          <span className="text-slate-400 text-xs font-normal">Optional</span>
        </label>
        <div className="relative">
          <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <select
            value={formData.availability || 'Weekends Only'}
            onChange={(e) => updateFormData({ availability: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option value="1-2 Hours/Week">1–2 Hours per week (Online / Spiritual updates)</option>
            <option value="3-5 Hours/Week">3–5 Hours per week (Active volunteering)</option>
            <option value="Weekends Only">Weekends & Festival programs only</option>
            <option value="Retreats & Events">During Puri Retreats & Mahotsavs</option>
            <option value="Full-Time Volunteer">Full-time dedicated seva / coordinator</option>
          </select>
        </div>
      </div>

      {/* Purpose for Joining */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
          <span>Purpose for Joining / जुड़ने का उद्देश्य</span>
          <span className="text-slate-400 text-xs font-normal">Optional (Max 300 chars)</span>
        </label>
        <div className="relative">
          <Heart className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <textarea
            rows={3}
            maxLength={300}
            placeholder="Share why you wish to join Jai Jagannath Mission International (e.g. spiritual growth, community service, devotion to Mahaprabhu)"
            value={formData.joining_purpose || ''}
            onChange={(e) => updateFormData({ joining_purpose: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
          />
        </div>
        <div className="text-right text-[11px] text-slate-400 mt-1">
          {(formData.joining_purpose || '').length} / 300 characters
        </div>
      </div>
    </div>
  );
};

