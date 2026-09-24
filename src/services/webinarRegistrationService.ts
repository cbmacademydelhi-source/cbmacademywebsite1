import { WebinarRegistration } from '../types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface ConfigStatusResponse {
  supabaseConfigured: boolean;
  razorpayConfigured: boolean;
  razorpayKeyId: string | null;
}

export interface FreeRegistrationParams {
  webinarId: string;
  webinarTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  date?: string;
  time?: string;
  duration?: string;
}

export interface PaidOrderParams {
  webinarId: string;
  webinarTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  price: number;
  date?: string;
  time?: string;
  duration?: string;
}

export interface PaymentVerificationParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  registrationId?: string;
  webinarId: string;
  webinarTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  amount: number;
}

/**
 * Fetch configuration status (whether Razorpay credentials are set)
 */
export async function fetchWebinarConfigStatus(): Promise<ConfigStatusResponse> {
  try {
    const res = await fetch('/api/webinars/config-status');
    if (!res.ok) {
      return { supabaseConfigured: true, razorpayConfigured: false, razorpayKeyId: null };
    }
    return await res.json();
  } catch {
    return { supabaseConfigured: true, razorpayConfigured: false, razorpayKeyId: null };
  }
}

/**
 * Register for a Free Webinar
 */
export async function submitFreeRegistration(data: FreeRegistrationParams) {
  const res = await fetch('/api/webinars/register-free', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Registration could not be completed.');
  }
  return json;
}

export interface PaidOrderResponse {
  success: boolean;
  registrationId: string;
  orderId: string;
  qrId?: string | null;
  qrImageUrl?: string | null;
  qrPayload?: string | null;
  amount: number; // in paise
  amountInINR: number;
  currency: string;
  keyId: string;
  webinarTitle: string;
  isTestMode?: boolean;
}

export interface RegistrationStatusResponse {
  success: boolean;
  payment_status: 'not_required' | 'pending' | 'paid' | 'failed' | 'expired';
  registration_status: 'pending' | 'approved' | 'cancelled';
  paid_at?: string | null;
  payment_id?: string | null;
  webinar_title?: string;
  message?: string;
}

/**
 * Simulate payment completion in Test Mode (for verification and development)
 */
export async function simulateWebinarPayment(
  registrationId: string
): Promise<RegistrationStatusResponse> {
  const res = await fetch('/api/webinars/simulate-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationId }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Payment simulation failed');
  }
  return json;
}

/**
 * Check registration & payment status by ID (polling)
 */
export async function checkRegistrationStatus(
  registrationId: string
): Promise<RegistrationStatusResponse> {
  const res = await fetch(`/api/webinars/registration-status/${encodeURIComponent(registrationId)}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to check status');
  }
  return json;
}

/**
 * Create Razorpay Order on Server for Paid Webinar
 */
export async function createPaidWebinarOrder(data: PaidOrderParams): Promise<PaidOrderResponse> {
  const res = await fetch('/api/webinars/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    const err: any = new Error(json.message || 'Failed to create payment order.');
    err.code = json.code;
    throw err;
  }
  return json as PaidOrderResponse;
}

/**
 * Verify Razorpay Payment Server-Side
 */
export async function verifyPaidWebinarPayment(data: PaymentVerificationParams) {
  const res = await fetch('/api/webinars/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Payment verification failed.');
  }
  return json;
}

/**
 * Dynamically load Razorpay SDK if not already loaded
 */
export function ensureRazorpayLoaded(): Promise<boolean> {
  if (typeof window.Razorpay === 'function') {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay checkout script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Launch Razorpay Checkout Modal
 */
export async function launchRazorpayCheckout({
  keyId,
  orderId,
  amountInPaise,
  currency = 'INR',
  webinarTitle,
  userName,
  userEmail,
  userPhone,
  onSuccess,
  onFailure,
  onDismiss,
}: {
  keyId: string;
  orderId: string;
  amountInPaise: number;
  currency?: string;
  webinarTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure: (errorMsg: string) => void;
  onDismiss?: () => void;
}) {
  const isLoaded = await ensureRazorpayLoaded();
  if (!isLoaded || !window.Razorpay) {
    onFailure('Could not load Razorpay payment gateway. Please check your internet connection.');
    return;
  }

  const options = {
    key: keyId,
    amount: amountInPaise,
    currency,
    name: 'CBM Academy',
    description: webinarTitle,
    image: 'https://cxeztsvgaeytdljoned.supabase.co/storage/v1/object/public/assets/cbm_logo.png',
    order_id: orderId,
    prefill: {
      name: userName,
      email: userEmail,
      contact: userPhone,
    },
    theme: {
      color: '#072B57', // CBM Academy primary navy
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) {
          onDismiss();
        }
      },
      escape: true,
      backdropclose: false,
    },
    handler: (response: any) => {
      if (response?.razorpay_payment_id && response?.razorpay_order_id && response?.razorpay_signature) {
        onSuccess(response);
      } else {
        onFailure('Payment response was incomplete. Please contact support.');
      }
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (resp: any) => {
      console.error('[Razorpay] Payment failed event:', resp?.error);
      const desc = resp?.error?.description || 'Payment was declined or cancelled.';
      onFailure(desc);
    });
    rzp.open();
  } catch (err: any) {
    console.error('[Razorpay] Failed to open checkout:', err);
    onFailure(err?.message || 'Failed to initialize payment gateway.');
  }
}

/**
 * Fetch Admin Registrations
 */
export async function fetchAdminRegistrations(
  token: string,
  filters?: { type?: 'free' | 'paid'; status?: string }
): Promise<WebinarRegistration[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.status) params.append('status', filters.status);

  const res = await fetch(`/api/webinars/registrations?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch registrations.');
  }
  return json.registrations || [];
}
