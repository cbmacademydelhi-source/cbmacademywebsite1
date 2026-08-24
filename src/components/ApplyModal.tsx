import React, { useState, useEffect } from 'react';
import { ApplicationFormData } from '../types';
import { submitApplicationForm, TARGET_NOTIFICATION_EMAIL } from '../services/formService';
import { X, CheckCircle2, AlertCircle, Sparkles, Send, ShieldCheck, GraduationCap } from 'lucide-react';
import { CbmLogo } from './CbmLogo';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: string;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  onClose,
  initialCourse = 'Master in AI-Powered Digital Marketing & Performance Growth',
}) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    qualification: 'Working Professional',
    course: initialCourse,
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  useEffect(() => {
    if (initialCourse) {
      setFormData((prev) => ({ ...prev, course: initialCourse }));
    }
  }, [initialCourse]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) return true;
    if (cleaned.length === 12 && cleaned.startsWith('91') && /^91[6-9]\d{9}$/.test(cleaned)) return true;
    return false;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone / WhatsApp number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone (e.g. 9876543210 or +91...)';
    }

    if (!formData.qualification) {
      newErrors.qualification = 'Please select your current status/qualification';
    }

    if (!formData.course) {
      newErrors.course = 'Please select your preferred track';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: 'idle', message: '' });

    try {
      const result = await submitApplicationForm(formData);
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Thank you! Your application has been sent to CBM Academy. Our admissions team will contact you within 24 hours.',
        });
        // Reset form data
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          qualification: 'Working Professional',
          course: initialCourse,
          message: '',
          honeypot: '',
        });
        setErrors({});
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || `We couldn't send your application right now. Please try again or contact CBM Academy directly at ${TARGET_NOTIFICATION_EMAIL}.`,
        });
      }
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: `We couldn't send your application right now. Please try again or contact CBM Academy directly at ${TARGET_NOTIFICATION_EMAIL}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="mb-2">
            <CbmLogo height={38} showTagline={false} />
          </div>
          <h2 id="apply-modal-title" className="text-xl sm:text-2xl font-extrabold text-[#072B57] tracking-tight">
            Apply for CBM Academy
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill in your details below. Submissions are delivered to <span className="font-semibold text-slate-700">office@cbmacademy.in</span>.
          </p>
        </div>

        {/* Success Banner */}
        {submitStatus.type === 'success' ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#072B57]">
              Application Submitted Successfully!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              {submitStatus.message}
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitStatus({ type: 'idle', message: '' });
                  onClose();
                }}
                type="button"
                className="bg-[#072B57] text-white font-bold text-sm px-8 py-3 rounded-xl hover:bg-[#0c3c78] transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Honeypot Spam Field */}
            <input
              type="text"
              name="cbm_antispam_hp"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {submitStatus.type === 'error' && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-medium leading-relaxed">
                  {submitStatus.message}
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="apply-fullname" className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="apply-fullname"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                placeholder="e.g. Priya Sharma"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#072B57] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.fullName ? 'border-rose-300 ring-1 ring-rose-300 bg-rose-50/20' : 'border-slate-300 focus:ring-[#FF6B00] focus:border-[#FF6B00]'
                }`}
              />
              {errors.fullName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName}</p>}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="apply-email" className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="apply-email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="e.g. priya@gmail.com"
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#072B57] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-rose-300 ring-1 ring-rose-300 bg-rose-50/20' : 'border-slate-300 focus:ring-[#FF6B00] focus:border-[#FF6B00]'
                  }`}
                />
                {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="apply-phone" className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="apply-phone"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="10-digit number (e.g. 9876543210)"
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#072B57] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-rose-300 ring-1 ring-rose-300 bg-rose-50/20' : 'border-slate-300 focus:ring-[#FF6B00] focus:border-[#FF6B00]'
                  }`}
                />
                {errors.phone && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone}</p>}
              </div>
            </div>

            {/* Highest Qualification & Course Track */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="apply-qualification" className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                  Qualification / Status <span className="text-rose-500">*</span>
                </label>
                <select
                  id="apply-qualification"
                  value={formData.qualification}
                  onChange={(e) => {
                    setFormData({ ...formData, qualification: e.target.value });
                    if (errors.qualification) setErrors({ ...errors, qualification: '' });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-[#072B57] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                >
                  <option value="Working Professional (Marketing / Sales)">Working Professional (Marketing / Sales)</option>
                  <option value="Working Professional (Non-Marketing / Career Switch)">Working Professional (Career Switch)</option>
                  <option value="Final Year College Student / Graduate">Final Year College Student / Graduate</option>
                  <option value="Undergraduate Student">Undergraduate Student</option>
                  <option value="Business Owner / Entrepreneur">Business Owner / Entrepreneur</option>
                  <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                </select>
                {errors.qualification && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.qualification}</p>}
              </div>

              <div>
                <label htmlFor="apply-course" className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                  Selected Course / Track <span className="text-rose-500">*</span>
                </label>
                <select
                  id="apply-course"
                  value={formData.course}
                  onChange={(e) => {
                    setFormData({ ...formData, course: e.target.value });
                    if (errors.course) setErrors({ ...errors, course: '' });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-[#072B57] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                >
                  <option value="Master in AI-Powered Digital Marketing & Performance Growth">Master in AI-Powered Digital Marketing (Complete Specialization)</option>
                  <option value="Executive Performance Marketing & Meta Ads">Performance Marketing & Meta Ads</option>
                  <option value="Advanced SEO & Generative Search (GEO)">Advanced SEO & Generative Search (GEO)</option>
                  <option value="Google Ads & Performance Max (PMax)">Google Ads & Performance Max (PMax)</option>
                  <option value="AI Content Creation & Automation Tools">AI Content Creation & Automation Tools</option>
                  <option value="Web Analytics, GA4 & Looker Studio">Web Analytics, GA4 & Looker Studio</option>
                  <option value="Corporate / Custom Team Training">Corporate / Custom Team Training</option>
                </select>
                {errors.course && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.course}</p>}
              </div>
            </div>

            {/* Questions / Message (Optional) */}
            <div>
              <label htmlFor="apply-message" className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                Questions or Learning Goals (Optional)
              </label>
              <textarea
                id="apply-message"
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Any specific batch timing preferences, career expectations, or questions?"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-[#072B57] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                id="apply-submit-btn"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-base py-3.5 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Privacy Guaranteed &bull; No Spam &bull; Admissions Team Callback</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
