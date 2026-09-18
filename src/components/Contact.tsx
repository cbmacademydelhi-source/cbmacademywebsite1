import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ContactFormData } from '../types';
import { submitContactForm, TARGET_NOTIFICATION_EMAIL } from '../services/formService';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SMOOTH_EASE_OUT, VIEWPORT_ONCE } from '../lib/animations';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Course Admission & Eligibility',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  // Indian Phone validation (+91 or 10-digit)
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) return true;
    if (cleaned.length === 12 && cleaned.startsWith('91') && /^91[6-9]\d{9}$/.test(cleaned)) return true;
    return false;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit Indian phone (e.g. 9876543210 or +91...)';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please select or enter an inquiry subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your inquiry';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
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
      const result = await submitContactForm(formData);
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Thank you! Your inquiry has been sent to CBM Academy. Our team will get back to you within 24 hours.',
        });
        // Clear form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: 'Course Admission & Eligibility',
          message: '',
          honeypot: '',
        });
        setErrors({});
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || `We couldn't send your message right now. Please try again or contact CBM Academy directly at ${TARGET_NOTIFICATION_EMAIL}.`,
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: `We couldn't send your message right now. Please try again or contact CBM Academy directly at ${TARGET_NOTIFICATION_EMAIL}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative overflow-hidden pt-8 sm:pt-10 pb-8 sm:pb-10 bg-transparent"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, ease: SMOOTH_EASE_OUT }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7200]/10 text-[#FF7200] text-xs font-bold uppercase tracking-wider border border-[#FF7200]/30"
          >
            Get In Touch
          </motion.div>
          <motion.h2
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.08, ease: SMOOTH_EASE_OUT }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight"
          >
            Contact CBM Academy
          </motion.h2>
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.16, ease: SMOOTH_EASE_OUT }}
            className="text-[#A7A7A7] text-base leading-relaxed"
          >
            Have questions about upcoming batches, syllabus, or corporate training? Reach out below.
          </motion.p>
        </div>

        {/* Two-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Institute Contact Details & Google Map Container */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.08, ease: SMOOTH_EASE_OUT }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Consistent Card Container */}
            <div className="bg-white/[0.04] p-6 sm:p-8 rounded-[20px] border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-xs space-y-6">
              
              <h3 className="text-xl font-bold text-white pb-3 border-b border-white/[0.08]">
                Admissions & Campus Office
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-[#FF7200] shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-0.5">Address</h4>
                  <p className="text-sm font-semibold text-white">
                    CBM Academy, Digital Growth Campus
                  </p>
                  <p className="text-xs text-[#A7A7A7] leading-relaxed mt-0.5">
                    Plot 14, Institutional Area, South Extension & Connaught Place, New Delhi, 110049, India
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-[#FF7200] shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-0.5">Official Email</h4>
                  <a
                    href="mailto:office@cbmacademy.in"
                    className="text-sm font-bold text-white hover:text-[#FF7200] transition-colors"
                  >
                    office@cbmacademy.in
                  </a>
                  <p className="text-xs text-[#A7A7A7] mt-0.5">Direct inquiries & corporate partnerships</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-[#FF7200] shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-0.5">Helpline & WhatsApp</h4>
                  <a
                    href="tel:+919876543210"
                    className="text-sm font-bold text-white hover:text-[#FF7200] transition-colors block"
                  >
                    +91 98765 43210 / +91 11 4567 8900
                  </a>
                  <p className="text-xs text-[#A7A7A7] mt-0.5">Available on WhatsApp for instant guidance</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-[#FF7200] shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-0.5">Office Timings</h4>
                  <p className="text-sm font-semibold text-white">
                    Monday – Saturday: 9:00 AM – 7:00 PM IST
                  </p>
                  <p className="text-xs text-[#A7A7A7] mt-0.5">Sunday: Prior Appointment Only</p>
                </div>
              </div>

            </div>

            {/* Google Map Interactive Container */}
            <div className="rounded-[20px] overflow-hidden border border-white/[0.08] shadow-sm bg-[#0D0D0D] h-56 relative">
              <iframe
                title="CBM Academy Delhi Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112061.7618210352!2d77.12781682974558!3d28.631853516544976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b92bb18b%3A0xe5a36371a539eb87!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 opacity-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-2 left-2 bg-[#0D0D0D]/90 backdrop-blur-xs px-3 py-1 rounded-md text-[11px] font-bold text-white border border-white/10 shadow">
                📍 CBM Academy Campus &bull; New Delhi
              </div>
            </div>

          </motion.div>

          {/* Right Column: Contact Inquiry Form */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.16, ease: SMOOTH_EASE_OUT }}
            className="lg:col-span-7"
          >
            {/* Consistent Card Container */}
            <div className="bg-white/[0.04] p-6 sm:p-8 rounded-[20px] border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-xs">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">
                  Send an Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-[#A7A7A7] mt-1">
                  All messages are routed directly to <strong className="text-[#FF7200]">office@cbmacademy.in</strong>. We reply within 24 hours.
                </p>
              </div>

              {/* Status Banner */}
              {submitStatus.type === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm font-medium leading-relaxed">
                    {submitStatus.message}
                  </div>
                </div>
              )}

              {submitStatus.type === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm font-medium leading-relaxed">
                    {submitStatus.message}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                
                {/* Honeypot Spam Protection Field */}
                <input
                  type="text"
                  name="cbm_security_check"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="contact-fullname" className="block text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-fullname"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 ${
                        errors.fullName ? 'border-rose-400/80 ring-1 ring-rose-400/50 bg-rose-500/10' : 'bg-white/[0.04] border-white/[0.12] focus:ring-[#FF7200] focus:border-[#FF7200]'
                      }`}
                    />
                    {errors.fullName && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 ${
                        errors.email ? 'border-rose-400/80 ring-1 ring-rose-400/50 bg-rose-500/10' : 'bg-white/[0.04] border-white/[0.12] focus:ring-[#FF7200] focus:border-[#FF7200]'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 ${
                        errors.phone ? 'border-rose-400/80 ring-1 ring-rose-400/50 bg-rose-500/10' : 'bg-white/[0.04] border-white/[0.12] focus:ring-[#FF7200] focus:border-[#FF7200]'
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.phone}</p>}
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-1.5">
                      Inquiry Subject <span className="text-rose-400">*</span>
                    </label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: '' });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-white/[0.12] bg-[#0D0D0D] text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF7200] focus:border-[#FF7200]"
                    >
                      <option value="Course Admission & Eligibility" className="bg-[#0D0D0D] text-white">Course Admission & Eligibility</option>
                      <option value="Placement Drives & Job Assistance" className="bg-[#0D0D0D] text-white">Placement Drives & Job Assistance</option>
                      <option value="Corporate Training & Workshops" className="bg-[#0D0D0D] text-white">Corporate Training & Workshops</option>
                      <option value="Fee Structure & Scholarship Options" className="bg-[#0D0D0D] text-white">Fee Structure & Scholarship Options</option>
                      <option value="Certificate Verification Assistance" className="bg-[#0D0D0D] text-white">Certificate Verification Assistance</option>
                      <option value="Other Query" className="bg-[#0D0D0D] text-white">Other Query</option>
                    </select>
                    {errors.subject && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.subject}</p>}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-1.5">
                    Your Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    placeholder="Tell us about your background, career goals, or specific questions..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 ${
                      errors.message ? 'border-rose-400/80 ring-1 ring-rose-400/50 bg-rose-500/10' : 'bg-white/[0.04] border-white/[0.12] focus:ring-[#FF7200] focus:border-[#FF7200]'
                    }`}
                  />
                  {errors.message && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="contact-submit-btn"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7200] hover:bg-[#e06500] text-white font-bold text-base py-3.5 rounded-xl shadow-[0_4px_20px_rgba(255,114,0,0.3)] hover:shadow-[0_6px_25px_rgba(255,114,0,0.4)] transition-all active:scale-98 disabled:opacity-60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF7200] focus:ring-offset-2 focus:ring-offset-[#080808]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Inquiry to CBM Office</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#A7A7A7] text-center">
                  Protected by honeypot spam filtering. Your contact information is kept strictly confidential.
                </p>

              </form>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
