import React, { useEffect, useState } from 'react';
import {
  Download,
  FileText,
  CheckCircle2,
  X,
  Sparkles,
  Eye,
  User,
  Mail,
  Phone,
  Loader2,
} from 'lucide-react';
import { submitBrochureRequest } from '../services/formService';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    'idle' | 'downloading' | 'ready'
  >('idle');

  /*
   * PDF is inside the public folder.
   * import.meta.env.BASE_URL automatically uses the
   * correct path for the current Vite deployment.
   */
  const brochurePdf = `${import.meta.env.BASE_URL}Digital_Marketing_Course_Brochure.pdf`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset error and states when opened/closed
  useEffect(() => {
    if (!isOpen) {
      setErrorMsg(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const triggerPdfDownload = () => {
    setDownloadStatus('downloading');

    try {
      const link = document.createElement('a');
      link.href = brochurePdf;
      link.download = 'Digital Marketing Course Brochure.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadStatus('ready');
      }, 700);
    } catch (error) {
      console.error('Brochure download error:', error);
      setDownloadStatus('idle');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    const cleanName = studentName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setErrorMsg('Please enter the student name.');
      return;
    }

    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 8) {
      setErrorMsg('Please enter a valid phone number (at least 8-10 digits).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save submitted student details securely in Supabase
      const result = await submitBrochureRequest({
        studentName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        honeypot,
      });

      if (!result.success) {
        setErrorMsg(result.message || 'Failed to save student details. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      setIsSubmitting(false);

      // Automatically trigger brochure download
      triggerPdfDownload();
    } catch (err: any) {
      console.error('Brochure form error:', err);
      setErrorMsg(err?.message || 'A network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleViewPdf = () => {
    window.open(brochurePdf, '_blank', 'noopener,noreferrer');
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setDownloadStatus('idle');
    setErrorMsg(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brochure-modal-title"
      onClick={onClose}
    >
      <div
        id="brochure-modal"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-brochure-modal-btn"
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close brochure modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] shrink-0">
            <FileText className="w-6 h-6" />
          </div>

          <div>
            <h3
              id="brochure-modal-title"
              className="text-xl font-bold text-[#072B57]"
            >
              Download 2026 Course Brochure
            </h3>

            <p className="text-sm text-slate-500">
              CBM Academy — Digital Marketing Programme
            </p>
          </div>
        </div>

        {/* Brochure Highlights */}
        <div className="mb-5 p-3.5 bg-orange-50 border border-orange-100 rounded-xl">
          <div className="flex items-center gap-2 text-orange-950 font-semibold text-xs sm:text-sm mb-1.5">
            <Sparkles className="w-4 h-4 text-[#FF6B00]" />
            Inside the 2026 brochure:
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700 pl-4 list-disc">
            <li>Course curriculum &amp; modules</li>
            <li>Live campaign assignments</li>
            <li>AI tools &amp; automations</li>
            <li>Career &amp; placement roadmap</li>
          </ul>
        </div>

        {!isSubmitted ? (
          /* Student Details Form */
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Honeypot Anti-Spam (Hidden) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm">
                {errorMsg}
              </div>
            )}

            {/* Student Name */}
            <div>
              <label
                htmlFor="brochure-student-name"
                className="block text-xs sm:text-sm font-semibold text-[#072B57] mb-1.5"
              >
                Student Name <span className="text-[#FF6B00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="brochure-student-name"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#072B57] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email ID */}
            <div>
              <label
                htmlFor="brochure-student-email"
                className="block text-xs sm:text-sm font-semibold text-[#072B57] mb-1.5"
              >
                Email ID <span className="text-[#FF6B00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="brochure-student-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#072B57] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="brochure-student-phone"
                className="block text-xs sm:text-sm font-semibold text-[#072B57] mb-1.5"
              >
                Phone Number <span className="text-[#FF6B00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="brochure-student-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#072B57] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-brochure-form-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-semibold text-sm transition-all shadow-md shadow-orange-500/20 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving... </span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Brochure</span>
                  </>
                )}
              </button>
            </div>

           
          </form>
        ) : (
          /* Success & Download Options */
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">
                  Details saved securely! Your brochure download is ready.
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Thank you, <strong className="text-emerald-900">{studentName}</strong>. If the download did not start automatically, please use the buttons below.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Download PDF */}
              <button
                id="start-brochure-download-btn"
                onClick={triggerPdfDownload}
                type="button"
                disabled={downloadStatus === 'downloading'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-semibold text-sm transition-all shadow-md shadow-orange-500/20 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {downloadStatus === 'downloading'
                  ? 'Preparing...'
                  : 'Download PDF Brochure'}
              </button>

              {/* View PDF */}
              <a
                id="view-brochure-pdf-btn"
                href={brochurePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#072B57] font-semibold text-sm transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                View PDF
              </a>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-slate-500 hover:text-[#072B57] underline cursor-pointer"
              >
                Submit for another student
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-5">
          CBM Academy • Your Digital Marketing Journey Begins Here
        </p>
      </div>
    </div>
  );
};
