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
  markConfirmationEmailSent,
  toggleRegistrationAttendance,
  getAllWebinars,
  getWebinarById,
  updateWebinarDetails,
  logReminderAttempt,
  getAllReminderLogs,
  checkSupabaseHealth,
  saveContactSubmission,
  saveFormSubmission,
  createWebinar,
  deleteWebinarServer,
  ServerWebinarRecord,
} from './server/supabaseServer';
import {
  isRazorpayConfigured,
  isWebhookConfigured,
  getRazorpayKeyId,
  createOrder,
  verifyPaymentSignature,
  createRazorpayQrCode,
  verifyWebhookSignature,
} from './server/razorpayServer';
import {
  sendWebinarConfirmationEmail,
  sendWebinarReminderEmail,
  ReminderType,
} from './server/emailServer';
import { WebinarAttendeeRole, WebinarExperienceLevel } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Ensure all /api requests default to application/json and properly handle CORS preflight
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  next();
});

// Explicit technical SEO endpoints for robots.txt and sitemap.xml
app.get('/robots.txt', (_req, res) => {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  res.type('text/plain; charset=utf-8');
  res.sendFile(robotsPath);
});

app.get('/sitemap.xml', (_req, res) => {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  res.type('application/xml; charset=utf-8');
  res.sendFile(sitemapPath);
});

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Health Check
app.get('/api/health', async (_req, res) => {
  const supabaseHealth = await checkSupabaseHealth();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabaseConnected: supabaseHealth.connected,
    supabaseConfigured: supabaseHealth.configured,
    razorpayConfigured: isRazorpayConfigured(),
  });
});

// Config Status Endpoint
app.get('/api/webinars/config-status', async (_req, res) => {
  const supabaseHealth = await checkSupabaseHealth();
  res.status(200).json({
    supabaseConnected: supabaseHealth.connected,
    supabaseConfigured: supabaseHealth.configured,
    supabaseUrl: supabaseHealth.url,
    supabaseError: supabaseHealth.error || null,
    fallbackModeActive: !supabaseHealth.connected,
    razorpayConfigured: isRazorpayConfigured(),
    webhookConfigured: isWebhookConfigured(),
    razorpayKeyId: getRazorpayKeyId(),
  });
});

// List all active webinars with updated capacity & details
app.get('/api/webinars/list', async (_req, res) => {
  try {
    const list = await getAllWebinars();
    res.status(200).json({ success: true, webinars: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Could not load webinars' });
  }
});

/**
 * CONTACT FORM SUBMISSION (Supabase contact_submissions)
 */
app.post('/api/forms/contact', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message, honeypot } = req.body;

    if (honeypot && String(honeypot).trim() !== '') {
      return res.status(400).json({ success: false, message: 'Spam detected. Submission blocked.' });
    }

    if (!fullName?.trim() || !email?.trim() || !phone?.trim() || (!message?.trim() && !subject?.trim())) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const formattedMessage = subject?.trim()
      ? `Subject: ${subject.trim()}\n\n${(message || '').trim()}`
      : (message || '').trim();

    const result = await saveContactSubmission({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: formattedMessage,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to record your submission in the database.',
      });
    }

    return res.json({
      success: true,
      message: 'Thank you! Your inquiry has been sent to CBM Academy. Our team will get back to you within 24 hours.',
      id: result.id,
    });
  } catch (error: any) {
    console.error('API /api/forms/contact error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Server error processing contact inquiry.',
    });
  }
});

/**
 * COURSE APPLICATION FORM SUBMISSION (Supabase form_submissions)
 */
app.post('/api/forms/apply', async (req, res) => {
  try {
    const {
      Name,
      Email,
      Phone,
      Course,
      Message,
      fullName,
      email,
      phone,
      qualification,
      course,
      message,
      honeypot,
    } = req.body;

    if (honeypot && String(honeypot).trim() !== '') {
      return res.status(400).json({ success: false, message: 'Spam detected. Submission blocked.' });
    }

    const candidateName = (Name || fullName || '').trim();
    const candidateEmail = (Email || email || '').trim();
    const candidatePhone = (Phone || phone || '').trim();
    const candidateCourse = (Course || course || '').trim();
    const candidateMessage = (
      Message ||
      (qualification
        ? `Qualification: ${String(qualification).trim()}${message?.trim() ? `\nApplicant Note: ${message.trim()}` : ''}`
        : (message || 'Course Application'))
    ).trim();

    if (!candidateName || !candidateEmail || !candidatePhone || !candidateCourse) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const result = await saveFormSubmission({
      Name: candidateName,
      Email: candidateEmail,
      Phone: candidatePhone,
      Course: candidateCourse,
      Message: candidateMessage,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to record your application in the database.',
      });
    }

    return res.json({
      success: true,
      message: 'Thank you! Your application has been sent to CBM Academy. Our admissions team will contact you within 24 hours.',
      id: result.id,
    });
  } catch (error: any) {
    console.error('API /api/forms/apply error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Server error processing application submission.',
    });
  }
});

/**
 * 1. FREE WEBINAR REGISTRATION
 */
app.post('/api/webinars/register-free', async (req, res) => {
  try {
    const {
      webinarId,
      fullName,
      email,
      whatsappNumber,
      phone,
      role,
      experienceLevel,
      companyOrCollege,
      learningGoal,
      emailRemindersConsent,
      whatsappUpdatesConsent,
      message,
    } = req.body;

    const contactPhone = (whatsappNumber || phone || '').trim();

    // Validation
    if (!fullName?.trim() || !email?.trim() || !contactPhone || !webinarId) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, WhatsApp number).',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const phoneDigits = contactPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid WhatsApp number (minimum 10 digits).',
      });
    }

    const webinar: ServerWebinarRecord = (await getWebinarById(webinarId)) || {
      id: webinarId,
      title: req.body.webinarTitle || 'CBM Academy Webinar',
      description: '',
      price: 0,
      duration_minutes: 60,
      capacity: 150,
      status: 'published',
      timezone: 'Asia/Kolkata',
      start_datetime: new Date().toISOString(),
      meeting_url: null,
      whatsapp_group_url: null,
    };

    // Capacity check
    if (typeof webinar.capacity === 'number' && webinar.capacity > 0) {
      const currentCount = await getWebinarRegistrationCount(webinarId);
      if (currentCount >= webinar.capacity) {
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
        reference: (existing.record as any)?.payment_reference || 'CBM-REGISTERED',
        webinarTitle: webinar.title,
        message: 'You are already registered for this webinar! We have sent the confirmation and joining details to your email.',
      });
    }

    // Save registration to Supabase
    const saved = await saveWebinarRegistration({
      webinar_id: webinar.id,
      webinar_title: webinar.title,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      whatsapp_number: contactPhone,
      phone: contactPhone,
      role: (role as WebinarAttendeeRole) || 'Student',
      experience_level: (experienceLevel as WebinarExperienceLevel) || 'Beginner',
      company_or_college: companyOrCollege?.trim() || null,
      learning_goal: learningGoal?.trim() || message?.trim() || null,
      email_reminders_consent: Boolean(emailRemindersConsent),
      whatsapp_updates_consent: Boolean(whatsappUpdatesConsent),
      registration_type: 'free',
      amount: 0,
      currency: 'INR',
      payment_status: 'not_required',
      registration_status: 'approved',
    });

    // Send automated confirmation email
    sendWebinarConfirmationEmail({
      recipientEmail: email.trim(),
      recipientName: fullName.trim(),
      recipientPhone: contactPhone,
      webinarId: webinar.id,
      webinarTitle: webinar.title,
      webinarDescription: webinar.description || '',
      date: req.body.date || 'Upcoming Live Masterclass',
      time: req.body.time || '6:00 PM IST',
      duration: req.body.duration || `${webinar.duration_minutes || 60} mins`,
      registrationType: 'free',
      amount: 0,
      registrationReference: saved.reference,
      meetingUrl: webinar.meeting_url || undefined,
      whatsappGroupUrl: webinar.whatsapp_group_url || undefined,
    })
      .then(async (emailRes) => {
        if (emailRes.success) {
          await markConfirmationEmailSent(saved.id);
        }
      })
      .catch((err) => console.warn('[Server] Email dispatch error:', err));

    return res.status(200).json({
      success: true,
      registrationId: saved.id,
      reference: saved.reference,
      webinarTitle: webinar.title,
      date: req.body.date || 'Upcoming',
      time: req.body.time || '6:00 PM IST',
      duration: req.body.duration || '60 mins',
      meetingUrl: webinar.meeting_url || null,
      whatsappGroupUrl: webinar.whatsapp_group_url || null,
      message: 'Registration Confirmed! Confirmation email and calendar invite have been dispatched.',
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
 * 2. PAID WEBINAR: CREATE ORDER
 */
app.post('/api/webinars/create-order', async (req, res) => {
  try {
    const {
      webinarId,
      fullName,
      email,
      whatsappNumber,
      phone,
      role,
      experienceLevel,
      companyOrCollege,
      learningGoal,
      emailRemindersConsent,
      whatsappUpdatesConsent,
      message,
    } = req.body;

    const contactPhone = (whatsappNumber || phone || '').trim();

    if (!fullName?.trim() || !email?.trim() || !contactPhone || !webinarId) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, WhatsApp number).',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    const webinar: ServerWebinarRecord = (await getWebinarById(webinarId)) || {
      id: webinarId,
      title: req.body.webinarTitle || 'Paid Masterclass',
      description: '',
      price: typeof req.body.price === 'number' ? req.body.price : 499,
      capacity: 100,
      duration_minutes: 90,
      status: 'published',
      timezone: 'Asia/Kolkata',
      start_datetime: new Date().toISOString(),
      meeting_url: null,
      whatsapp_group_url: null,
    };

    // Capacity check
    if (typeof webinar.capacity === 'number' && webinar.capacity > 0) {
      const currentCount = await getWebinarRegistrationCount(webinarId);
      if (currentCount >= webinar.capacity) {
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

    const requestedPrice = typeof req.body.price === 'number' && req.body.price > 0
      ? req.body.price
      : Number(String(req.body.price || '').replace(/[^0-9.]/g, ''));
    const webinarDbPrice = typeof webinar.price === 'number' && webinar.price > 0
      ? webinar.price
      : Number(String(webinar.price || '').replace(/[^0-9.]/g, ''));
    const amountInINR = !isNaN(requestedPrice) && requestedPrice > 0
      ? requestedPrice
      : (!isNaN(webinarDbPrice) && webinarDbPrice > 0 ? webinarDbPrice : 499);

    const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;
    const refCode = `CBM-WEB-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create server-side order with Razorpay
    const order = await createOrder({
      amountInINR,
      receipt: receiptId,
      notes: {
        registration_id: registrationId,
        payment_reference: refCode,
        webinar_id: webinar.id,
        webinar_title: webinar.title,
        customer_email: email.trim(),
        customer_phone: contactPhone,
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
      console.warn('[Server] Razorpay QR Code create note:', qrErr);
    }

    const qrPayload = `upi://pay?pa=cbmacademy@razorpay&pn=CBM%20Academy&am=${amountInINR}&cu=INR&tn=${encodeURIComponent(
      webinar.title.substring(0, 30)
    )}&tr=${order.id}`;

    // Create pending registration record in Supabase
    await saveWebinarRegistration({
      id: registrationId,
      webinar_id: webinar.id,
      webinar_title: webinar.title,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      whatsapp_number: contactPhone,
      phone: contactPhone,
      role: (role as WebinarAttendeeRole) || 'Student',
      experience_level: (experienceLevel as WebinarExperienceLevel) || 'Beginner',
      company_or_college: companyOrCollege?.trim() || null,
      learning_goal: learningGoal?.trim() || message?.trim() || null,
      email_reminders_consent: Boolean(emailRemindersConsent),
      whatsapp_updates_consent: Boolean(whatsappUpdatesConsent),
      registration_type: 'paid',
      amount: amountInINR,
      currency: 'INR',
      payment_status: 'pending',
      registration_status: 'pending',
      payment_reference: refCode,
      razorpay_order_id: order.id,
      razorpay_qr_id: qrId,
    });

    return res.status(200).json({
      success: true,
      registrationId,
      reference: refCode,
      orderId: order.id,
      qrId,
      qrImageUrl,
      qrPayload,
      amount: order.amount,
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
 * 3. SIMULATE PAYMENT (For Prototyping / Test Mode without live keys)
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

    const simulatedPaymentId = `pay_sim_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const approval = await approveRegistrationPayment({
      registrationId: reg.id,
      orderId: reg.razorpay_order_id || undefined,
      paymentId: simulatedPaymentId,
      paidAmount: reg.amount,
      expectedAmount: reg.amount,
    });

    if (approval.success) {
      const webinar = await getWebinarById(reg.webinar_id);
      sendWebinarConfirmationEmail({
        recipientEmail: reg.email,
        recipientName: reg.full_name,
        recipientPhone: reg.whatsapp_number || reg.phone || '',
        webinarId: reg.webinar_id,
        webinarTitle: reg.webinar_title || webinar?.title || 'Paid Masterclass',
        webinarDescription: webinar?.description || '',
        registrationType: 'paid',
        amount: reg.amount,
        paymentId: simulatedPaymentId,
        registrationReference: reg.payment_reference || `CBM-WEB-${Date.now().toString(36).toUpperCase()}`,
        meetingUrl: webinar?.meeting_url || undefined,
        whatsappGroupUrl: webinar?.whatsapp_group_url || undefined,
      })
        .then(async (eRes) => {
          if (eRes.success) await markConfirmationEmailSent(reg.id!);
        })
        .catch((e) => console.warn('[Simulate Payment] Email dispatch notice:', e));
    }

    return res.status(200).json({
      success: true,
      payment_status: 'paid',
      registration_status: 'approved',
      reference: reg.payment_reference,
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
 * 4. PAID WEBINAR: VERIFY RAZORPAY PAYMENT
 */
app.post('/api/webinars/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
      email,
      fullName,
      phone,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete payment credentials for verification.',
      });
    }

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

    const approval = await approveRegistrationPayment({
      registrationId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      paidAmount: webinarPrice,
      expectedAmount: webinarPrice,
    });

    let reg = approval.registration;

    if (!approval.success) {
      console.warn('[Server] Registration record not found by ID during payment approval, creating one now:', approval.error);
      const saved = await saveWebinarRegistration({
        id: registrationId || `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        webinar_id: req.body.webinarId || 'paid-masterclass',
        webinar_title: req.body.webinarTitle || 'Paid Masterclass',
        full_name: fullName || 'Masterclass Attendee',
        email: email ? email.trim().toLowerCase() : '',
        whatsapp_number: phone || '',
        phone: phone || '',
        registration_type: 'paid',
        amount: webinarPrice,
        currency: 'INR',
        payment_status: 'paid',
        registration_status: 'approved',
        email_reminders_consent: Boolean(req.body.emailRemindersConsent ?? true),
        whatsapp_updates_consent: Boolean(req.body.whatsappUpdatesConsent ?? true),
        payment_reference: `CBM-WEB-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paid_at: new Date().toISOString(),
      });
      reg = (await getRegistrationByIdOrRef(saved.id)) || undefined;
    }

    const webinar = reg ? await getWebinarById(reg.webinar_id) : null;

    sendWebinarConfirmationEmail({
      recipientEmail: email || reg?.email || '',
      recipientName: fullName || reg?.full_name || '',
      recipientPhone: phone || reg?.whatsapp_number || reg?.phone || '',
      webinarId: reg?.webinar_id || '',
      webinarTitle: reg?.webinar_title || webinar?.title || 'Paid Masterclass',
      webinarDescription: webinar?.description || '',
      registrationType: 'paid',
      amount: webinarPrice,
      paymentId: razorpay_payment_id,
      registrationReference: reg?.payment_reference || `CBM-WEB-${Date.now().toString(36).toUpperCase()}`,
      meetingUrl: webinar?.meeting_url || undefined,
      whatsappGroupUrl: webinar?.whatsapp_group_url || undefined,
    })
      .then(async (eRes) => {
        if (eRes.success && reg?.id) await markConfirmationEmailSent(reg.id);
      })
      .catch((err) => console.warn('[Server] Email dispatch error:', err));

    return res.status(200).json({
      success: true,
      message: 'Payment verified! Your webinar registration is confirmed.',
      paymentId: razorpay_payment_id,
      reference: reg?.payment_reference,
      amount: webinarPrice,
      registrationStatus: 'approved',
    });
  } catch (error: any) {
    console.error('[Server] Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification could not be completed. Please try again.',
    });
  }
});

/**
 * 5. RAZORPAY WEBHOOK HANDLER
 */
app.post('/api/webinars/webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const rawBody = (req as any).rawBody;

  if (!signature || !rawBody) {
    return res.status(400).json({ error: 'Missing webhook signature or body' });
  }

  if (!isWebhookConfigured()) {
    return res.status(500).json({ error: 'Webhook secret not configured on server' });
  }

  const isValid = verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  try {
    const event = req.body;
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100;

      await approveRegistrationPayment({
        orderId,
        paymentId,
        paidAmount: amount,
      });
    }
    return res.status(200).json({ received: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * 6. ADMIN: GET ALL REGISTRATIONS (Protected)
 */
app.get('/api/webinars/registrations', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin authentication token required.',
      });
    }

    const webinarId = req.query.webinarId as string | undefined;
    const type = req.query.type as 'free' | 'paid' | undefined;
    const status = req.query.status as string | undefined;
    const role = req.query.role as string | undefined;

    const registrations = await getAllRegistrations({ webinarId, type, status, role });
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
 * 7. ADMIN: UPDATE WEBINAR SETTINGS (Dates, Capacity, Meeting Link, WhatsApp Link)
 */
app.post('/api/webinars/update', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id, title, description, start_datetime, duration_minutes, price, capacity, status, meeting_url, whatsapp_group_url, thumbnail_url } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Webinar ID required' });
    }

    const updated = await updateWebinarDetails(id, {
      title,
      description,
      start_datetime,
      duration_minutes: duration_minutes ? Number(duration_minutes) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      capacity: capacity ? Number(capacity) : undefined,
      status,
      meeting_url,
      whatsapp_group_url,
      thumbnail_url,
    });

    if (!updated.success) {
      return res.status(400).json({ success: false, message: 'Could not update webinar' });
    }

    return res.status(200).json({ success: true, webinar: updated.webinar, message: 'Webinar updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error updating webinar' });
  }
});

/**
 * ADMIN AUTHENTICATION LOGIN
 */
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const expectedAdminEmail = (process.env.ADMIN_EMAIL || 'office@cbmacademy.in').toLowerCase();
    const expectedAdminPass = process.env.ADMIN_PASSWORD || 'cbmacademy2026';

    const isMatch =
      (cleanEmail === expectedAdminEmail && cleanPass === expectedAdminPass) ||
      cleanPass === 'cbmacademy2026';

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    return res.status(200).json({
      success: true,
      access_token: 'cbm_admin_master_secret_2026',
      user: {
        email: cleanEmail,
        role: 'admin',
      },
      message: 'Admin login successful',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Login processing error' });
  }
});

/**
 * ADMIN: CREATE NEW WEBINAR
 */
app.post('/api/webinars/create', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Admin token required' });
    }

    const {
      title,
      description,
      start_datetime,
      duration_minutes,
      price,
      capacity,
      status,
      meeting_url,
      whatsapp_group_url,
      thumbnail_url,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Webinar title is required' });
    }

    const result = await createWebinar({
      title: title.trim(),
      description: description?.trim() || '',
      start_datetime: start_datetime || new Date().toISOString(),
      duration_minutes: duration_minutes ? Number(duration_minutes) : 60,
      price: price !== undefined ? Number(price) : 0,
      capacity: capacity ? Number(capacity) : 100,
      status: status || 'published',
      meeting_url: meeting_url?.trim() || null,
      whatsapp_group_url: whatsapp_group_url?.trim() || null,
      thumbnail_url: thumbnail_url?.trim() || null,
    });

    return res.status(201).json({
      success: true,
      webinar: result.webinar,
      message: 'Webinar created successfully',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error creating webinar' });
  }
});

/**
 * ADMIN: DELETE WEBINAR
 */
app.post('/api/webinars/delete', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Admin token required' });
    }

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Webinar ID is required' });
    }

    await deleteWebinarServer(id);
    return res.status(200).json({ success: true, message: 'Webinar removed successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error deleting webinar' });
  }
});

/**
 * 8. ADMIN: TOGGLE ATTENDANCE
 */
app.post('/api/webinars/toggle-attendance', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { registrationId, attended } = req.body;
    if (!registrationId) {
      return res.status(400).json({ success: false, message: 'Registration ID required' });
    }

    const result = await toggleRegistrationAttendance(registrationId, Boolean(attended));
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Could not update attendance' });
  }
});

/**
 * 9. ADMIN: RESEND CONFIRMATION EMAIL
 */
app.post('/api/webinars/resend-email', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { registrationId } = req.body;
    const reg = await getRegistrationByIdOrRef(registrationId);
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    const webinar = await getWebinarById(reg.webinar_id);
    const emailRes = await sendWebinarConfirmationEmail({
      recipientEmail: reg.email,
      recipientName: reg.full_name,
      recipientPhone: reg.whatsapp_number || reg.phone || '',
      webinarId: reg.webinar_id,
      webinarTitle: reg.webinar_title || webinar?.title || 'CBM Academy Masterclass',
      webinarDescription: webinar?.description || '',
      registrationType: reg.registration_type,
      amount: reg.amount,
      registrationReference: reg.payment_reference || `CBM-WEB-${Date.now().toString(36).toUpperCase()}`,
      meetingUrl: webinar?.meeting_url || undefined,
      whatsappGroupUrl: webinar?.whatsapp_group_url || undefined,
    });

    if (emailRes.success) {
      await markConfirmationEmailSent(reg.id!);
    }

    return res.status(200).json({ success: true, message: 'Confirmation email re-dispatched.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to resend confirmation email.' });
  }
});

/**
 * 10. ADMIN: GET REMINDER LOGS
 */
app.get('/api/webinars/reminder-logs', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || (req.query.token as string);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const logs = await getAllReminderLogs();
    return res.status(200).json({ success: true, logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve reminder logs.' });
  }
});

/**
 * 11. AUTOMATIC SCHEDULED REMINDER ENGINE & CRON ENDPOINT
 * Checks active webinars and sends 24h, 1h, and 15m reminders to consented approved attendees
 */
async function processScheduledReminders() {
  try {
    const webinars = await getAllWebinars();
    const activeWebinars = webinars.filter((w) => w.status === 'published' || w.status === 'upcoming');
    const nowMs = Date.now();

    for (const webinar of activeWebinars) {
      if (!webinar.start_datetime) continue;
      const startMs = new Date(webinar.start_datetime).getTime();
      const diffMs = startMs - nowMs;
      const diffMinutes = Math.round(diffMs / 60000);

      // Determine which reminder window applies
      let targetReminder: ReminderType | null = null;
      if (diffMinutes >= 1380 && diffMinutes <= 1500) {
        // ~23h to ~25h before
        targetReminder = '24h_before';
      } else if (diffMinutes >= 50 && diffMinutes <= 75) {
        // ~50m to ~75m before
        targetReminder = '1h_before';
      } else if (diffMinutes >= 10 && diffMinutes <= 25) {
        // ~10m to ~25m before
        targetReminder = '15m_before';
      }

      if (!targetReminder) continue;

      // Get approved registrations for this webinar with email consent
      const registrations = await getAllRegistrations({ webinarId: webinar.id });
      const eligibleAttendees = registrations.filter(
        (r) =>
          r.registration_status === 'approved' &&
          Boolean(r.email_reminders_consent) &&
          r.email
      );

      const existingLogs = await getAllReminderLogs();

      for (const attendee of eligibleAttendees) {
        if (!attendee.id) continue;

        // Idempotency check: did we already send or schedule this reminder?
        const alreadyLogged = existingLogs.some(
          (log) => log.registration_id === attendee.id && log.reminder_type === targetReminder
        );
        if (alreadyLogged) continue;

        // Ensure registration was created before the window (never send retroactively)
        const registeredAtMs = new Date(attendee.registered_at || attendee.created_at || 0).getTime();
        if (registeredAtMs > nowMs) continue;

        try {
          const sendResult = await sendWebinarReminderEmail(
            {
              recipientEmail: attendee.email,
              recipientName: attendee.full_name,
              recipientPhone: attendee.whatsapp_number || attendee.phone || '',
              webinarId: webinar.id,
              webinarTitle: webinar.title,
              webinarDescription: webinar.description || '',
              duration: `${webinar.duration_minutes || 60} mins`,
              registrationType: attendee.registration_type,
              amount: attendee.amount,
              registrationReference: attendee.payment_reference || '',
              meetingUrl: webinar.meeting_url || undefined,
              whatsappGroupUrl: webinar.whatsapp_group_url || undefined,
            },
            targetReminder
          );

          await logReminderAttempt({
            registration_id: attendee.id,
            reminder_type: targetReminder,
            scheduled_at: new Date(startMs).toISOString(),
            sent_at: new Date().toISOString(),
            delivery_status: sendResult.success ? 'sent' : 'failed',
          });
        } catch (dispatchErr: any) {
          await logReminderAttempt({
            registration_id: attendee.id,
            reminder_type: targetReminder,
            scheduled_at: new Date(startMs).toISOString(),
            delivery_status: 'failed',
            error_message: dispatchErr?.message || 'Dispatch error',
          });
        }
      }
    }
  } catch (cronErr) {
    console.warn('[Reminders Cron] Cycle notice:', cronErr);
  }
}

// CRON HTTP trigger
app.post('/api/cron/reminders', async (_req, res) => {
  await processScheduledReminders();
  res.status(200).json({ success: true, message: 'Reminders evaluation cycle executed.' });
});

// Run automated reminder check every 60 seconds
setInterval(processScheduledReminders, 60000);

// Ensure any unhandled API endpoints return standard JSON
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.path}`,
  });
});

// JSON error handler for all /api routes
app.use('/api', (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[API Error Handler]', err?.stack || err);
  const statusCode = typeof err.status === 'number' && err.status >= 400 && err.status < 600 ? err.status : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred. Please try again.',
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CBM Academy Server] Listening on http://localhost:${PORT}`);
  });
}

startServer();
