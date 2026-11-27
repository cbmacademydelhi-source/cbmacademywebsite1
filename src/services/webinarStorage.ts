import { Webinar, WebinarRegistration, FormSubmissionResult, WebinarType } from '../types';
import { supabase } from '../lib/supabase';
import { apiFetch } from '../utils/apiConfig';
import { getFreshAdminToken } from './adminService';
import {
  parseWebinarContent,
  composeStructuredDescription,
} from '../utils/webinarContent';

/**
 * CBM ACADEMY WEBINAR STORAGE
 * Globally synchronized directly with Supabase (no browser localStorage caching).
 */

export const WEBINAR_UPDATE_EVENT = 'cbm_webinars_updated';

// Known legacy demo webinar IDs to ignore
const DEMO_WEBINAR_IDS = new Set([
  'webinar-ai-tools-2026',
  'webinar-meta-ads-masterclass',
  'webinar-seo-basics',
  'webinar-wordpress-elementor',
  'webinar-canva-graphic-design',
  'webinar-google-ads-growth',
  'webinar-content-copywriting-ai',
  'webinar-linkedin-branding',
  'webinar-email-automation',
  'webinar-youtube-growth',
  'webinar-ecommerce-scaling',
  'webinar-ga4-analytics',
]);

export const DEFAULT_WEBINARS: Webinar[] = [];

// Transient in-memory state populated strictly from Supabase
let inMemoryWebinars: Webinar[] = [];

function emitWebinarUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(WEBINAR_UPDATE_EVENT));
  }
}

function getWebinarRecencyMs(w: Webinar): number {
  const publishedMs = w.publishedAt ? Date.parse(w.publishedAt) : NaN;
  if (!Number.isNaN(publishedMs)) return publishedMs;
  const createdMs = w.createdAt ? Date.parse(w.createdAt) : NaN;
  if (!Number.isNaN(createdMs)) return createdMs;
  return 0;
}

/**
 * Return the most recently published (or upcoming) webinar.
 */
export function getMostRecentlyPublishedWebinar(webinars: Webinar[]): Webinar | null {
  const published = webinars.filter(
    (w) => w.status === 'published' || w.status === 'upcoming'
  );
  if (published.length === 0) return null;

  let latest = published[0];
  let latestTs = getWebinarRecencyMs(latest);

  for (let i = 1; i < published.length; i++) {
    const candidate = published[i];
    const candidateTs = getWebinarRecencyMs(candidate);
    if (candidateTs > latestTs) {
      latest = candidate;
      latestTs = candidateTs;
    }
  }

  return latest;
}

function sortWebinarsNewestFirst(list: Webinar[]): Webinar[] {
  return [...list].sort((a, b) => getWebinarRecencyMs(b) - getWebinarRecencyMs(a));
}

function computeStartDatetimeIso(dateStr?: string, timeStr?: string): string | null {
  const cleanDate = typeof dateStr === 'string' ? dateStr.trim() : '';
  if (!cleanDate) {
    return null;
  }
  // Support YYYY-MM-DD or readable date strings
  const combined = timeStr ? `${cleanDate} ${timeStr.replace(/\bIST\b/i, '+05:30')}` : cleanDate;
  const parsedCombined = Date.parse(combined);
  if (!Number.isNaN(parsedCombined)) {
    return new Date(parsedCombined).toISOString();
  }
  const parsedDate = Date.parse(cleanDate);
  if (!Number.isNaN(parsedDate)) {
    return new Date(parsedDate).toISOString();
  }
  return null;
}

function formatSqlTimeForDisplay(rawTime?: string | null): string {
  if (typeof rawTime !== 'string') return '';
  const trimmed = rawTime.trim();
  if (!trimmed) return '';
  const sqlMatch = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(trimmed);
  if (sqlMatch) {
    const hour24 = parseInt(sqlMatch[1], 10);
    const minute = sqlMatch[2];
    if (hour24 >= 0 && hour24 <= 23) {
      const period = hour24 < 12 ? 'AM' : 'PM';
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      return `${hour12}:${minute} ${period} IST`;
    }
  }
  return trimmed;
}

function mapRemoteWebinar(sw: any): Webinar {
  const isFree = Number(sw.price) === 0;

  const hasExplicitNullDate =
    ('date' in sw && sw.date === null && !sw.display_date) ||
    ('display_date' in sw && sw.display_date === null && !sw.date);

  let dateStr =
    (typeof sw.display_date === 'string' && sw.display_date.trim()) ||
    (typeof sw.date === 'string' && sw.date.trim()) ||
    '';
  let timeStr =
    (typeof sw.display_time === 'string' && sw.display_time.trim()) ||
    formatSqlTimeForDisplay(sw.time) ||
    '';

  if (((!dateStr && !hasExplicitNullDate) || !timeStr) && sw.start_datetime) {
    try {
      const d = new Date(sw.start_datetime);
      if (!Number.isNaN(d.getTime())) {
        if (!dateStr && !hasExplicitNullDate) {
          dateStr = d.toLocaleDateString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }
        if (!timeStr) {
          timeStr =
            d.toLocaleTimeString('en-IN', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }) + ' IST';
        }
      }
    } catch {}
  }

  const createdAt = sw.created_at || new Date().toISOString();
  const status = sw.status || 'published';
  const publishedAt =
    sw.published_at ||
    (status === 'published' || status === 'upcoming'
      ? sw.updated_at || sw.created_at || createdAt
      : undefined);

  const parsedContent = parseWebinarContent(
    sw.description,
    sw.what_you_will_explore,
    sw.what_you_will_learn ?? sw.key_takeaways
  );

  const hasAnyStructuredContent =
    Boolean(parsedContent.introduction) ||
    parsedContent.whatYouWillExplore.length > 0 ||
    parsedContent.keyTakeaways.length > 0 ||
    Array.isArray(sw.what_you_will_learn) ||
    Array.isArray(sw.key_takeaways);

  const learnPoints = hasAnyStructuredContent
    ? parsedContent.keyTakeaways
    : [
        'Comprehensive live practical industry breakdown',
        'Interactive Q&A with CBM Academy mentors',
        'Take-home resources and practical frameworks',
      ];

  const normalizedDescription =
    (typeof sw.description === 'string' && sw.description.trim()) ||
    composeStructuredDescription(
      parsedContent.introduction,
      parsedContent.whatYouWillExplore,
      learnPoints,
      true
    );

  return {
    id: sw.id,
    title: sw.title,
    description: normalizedDescription,
    introduction: parsedContent.introduction,
    whatYouWillExplore: parsedContent.whatYouWillExplore,
    posterUrl:
      sw.thumbnail_url ||
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    type: (isFree ? 'free' : 'paid') as WebinarType,
    price: isFree ? 'FREE' : Number(sw.price),
    date: dateStr,
    time: timeStr || '6:00 PM IST',
    duration: sw.duration_minutes ? `${sw.duration_minutes} mins` : '60 mins',
    host: (typeof sw.host === 'string' && sw.host.trim()) || 'CBM Academy Faculty',
    whatYouWillLearn: learnPoints,
    status,
    capacity: sw.capacity || 100,
    createdAt,
    publishedAt,
    start_datetime: sw.start_datetime ?? null,
    meeting_url: sw.meeting_url,
    whatsapp_group_url: sw.whatsapp_group_url,
  };
}

function isMissingTableError(error: any): boolean {
  const code = String(error?.code || '');
  const msg = String(error?.message || '');
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    /could not find the table|relation .* does not exist/i.test(msg)
  );
}

function isMissingColumnError(error: any): boolean {
  const code = String(error?.code || '');
  const msg = String(error?.message || '');
  return (
    code === '42703' ||
    code === 'PGRST204' ||
    /column .* does not exist|could not find the .* column/i.test(msg)
  );
}

/**
 * Retrieve the latest webinars loaded in memory from Supabase.
 */
export function getWebinars(): Webinar[] {
  return inMemoryWebinars;
}

/**
 * Fetch latest webinars directly from Supabase (with backend API fallback).
 */
export async function fetchWebinarsFromDb(): Promise<Webinar[]> {
  // 1. Primary: Direct Supabase query
  try {
    const { data: supaWebinars, error: supaErr } = await supabase
      .from('webinars')
      .select('*')
      .order('created_at', { ascending: false });

    if (!supaErr && Array.isArray(supaWebinars)) {
      const mapped = sortWebinarsNewestFirst(
        supaWebinars
          .filter((sw: any) => sw && sw.id && !DEMO_WEBINAR_IDS.has(sw.id))
          .map((sw: any) => mapRemoteWebinar(sw))
      );

      inMemoryWebinars = mapped;
      emitWebinarUpdate();
      return mapped;
    }
  } catch (supaErr) {
    console.warn('[Supabase Direct] fetchWebinars notice:', supaErr);
  }

  // 2. Fallback: Server API query (which reads from Supabase)
  try {
    const res = await apiFetch('/api/webinars/list', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.webinars)) {
        const mapped = sortWebinarsNewestFirst(
          data.webinars
            .filter((sw: any) => sw && sw.id && !DEMO_WEBINAR_IDS.has(sw.id))
            .map((sw: any) => mapRemoteWebinar(sw))
        );

        inMemoryWebinars = mapped;
        emitWebinarUpdate();
        return mapped;
      }
    }
  } catch (err) {
    console.warn('fetchWebinarsFromDb notice:', err);
  }

  return inMemoryWebinars;
}

/**
 * Subscribe to real-time webinar changes in Supabase across all open devices/tabs.
 */
export function subscribeToWebinarChanges(onChange: () => void): () => void {
  let channel: ReturnType<typeof supabase.channel> | null = null;
  try {
    channel = supabase
      .channel('cbm-webinars-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'webinars' },
        () => {
          onChange();
        }
      )
      .subscribe();
  } catch {
    // Non-fatal if Realtime isn't enabled yet
  }

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}

export interface WebinarMutationResult {
  success: boolean;
  webinar?: Webinar;
  message?: string;
}

/**
 * Save or update a webinar directly in Supabase so all devices see it immediately.
 */
export async function saveWebinar(
  webinar: Omit<Webinar, 'id' | 'createdAt'> & { id?: string }
): Promise<WebinarMutationResult> {
  const existing = webinar.id
    ? inMemoryWebinars.find((w) => w.id === webinar.id)
    : undefined;
  const isEdit = Boolean(existing);
  const now = new Date().toISOString();
  const isPublishedStatus = webinar.status === 'published' || webinar.status === 'upcoming';
  const wasPublishedStatus =
    existing?.status === 'published' || existing?.status === 'upcoming';

  const id =
    (isEdit && existing ? existing.id : webinar.id) ||
    `webinar-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const publishedAt = isPublishedStatus
    ? isEdit && wasPublishedStatus
      ? webinar.publishedAt || existing?.publishedAt || existing?.createdAt || now
      : now
    : existing?.publishedAt || null;

  const numericPrice =
    typeof webinar.price === 'number'
      ? webinar.price
      : webinar.type === 'free'
      ? 0
      : Number(String(webinar.price || '').replace(/[^0-9]/g, '')) || 499;

  const durationMins = Number(String(webinar.duration || '').replace(/[^0-9]/g, '')) || 60;
  const cleanDate = typeof webinar.date === 'string' ? webinar.date.trim() : '';
  const isoDateOrNull = /^\d{4}-\d{2}-\d{2}$/.test(cleanDate) ? cleanDate : null;
  const startDatetimeIso = cleanDate
    ? webinar.start_datetime || computeStartDatetimeIso(cleanDate, webinar.time)
    : null;

  const parsedDraft = parseWebinarContent(
    webinar.description,
    webinar.whatYouWillExplore,
    webinar.whatYouWillLearn
  );
  const finalIntro =
    typeof webinar.introduction === 'string'
      ? webinar.introduction.trim()
      : parsedDraft.introduction;
  const finalExplore = Array.isArray(webinar.whatYouWillExplore)
    ? webinar.whatYouWillExplore.map((item) => item.trim()).filter(Boolean)
    : parsedDraft.whatYouWillExplore;
  const finalTakeaways = Array.isArray(webinar.whatYouWillLearn)
    ? webinar.whatYouWillLearn.map((item) => item.trim()).filter(Boolean)
    : parsedDraft.keyTakeaways;

  const structuredDescription = composeStructuredDescription(
    finalIntro,
    finalExplore,
    finalTakeaways,
    true
  );

  const basePayload: Record<string, any> = {
    id,
    title: webinar.title.trim(),
    description: structuredDescription,
    thumbnail_url: webinar.posterUrl || null,
    date: isoDateOrNull,
    start_datetime: startDatetimeIso,
    price: numericPrice,
    duration_minutes: durationMins,
    capacity: webinar.capacity || webinar.max_capacity || 100,
    status: webinar.status || 'published',
    meeting_url: webinar.meeting_url || null,
    whatsapp_group_url: webinar.whatsapp_group_url || null,
  };

  const extendedPayload: Record<string, any> = {
    ...basePayload,
    display_date: cleanDate || null,
    display_time: webinar.time || null,
    host: webinar.host || 'CBM Academy Faculty',
    what_you_will_explore: finalExplore,
    what_you_will_learn: finalTakeaways,
    published_at: publishedAt,
    updated_at: now,
  };

  const isStartDatetimeNotNullError = (err: any): boolean => {
    const code = String(err?.code || '');
    const msg = String(err?.message || '');
    return code === '23502' && /start_datetime/i.test(msg);
  };

  const upsertWithNullDateFallback = async (payloadToSave: Record<string, any>) => {
    let attempt = await supabase
      .from('webinars')
      .upsert([payloadToSave], { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (attempt.error && isStartDatetimeNotNullError(attempt.error) && payloadToSave.start_datetime === null) {
      // Allow Postgres column DEFAULT to populate start_datetime while keeping date NULL
      const withoutStart = { ...payloadToSave };
      delete withoutStart.start_datetime;
      attempt = await supabase
        .from('webinars')
        .upsert([withoutStart], { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (attempt.error && isStartDatetimeNotNullError(attempt.error)) {
        attempt = await supabase
          .from('webinars')
          .upsert([{ ...payloadToSave, start_datetime: now }], { onConflict: 'id' })
          .select()
          .maybeSingle();
      }
    }

    return attempt;
  };

  // 1. Primary: Direct Supabase upsert (auto-fallback to base columns if extended columns don't exist yet)
  let supaError: any = null;
  try {
    let { data, error } = await upsertWithNullDateFallback(extendedPayload);

    if (error && isMissingColumnError(error)) {
      const retry = await upsertWithNullDateFallback(basePayload);
      data = retry.data;
      error = retry.error;

      if (error && isMissingColumnError(error) && 'date' in basePayload) {
        const withoutDateCol = { ...basePayload };
        delete withoutDateCol.date;
        const retryNoDate = await upsertWithNullDateFallback(withoutDateCol);
        data = retryNoDate.data;
        error = retryNoDate.error;
      }
    }

    if (!error) {
      const saved = data
        ? mapRemoteWebinar({
            ...extendedPayload,
            ...data,
            date: cleanDate ? (data.date ?? isoDateOrNull) : null,
            display_date: cleanDate || null,
          })
        : mapRemoteWebinar(extendedPayload);

      const nextList = sortWebinarsNewestFirst([
        saved,
        ...inMemoryWebinars.filter((w) => w.id !== saved.id),
      ]);
      inMemoryWebinars = nextList;
      emitWebinarUpdate();
      return { success: true, webinar: saved };
    }

    supaError = error;
    if (isMissingTableError(error)) {
      return {
        success: false,
        message:
          "Supabase 'webinars' table is not created yet. Run supabase_global_sync_schema.sql in Supabase SQL Editor to enable global webinar sync.",
      };
    }
  } catch (err) {
    supaError = err;
  }

  // 2. Fallback: Backend Express API (using admin token)
  try {
    const endpoint = isEdit ? '/api/webinars/update' : '/api/webinars/create';
    const token = await getFreshAdminToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await apiFetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(extendedPayload),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) {
      const saved = data.webinar
        ? mapRemoteWebinar({ ...extendedPayload, ...data.webinar })
        : mapRemoteWebinar(extendedPayload);
      const nextList = sortWebinarsNewestFirst([
        saved,
        ...inMemoryWebinars.filter((w) => w.id !== saved.id),
      ]);
      inMemoryWebinars = nextList;
      emitWebinarUpdate();
      return { success: true, webinar: saved };
    }

    return {
      success: false,
      message:
        data?.message ||
        supaError?.message ||
        'Failed to save webinar to Supabase.',
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        supaError?.message ||
        err?.message ||
        'Failed to save webinar to Supabase.',
    };
  }
}

/**
 * Delete a webinar by ID directly in Supabase.
 */
export async function deleteWebinar(
  id: string
): Promise<{ success: boolean; message?: string }> {
  let supaError: any = null;
  try {
    const { error } = await supabase.from('webinars').delete().eq('id', id);
    if (!error) {
      inMemoryWebinars = inMemoryWebinars.filter((w) => w.id !== id);
      emitWebinarUpdate();
      return { success: true };
    }

    supaError = error;
    if (isMissingTableError(error)) {
      return {
        success: false,
        message:
          "Supabase 'webinars' table is not created yet. Run supabase_global_sync_schema.sql in Supabase SQL Editor.",
      };
    }
  } catch (err) {
    supaError = err;
  }

  // Fallback to backend API
  try {
    const token = await getFreshAdminToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await apiFetch('/api/webinars/delete', {
      method: 'POST',
      headers,
      body: JSON.stringify({ id }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) {
      inMemoryWebinars = inMemoryWebinars.filter((w) => w.id !== id);
      emitWebinarUpdate();
      return { success: true };
    }

    return {
      success: false,
      message:
        data?.message ||
        supaError?.message ||
        'Failed to delete webinar from Supabase.',
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        supaError?.message ||
        err?.message ||
        'Failed to delete webinar from Supabase.',
    };
  }
}

/**
 * Toggle webinar publish/draft status directly in Supabase.
 */
export async function toggleWebinarStatus(
  id: string
): Promise<WebinarMutationResult> {
  const existing = inMemoryWebinars.find((w) => w.id === id);
  if (!existing) {
    return { success: false, message: 'Webinar not found.' };
  }

  const newStatus =
    existing.status === 'published' || existing.status === 'upcoming'
      ? 'draft'
      : 'published';
  const now = new Date().toISOString();
  const updatePayload: Record<string, any> =
    newStatus === 'published'
      ? { status: newStatus, published_at: now, updated_at: now }
      : { status: newStatus, updated_at: now };

  let supaError: any = null;
  try {
    let { error } = await supabase
      .from('webinars')
      .update(updatePayload)
      .eq('id', id);

    if (error && isMissingColumnError(error)) {
      const retry = await supabase
        .from('webinars')
        .update({ status: newStatus })
        .eq('id', id);
      error = retry.error;
    }

    if (!error) {
      const updated: Webinar = {
        ...existing,
        status: newStatus,
        publishedAt: newStatus === 'published' ? now : existing.publishedAt,
      };
      inMemoryWebinars = sortWebinarsNewestFirst(
        inMemoryWebinars.map((w) => (w.id === id ? updated : w))
      );
      emitWebinarUpdate();
      return { success: true, webinar: updated };
    }

    supaError = error;
    if (isMissingTableError(error)) {
      return {
        success: false,
        message:
          "Supabase 'webinars' table is not created yet. Run supabase_global_sync_schema.sql in Supabase SQL Editor.",
      };
    }
  } catch (err) {
    supaError = err;
  }

  // Fallback to backend API
  try {
    const token = await getFreshAdminToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await apiFetch('/api/webinars/update', {
      method: 'POST',
      headers,
      body: JSON.stringify({ id, ...updatePayload }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) {
      const updated: Webinar = {
        ...existing,
        status: newStatus,
        publishedAt: newStatus === 'published' ? now : existing.publishedAt,
      };
      inMemoryWebinars = sortWebinarsNewestFirst(
        inMemoryWebinars.map((w) => (w.id === id ? updated : w))
      );
      emitWebinarUpdate();
      return { success: true, webinar: updated };
    }

    return {
      success: false,
      message:
        data?.message ||
        supaError?.message ||
        'Failed to update webinar status in Supabase.',
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        supaError?.message ||
        err?.message ||
        'Failed to update webinar status in Supabase.',
    };
  }
}

/**
 * Reload webinars strictly from Supabase.
 */
export async function resetWebinarsToDefault(): Promise<Webinar[]> {
  return fetchWebinarsFromDb();
}

/**
 * Registrations are persisted in Supabase via webinarRegistrationService.
 */
export function getWebinarRegistrations(): WebinarRegistration[] {
  return [];
}

/**
 * Register a user for a webinar directly in Supabase.
 */
export async function registerForWebinar(data: {
  webinarId: string;
  webinarTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
}): Promise<FormSubmissionResult> {
  const name = data.fullName.trim();
  const email = data.email.trim();
  const phone = data.phone.trim();

  if (!name || !email || !phone || !data.webinarId) {
    return {
      success: false,
      message: 'Please fill in all required fields.',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please provide a valid email address.',
    };
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return {
      success: false,
      message: 'Please provide a valid 10-digit mobile number.',
    };
  }

  try {
    const { error } = await supabase.from('webinar_registrations').insert([
      {
        webinar_id: data.webinarId,
        webinar_title: data.webinarTitle,
        full_name: name,
        email,
        phone,
        message: data.message?.trim() || null,
        registration_type: 'free',
        amount: 0,
        currency: 'INR',
        payment_status: 'not_required',
      },
    ]);

    if (!error) {
      return {
        success: true,
        message: 'Thank you for registering. We will contact you with the webinar details.',
      };
    }
  } catch {
    // Fall back to API below
  }

  try {
    const res = await apiFetch('/api/webinars/register-free', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webinar_id: data.webinarId,
        webinar_title: data.webinarTitle,
        full_name: name,
        email,
        phone,
        message: data.message?.trim(),
      }),
    });
    const resData = await res.json().catch(() => null);
    if (res.ok && resData?.success) {
      return {
        success: true,
        message:
          resData.message ||
          'Thank you for registering. We will contact you with the webinar details.',
      };
    }
    return {
      success: false,
      message: resData?.message || 'Unable to complete registration. Please try again.',
    };
  } catch {
    return {
      success: false,
      message: 'Unable to complete registration right now. Please try again.',
    };
  }
}
