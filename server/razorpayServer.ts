import crypto from 'crypto';
import Razorpay from 'razorpay';

const DEFAULT_KEY_ID = 'rzp_live_TqufyQXW4P2Don';
const DEFAULT_KEY_SECRET = 'FAPE53ROFpLpdhRcJ1LPu1VT';

export function getRazorpayKeyId(): string {
  const keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || DEFAULT_KEY_ID).trim();
  return keyId;
}

export function getRazorpayKeySecret(): string {
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || DEFAULT_KEY_SECRET).trim();
  return keySecret;
}

export function isRazorpayConfigured(): boolean {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  return Boolean(keyId && keySecret && keyId.startsWith('rzp_'));
}

export function isWebhookConfigured(): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  return Boolean(secret && secret.trim());
}

let razorpayInstance: Razorpay | null = null;
let currentKeyId = '';

export function getRazorpayClient(): Razorpay {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();

  if (!razorpayInstance || currentKeyId !== keyId) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    currentKeyId = keyId;
  }

  return razorpayInstance;
}

export interface CreateOrderParams {
  amountInINR: number; // e.g. 499
  receipt: string;
  notes?: Record<string, string>;
}

export async function createOrder({ amountInINR, receipt, notes }: CreateOrderParams) {
  const numericAmount = typeof amountInINR === 'number' && !isNaN(amountInINR)
    ? amountInINR
    : Number(String(amountInINR || '').replace(/[^0-9.]/g, '')) || 499;
  const amountInPaise = Math.round(numericAmount * 100);
  const razorpay = getRazorpayClient();

  // Sanitize notes: Razorpay accepts at most 15 keys, alphanumeric keys <= 40 chars, values strings <= 256 chars
  const sanitizedNotes: Record<string, string> = {};
  if (notes && typeof notes === 'object') {
    Object.entries(notes).slice(0, 15).forEach(([k, v]) => {
      if (k && v !== undefined && v !== null) {
        const cleanKey = String(k).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
        const cleanVal = String(v).substring(0, 255);
        if (cleanKey) {
          sanitizedNotes[cleanKey] = cleanVal;
        }
      }
    });
  }

  const cleanReceipt = String(receipt || `rcpt_${Date.now()}`).substring(0, 40);

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: cleanReceipt,
      notes: sanitizedNotes,
    });
    return order;
  } catch (orderErr: any) {
    console.error('[Razorpay] Order creation error:', orderErr?.error || orderErr?.message || orderErr);
    throw orderErr;
  }
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export function verifyPaymentSignature({ orderId, paymentId, signature }: VerifyPaymentParams): boolean {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const keySecret = getRazorpayKeySecret();
  if (!keySecret) {
    console.error('[Razorpay] Cannot verify signature: keySecret is not set.');
    return false;
  }

  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (expectedBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  } catch (err) {
    console.error('[Razorpay] Signature verification error:', err);
    return false;
  }
}


export interface CreateQrCodeParams {
  amountInINR: number;
  description: string;
  notes?: Record<string, string>;
}

export async function createRazorpayQrCode({
  amountInINR,
  description,
  notes,
}: CreateQrCodeParams) {
  const amountInPaise = Math.round(amountInINR * 100);
  const qrId = `qr_${Date.now().toString(36)}`;
  const upiPayload = `upi://pay?pa=cbmacademy@razorpay&pn=CBM%20Academy&am=${amountInINR}&cu=INR&tn=${encodeURIComponent(
    description.substring(0, 30)
  )}`;

  return {
    id: qrId,
    imageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiPayload)}`,
    status: 'active',
    amount: amountInPaise,
  };
}

export async function fetchRazorpayPayment(paymentId: string) {
  if (!isRazorpayConfigured()) {
    throw new Error('RAZORPAY_CONFIG_REQUIRED');
  }
  const razorpay = getRazorpayClient();
  return await razorpay.payments.fetch(paymentId);
}

export async function fetchRazorpayQrCode(qrId: string) {
  if (!isRazorpayConfigured()) {
    throw new Error('RAZORPAY_CONFIG_REQUIRED');
  }
  const razorpay = getRazorpayClient();
  return await (razorpay as any).qrCode.fetch(qrId);
}

/**
 * Verify Razorpay Webhook signature using RAZORPAY_WEBHOOK_SECRET
 */
export function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error('[Razorpay] Cannot verify webhook: RAZORPAY_WEBHOOK_SECRET is not configured.');
    return false;
  }
  if (!signature || !signature.trim()) {
    return false;
  }

  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(expected, 'utf8');
    const signatureBuf = Buffer.from(signature.trim(), 'utf8');

    if (expectedBuf.length !== signatureBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, signatureBuf);
  } catch (err) {
    console.error('[Razorpay] Webhook signature verification error:', err);
    return false;
  }
}

