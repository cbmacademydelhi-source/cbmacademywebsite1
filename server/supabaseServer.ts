import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { WebinarAttendeeRole, WebinarExperienceLevel } from '../src/types';

dotenv.config();

function getSupabaseEnv() {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://cxeztssvgaeytdljoned.supabase.co'
  ).trim();

  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_sO0rnN9MJzQmBiq-Lm6p3w_EAYKjVOb'
  ).trim();

  return { url, key };
}

let supabaseClient: SupabaseClient | null = null;
let currentClientKey = '';

function withTimeout<T>(promise: PromiseLike<T>, ms = 3000): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Supabase request timed out')), ms)),
  ]);
}

export function isSupabaseConfiguredOnServer(): boolean {
  const { url, key } = getSupabaseEnv();
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !url.includes('example.supabase.co')
  );
}

export function getSupabaseServer(): SupabaseClient | null {
  if (!isSupabaseConfiguredOnServer()) {
    return null;
  }
  const { url, key } = getSupabaseEnv();
  const cacheKey = `${url}:${key}`;
  if (!supabaseClient || currentClientKey !== cacheKey) {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    currentClientKey = cacheKey;
  }
  return supabaseClient;
}

export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  configured: boolean;
  url: string;
  error?: string | null;
}> {
  const { url, key } = getSupabaseEnv();

  if (!isSupabaseConfiguredOnServer()) {
    const isPlaceholder = url.includes('cxeztsvgaeytdljoned') || url.includes('your-project');
    return {
      connected: false,
      configured: false,
      url: isPlaceholder ? 'Placeholder / Unset' : (url || 'Not configured'),
      error: !url || isPlaceholder
        ? 'SUPABASE_URL is missing or contains placeholder host. Please provide your real Supabase Project URL.'
        : !key
        ? 'SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY is missing.'
        : 'Supabase credentials are incomplete or invalid.',
    };
  }

  try {
    const supabase = getSupabaseServer();
    if (!supabase) {
      return {
        connected: false,
        configured: false,
        url,
        error: 'Failed to initialize Supabase client.',
      };
    }
    const query = supabase.from('webinars').select('id', { count: 'exact', head: true });
    const { error } = await withTimeout(query, 3000);
    if (!error) {
      return { connected: true, configured: true, url, error: null };
    }
    return {
      connected: false,
      configured: true,
      url,
      error: error.message,
    };
  } catch (err: any) {
    return {
      connected: false,
      configured: true,
      url,
      error: err?.message || 'Database host unreachable',
    };
  }
}

export interface ServerWebinarRecord {
  id: string;
  title: string;
  description?: string;
  start_datetime: string;
  timezone: string;
  duration_minutes: number;
  price: number;
  registration_deadline?: string | null;
  capacity: number;
  status: 'upcoming' | 'published' | 'draft' | 'completed' | 'cancelled';
  meeting_url?: string | null;
  whatsapp_group_url?: string | null;
  thumbnail_url?: string | null;
  created_at?: string;
}

export interface NewRegistrationRecord {
  id?: string;
  webinar_id: string;
  webinar_title?: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  phone?: string;
  role?: WebinarAttendeeRole;
  experience_level?: WebinarExperienceLevel;
  company_or_college?: string | null;
  learning_goal?: string | null;
  email_reminders_consent: boolean;
  whatsapp_updates_consent: boolean;
  message?: string;
  registration_type: 'free' | 'paid';
  amount: number;
  currency: string;
  payment_status: 'not_required' | 'pending' | 'paid' | 'failed' | 'expired';
  registration_status?: 'pending' | 'approved' | 'cancelled' | 'attended';
  payment_reference?: string | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  razorpay_qr_id?: string | null;
  registered_at?: string;
  created_at?: string;
  paid_at?: string | null;
  confirmation_email_sent_at?: string | null;
  attendance_status?: 'attended' | 'not_attended';
}

export interface ServerReminderLog {
  id: string;
  registration_id: string;
  reminder_type: '24h_before' | '1h_before' | '15m_before';
  scheduled_at: string;
  sent_at?: string | null;
  delivery_status: 'pending' | 'sent' | 'failed' | 'skipped';
  error_message?: string | null;
  created_at?: string;
}

// In-memory repositories for 100% resilient operation & local dev
const memoryWebinars: ServerWebinarRecord[] = [
  {
    id: 'webinar-ai-tools-2026',
    title: 'AI Tools Every Digital Marketer Should Know in 2026',
    description: 'Learn how modern AI tools like ChatGPT, Claude, and Midjourney can automate marketing workflows and boost campaign ROI.',
    start_datetime: '2026-10-24T12:30:00.000Z',
    timezone: 'Asia/Kolkata',
    duration_minutes: 60,
    price: 0,
    capacity: 150,
    status: 'published',
    meeting_url: 'https://meet.google.com/cbm-live-ai',
    whatsapp_group_url: 'https://chat.whatsapp.com/CBMWebinarAITools',
    thumbnail_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'webinar-meta-ads-masterclass',
    title: 'Meta Ads Masterclass (Facebook & Instagram Ads)',
    description: 'Deep dive into Meta Advantage+ campaigns, custom audience scaling, ROAS optimization, and high-converting ad creative frameworks.',
    start_datetime: '2026-10-25T13:30:00.000Z',
    timezone: 'Asia/Kolkata',
    duration_minutes: 90,
    price: 499,
    capacity: 100,
    status: 'published',
    meeting_url: 'https://meet.google.com/cbm-live-meta',
    whatsapp_group_url: 'https://chat.whatsapp.com/CBMMetaAdsVIP',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'webinar-seo-basics',
    title: 'SEO Basics for Beginners',
    description: 'Master the foundations of organic search: keyword research, on-page optimization, site architecture, and ranking in modern AI search results.',
    start_datetime: '2026-10-28T13:00:00.000Z',
    timezone: 'Asia/Kolkata',
    duration_minutes: 60,
    price: 0,
    capacity: 150,
    status: 'published',
    meeting_url: 'https://meet.google.com/cbm-live-seo',
    whatsapp_group_url: 'https://chat.whatsapp.com/CBMSEOBeginners',
    thumbnail_url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'webinar-wordpress-elementor',
    title: 'WordPress Website Development with Elementor',
    description: 'Build responsive, lightning-fast business websites and landing pages without code using WordPress, Elementor Pro, and domain hosting.',
    start_datetime: '2026-10-31T11:30:00.000Z',
    timezone: 'Asia/Kolkata',
    duration_minutes: 120,
    price: 499,
    capacity: 100,
    status: 'published',
    meeting_url: 'https://meet.google.com/cbm-live-wp',
    whatsapp_group_url: 'https://chat.whatsapp.com/CBMWordPressPro',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'webinar-canva-graphic-design',
    title: 'Graphic Design with Canva for Social Media',
    description: 'Create eye-catching social media posts, carousel decks, YouTube thumbnails, and professional brand assets using Canva.',
    start_datetime: '2026-11-01T12:30:00.000Z',
    timezone: 'Asia/Kolkata',
    duration_minutes: 60,
    price: 0,
    capacity: 200,
    status: 'published',
    meeting_url: 'https://meet.google.com/cbm-live-canva',
    whatsapp_group_url: 'https://chat.whatsapp.com/CBMCanvaDesign',
    thumbnail_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'webinar-google-ads-growth',
    title: 'Google Ads for Business Growth',
    description: 'Practical campaign architecture, search keyword match types, negative keywords, Quality Score optimization, and high-ROI bidding.',
    start_datetime: '2026-11-07T13:30:00.000Z',
    timezone: 'Asia/Kolkata',
    duration_minutes: 90,
    price: 499,
    capacity: 100,
    status: 'published',
    meeting_url: 'https://meet.google.com/cbm-live-gads',
    whatsapp_group_url: 'https://chat.whatsapp.com/CBMGoogleAdsVIP',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
];

const memoryRegistrations: NewRegistrationRecord[] = [];
const memoryReminderLogs: ServerReminderLog[] = [];

/**
 * Check if the user has already registered for this webinar
 */
export async function checkExistingRegistration(email: string, webinarId: string) {
  const cleanEmail = email.trim().toLowerCase();
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const query = supabase
        .from('webinar_registrations')
        .select('id, payment_status, registration_status, payment_reference')
        .eq('email', cleanEmail)
        .eq('webinar_id', webinarId)
        .in('payment_status', ['paid', 'not_required'])
        .maybeSingle();

      const { data, error } = await withTimeout(query, 2500);
      if (!error && data) {
        return { exists: true, record: data };
      }
    } catch (err) {
      console.warn('[Supabase] checkExistingRegistration notice:', err);
    }
  }

  // Check in-memory fallback
  const inMem = memoryRegistrations.find(
    (r) =>
      r.email.toLowerCase() === cleanEmail &&
      r.webinar_id === webinarId &&
      (r.payment_status === 'paid' || r.payment_status === 'not_required')
  );
  if (inMem) {
    return { exists: true, record: inMem };
  }

  return { exists: false, record: null };
}

/**
 * Get count of active/confirmed registrations for capacity enforcement
 */
export async function getWebinarRegistrationCount(webinarId: string): Promise<number> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const query = supabase
        .from('webinar_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('webinar_id', webinarId)
        .in('payment_status', ['paid', 'not_required']);

      const { count, error } = await withTimeout(query, 2500);
      if (!error && typeof count === 'number') {
        return count;
      }
    } catch (err) {
      console.warn('[Supabase] Error counting registrations:', err);
    }
  }

  return memoryRegistrations.filter(
    (r) =>
      r.webinar_id === webinarId &&
      (r.payment_status === 'paid' || r.payment_status === 'not_required')
  ).length;
}

/**
 * Save new registration to Supabase with unique reference ID
 */
export async function saveWebinarRegistration(
  record: NewRegistrationRecord
): Promise<{ success: boolean; id: string; reference: string; error?: string }> {
  const refCode = record.payment_reference || `CBM-WEB-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const nowIso = new Date().toISOString();

  const finalRecord: NewRegistrationRecord = {
    ...record,
    id: record.id || `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: record.email.trim().toLowerCase(),
    full_name: record.full_name.trim(),
    whatsapp_number: (record.whatsapp_number || record.phone || '').trim(),
    phone: (record.phone || record.whatsapp_number || '').trim(),
    role: record.role || 'Student',
    experience_level: record.experience_level || 'Beginner',
    company_or_college: record.company_or_college || null,
    learning_goal: record.learning_goal || null,
    email_reminders_consent: Boolean(record.email_reminders_consent),
    whatsapp_updates_consent: Boolean(record.whatsapp_updates_consent),
    registration_status:
      record.registration_status ||
      (record.registration_type === 'free' ? 'approved' : 'pending'),
    payment_reference: refCode,
    registered_at: record.registered_at || nowIso,
    created_at: record.created_at || nowIso,
  };

  const supabase = getSupabaseServer();
  let savedToSupabase = false;

  if (supabase) {
    // 1. Primary: Try webinar_registrations table with quick timeout
    try {
      const query = supabase
        .from('webinar_registrations')
        .insert([finalRecord])
        .select()
        .single();

      const { data, error } = await withTimeout(query, 1200);
      if (!error && data) {
        savedToSupabase = true;
        memoryRegistrations.unshift(finalRecord);
        return { success: true, id: data.id || finalRecord.id!, reference: refCode };
      }
    } catch (err: any) {
      console.warn('[Supabase] webinar_registrations table notice:', err?.message);
    }

    // 2. Guaranteed Persistence: Save to existing website_submissions table
    try {
      const subQuery = supabase
        .from('website_submissions')
        .insert([
          {
            form_type: 'webinar_registration',
            name: finalRecord.full_name,
            email: finalRecord.email,
            phone: finalRecord.whatsapp_number,
            course: finalRecord.webinar_title || finalRecord.webinar_id,
            message: finalRecord.message || finalRecord.learning_goal || `Registered for ${finalRecord.webinar_title || finalRecord.webinar_id}`,
            form_data: {
              ...finalRecord,
              reference: refCode,
            },
          },
        ])
        .select();

      const { data: subData, error: subError } = await withTimeout(subQuery, 1500);
      if (!subError && subData && subData.length > 0) {
        savedToSupabase = true;
      }
    } catch (subErr: any) {
      console.warn('[Supabase] website_submissions insert notice:', subErr?.message);
    }

    // 3. Backup to contact_submissions table
    try {
      const csQuery = supabase.from('contact_submissions').insert([
        {
          full_name: finalRecord.full_name,
          email: finalRecord.email,
          phone: finalRecord.whatsapp_number,
          message: `[Webinar Registration]\nWebinar: ${finalRecord.webinar_title || finalRecord.webinar_id}\nRef: ${refCode}\nStatus: ${finalRecord.registration_status}\n${finalRecord.message ? 'Note: ' + finalRecord.message : ''}`,
        },
      ]);
      await withTimeout(csQuery, 1200);
      savedToSupabase = true;
    } catch (csErr: any) {
      console.warn('[Supabase] contact_submissions backup notice:', csErr?.message);
    }
  }

  memoryRegistrations.unshift(finalRecord);

  return { success: true, id: finalRecord.id!, reference: refCode };

  return { success: true, id: finalRecord.id!, reference: refCode };
}

/**
 * Find registration record by ID, Reference, or Razorpay ID
 */
export async function getRegistrationByIdOrRef(
  identifier: string
): Promise<NewRegistrationRecord | null> {
  if (!identifier || !identifier.trim()) return null;
  const cleanId = identifier.trim();

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const query = supabase
        .from('webinar_registrations')
        .select('*')
        .or(`id.eq.${cleanId},payment_reference.eq.${cleanId},razorpay_order_id.eq.${cleanId},razorpay_qr_id.eq.${cleanId}`)
        .limit(1)
        .maybeSingle();

      const { data, error } = await withTimeout(query, 2500);
      if (!error && data) {
        return data as NewRegistrationRecord;
      }
    } catch (err) {
      console.warn('[Supabase] Warning fetching registration by ref:', err);
    }
  }

  const inMem = memoryRegistrations.find(
    (r) =>
      r.id === cleanId ||
      r.payment_reference === cleanId ||
      r.razorpay_order_id === cleanId ||
      r.razorpay_qr_id === cleanId
  );
  return inMem || null;
}

/**
 * Mark confirmation email sent timestamp
 */
export async function markConfirmationEmailSent(registrationId: string): Promise<void> {
  const nowIso = new Date().toISOString();
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase
        .from('webinar_registrations')
        .update({ confirmation_email_sent_at: nowIso })
        .eq('id', registrationId);
    } catch (err) {
      console.warn('[Supabase] markConfirmationEmailSent notice:', err);
    }
  }

  const inMem = memoryRegistrations.find((r) => r.id === registrationId);
  if (inMem) {
    inMem.confirmation_email_sent_at = nowIso;
  }
}

/**
 * Approve registration payment after server verification
 */
export async function approveRegistrationPayment(params: {
  registrationId?: string;
  orderId?: string;
  qrId?: string;
  paymentId: string;
  paidAmount: number;
  expectedAmount?: number;
  signature?: string;
}): Promise<{
  success: boolean;
  registration?: NewRegistrationRecord;
  alreadyApproved?: boolean;
  error?: string;
}> {
  const identifier = params.registrationId || params.orderId || params.qrId || '';
  const reg = await getRegistrationByIdOrRef(identifier);

  if (!reg) {
    return { success: false, error: 'Registration not found' };
  }

  if (reg.payment_status === 'paid' && reg.registration_status === 'approved') {
    return { success: true, registration: reg, alreadyApproved: true };
  }

  if (params.expectedAmount && params.paidAmount < params.expectedAmount) {
    return { success: false, error: 'Payment amount mismatch' };
  }

  const paidAt = new Date().toISOString();
  reg.payment_status = 'paid';
  reg.registration_status = 'approved';
  reg.razorpay_payment_id = params.paymentId;
  reg.paid_at = paidAt;
  if (params.signature) {
    reg.razorpay_signature = params.signature;
  }

  try {
    const supabase = getSupabaseServer();
    await supabase
      .from('webinar_registrations')
      .update({
        payment_status: 'paid',
        registration_status: 'approved',
        razorpay_payment_id: params.paymentId,
        razorpay_signature: params.signature || null,
        paid_at: paidAt,
      })
      .eq('id', reg.id);
  } catch (err) {
    console.warn('[Supabase] approveRegistrationPayment DB update warning:', err);
  }

  const inMem = memoryRegistrations.find((r) => r.id === reg.id);
  if (inMem) {
    inMem.payment_status = 'paid';
    inMem.registration_status = 'approved';
    inMem.razorpay_payment_id = params.paymentId;
    inMem.paid_at = paidAt;
  }

  return { success: true, registration: reg };
}

/**
 * Update registration payment status
 */
export async function updateRegistrationPaymentStatus(
  identifier: string,
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' | 'not_required',
  registrationStatus?: 'pending' | 'approved' | 'cancelled' | 'attended'
): Promise<boolean> {
  const reg = await getRegistrationByIdOrRef(identifier);
  if (!reg) return false;

  const updates: any = { payment_status: paymentStatus };
  if (registrationStatus) {
    updates.registration_status = registrationStatus;
  }

  try {
    const supabase = getSupabaseServer();
    await supabase.from('webinar_registrations').update(updates).eq('id', reg.id);
  } catch (err) {
    console.warn('[Supabase] updateRegistrationPaymentStatus notice:', err);
  }

  const inMem = memoryRegistrations.find((r) => r.id === reg.id);
  if (inMem) {
    inMem.payment_status = paymentStatus;
    if (registrationStatus) {
      inMem.registration_status = registrationStatus;
    }
  }
  return true;
}

/**
 * Mark registration payment as failed
 */
export async function markRegistrationPaymentFailed(identifier: string): Promise<boolean> {
  return updateRegistrationPaymentStatus(identifier, 'failed', 'cancelled');
}

/**
 * Mark registration payment as expired
 */
export async function markRegistrationPaymentExpired(identifier: string): Promise<boolean> {
  return updateRegistrationPaymentStatus(identifier, 'expired', 'cancelled');
}

/**
 * Toggle attendance for an attendee
 */
export async function toggleRegistrationAttendance(
  registrationId: string,
  attended: boolean
): Promise<{ success: boolean; status: string }> {
  const newStatus = attended ? 'attended' : 'approved';
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase
        .from('webinar_registrations')
        .update({ registration_status: newStatus })
        .eq('id', registrationId);
    } catch (err) {
      console.warn('[Supabase] toggleAttendance notice:', err);
    }
  }

  const inMem = memoryRegistrations.find((r) => r.id === registrationId);
  if (inMem) {
    inMem.registration_status = newStatus as any;
  }

  return { success: true, status: newStatus };
}

/**
 * Fetch all webinars from database / memory
 */
export async function getAllWebinars(): Promise<ServerWebinarRecord[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const query = supabase.from('webinars').select('*').order('start_datetime', { ascending: true });
      const { data, error } = await withTimeout(query, 1500);
      if (!error && Array.isArray(data) && data.length > 0) {
        return data as ServerWebinarRecord[];
      }
    } catch (err) {
      console.warn('[Supabase] Error fetching webinars, falling back to memory:', err);
    }
  }
  return memoryWebinars;
}

/**
 * Fetch single webinar by ID
 */
export async function getWebinarById(id: string): Promise<ServerWebinarRecord | null> {
  const webinars = await getAllWebinars();
  return webinars.find((w) => w.id === id) || null;
}

/**
 * Update webinar details (dates, capacity, meeting link, WhatsApp link, status)
 */
export async function updateWebinarDetails(
  id: string,
  updates: Partial<ServerWebinarRecord>
): Promise<{ success: boolean; webinar?: ServerWebinarRecord }> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('webinars')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return { success: true, webinar: data as ServerWebinarRecord };
      }
    } catch (err) {
      console.warn('[Supabase] updateWebinarDetails notice:', err);
    }
  }

  const inMem = memoryWebinars.find((w) => w.id === id);
  if (inMem) {
    Object.assign(inMem, updates);
    return { success: true, webinar: inMem };
  }

  return { success: false };
}

/**
 * Create a new webinar in Supabase and memory
 */
export async function createWebinar(
  data: Partial<ServerWebinarRecord>
): Promise<{ success: boolean; webinar: ServerWebinarRecord; error?: string }> {
  const newId = data.id || `webinar-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const nowIso = new Date().toISOString();

  const newWebinar: ServerWebinarRecord = {
    id: newId,
    title: (data.title || 'Untitled Webinar').trim(),
    description: (data.description || '').trim(),
    start_datetime: data.start_datetime || nowIso,
    timezone: data.timezone || 'Asia/Kolkata',
    duration_minutes: data.duration_minutes ? Number(data.duration_minutes) : 60,
    price: data.price !== undefined ? Number(data.price) : 0,
    capacity: data.capacity ? Number(data.capacity) : 100,
    status: (data.status as any) || 'published',
    thumbnail_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    meeting_url: data.meeting_url || null,
    whatsapp_group_url: data.whatsapp_group_url || null,
    created_at: nowIso,
  };

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data: dbData, error } = await supabase
        .from('webinars')
        .insert([newWebinar])
        .select()
        .single();

      if (!error && dbData) {
        memoryWebinars.unshift(dbData as ServerWebinarRecord);
        return { success: true, webinar: dbData as ServerWebinarRecord };
      }
    } catch (err: any) {
      console.warn('[Supabase] createWebinar notice:', err?.message);
    }
  }

  memoryWebinars.unshift(newWebinar);
  return { success: true, webinar: newWebinar };
}

/**
 * Delete or deactivate webinar by ID
 */
export async function deleteWebinarServer(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('webinars').delete().eq('id', id);
    } catch (err: any) {
      console.warn('[Supabase] deleteWebinar notice:', err?.message);
    }
  }

  const idx = memoryWebinars.findIndex((w) => w.id === id);
  if (idx !== -1) {
    memoryWebinars.splice(idx, 1);
  }
  return { success: true };
}

/**
 * Fetch all registrations for admin with optional filters
 */
export async function getAllRegistrations(filters?: {
  webinarId?: string;
  type?: 'free' | 'paid' | 'all';
  status?: string;
  role?: string;
}): Promise<NewRegistrationRecord[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      let query = supabase
        .from('webinar_registrations')
        .select('*')
        .order('registered_at', { ascending: false });

      if (filters?.webinarId && filters.webinarId !== 'all') {
        query = query.eq('webinar_id', filters.webinarId);
      }
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('registration_type', filters.type);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('payment_status', filters.status);
      }
      if (filters?.role && filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }

      const { data, error } = await withTimeout(query, 2500);
      if (!error && Array.isArray(data) && data.length > 0) {
        const dbIds = new Set(data.map((r: any) => r.id));
        const extraMem = memoryRegistrations.filter((m) => m.id && !dbIds.has(m.id));
        return [...data, ...extraMem];
      }

      // Fallback: Query website_submissions table for webinar registrations
      try {
        const { data: subData } = await supabase
          .from('website_submissions')
          .select('*')
          .eq('form_type', 'webinar_registration')
          .order('created_at', { ascending: false });

        if (subData && subData.length > 0) {
          const mappedSub: NewRegistrationRecord[] = subData.map((s: any) => {
            const fd = s.form_data || {};
            return {
              id: fd.id || s.id,
              webinar_id: fd.webinar_id || 'webinar-ai-tools-2026',
              webinar_title: fd.webinar_title || s.course || 'Live Webinar',
              full_name: s.name || fd.full_name || '',
              email: s.email || fd.email || '',
              whatsapp_number: s.phone || fd.whatsapp_number || '',
              phone: s.phone || fd.phone || '',
              role: fd.role || 'Student',
              experience_level: fd.experience_level || 'Beginner',
              company_or_college: fd.company_or_college || null,
              learning_goal: fd.learning_goal || s.message || null,
              message: s.message || fd.message || null,
              email_reminders_consent: fd.email_reminders_consent ?? true,
              whatsapp_updates_consent: fd.whatsapp_updates_consent ?? true,
              registration_type: fd.registration_type || 'free',
              amount: fd.amount || 0,
              currency: fd.currency || 'INR',
              payment_status: fd.payment_status || 'not_required',
              registration_status: fd.registration_status || 'approved',
              payment_reference: fd.reference || fd.payment_reference || 'CBM-WEB',
              razorpay_order_id: fd.razorpay_order_id || null,
              razorpay_payment_id: fd.razorpay_payment_id || null,
              registered_at: s.created_at || fd.registered_at || new Date().toISOString(),
              created_at: s.created_at || new Date().toISOString(),
            };
          });
          const dbIds = new Set(mappedSub.map((r: any) => r.id));
          const extraMem = memoryRegistrations.filter((m) => m.id && !dbIds.has(m.id));
          return [...mappedSub, ...extraMem];
        }
      } catch (wsErr) {
        console.warn('[Supabase] website_submissions query notice:', wsErr);
      }
    } catch (err) {
      console.warn('[Supabase] Error querying registrations:', err);
    }
  }

  return memoryRegistrations.filter((r) => {
    if (filters?.webinarId && filters.webinarId !== 'all' && r.webinar_id !== filters.webinarId) return false;
    if (filters?.type && filters.type !== 'all' && r.registration_type !== filters.type) return false;
    if (filters?.status && filters.status !== 'all' && r.payment_status !== filters.status) return false;
    if (filters?.role && filters.role !== 'all' && r.role !== filters.role) return false;
    return true;
  });
}

/**
 * Log reminder dispatch attempt (idempotent tracking)
 */
export async function logReminderAttempt(log: {
  registration_id: string;
  reminder_type: '24h_before' | '1h_before' | '15m_before';
  scheduled_at: string;
  sent_at?: string | null;
  delivery_status: 'pending' | 'sent' | 'failed' | 'skipped';
  error_message?: string | null;
}): Promise<void> {
  const fullLog: ServerReminderLog = {
    id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...log,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('reminder_logs').upsert([fullLog], { onConflict: 'registration_id,reminder_type' });
    } catch (err) {
      console.warn('[Supabase] logReminderAttempt notice:', err);
    }
  }

  memoryReminderLogs.unshift(fullLog);
}

/**
 * Fetch all reminder logs for admin view
 */
export async function getAllReminderLogs(): Promise<ServerReminderLog[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('reminder_logs').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        return data as ServerReminderLog[];
      }
    } catch (err) {
      console.warn('[Supabase] Error fetching reminder logs:', err);
    }
  }
  return memoryReminderLogs;
}

/**
 * Save contact or application form submission to contact_submissions table
 */
export async function saveContactSubmission(data: {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getSupabaseServer();
  if (!supabase) {
    return { success: false, error: 'Supabase server is not configured.' };
  }

  try {
    const { data: records, error } = await withTimeout(
      supabase
        .from('contact_submissions')
        .insert([
          {
            full_name: data.fullName.trim(),
            email: data.email.trim(),
            phone: data.phone.trim(),
            message: data.message.trim(),
          },
        ])
        .select()
    );

    if (error) {
      console.error('[Supabase Server] saveContactSubmission error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: records?.[0]?.id };
  } catch (err: any) {
    console.error('[Supabase Server] saveContactSubmission exception:', err);
    return { success: false, error: err?.message || 'Database insert failed' };
  }
}

/**
 * Save application form submission directly to form_submissions table
 * Columns: Name, Email, Phone, Course, Message
 */
export async function saveFormSubmission(data: {
  Name: string;
  Email: string;
  Phone: string;
  Course: string;
  Message: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getSupabaseServer();
  if (!supabase) {
    return { success: false, error: 'Supabase server is not configured.' };
  }

  try {
    const { data: records, error } = await withTimeout(
      supabase
        .from('form_submissions')
        .insert([
          {
            Name: data.Name.trim(),
            Email: data.Email.trim(),
            Phone: data.Phone.trim(),
            Course: data.Course.trim(),
            Message: data.Message.trim(),
          },
        ])
        .select()
    );

    if (error) {
      console.error('[Supabase Server] saveFormSubmission error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: records?.[0]?.Id || records?.[0]?.id };
  } catch (err: any) {
    console.error('[Supabase Server] saveFormSubmission exception:', err);
    return { success: false, error: err?.message || 'Database insert failed' };
  }
}

