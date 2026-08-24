import React, { useState } from 'react';
import { X, Download, CheckCircle2, FileText, Sparkles, BookOpen, Clock, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import { CbmLogo } from './CbmLogo';
import { submitApplicationForm } from '../services/formService';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim() || !name.trim()) return;

    setIsSubmitting(true);

    try {
      // Record lead in admissions office
      await submitApplicationForm({
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        qualification: 'Brochure Download Request',
        course: 'Comprehensive 2026 AI Digital Marketing Syllabus & Placement Guide',
        message: 'Downloaded Official 2026 CBM Academy Course Brochure',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
      setIsDownloaded(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close brochure modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="mb-2">
            <CbmLogo height={36} showTagline={false} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#072B57] tracking-tight">
            Download 2026 Course Syllabus & Placement Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Get the full week-by-week curriculum, live project briefs, tools list, and hiring partner salary statistics.
          </p>
        </div>

        {isDownloaded ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#072B57]">
              Brochure Unlocked & Sent to Your Email!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              We have dispatched the complete 32-page curriculum brochure to <strong className="text-slate-800">{email}</strong>. You can also print or save it directly below.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Save/Print PDF Now</span>
              </button>
              <button
                onClick={onClose}
                type="button"
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDownload} className="space-y-4">
            {/* Highlights */}
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-[#072B57] uppercase tracking-wider text-[11px]">
                Inside this 32-Page Brochure:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>8 Core Specialization Modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>15+ Live Capstone Project Blueprints</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>500+ Corporate Hiring Partners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Batch Timetables & EMI Options</span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ankit Verma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-[#072B57] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ankit@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-[#072B57] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-[#072B57] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Preparing Brochure...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Brochure (Free PDF)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
