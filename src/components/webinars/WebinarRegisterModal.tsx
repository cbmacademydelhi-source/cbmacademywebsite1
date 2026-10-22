import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Calendar, Clock, Loader2, Sparkles } from 'lucide-react';
import { Webinar } from '../../types';
import { supabase } from '../../lib/supabase';

export interface WebinarRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  webinar?: Webinar | null;
  selectedWebinar?: Webinar | null;
  availableWebinars?: Webinar[];
}

export const WebinarRegisterModal: React.FC<WebinarRegisterModalProps> = ({
  isOpen,
  onClose,
  webinar,
  selectedWebinar,
  availableWebinars,
}) => {
  // Resolve the active webinar from either prop or fallback to first available
  const activeWebinar: Webinar | null =
    webinar ||
    selectedWebinar ||
    (availableWebinars && availableWebinars.length > 0 ? availableWebinars[0] : null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    phone: string;
    webinarTitle: string;
    date: string;
    time: string;
    duration: string;
  } | null>(null);

  // Reset form when modal opens or active webinar changes
  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setEmail('');
      setPhone('');
      setErrors({});
      setServerError('');
      setIsSubmitting(false);
      setIsSuccess(false);
      setSubmittedData(null);
    }
  }, [isOpen, activeWebinar?.id]);

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

  const webinarTitle = activeWebinar?.title || 'Digital Marketing Live Masterclass';
  const webinarDate = activeWebinar?.date || 'Upcoming Live Session';
  const webinarTime = activeWebinar?.time || '6:00 PM IST';
  const webinarDuration = activeWebinar?.duration || '60 mins';
  const webinarId = activeWebinar?.id || 'webinar-live-masterclass';

  // Dynamic pricing calculation from activeWebinar
  const rawPrice = activeWebinar?.price;
  const numPrice = typeof rawPrice === 'number'
    ? rawPrice
    : Number(String(rawPrice || '').replace(/[^0-9.]/g, ''));

  // FREE ONLY when price is explicitly 0, '0', 'FREE', or webinar.type is 'free' (and numeric price is not > 0)
  const isPaid = (typeof rawPrice === 'number' && rawPrice > 0) ||
    (!isNaN(numPrice) && numPrice > 0) ||
    activeWebinar?.type === 'paid';

  const priceValue = typeof rawPrice === 'number' && rawPrice > 0
    ? rawPrice
    : !isNaN(numPrice) && numPrice > 0
    ? numPrice
    : 499;

  const displayPrice = isPaid ? `₹${priceValue}` : 'FREE';

  const validatePhone = (value: string): boolean => {
    const cleaned = value.replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) return true;
    if (cleaned.length === 12 && cleaned.startsWith('91') && /^91[6-9]\d{9}$/.test(cleaned)) return true;
    // Allow standard 10+ digits international format as well
    if (cleaned.length >= 10 && /^\d{10,13}$/.test(cleaned)) return true;
    return false;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone / WhatsApp Number is required';
    } else if (!validatePhone(phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    let savedSuccessfully = false;
    let submissionErrorMessage = '';

    // =========================================================================
    // 1. PAID WEBINAR FLOW (Razorpay Checkout & Server Verification)
    // =========================================================================
    if (isPaid) {
      try {
        // Step A: Create order on server with dynamic webinar price
        const orderRes = await fetch('/api/webinars/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webinarId,
            webinarTitle,
            fullName: cleanFullName,
            email: cleanEmail,
            whatsappNumber: cleanPhone,
            phone: cleanPhone,
            price: priceValue,
            date: webinarDate,
            time: webinarTime,
            duration: webinarDuration,
            type: 'paid',
          }),
        });

        if (!orderRes.ok) {
          const errData = await orderRes.json().catch(() => null);
          throw new Error(errData?.message || 'Failed to initiate secure payment order. Please try again.');
        }

        const orderData = await orderRes.json();
        if (!orderData?.success || !orderData?.orderId) {
          throw new Error(orderData?.message || 'Could not generate Razorpay order.');
        }

        // Step B: Ensure Razorpay Checkout script is ready
        const loadRazorpay = (): Promise<boolean> => {
          return new Promise((resolve) => {
            if (typeof (window as any).Razorpay !== 'undefined') {
              resolve(true);
              return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const isLoaded = await loadRazorpay();
        if (!isLoaded || typeof (window as any).Razorpay === 'undefined') {
          throw new Error('Unable to open payment gateway. Please check your internet connection.');
        }

        const razorpayKey =
          orderData.keyId ||
          (import.meta as any).env?.VITE_RAZORPAY_KEY_ID ||
          'rzp_live_TqufyQXW4P2Don';

        // Step C: Open Razorpay Checkout Modal
        const options = {
          key: razorpayKey,
          amount: orderData.amount, // in paise
          currency: orderData.currency || 'INR',
          name: 'CBM Academy',
          description: `${webinarTitle} • Live Access`,
          order_id: orderData.orderId,
          prefill: {
            name: cleanFullName,
            email: cleanEmail,
            contact: cleanPhone,
          },
          notes: {
            webinar_id: webinarId,
            registration_id: orderData.registrationId,
          },
          theme: {
            color: '#FF6B00',
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
          },
          handler: async (paymentResponse: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              setIsSubmitting(true);
              // Step D: Server-side payment signature verification
              const verifyRes = await fetch('/api/webinars/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  registrationId: orderData.registrationId,
                  email: cleanEmail,
                  fullName: cleanFullName,
                  phone: cleanPhone,
                  amount: priceValue,
                  webinarId,
                  webinarTitle,
                }),
              });

              const verifyData = await verifyRes.json().catch(() => null);

              if (verifyRes.ok && verifyData?.success) {
                // Step E: Save registration in Supabase (client-side backup)
                try {
                  await supabase.from('webinar_registrations').insert([
                    {
                      id: orderData.registrationId,
                      webinar_id: webinarId,
                      webinar_title: webinarTitle,
                      full_name: cleanFullName,
                      email: cleanEmail,
                      whatsapp_number: cleanPhone,
                      phone: cleanPhone,
                      registration_type: 'paid',
                      amount: priceValue,
                      currency: 'INR',
                      payment_status: 'paid',
                      registration_status: 'approved',
                      razorpay_order_id: paymentResponse.razorpay_order_id,
                      razorpay_payment_id: paymentResponse.razorpay_payment_id,
                      razorpay_signature: paymentResponse.razorpay_signature,
                      payment_reference: orderData.reference,
                      paid_at: new Date().toISOString(),
                    },
                  ]);
                } catch (dbErr) {
                  console.warn('Supabase client insert backup notice:', dbErr);
                }

                setSubmittedData({
                  name: cleanFullName,
                  email: cleanEmail,
                  phone: cleanPhone,
                  webinarTitle,
                  date: webinarDate,
                  time: webinarTime,
                  duration: webinarDuration,
                });
                setIsSuccess(true);
              } else {
                setServerError(
                  verifyData?.message ||
                    'Payment signature verification failed. Please contact admissions support if your card or UPI was charged.'
                );
              }
            } catch (vErr: any) {
              console.error('Payment verification failed:', vErr);
              setServerError(
                'Could not verify payment status with server. If your account was debited, your seat will be confirmed automatically.'
              );
            } finally {
              setIsSubmitting(false);
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          setIsSubmitting(false);
          setServerError(
            resp?.error?.description || 'Payment was unsuccessful or cancelled. Please try again.'
          );
        });
        rzp.open();
        return;
      } catch (payErr: any) {
        console.error('Razorpay order initiation failed:', payErr);
        setIsSubmitting(false);
        setServerError(payErr?.message || 'Could not connect to payment gateway. Please try again.');
        return;
      }
    }

    // =========================================================================
    // 2. FREE WEBINAR FLOW (Keep existing free registration flow)
    // =========================================================================
    try {
      // Primary: Insert into webinar_registrations table (without .select() to respect RLS INSERT policy)
      const regRecord = {
        webinar_id: webinarId,
        webinar_title: webinarTitle,
        full_name: cleanFullName,
        email: cleanEmail,
        whatsapp_number: cleanPhone,
        phone: cleanPhone,
        registration_type: 'free',
        amount: 0,
        currency: 'INR',
        payment_status: 'not_required',
        registration_status: 'approved',
      };

      const { error: regError } = await supabase
        .from('webinar_registrations')
        .insert([regRecord]);

      if (!regError) {
        savedSuccessfully = true;
      } else {
        console.warn('webinar_registrations table insert notice:', regError.message);
      }

      // Also persist to website_submissions table
      const { error: subError } = await supabase
        .from('website_submissions')
        .insert([
          {
            form_type: 'webinar_registration',
            name: cleanFullName,
            email: cleanEmail,
            phone: cleanPhone,
            course: webinarTitle,
            message: `[Webinar Registration] ${webinarTitle} - Date: ${webinarDate} ${webinarTime} (FREE)`,
            form_data: {
              full_name: cleanFullName,
              email: cleanEmail,
              phone: cleanPhone,
              webinar_id: webinarId,
              webinar_title: webinarTitle,
              date: webinarDate,
              time: webinarTime,
              duration: webinarDuration,
              registration_type: 'free',
              amount: 0,
            },
          },
        ]);

      if (!subError) {
        savedSuccessfully = true;
      }

      // Also persist to contact_submissions table
      const { error: contactError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            full_name: cleanFullName,
            email: cleanEmail,
            phone: cleanPhone,
            message: `[Webinar Registration]\nWebinar: ${webinarTitle}\nStatus: Approved (Free Access)`,
          },
        ]);

      if (!contactError) {
        savedSuccessfully = true;
      }
    } catch (dbErr: any) {
      console.warn('Direct Supabase insert exception:', dbErr);
    }

    // Server API fallback & automated notification trigger
    try {
      const response = await fetch('/api/webinars/register-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webinarId,
          webinarTitle,
          fullName: cleanFullName,
          email: cleanEmail,
          whatsappNumber: cleanPhone,
          phone: cleanPhone,
          date: webinarDate,
          time: webinarTime,
          duration: webinarDuration,
          price: 0,
          type: 'free',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          savedSuccessfully = true;
        } else if (result.message) {
          submissionErrorMessage = result.message;
        }
      } else {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          submissionErrorMessage = errorData.message;
        }
      }
    } catch (apiErr: any) {
      console.warn('Server registration dispatch notice:', apiErr);
    }

    setIsSubmitting(false);

    if (savedSuccessfully) {
      setSubmittedData({
        name: cleanFullName,
        email: cleanEmail,
        phone: cleanPhone,
        webinarTitle,
        date: webinarDate,
        time: webinarTime,
        duration: webinarDuration,
      });
      setIsSuccess(true);
    } else {
      setServerError(
        submissionErrorMessage ||
          'Failed to record your registration in the database. Please check your network connection and try again.'
      );
    }
  };

  const handleCloseModal = () => {
    setIsSuccess(false);
    setErrors({});
    setServerError('');
    onClose();
  };

  return (
    <div
      id="webinar-register-modal-overlay"
      className="fixed inset-0 z-[10020] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={handleCloseModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="webinar-register-title"
    >
      <div
        id="webinar-register-modal-content"
        className="relative my-8 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 bg-[#072B57] px-6 py-5 text-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                isPaid ? 'bg-orange-500 text-white font-extrabold' : 'bg-emerald-600 text-white'
              }`}>
                <Sparkles className="w-3 h-3" />
                {isPaid ? `PAID • ${displayPrice}` : 'FREE'}
              </span>
            </div>
            <h2 id="webinar-register-title" className="text-lg sm:text-xl font-black tracking-tight text-white">
              {isSuccess ? 'Registration Confirmed' : 'Register for Webinar'}
            </h2>
            <p className="text-xs text-slate-300 leading-snug">
              {isSuccess
                ? 'Your seat has been reserved. See you at the live session!'
                : isPaid
                ? `Fill in your details below to secure your seat for ${displayPrice}.`
                : 'Fill in your details below to secure your free live access.'}
            </p>
          </div>

          <button
            type="button"
            id="btn-close-register-modal"
            onClick={handleCloseModal}
            aria-label="Close modal"
            className="rounded-xl p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {isSuccess && submittedData ? (
            /* ===================================================
               SUCCESS VIEW
            =================================================== */
            <div id="webinar-register-success-view" className="text-center py-3 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#072B57]">
                  Registration Confirmed!
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Thank you, <span className="font-bold text-[#072B57]">{submittedData.name}</span>! Your registration has been successfully received by CBM Academy. We look forward to seeing you at the session!
                </p>
              </div>

              {/* Webinar Details Card */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 max-w-md mx-auto">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Confirmed Webinar
                </div>
                <div className="text-sm font-extrabold text-[#072B57] leading-snug">
                  {submittedData.webinarTitle}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                    <span>{submittedData.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                    <span>{submittedData.time}</span>
                  </div>
                  <div className="col-span-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Duration: <span className="font-semibold text-slate-700">{submittedData.duration}</span></span>
                    <span className="font-extrabold text-[#072B57]">{isPaid ? `PAID • ${displayPrice}` : 'FREE'}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Webinar details and Google Meet joining link will be shared with you on{' '}
                <span className="font-semibold text-[#072B57]">{submittedData.email}</span> and WhatsApp ({submittedData.phone}).
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  id="btn-close-register-success"
                  onClick={handleCloseModal}
                  className="inline-flex items-center justify-center rounded-xl bg-[#072B57] px-8 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#0c3c78] cursor-pointer shadow-sm active:scale-98"
                >
                  Explore More Webinars
                </button>
              </div>
            </div>
          ) : (
            /* ===================================================
               REGISTRATION FORM
            =================================================== */
            <form onSubmit={handleSubmit} className="space-y-4" noValidate autoComplete="off">
              {/* Trap browser autofill heuristics */}
              <input type="text" name="chrome_autofill_trap_1" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <input type="email" name="chrome_autofill_trap_2" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <input type="tel" name="chrome_autofill_trap_3" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              {serverError && (
                <div
                  id="webinar-register-server-error"
                  className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs font-medium leading-relaxed">
                    {serverError}
                  </div>
                </div>
              )}

              {Object.keys(errors).length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs font-medium leading-relaxed">
                    Please correct the highlighted fields below.
                  </div>
                </div>
              )}

              {/* 1. Selected Webinar (Pre-filled automatically) */}
              <div>
                <label
                  htmlFor="register-webinar-prefilled"
                  className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5"
                >
                  Selected Webinar
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        id="register-webinar-prefilled"
                        className="text-xs sm:text-sm font-extrabold text-[#072B57] leading-snug"
                      >
                        {webinarTitle}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{webinarDate}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{webinarTime} ({webinarDuration})</span>
                        </span>
                      </div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      isPaid
                        ? 'bg-orange-50 text-[#FF6B00] border border-orange-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isPaid ? `PAID • ${displayPrice}` : 'FREE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Full Name */}
              <div>
                <label
                  htmlFor="cbm-reg-fullname"
                  className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="cbm-reg-fullname"
                  name="cbm_student_name"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  data-lpignore="true"
                  data-form-type="other"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    if (serverError) setServerError('');
                  }}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm text-[#072B57] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all [text-decoration:none] ${
                    errors.fullName
                      ? 'border-rose-300 ring-1 ring-rose-300 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-[#FF6B00] focus:border-[#FF6B00]'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* 3. Email Address */}
              <div>
                <label
                  htmlFor="cbm-reg-email"
                  className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="email"
                  id="cbm-reg-email"
                  name="cbm_student_email"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-form-type="other"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    if (serverError) setServerError('');
                  }}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm text-[#072B57] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all [text-decoration:none] ${
                    errors.email
                      ? 'border-rose-300 ring-1 ring-rose-300 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-[#FF6B00] focus:border-[#FF6B00]'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              {/* 4. Phone/WhatsApp Number */}
              <div>
                <label
                  htmlFor="cbm-reg-phone"
                  className="block text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5"
                >
                  Phone/WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="tel"
                  id="cbm-reg-phone"
                  name="cbm_student_phone"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-form-type="other"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    if (serverError) setServerError('');
                  }}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm text-[#072B57] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all [text-decoration:none] ${
                    errors.phone
                      ? 'border-rose-300 ring-1 ring-rose-300 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-[#FF6B00] focus:border-[#FF6B00]'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Clear "Register Now" Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-register-now"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#e05f00] disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer shadow-md active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{isPaid ? 'Connecting to Payment...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <span>{isPaid ? `Book Seat / Pay ${displayPrice}` : 'Register Now'}</span>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400">
                {isPaid
                  ? `Official Live Masterclass (${displayPrice}) • Details will be recorded in Supabase and shared to your email.`
                  : '100% Free Live Session • Details will be recorded in Supabase and shared to your email.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
