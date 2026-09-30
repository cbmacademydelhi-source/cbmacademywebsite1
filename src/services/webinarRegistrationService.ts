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
 * Robust JSON fetch wrapper that guarantees:
 * 1. Safe parsing: never throws "Unexpected token '<', <html>... is not valid JSON"
 * 2. Human-readable errors: cleanly converts HTML 404/500 into helpful messages
 * 3. Safe logging: logs unexpected response bodies safely for debugging without exposing secrets
 */
async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  fallbackMessage = 'Request could not be completed.'
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (netErr: any) {
    console.error(`[Webinar Service Network Error] ${url}:`, netErr?.message || netErr);
    throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch (parseErr) {
      console.error(`[Webinar Service JSON Parse Error] ${url}:`, parseErr);
      throw new Error('Received an unreadable response from the payment server. Please try again.');
    }
  } else {
    // Non-JSON response (e.g., HTML fallback or server error page)
    const rawText = await res.text().catch(() => '');
    console.warn(
      `[Webinar Service Non-JSON Response] ${url} (Status: ${res.status}, Type: ${contentType}):`,
      rawText.slice(0, 160)
    );

    if (res.status === 404) {
      throw new Error('Payment service endpoint not found. Please refresh the page and try again.');
    } else if (res.status >= 500) {
      throw new Error('Payment service is temporarily unavailable. Please try again in a few moments.');
    } else {
      throw new Error(fallbackMessage);
    }
  }

  if (!res.ok) {
    const errorMsg = data?.message || fallbackMessage;
    const err: any = new Error(errorMsg);
    if (data?.code) err.code = data.code;
    throw err;
  }

  return data as T;
}

/**
 * Fetch configuration status (whether Razorpay credentials are set)
 */
export async function fetchWebinarConfigStatus(): Promise<ConfigStatusResponse> {
  try {
    return await safeFetchJson<ConfigStatusResponse>(
      '/api/webinars/config-status',
      undefined,
      'Could not retrieve configuration status.'
    );
  } catch {
    return { supabaseConfigured: true, razorpayConfigured: false, razorpayKeyId: null };
  }
}

/**
 * Register for a Free Webinar
 */
export async function submitFreeRegistration(data: FreeRegistrationParams) {
  return await safeFetchJson(
    '/api/webinars/register-free',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    'Registration could not be completed.'
  );
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
  return await safeFetchJson<RegistrationStatusResponse>(
    '/api/webinars/simulate-payment',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId }),
    },
    'Payment simulation failed.'
  );
}

/**
 * Check registration & payment status by ID (polling)
 */
export async function checkRegistrationStatus(
  registrationId: string
): Promise<RegistrationStatusResponse> {
  return await safeFetchJson<RegistrationStatusResponse>(
    `/api/webinars/registration-status/${encodeURIComponent(registrationId)}`,
    undefined,
    'Failed to check registration status.'
  );
}

/**
 * Create Razorpay Order on Server for Paid Webinar
 */
export async function createPaidWebinarOrder(data: PaidOrderParams): Promise<PaidOrderResponse> {
  return await safeFetchJson<PaidOrderResponse>(
    '/api/webinars/create-order',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    'Failed to create payment order.'
  );
}

/**
 * Verify Razorpay Payment Server-Side
 */
export async function verifyPaidWebinarPayment(data: PaymentVerificationParams) {
  return await safeFetchJson(
    '/api/webinars/verify-payment',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    'Payment verification failed.'
  );
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

  const json = await safeFetchJson<{ registrations?: WebinarRegistration[] }>(
    `/api/webinars/registrations?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    'Failed to fetch registrations.'
  );

  return json.registrations || [];
}
