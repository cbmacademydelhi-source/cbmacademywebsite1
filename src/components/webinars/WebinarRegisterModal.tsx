import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Smartphone,
  ArrowLeft,
} from 'lucide-react';
import { Webinar } from '../../types';
import {
  fetchWebinarConfigStatus,
  submitFreeRegistration,
  createPaidWebinarOrder,
  verifyPaidWebinarPayment,
  checkRegistrationStatus,
  simulateWebinarPayment,
  launchRazorpayCheckout,
  ConfigStatusResponse,
} from '../../services/webinarRegistrationService';

interface WebinarRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWebinar: Webinar | null;
  availableWebinars: Webinar[];
}

interface QrSessionData {
  registrationId: string;
  orderId: string;
  qrId?: string | null;
  qrImageUrl?: string | null;
  qrPayload?: string | null;
  amount: number;
  amountInINR: number;
  keyId: string;
  webinarTitle: string;
  webinarDate: string;
  webinarTime: string;
  webinarDuration: string;
  isTestMode?: boolean;
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
  const [submittingStep, setSubmittingStep] = useState<string>('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    webinarTitle: string;
    date: string;
    time: string;
    duration: string;
    isPaid: boolean;
    amount: number;
    paymentId?: string;
  } | null>(null);

  // Active Razorpay QR Session State
  const [qrSession, setQrSession] = useState<QrSessionData | null>(null);

  const [configStatus, setConfigStatus] = useState<ConfigStatusResponse>({
    supabaseConfigured: true,
    razorpayConfigured: false,
    razorpayKeyId: null,
  });

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
      setSuccessDetails(null);
      setQrSession(null);
      fetchWebinarConfigStatus().then((cfg) => setConfigStatus(cfg));
    }
  }, [isOpen]);

  // ==========================================
  // POLLING LISTENER FOR QR CODE PAYMENT
  // ==========================================
  useEffect(() => {
    if (!qrSession?.registrationId) return;

    let isSubscribed = true;
    const interval = setInterval(async () => {
      try {
        const statusRes = await checkRegistrationStatus(qrSession.registrationId);
        if (!isSubscribed) return;

        // Payment confirmed & verified server-side
        if (
          statusRes.payment_status === 'paid' &&
          statusRes.registration_status === 'approved'
        ) {
          clearInterval(interval);
          setSuccessDetails({
            webinarTitle: qrSession.webinarTitle,
            date: qrSession.webinarDate,
            time: qrSession.webinarTime,
            duration: qrSession.webinarDuration,
            isPaid: true,
            amount: qrSession.amountInINR,
            paymentId: statusRes.payment_id || undefined,
          });
          setQrSession(null);
          setIsSuccess(true);
          setFullName('');
          setEmail('');
          setPhone('');
          setMessage('');
        } else if (statusRes.payment_status === 'failed') {
          clearInterval(interval);
          setError('Payment could not be completed. Please try again.');
          setQrSession(null);
        } else if (statusRes.payment_status === 'expired') {
          clearInterval(interval);
          setError('Payment QR has expired. Please try again.');
          setQrSession(null);
        }
      } catch (pollErr) {
        console.warn('[Polling] Registration status check notice:', pollErr);
      }
    }, 2500);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [qrSession]);

  if (!isOpen) return null;

  const currentWebinar = availableWebinars.find((w) => w.id === webinarId) || selectedWebinar;
  const isPaid = currentWebinar?.type === 'paid';
  const webinarPrice = typeof currentWebinar?.price === 'number' ? currentWebinar.price : 499;

  // Capacity evaluation
  const isCapacityReached =
    typeof currentWebinar?.max_capacity === 'number' &&
    typeof currentWebinar?.current_registrations === 'number' &&
    currentWebinar.current_registrations >= currentWebinar.max_capacity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Prevent double submission
    setError('');

    // Form validation
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

    if (!webinarId || !currentWebinar) {
      setError('Please select a webinar.');
      return;
    }

    if (isCapacityReached) {
      setError('Registration Closed: This webinar has reached maximum capacity.');
      return;
    }

    setSubmitting(true);

    // ==========================================
    // 1. FREE WEBINAR FLOW
    // ==========================================
    if (!isPaid) {
      setSubmittingStep('Confirming free registration in Supabase...');
      try {
        const result = await submitFreeRegistration({
          webinarId: currentWebinar.id,
          webinarTitle: currentWebinar.title,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          date: currentWebinar.date,
          time: currentWebinar.time,
          duration: currentWebinar.duration,
        });

        if (result.success) {
          setSuccessDetails({
            webinarTitle: currentWebinar.title,
            date: currentWebinar.date,
            time: currentWebinar.time,
            duration: currentWebinar.duration,
            isPaid: false,
            amount: 0,
          });
          setIsSuccess(true);
          setFullName('');
          setEmail('');
          setPhone('');
          setMessage('');
        } else {
          setError(
            result.message ||
              'Something went wrong while completing your registration. Please try again.'
          );
        }
      } catch (err: any) {
        console.error('Free registration error:', err);
        setError(
          err.message ||
            'Something went wrong while completing your registration. Please try again.'
        );
      } finally {
        setSubmitting(false);
        setSubmittingStep('');
      }
      return;
    }

    // ==========================================
    // 2. PAID WEBINAR FLOW (Razorpay QR Session)
    // ==========================================
    setSubmittingStep('Creating secure Razorpay QR session...');

    try {
      const orderData = await createPaidWebinarOrder({
        webinarId: currentWebinar.id,
        webinarTitle: currentWebinar.title,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        price: webinarPrice,
        date: currentWebinar.date,
        time: currentWebinar.time,
        duration: currentWebinar.duration,
      });

      if (!orderData.orderId || !orderData.registrationId) {
        throw new Error('Order creation was incomplete.');
      }

      // Enter QR Payment State
      setQrSession({
        registrationId: orderData.registrationId,
        orderId: orderData.orderId,
        qrId: orderData.qrId,
        qrImageUrl: orderData.qrImageUrl,
        qrPayload: orderData.qrPayload,
        amount: orderData.amount,
        amountInINR: orderData.amountInINR,
        keyId: orderData.keyId,
        webinarTitle: currentWebinar.title,
        webinarDate: currentWebinar.date,
        webinarTime: currentWebinar.time,
        webinarDuration: currentWebinar.duration,
        isTestMode: orderData.isTestMode,
      });
    } catch (err: any) {
      console.warn('Paid registration initiation notice:', err);
      setError(err?.message || 'Payment could not be completed. Please try again.');
    } finally {
      setSubmitting(false);
      setSubmittingStep('');
    }
  };

  /**
   * Simulate Successful Payment in Test Mode
   */
  const handleSimulatePayment = async () => {
    if (!qrSession) return;
    setSubmitting(true);
    setSubmittingStep('Confirming verified test payment...');

    try {
      const simRes = await simulateWebinarPayment(qrSession.registrationId);
      if (simRes.success && simRes.payment_status === 'paid') {
        setSuccessDetails({
          webinarTitle: qrSession.webinarTitle,
          date: qrSession.webinarDate,
          time: qrSession.webinarTime,
          duration: qrSession.webinarDuration,
          isPaid: true,
          amount: qrSession.amountInINR,
          paymentId: simRes.payment_id || `pay_test_${Date.now().toString(36)}`,
        });
        setQrSession(null);
        setIsSuccess(true);
        setFullName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setError('Payment simulation could not be completed.');
      }
    } catch (simErr: any) {
      console.warn('Simulate payment error:', simErr);
      setError('Payment simulation could not be completed.');
    } finally {
      setSubmitting(false);
      setSubmittingStep('');
    }
  };

  /**
   * Optional Fallback: Launch Razorpay Checkout Modal for Cards/Netbanking
   */
  const handleLaunchCheckoutModal = async () => {
    if (!qrSession) return;
    setSubmitting(true);
    setSubmittingStep('Opening Razorpay Gateway...');

    try {
      await launchRazorpayCheckout({
        keyId: qrSession.keyId,
        orderId: qrSession.orderId,
        amountInPaise: qrSession.amount,
        currency: 'INR',
        webinarTitle: qrSession.webinarTitle,
        userName: fullName.trim(),
        userEmail: email.trim(),
        userPhone: phone.trim(),
        onSuccess: async (rzpResponse) => {
          setSubmittingStep('Verifying payment securely on server...');
          try {
            const verifyResult = await verifyPaidWebinarPayment({
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
              registrationId: qrSession.registrationId,
              webinarId: currentWebinar?.id || '',
              webinarTitle: qrSession.webinarTitle,
              fullName: fullName.trim(),
              email: email.trim(),
              phone: phone.trim(),
              message: message.trim(),
              amount: qrSession.amountInINR,
            });

            if (verifyResult.success) {
              setSuccessDetails({
                webinarTitle: qrSession.webinarTitle,
                date: qrSession.webinarDate,
                time: qrSession.webinarTime,
                duration: qrSession.webinarDuration,
                isPaid: true,
                amount: qrSession.amountInINR,
                paymentId: rzpResponse.razorpay_payment_id,
              });
              setQrSession(null);
              setIsSuccess(true);
              setFullName('');
              setEmail('');
              setPhone('');
              setMessage('');
            } else {
              setError('Payment could not be completed. Please try again.');
            }
          } catch (verErr: any) {
            console.error('Payment verification error:', verErr);
            setError('Payment could not be completed. Please try again.');
          } finally {
            setSubmitting(false);
            setSubmittingStep('');
          }
        },
        onFailure: (errorMsg) => {
          console.warn('[Razorpay] Payment declined or failed:', errorMsg);
          setError('Payment could not be completed. Please try again.');
          setSubmitting(false);
          setSubmittingStep('');
        },
        onDismiss: () => {
          setError('Payment was cancelled. Your registration has not been confirmed.');
          setSubmitting(false);
          setSubmittingStep('');
        },
      });
    } catch (err: any) {
      console.error('Launch checkout error:', err);
      setError('Payment could not be completed. Please try again.');
      setSubmitting(false);
      setSubmittingStep('');
    }
  };

  const handleCancelQrSession = () => {
    setQrSession(null);
    setError('Payment was cancelled. Your registration has not been confirmed.');
  };

  const handleClose = () => {
    setError('');
    setIsSuccess(false);
    setSuccessDetails(null);
    setQrSession(null);
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
              {qrSession ? 'UPI QR Payment' : 'Webinar Registration'}
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

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {isSuccess && successDetails ? (
            /* ===================================================
               SUCCESS SCREEN (Per User Requirement 8 & 14)
               - "Payment successful! Your webinar registration is confirmed."
               - "You're Registered!"
               - Webinar Title
               - Date, Time, Duration
               - Amount Paid (for paid)
               - Payment ID
               - "Webinar details will be sent to your registered email."
            =================================================== */
            <div id="webinar-registration-success-state" className="text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce-short">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <h4 className="text-2xl font-black text-[#072B57]">
                You're Registered!
              </h4>

              <div className="mt-2 inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                {successDetails.isPaid
                  ? 'Payment successful! Your webinar registration is confirmed.'
                  : 'Free Registration Confirmed'}
              </div>

              {/* Webinar Details Card */}
              <div className="mt-5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-4 text-left max-w-md mx-auto space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Webinar Details
                </div>
                <div className="text-base font-extrabold text-[#072B57]">
                  {successDetails.webinarTitle}
                </div>
                <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-700">Date:</span>{' '}
                    {successDetails.date}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Time:</span>{' '}
                    {successDetails.time}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-700">Duration:</span>{' '}
                    {successDetails.duration}
                  </div>
                </div>

                {successDetails.isPaid && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Amount Paid:</span>
                    <span className="text-sm font-extrabold text-[#072B57]">
                      ₹{successDetails.amount}
                    </span>
                  </div>
                )}

                {successDetails.paymentId && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold">Payment ID:</span>{' '}
                    {successDetails.paymentId}
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Webinar details will be sent to your registered email.
              </p>

              <button
                type="button"
                id="btn-registration-done-close"
                onClick={handleClose}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#072B57] px-8 py-2.5 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#0c3c78] cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          ) : qrSession ? (
            /* ===================================================
               RAZORPAY QR PAYMENT INTERFACE (User Requirement 3 & 4)
               - Scan QR code using your UPI app
               - Waiting for payment...
               - Real-time server-side verified confirmation
            =================================================== */
            <div id="razorpay-qr-payment-view" className="text-center py-2 space-y-4">
              {/* Back / Cancel button */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCancelQrSession}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to details</span>
                </button>
                <span className="text-xs font-bold text-slate-400">Order #{qrSession.orderId.slice(-6)}</span>
              </div>

              {/* Amount and Webinar Header */}
              <div className="rounded-xl bg-[#072B57]/5 border border-[#072B57]/15 p-3 flex items-center justify-between text-left">
                <div>
                  <div className="text-xs font-bold text-[#072B57] line-clamp-1">
                    {qrSession.webinarTitle}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Live Session Seat Reservation
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Amount</div>
                  <div className="text-xl font-black text-[#072B57]">
                    ₹{qrSession.amountInINR}
                  </div>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="mx-auto flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm max-w-[260px]">
                <div className="relative w-[210px] h-[210px] flex items-center justify-center bg-white rounded-xl overflow-hidden">
                  <img
                    src={
                      qrSession.qrImageUrl ||
                      `https://api.qrserver.com/v1/create-qr-code/?size=210x210&margin=4&data=${encodeURIComponent(
                        qrSession.qrPayload || `upi://pay?am=${qrSession.amountInINR}&cu=INR`
                      )}`
                    }
                    alt="Razorpay UPI Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1">
                  <QrCode className="h-3 w-3 text-[#FF6B00]" />
                  <span>Razorpay Verified UPI QR</span>
                </div>
              </div>

              {/* Primary Instruction Messages (Exact User Requirement) */}
              <div className="space-y-1.5 pt-1">
                <div className="text-sm font-bold text-[#072B57]">
                  Scan the QR code using your UPI app
                </div>

                {/* Animated status beacon */}
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-200">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">
                    Waiting for payment...
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 max-w-xs mx-auto pt-1 leading-snug">
                  Payment is still pending. Your registration will be confirmed after successful payment.
                </p>
              </div>

              {/* Supported UPI Apps Banner */}
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Supported UPI Apps
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1">Google Pay</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">PhonePe</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">Paytm</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">BHIM</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">CRED</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                {/* Razorpay Test Mode Simulation Controls */}
                {(qrSession.isTestMode || !configStatus.razorpayConfigured) && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3 text-left space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                        Razorpay Test Mode Active
                      </span>
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                        Sandbox / Test
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      Test UPI QR generated. Click below to verify the real-time server approval and confirmation flow.
                    </p>
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-[#FF6B00] py-2.5 text-xs font-bold text-white hover:opacity-95 transition-opacity shadow-xs cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Approving Test Payment...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Simulate Verified Payment (Test Mode)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Mobile Intent link for direct app open */}
                {qrSession.qrPayload && (
                  <a
                    href={qrSession.qrPayload}
                    className="sm:hidden w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>Pay in UPI App Directly</span>
                  </a>
                )}

                {/* Alternative: Pay with Cards / Netbanking */}
                <button
                  type="button"
                  onClick={handleLaunchCheckoutModal}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <CreditCard className="h-3.5 w-3.5 text-slate-500" />
                  <span>Pay with Cards / Netbanking instead</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelQrSession}
                  className="text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer pt-1"
                >
                  Cancel Registration
                </button>
              </div>
            </div>
          ) : (
            /* ===================================================
               REGISTRATION FORM
            =================================================== */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  id="webinar-register-error"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Webinar Selection */}
              <div>
                <label className="block text-xs font-bold text-[#072B57] mb-1">
                  Selected Webinar <span className="text-red-500">*</span>
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

              {/* Price / Amount Payable Display */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Amount Payable
                  </span>
                  <span className="text-xs text-slate-500">
                    {isPaid ? 'Live Workshop + Verified Certificate' : '100% Free Live Access'}
                  </span>
                </div>
                <div>
                  <span
                    className={`text-xl font-black ${
                      isPaid ? 'text-[#072B57]' : 'text-emerald-600'
                    }`}
                  >
                    {isPaid ? `₹${webinarPrice}` : 'FREE'}
                  </span>
                </div>
              </div>

              {/* Test Mode / Credentials Notice for Paid Webinars */}
              {isPaid && !configStatus.razorpayConfigured && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-3 text-xs text-indigo-900 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">
                      Razorpay Test Mode Active
                    </span>
                    <span className="text-[11px] text-indigo-700 block mt-0.5 leading-snug">
                      Test UPI QR generation and instant payment simulation are enabled so you can test registrations. For live payments, set <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono text-[10px]">RAZORPAY_KEY_ID</code> &amp; <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono text-[10px]">RAZORPAY_KEY_SECRET</code> in environment variables.
                    </span>
                  </div>
                </div>
              )}

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
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
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
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
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
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
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
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 resize-none disabled:bg-slate-100"
                />
              </div>

              {/* Submit Button */}
              {isCapacityReached ? (
                <div className="w-full rounded-xl bg-slate-200 py-3 text-center text-xs sm:text-sm font-bold text-slate-500">
                  Registration Closed (Capacity Reached)
                </div>
              ) : (
                <button
                  id="btn-submit-registration"
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] py-3 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#e05f00] disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer shadow-md active:scale-98"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{submittingStep || 'Processing...'}</span>
                    </>
                  ) : isPaid ? (
                    <>
                      <QrCode className="h-4 w-4" />
                      <span>Pay via UPI QR (₹{webinarPrice})</span>
                    </>
                  ) : (
                    <span>Register for Free</span>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <Lock className="h-3 w-3" />
                <span>
                  {isPaid
                    ? 'Secured with Razorpay 256-bit encryption. No banking PINs stored.'
                    : 'We will send the webinar joining link to your registered email.'}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

