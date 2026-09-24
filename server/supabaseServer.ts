import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or fallback to project configuration
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  'https://cxeztsvgaeytdljoned.supabase.co';

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_sO0rnN9MJzQmBiq-Lm6p3w_EAYKjVOb';

let supabaseClient: SupabaseClient | null = null;

function withTimeout<T>(promise: PromiseLike<T>, ms = 2500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Supabase request timed out')), ms)),
  ]);
}

export function getSupabaseServer(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClient;
}

export interface NewRegistrationRecord {
  id?: string;
  webinar_id: string;
  webinar_title?: string;
  full_name: string;
  email: string;
  phone: string;
  message?: string;
  registration_type: 'free' | 'paid';
  amount: number;
  currency: string;
  payment_status: 'not_required' | 'pending' | 'paid' | 'failed' | 'expired';
  registration_status?: 'pending' | 'approved' | 'cancelled';
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  razorpay_qr_id?: string | null;
  created_at?: string;
  paid_at?: string | null;
}

// In-memory fallback if Supabase table is not yet provisioned on the remote project
const memoryRegistrations: NewRegistrationRecord[] = [];

/**
 * Check if the user has already registered for this webinar with confirmed status
 */
export async function checkExistingRegistration(email: string, webinarId: string) {
  try {
    const supabase = getSupabaseServer();
    const query = supabase
      .from('webinar_registrations')
      .select('id, payment_status, registration_type')
      .eq('email', email.trim().toLowerCase())
      .eq('webinar_id', webinarId)
      .in('payment_status', ['paid', 'not_required'])
      .maybeSingle();

    const { data, error } = await withTimeout(query, 2000);

    if (!error && data) {
      return { exists: true, record: data };
    }
  } catch (err) {
    console.warn('[Supabase] Warning checking existing registration:', err);
  }

  // Check in-memory fallback
  const inMem = memoryRegistrations.find(
    (r) =>
      r.email.toLowerCase() === email.trim().toLowerCase() &&
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
  try {
    const supabase = getSupabaseServer();
    const query = supabase
      .from('webinar_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('webinar_id', webinarId)
      .in('payment_status', ['paid', 'not_required']);

    const { count, error } = await withTimeout(query, 2000);

    if (!error && typeof count === 'number') {
      return count;
    }
  } catch (err) {
    console.warn('[Supabase] Error counting registrations:', err);
  }

  // Count in memory
  return memoryRegistrations.filter(
    (r) =>
      r.webinar_id === webinarId &&
      (r.payment_status === 'paid' || r.payment_status === 'not_required')
  ).length;
}

/**
 * Save new registration to Supabase
 */
export async function saveWebinarRegistration(
  record: NewRegistrationRecord
): Promise<{ success: boolean; id: string; error?: string }> {
  const finalRecord: NewRegistrationRecord = {
    ...record,
    id: record.id || `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: record.email.trim().toLowerCase(),
    full_name: record.full_name.trim(),
    phone: record.phone.trim(),
    registration_status:
      record.registration_status ||
      (record.registration_type === 'free' ? 'approved' : 'pending'),
    created_at: record.created_at || new Date().toISOString(),
  };

  try {
    const supabase = getSupabaseServer();
    const query = supabase
      .from('webinar_registrations')
      .insert([finalRecord])
      .select()
      .single();

    const { data, error } = await withTimeout(query, 2500);

    if (error) {
      console.warn('[Supabase] Insert notice (will store in memory backup):', error.message);
      memoryRegistrations.unshift(finalRecord);
      return { success: true, id: finalRecord.id! };
    }

    return { success: true, id: data?.id || finalRecord.id! };
  } catch (err: any) {
    console.warn('[Supabase] Insert error caught (saved to in-memory store):', err?.message);
    memoryRegistrations.unshift(finalRecord);
    return { success: true, id: finalRecord.id! };
  }
}

/**
 * Find registration record by ID, Razorpay Order ID, or Razorpay QR ID
 */
export async function getRegistrationByIdOrRef(
  identifier: string
): Promise<NewRegistrationRecord | null> {
  if (!identifier || !identifier.trim()) return null;
  const cleanId = identifier.trim();

  try {
    const supabase = getSupabaseServer();
    // Query by id, razorpay_order_id, or razorpay_qr_id
    const query = supabase
      .from('webinar_registrations')
      .select('*')
      .or(`id.eq.${cleanId},razorpay_order_id.eq.${cleanId},razorpay_qr_id.eq.${cleanId}`)
      .limit(1)
      .maybeSingle();

    const { data, error } = await withTimeout(query, 2500);
    if (!error && data) {
      return data as NewRegistrationRecord;
    }
  } catch (err) {
    console.warn('[Supabase] Warning fetching registration by ref:', err);
  }

  // Check in-memory fallback
  const inMem = memoryRegistrations.find(
    (r) =>
      r.id === cleanId ||
      r.razorpay_order_id === cleanId ||
      r.razorpay_qr_id === cleanId
  );
  return inMem || null;
}

/**
 * Approve registration payment after server verification or valid webhook
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

  // Prevent duplicate payment confirmations
  if (reg.payment_status === 'paid' && reg.registration_status === 'approved') {
    return { success: true, registration: reg, alreadyApproved: true };
  }

  // Validate amount if expected amount is provided
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
    const updateQuery = supabase
      .from('webinar_registrations')
      .update({
        payment_status: 'paid',
        registration_status: 'approved',
        razorpay_payment_id: params.paymentId,
        razorpay_signature: params.signature || null,
        paid_at: paidAt,
      })
      .eq('id', reg.id);

    await withTimeout(updateQuery, 2500);
  } catch (err) {
    console.warn('[Supabase] approveRegistrationPayment DB update warning:', err);
  }

  // Update in memory
  const inMem = memoryRegistrations.find(
    (r) =>
      r.id === reg.id ||
      (params.orderId && r.razorpay_order_id === params.orderId) ||
      (params.qrId && r.razorpay_qr_id === params.qrId)
  );
  if (inMem) {
    inMem.payment_status = 'paid';
    inMem.registration_status = 'approved';
    inMem.razorpay_payment_id = params.paymentId;
    inMem.paid_at = paidAt;
    if (params.signature) inMem.razorpay_signature = params.signature;
  }

  return { success: true, registration: reg };
}

/**
 * Mark registration payment failed
 */
export async function markRegistrationPaymentFailed(identifier: string): Promise<void> {
  const reg = await getRegistrationByIdOrRef(identifier);
  if (!reg) return;

  // Don't downgrade if already paid
  if (reg.payment_status === 'paid') return;

  reg.payment_status = 'failed';
  reg.registration_status = 'cancelled';

  try {
    const supabase = getSupabaseServer();
    const query = supabase
      .from('webinar_registrations')
      .update({
        payment_status: 'failed',
        registration_status: 'cancelled',
      })
      .eq('id', reg.id);
    await withTimeout(query, 2000);
  } catch (err) {
    console.warn('[Supabase] Failed status update warning:', err);
  }
}

/**
 * Mark registration payment expired
 */
export async function markRegistrationPaymentExpired(identifier: string): Promise<void> {
  const reg = await getRegistrationByIdOrRef(identifier);
  if (!reg) return;

  if (reg.payment_status === 'paid') return;

  reg.payment_status = 'expired';
  reg.registration_status = 'cancelled';

  try {
    const supabase = getSupabaseServer();
    const query = supabase
      .from('webinar_registrations')
      .update({
        payment_status: 'expired',
        registration_status: 'cancelled',
      })
      .eq('id', reg.id);
    await withTimeout(query, 2000);
  } catch (err) {
    console.warn('[Supabase] Expired status update warning:', err);
  }
}

/**
 * Update payment status after Razorpay verification
 */
export async function updateRegistrationPaymentStatus(
  orderId: string,
  updates: {
    payment_status: 'paid' | 'failed';
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    email?: string;
    webinar_id?: string;
    full_name?: string;
    phone?: string;
    amount?: number;
    message?: string;
    webinar_title?: string;
  }
): Promise<{ success: boolean }> {
  try {
    const supabase = getSupabaseServer();

    // Check if record exists by razorpay_order_id
    const { data: existing } = await supabase
      .from('webinar_registrations')
      .select('id')
      .eq('razorpay_order_id', orderId)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from('webinar_registrations')
        .update({
          payment_status: updates.payment_status,
          razorpay_payment_id: updates.razorpay_payment_id || null,
          razorpay_signature: updates.razorpay_signature || null,
        })
        .eq('id', existing.id);

      if (!error) {
        return { success: true };
      }
    } else if (updates.email && updates.webinar_id && updates.full_name && updates.phone) {
      // Upsert/Insert new paid registration record directly
      await supabase.from('webinar_registrations').insert([
        {
          webinar_id: updates.webinar_id,
          webinar_title: updates.webinar_title || '',
          full_name: updates.full_name,
          email: updates.email.toLowerCase(),
          phone: updates.phone,
          message: updates.message || '',
          registration_type: 'paid',
          amount: updates.amount || 0,
          currency: 'INR',
          payment_status: updates.payment_status,
          razorpay_order_id: orderId,
          razorpay_payment_id: updates.razorpay_payment_id,
          razorpay_signature: updates.razorpay_signature,
        },
      ]);
      return { success: true };
    }
  } catch (err) {
    console.warn('[Supabase] Payment update notice:', err);
  }

  // Update in-memory fallback
  const inMem = memoryRegistrations.find((r) => r.razorpay_order_id === orderId);
  if (inMem) {
    inMem.payment_status = updates.payment_status;
    inMem.razorpay_payment_id = updates.razorpay_payment_id;
    inMem.razorpay_signature = updates.razorpay_signature;
  } else if (updates.email && updates.webinar_id) {
    memoryRegistrations.unshift({
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      webinar_id: updates.webinar_id,
      webinar_title: updates.webinar_title || '',
      full_name: updates.full_name || '',
      email: updates.email.toLowerCase(),
      phone: updates.phone || '',
      message: updates.message || '',
      registration_type: 'paid',
      amount: updates.amount || 0,
      currency: 'INR',
      payment_status: updates.payment_status,
      razorpay_order_id: orderId,
      razorpay_payment_id: updates.razorpay_payment_id,
      razorpay_signature: updates.razorpay_signature,
      created_at: new Date().toISOString(),
    });
  }

  return { success: true };
}

/**
 * Fetch all registrations for admin
 */
export async function getAllRegistrations(filters?: {
  type?: 'free' | 'paid';
  status?: string;
}): Promise<NewRegistrationRecord[]> {
  try {
    const supabase = getSupabaseServer();
    let query = supabase
      .from('webinar_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('registration_type', filters.type);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('payment_status', filters.status);
    }

    const { data, error } = await withTimeout(query, 2500);
    if (!error && Array.isArray(data)) {
      // Merge with any in-memory records that might not be in DB
      const dbIds = new Set(data.map((r: any) => r.id));
      const extraMem = memoryRegistrations.filter((m) => m.id && !dbIds.has(m.id));
      return [...data, ...extraMem];
    }
  } catch (err) {
    console.warn('[Supabase] Error querying registrations:', err);
  }

  // Filter in-memory fallback
  return memoryRegistrations.filter((r) => {
    if (filters?.type && r.registration_type !== filters.type) return false;
    if (filters?.status && filters.status !== 'all' && r.payment_status !== filters.status) return false;
    return true;
  });
}
