import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  saveWebinarRegistration,
  updateRegistrationPaymentStatus,
  getAllRegistrations,
  checkExistingRegistration,
  getWebinarRegistrationCount,
  getRegistrationByIdOrRef,
  approveRegistrationPayment,
  markRegistrationPaymentFailed,
  markRegistrationPaymentExpired,
} from './server/supabaseServer';
import {
  isRazorpayConfigured,
  isWebhookConfigured,
  getRazorpayKeyId,
  createOrder,
  verifyPaymentSignature,
  createRazorpayQrCode,
  verifyWebhookSignature,
  getRazorpayClient,
} from './server/razorpayServer';
import { sendWebinarConfirmationEmail } from './server/emailServer';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Known webinars repository for server-side price validation
const SERVER_WEBINARS: Record<
  string,
  {
    id: string;
    title: string;
    type: 'free' | 'paid';
    price: number;
    date: string;
    time: string;
    duration: string;
    max_capacity?: number;
  }
> = {
  'webinar-ai-tools': {
    id: 'webinar-ai-tools',
    title: 'AI Tools for Digital Marketing',
    type: 'free',
    price: 0,
    date: '28 September 2026',
    time: '6:00 PM',
    duration: '60 Minutes',
  },
  'webinar-google-ads': {
    id: 'webinar-google-ads',
    title: 'Master Google Ads in 2 Hours',
    type: 'paid',
    price: 499,
    date: '5 October 2026',
    time: '7:00 PM',
    duration: '2 Hours',
  },
  'webinar-seo-content': {
    id: 'webinar-seo-content',
    title: 'SEO & Content Strategy with AI',
    type: 'free',
    price: 0,
    date: '12 October 2026',
    time: '6:00 PM',
    duration: '90 Minutes',
  },
  'webinar-performance-marketing': {
    id: 'webinar-performance-marketing',
    title: 'Performance Marketing Masterclass',
    type: 'paid',
    price: 999,
    date: '20 October 2026',
    time: '7:00 PM',
    duration: '2 Hours',
  },
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    razorpayConfigured: isRazorpayConfigured(),
  });
});

// Config Status Endpoint (Never returns secrets, only configuration flags)
app.get('/api/webinars/config-status', (req, res) => {
  res.json({
    supabaseConfigured: true,
    razorpayConfigured: isRazorpayConfigured(),
    razorpayKeyId: getRazorpayKeyId(),
  });
});

/**
 * 1. FREE WEBINAR REGISTRATION
 */
app.post('/api/webinars/register-free', async (req, res) => {
  try {
    const { webinarId, fullName, email, phone, message } = req.body;

    // Validation
    if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !webinarId) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Phone, Webinar).',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    const webinar = SERVER_WEBINARS[webinarId] || {
      id: webinarId,
      title: req.body.webinarTitle || 'CBM Academy Webinar',
      type: 'free' as const,
      price: 0,
      date: req.body.date || 'Upcoming',
      time: req.body.time || 'TBA',
      duration: req.body.duration || '60 Minutes',
      max_capacity: req.body.max_capacity,
    };

    // Check capacity if configured
    if (typeof webinar.max_capacity === 'number' && webinar.max_capacity > 0) {
      const currentCount = await getWebinarRegistrationCount(webinarId);
      if (currentCount >= webinar.max_capacity) {
        return res.status(400).json({
          success: false,
          code: 'CAPACITY_REACHED',
          message: 'Registration Closed: This webinar has reached maximum capacity.',
        });
      }
    }

    // Check duplicate registration
    const existing = await checkExistingRegistration(email, webinarId);
    if (existing.exists) {
      return res.status(200).json({
        success: true,
        alreadyRegistered: true,
        message: 'You are already registered for this webinar! Details will be sent to your email.',
      });
    }

    // Save registration to Supabase
    const saved = await saveWebinarRegistration({
      webinar_id: webinar.id,
      webinar_title: webinar.title,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message?.trim() || '',
      registration_type: 'free',
      amount: 0,
      currency: 'INR',
      payment_status: 'not_required',
    });

    // Send confirmation email
    sendWebinarConfirmationEmail({
      recipientEmail: email.trim(),
      recipientName: fullName.trim(),
      recipientPhone: phone.trim(),
      webinarTitle: webinar.title,
      date: webinar.date,
      time: webinar.time,
      duration: webinar.duration,
      registrationType: 'free',
      amount: 0,
    }).catch((err) => console.warn('[Server] Email dispatch error:', err));

    return res.status(200).json({
      success: true,
      registrationId: saved.id,
      message: 'Registration Successful! Webinar details will be sent to your email.',
    });
  } catch (error: any) {
    console.error('[Server] Free registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while completing your registration. Please try again.',
    });
  }
});

/**
 * 2. PAID WEBINAR: CREATE RAZORPAY ORDER
 */
app.post('/api/webinars/create-order', async (req, res) => {
  try {
    const { webinarId, fullName, email, phone, message } = req.body;

    if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !webinarId) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const webinar = SERVER_WEBINARS[webinarId] || {
      id: webinarId,
      title: req.body.webinarTitle || 'Paid Masterclass',
      type: 'paid' as const,
      price: typeof req.body.price === 'number' ? req.body.price : 499,
      date: req.body.date || 'Upcoming',
      time: req.body.time || 'TBA',
      duration: req.body.duration || '2 Hours',
      max_capacity: req.body.max_capacity,
    };

    // Capacity check
    if (typeof webinar.max_capacity === 'number' && webinar.max_capacity > 0) {
      const currentCount = await getWebinarRegistrationCount(webinarId);
      if (currentCount >= webinar.max_capacity) {
        return res.status(400).json({
          success: false,
          code: 'CAPACITY_REACHED',
          message: 'Registration Closed: This webinar has reached maximum capacity.',
        });
      }
    }

    // Check if already paid
    const existing = await checkExistingRegistration(email, webinarId);
    if (existing.exists && existing.record?.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        code: 'ALREADY_PAID',
        message: 'You have already completed payment and registered for this webinar.',
      });
    }

    const amountInINR = webinar.price || 499;
    const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;

    // Create server-side order with Razorpay
    const order = await createOrder({
      amountInINR,
      receipt: receiptId,
      notes: {
        registration_id: registrationId,
        webinar_id: webinar.id,
        webinar_title: webinar.title,
        customer_email: email.trim(),
        customer_phone: phone.trim(),
      },
    });

    // Attempt to create dynamic Razorpay UPI QR Code
    let qrId: string | null = null;
    let qrImageUrl: string | null = null;
    try {
      const qrData = await createRazorpayQrCode({
        amountInINR,
        description: webinar.title,
        notes: {
          registration_id: registrationId,
          webinar_id: webinar.id,
          order_id: order.id,
        },
      });
      qrId = qrData.id;
      qrImageUrl = qrData.imageUrl;
    } catch (qrErr) {
      console.warn('[Server] Razorpay QR Code create note (fallback to dynamic UPI payload):', qrErr);
    }

    // Dynamic UPI URI payload for QR rendering and mobile deep-linking
    const qrPayload = `upi://pay?pa=cbmacademy@razorpay&pn=CBM%20Academy&am=${amountInINR}&cu=INR&tn=${encodeURIComponent(
      webinar.title.substring(0, 30)
    )}&tr=${order.id}`;

    // Create unique pending registration record in Supabase
    await saveWebinarRegistration({
      id: registrationId,
      webinar_id: webinar.id,
      webinar_title: webinar.title,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message?.trim() || '',
      registration_type: 'paid',
      amount: amountInINR,
      currency: 'INR',
      payment_status: 'pending',
      registration_status: 'pending',
      razorpay_order_id: order.id,
      razorpay_qr_id: qrId,
    });

    return res.status(200).json({
      success: true,
      registrationId,
      orderId: order.id,
      qrId,
      qrImageUrl,
      qrPayload,
      amount: order.amount, // amount in paise
      amountInINR,
      currency: 'INR',
      keyId: getRazorpayKeyId(),
      webinarTitle: webinar.title,
      isTestMode: !isRazorpayConfigured(),
    });
  } catch (error: any) {
    console.warn('[Server] Create Razorpay order notice:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not create secure payment order. Please try again.',
    });
  }
});

/**
 * SIMULATE PAYMENT (For Testing Mode / Development)
 */
app.post('/api/webinars/simulate-payment', async (req, res) => {
  try {
    const { registrationId } = req.body;
    if (!registrationId) {
      return res.status(400).json({ success: false, message: 'Registration ID required' });
    }

    const reg = await getRegistrationByIdOrRef(registrationId);
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    const simulatedPaymentId = `pay_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const approval = await approveRegistrationPayment({
      registrationId: reg.id,
      orderId: reg.razorpay_order_id,
      paymentId: simulatedPaymentId,
      paidAmount: reg.amount,
      expectedAmount: reg.amount,
    });

    if (approval.success) {
      sendWebinarConfirmationEmail({
        recipientEmail: reg.email,
        recipientName: reg.full_name,
        recipientPhone: reg.phone,
        webinarTitle: reg.webinar_title || 'Paid Masterclass',
        registrationType: 'paid',
        amount: reg.amount,
        paymentId: simulatedPaymentId,
      }).catch((e) => console.warn('[Simulate Payment] Email dispatch notice:', e));
    }

    return res.status(200).json({
      success: true,
      payment_status: 'paid',
      registration_status: 'approved',
      paid_at: approval.registration?.paid_at || new Date().toISOString(),
      payment_id: simulatedPaymentId,
      message: 'Payment simulation approved. Registration confirmed.',
    });
  } catch (err: any) {
    console.error('[Simulate Payment] Error:', err);
    return res.status(500).json({ success: false, message: 'Could not simulate payment' });
  }
});

/**
 * 3. PAID WEBINAR: CHECK REGISTRATION & PAYMENT STATUS (Polling)
 */
app.get('/api/webinars/registration-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id?.trim()) {
      return res.status(400).json({ success: false, message: 'Registration ID required' });
    }

    const reg = await getRegistrationByIdOrRef(id);
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // 1. If already approved and paid
    if (reg.payment_status === 'paid' && reg.registration_status === 'approved') {
      return res.status(200).json({
        success: true,
        payment_status: 'paid',
        registration_status: 'approved',
        paid_at: reg.paid_at,
        payment_id: reg.razorpay_payment_id,
        webinar_title: reg.webinar_title,
        message: 'Payment successful! Your webinar registration is confirmed.',
      });
    }

    // 2. If status is pending, verify with Razorpay API (handles UPI app payments where webhook hasn't hit yet)
    if (reg.payment_status === 'pending' && isRazorpayConfigured() && reg.razorpay_order_id) {
      try {
        const razorpay = getRazorpayClient();
        const payments = await razorpay.orders.fetchPayments(reg.razorpay_order_id);
        const capturedPayment = payments.items?.find((p: any) => p.status === 'captured');

        if (capturedPayment) {
          const paidAmount = Number(capturedPayment.amount) / 100;
          // Validate amount
          if (paidAmount >= reg.amount) {
            const approval = await approveRegistrationPayment({
              registrationId: reg.id,
              orderId: reg.razorpay_order_id,
              paymentId: capturedPayment.id,
              paidAmount,
              expectedAmount: reg.amount,
            });

            if (approval.success && !approval.alreadyApproved) {
              sendWebinarConfirmationEmail({
                recipientEmail: reg.email,
                recipientName: reg.full_name,
                recipientPhone: reg.phone,
                webinarTitle: reg.webinar_title || 'Paid Webinar',
                registrationType: 'paid',
                amount: reg.amount,
                paymentId: capturedPayment.id,
              }).catch((e) => console.warn('[Server] Email notice:', e));
            }

            return res.status(200).json({
              success: true,
              payment_status: 'paid',
              registration_status: 'approved',
              paid_at: approval.registration?.paid_at || new Date().toISOString(),
              payment_id: capturedPayment.id,
              webinar_title: reg.webinar_title,
              message: 'Payment successful! Your webinar registration is confirmed.',
            });
          }
        }
      } catch (checkErr) {
        console.warn('[Server] Polling status check note:', checkErr);
      }
    }

    // 3. Otherwise return current status
    return res.status(200).json({
      success: true,
      payment_status: reg.payment_status || 'pending',
      registration_status: reg.registration_status || 'pending',
      message:
        reg.payment_status === 'pending'
          ? 'Payment is still pending. Your registration will be confirmed after successful payment.'
          : 'Payment status updated.',
    });
  } catch (err: any) {
    console.error('[Server] Status check error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch status' });
  }
});

/**
 * 4. PAID WEBINAR: VERIFY RAZORPAY PAYMENT (Client Verification Flow)
 */
app.post('/api/webinars/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
      webinarId,
      fullName,
      email,
      phone,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete payment credentials for verification.',
      });
    }

    // Verify HMAC SHA256 signature server-side
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.error(`[Server] Signature mismatch for order: ${razorpay_order_id}`);
      await markRegistrationPaymentFailed(registrationId || razorpay_order_id);
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid transaction signature.',
      });
    }

    const webinarPrice = typeof amount === 'number' ? amount : 499;

    // Approve registration and mark paid
    const approval = await approveRegistrationPayment({
      registrationId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      paidAmount: webinarPrice,
      expectedAmount: webinarPrice,
    });

    if (!approval.success) {
      return res.status(400).json({
        success: false,
        message: approval.error || 'Payment verification could not be recorded.',
      });
    }

    // Send confirmation email
    sendWebinarConfirmationEmail({
      recipientEmail: email,
      recipientName: fullName,
      recipientPhone: phone,
      webinarTitle: approval.registration?.webinar_title || 'Paid Webinar',
      registrationType: 'paid',
      amount: webinarPrice,
      paymentId: razorpay_payment_id,
    }).catch((err) => console.warn('[Server] Email dispatch error:', err));

    return res.status(200).json({
      success: true,
      message: 'Payment successful! Your webinar registration is confirmed.',
      paymentId: razorpay_payment_id,
      amount: webinarPrice,
      registrationStatus: 'approved',
    });
  } catch (error: any) {
    console.error('[Server] Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment could not be completed. Please try again.',
    });
  }
});

/**
 * 5. RAZORPAY WEBHOOK HANDLER (Server-Side Automated Verification)
 */
app.post('/api/webinars/webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const rawBody = (req as any).rawBody;

  if (!signature || !rawBody) {
    return res.status(400).json({ error: 'Missing webhook signature or body' });
  }

  // Validate webhook secret exists
  if (!isWebhookConfigured()) {
    console.warn(
      '[Razorpay Webhook] Received webhook but RAZORPAY_WEBHOOK_SECRET is not set in environment.'
    );
    return res.status(500).json({ error: 'Webhook secret not configured on server' });
  }

  // Validate cryptographic signature
  const isValid = verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.error('[Razorpay Webhook] Invalid webhook signature!');
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  try {
    const event = req.body;
    const eventType = event.event;
    console.log(`[Razorpay Webhook] Authenticated event: ${eventType}`);

    if (
      eventType === 'payment.captured' ||
      eventType === 'order.paid' ||
      eventType === 'qr_code.credited'
    ) {
      let orderId: string | undefined;
      let qrId: string | undefined;
      let registrationId: string | undefined;
      let paymentId: string = '';
      let amountPaid: number = 0;

      if (event.payload?.payment?.entity) {
        const paymentEntity = event.payload.payment.entity;
        paymentId = paymentEntity.id;
        orderId = paymentEntity.order_id;
        amountPaid = Number(paymentEntity.amount) / 100;
        registrationId = paymentEntity.notes?.registration_id;
      }

      if (event.payload?.qr_code?.entity) {
        const qrEntity = event.payload.qr_code.entity;
        qrId = qrEntity.id;
        if (!registrationId) registrationId = qrEntity.notes?.registration_id;
        if (!amountPaid && qrEntity.payment_amount) {
          amountPaid = Number(qrEntity.payment_amount) / 100;
        }
      }

      const reg = await getRegistrationByIdOrRef(registrationId || orderId || qrId || '');
      if (!reg) {
        console.warn(`[Razorpay Webhook] Registration record not found for payment: ${paymentId}`);
        return res.status(200).json({ status: 'ignored_not_found' });
      }

      // Confirm payment amount matches webinar price
      if (reg.amount > 0 && amountPaid < reg.amount) {
        console.error(
          `[Razorpay Webhook] Amount mismatch: Paid ${amountPaid} INR, expected ${reg.amount} INR`
        );
        return res.status(400).json({ error: 'Amount mismatch' });
      }

      // Approve registration and update status to approved & paid
      const approval = await approveRegistrationPayment({
        registrationId: reg.id,
        orderId: reg.razorpay_order_id || orderId,
        qrId: reg.razorpay_qr_id || qrId,
        paymentId,
        paidAmount: amountPaid,
        expectedAmount: reg.amount,
      });

      if (approval.success && !approval.alreadyApproved) {
        console.log(`[Razorpay Webhook] Registration ${reg.id} APPROVED via verified webhook!`);
        sendWebinarConfirmationEmail({
          recipientEmail: reg.email,
          recipientName: reg.full_name,
          recipientPhone: reg.phone,
          webinarTitle: reg.webinar_title || 'Paid Webinar',
          registrationType: 'paid',
          amount: reg.amount,
          paymentId,
        }).catch((e) => console.warn('[Razorpay Webhook] Email notice:', e));
      }

      return res.status(200).json({ status: 'success' });
    }

    if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const ref = paymentEntity?.notes?.registration_id || paymentEntity?.order_id;
      if (ref) {
        await markRegistrationPaymentFailed(ref);
      }
      return res.status(200).json({ status: 'marked_failed' });
    }

    if (eventType === 'qr_code.expired') {
      const qrEntity = event.payload?.qr_code?.entity;
      const ref = qrEntity?.notes?.registration_id || qrEntity?.id;
      if (ref) {
        await markRegistrationPaymentExpired(ref);
      }
      return res.status(200).json({ status: 'marked_expired' });
    }

    return res.status(200).json({ status: 'unhandled_event' });
  } catch (err: any) {
    console.error('[Razorpay Webhook] Error processing event:', err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

/**
 * 6. CONFIG STATUS CHECK
 */
app.get('/api/webinars/config-status', (_req, res) => {
  return res.status(200).json({
    razorpayConfigured: isRazorpayConfigured(),
    webhookConfigured: isWebhookConfigured(),
    razorpayKeyId: getRazorpayKeyId(),
  });
});

/**
 * 4. ADMIN: GET REGISTRATIONS (Authenticated)
 */
app.get('/api/webinars/registrations', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);

    // Require token or admin session
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin authentication token required.',
      });
    }

    const type = req.query.type as 'free' | 'paid' | undefined;
    const status = req.query.status as string | undefined;

    const registrations = await getAllRegistrations({ type, status });
    return res.status(200).json({
      success: true,
      registrations,
    });
  } catch (err: any) {
    console.error('[Server] Get registrations error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations.',
    });
  }
});

/**
 * Start Server with Vite Middleware
 */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CBM Academy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
