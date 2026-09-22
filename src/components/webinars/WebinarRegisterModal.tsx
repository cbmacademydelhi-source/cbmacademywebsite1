import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Webinar } from '../../types';
import { registerForWebinar } from '../../services/webinarStorage';

interface WebinarRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWebinar: Webinar | null;
  availableWebinars: Webinar[];
}

export const WebinarRegisterModal: React.FC<WebinarRegisterModalProps> = ({
  isOpen,
  onClose,
  selectedWebinar,
  availableWebinars,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [webinarId, setWebinarId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (selectedWebinar) {
      setWebinarId(selectedWebinar.id);
    } else if (availableWebinars.length > 0 && !webinarId) {
      setWebinarId(availableWebinars[0].id);
    }
  }, [selectedWebinar, availableWebinars]);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentWebinar = availableWebinars.find((w) => w.id === webinarId) || selectedWebinar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim() || phoneDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!webinarId) {
      setError('Please select a webinar.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await registerForWebinar({
        webinarId,
        webinarTitle: currentWebinar ? currentWebinar.title : 'Webinar Registration',
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });

      if (result.success) {
        setIsSuccess(true);
        // Clear form
        setFullName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setError(result.message || 'Registration could not be completed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setError('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      id="webinar-register-modal-overlay"
      className="fixed inset-0 z-[10020] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="webinar-register-modal-content"
        className="relative my-8 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E7EB]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="webinar-register-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#072B57] px-6 py-4 text-white">
          <div>
            <h3 id="webinar-register-title" className="text-lg font-bold">
              Webinar Registration
            </h3>
            <p className="text-xs text-slate-300">
              {currentWebinar ? currentWebinar.title : 'Reserve your live seat'}
            </p>
          </div>

          <button
            type="button"
            id="btn-close-register-modal"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7">
          {isSuccess ? (
            <div id="webinar-registration-success-state" className="text-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <h4 className="text-xl font-extrabold text-[#072B57]">
                Registration Successful!
              </h4>

              <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for registering. We will contact you with the webinar details.
              </p>

              {currentWebinar && (
                <div className="mt-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-3 text-xs text-left max-w-sm mx-auto">
                  <div className="font-bold text-[#072B57]">{currentWebinar.title}</div>
                  <div className="text-slate-500 mt-1">
                    {currentWebinar.date} &bull; {currentWebinar.time}
                  </div>
                </div>
              )}

              <button
                type="button"
                id="btn-registration-done-close"
                onClick={handleClose}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#072B57] px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0c3c78] cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  id="webinar-register-error"
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Webinar Selection */}
              <div>
                <label className="block text-xs font-bold text-[#072B57] mb-1">
                  Select Webinar <span className="text-red-500">*</span>
                </label>
                <select
                  id="register-select-webinar"
                  value={webinarId}
                  onChange={(e) => setWebinarId(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                  required
                >
                  {availableWebinars.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.type === 'free' ? 'FREE' : `PAID ₹${w.price || 499}`}) - {w.date}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#072B57] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-input-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#072B57] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#072B57] mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-input-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Message / Question */}
              <div>
                <label className="block text-xs font-bold text-[#072B57] mb-1">
                  Message / Question <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="register-input-message"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any specific topic or question for the instructor?"
                  className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-registration"
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] py-3 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#e05f00] disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer shadow-md active:scale-98"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Registration...</span>
                  </>
                ) : (
                  <span>Register for Webinar</span>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                We will send webinar joining link and session materials via email &amp; WhatsApp.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
