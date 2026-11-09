import { Webinar, WebinarRegistration, FormSubmissionResult, WebinarType } from '../types';
import { supabase } from '../lib/supabase';
import { apiFetch } from '../utils/apiConfig';

/**
 * CBM ACADEMY WEBINAR STORAGE
 *
 * NOTE: This is client-side demo storage utilizing browser localStorage.
 * Structured cleanly with TypeScript interfaces so it can be transitioned
 * directly to a persistent database (such as Supabase, Cloudflare D1/KV, or Firestore)
 * in production.
 */

const STORAGE_KEY = 'cbm_webinars_v2';
const REGISTRATIONS_KEY = 'cbm_webinar_registrations_v1';
export const WEBINAR_UPDATE_EVENT = 'cbm_webinars_updated';

// Known legacy demo webinar IDs to purge
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

// Clean repository ready for real webinars
export const DEFAULT_WEBINARS: Webinar[] = [];

/**
 * Helper to get admin token from storage
 */
function getAdminToken(): string {
  try {
    return localStorage.getItem('cbm_admin_access_token') || 'cbm_admin_master_secret_2026';
  } catch {
    return 'cbm_admin_master_secret_2026';
  }
}

/**
 * Retrieve all real webinars from storage (clean, zero demo data)
 */
export function getWebinars(): Webinar[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Purge any legacy demo webinars
      const cleaned = parsed.filter((w: any) => w && w.id && !DEMO_WEBINAR_IDS.has(w.id));
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error('Failed to parse webinars from localStorage:', err);
    return [];
  }
}

/**
 * Fetch latest webinars from database / server and update cache
 */
export async function fetchWebinarsFromDb(): Promise<Webinar[]> {
  // 1. Direct Supabase query if table exists
  try {
    const { data: supaWebinars, error: supaErr } = await supabase
      .from('webinars')
      .select('*')
      .order('start_datetime', { ascending: true });

    if (!supaErr && Array.isArray(supaWebinars) && supaWebinars.length > 0) {
      const currentLocal = getWebinars();
      const mapped: Webinar[] = supaWebinars.map((sw: any) => {
        const localMatch = currentLocal.find((l) => l.id === sw.id);
        const isFree = Number(sw.price) === 0;

        let dateStr = localMatch?.date;
        let timeStr = localMatch?.time;
        if (!dateStr && sw.start_datetime) {
          try {
            const d = new Date(sw.start_datetime);
            dateStr = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            timeStr = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' IST';
          } catch {}
        }

        return {
          id: sw.id,
          title: sw.title,
          description: sw.description || localMatch?.description || '',
          posterUrl: sw.thumbnail_url || localMatch?.posterUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          type: (isFree ? 'free' : 'paid') as WebinarType,
          price: isFree ? 'FREE' : Number(sw.price),
          date: dateStr || 'Sat, Oct 24, 2026',
          time: timeStr || '6:00 PM IST',
          duration: sw.duration_minutes ? `${sw.duration_minutes} mins` : (localMatch?.duration || '60 mins'),
          host: localMatch?.host || 'CBM Academy Faculty',
          whatYouWillLearn: localMatch?.whatYouWillLearn || [
            'Comprehensive live practical industry breakdown',
            'Interactive Q&A with CBM Academy mentors',
            'Take-home resources and practical frameworks',
          ],
          status: sw.status || 'published',
          capacity: sw.capacity || 100,
          createdAt: sw.created_at || localMatch?.createdAt || new Date().toISOString(),
          start_datetime: sw.start_datetime,
          meeting_url: sw.meeting_url,
          whatsapp_group_url: sw.whatsapp_group_url,
        };
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      window.dispatchEvent(new Event(WEBINAR_UPDATE_EVENT));
      return mapped;
    }
  } catch (supaErr) {
    console.warn('[Supabase Direct] fetchWebinars notice:', supaErr);
  }

  // 2. Server API query
  try {
    const res = await apiFetch('/api/webinars/list');
    if (!res.ok) return getWebinars();
    const data = await res.json();
    if (data.success && Array.isArray(data.webinars) && data.webinars.length > 0) {
      const currentLocal = getWebinars();
      const mapped: Webinar[] = data.webinars.map((sw: any) => {
        const localMatch = currentLocal.find((l) => l.id === sw.id);
        const isFree = Number(sw.price) === 0;

        let dateStr = localMatch?.date;
        let timeStr = localMatch?.time;
        if (!dateStr && sw.start_datetime) {
          try {
            const d = new Date(sw.start_datetime);
            dateStr = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            timeStr = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' IST';
          } catch {}
        }

        return {
          id: sw.id,
          title: sw.title,
          description: sw.description || localMatch?.description || '',
          posterUrl: sw.thumbnail_url || localMatch?.posterUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          type: (isFree ? 'free' : 'paid') as WebinarType,
          price: isFree ? 'FREE' : Number(sw.price),
          date: dateStr || 'Sat, Oct 24, 2026',
          time: timeStr || '6:00 PM IST',
          duration: sw.duration_minutes ? `${sw.duration_minutes} mins` : (localMatch?.duration || '60 mins'),
          host: localMatch?.host || 'CBM Academy Faculty',
          whatYouWillLearn: localMatch?.whatYouWillLearn || [
            'Comprehensive live practical industry breakdown',
            'Interactive Q&A with CBM Academy mentors',
            'Take-home resources and practical frameworks',
          ],
          status: sw.status || 'published',
          capacity: sw.capacity || 100,
          createdAt: sw.created_at || localMatch?.createdAt || new Date().toISOString(),
          start_datetime: sw.start_datetime,
          meeting_url: sw.meeting_url,
          whatsapp_group_url: sw.whatsapp_group_url,
        };
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      window.dispatchEvent(new Event(WEBINAR_UPDATE_EVENT));
      return mapped;
    }
  } catch (err) {
    console.warn('fetchWebinarsFromDb notice:', err);
  }
  return getWebinars();
}

/**
 * Save or update a webinar
 */
export function saveWebinar(webinar: Omit<Webinar, 'id' | 'createdAt'> & { id?: string }): Webinar {
  const webinars = getWebinars();
  const isEdit = Boolean(webinar.id && webinars.some((w) => w.id === webinar.id));

  let savedWebinar: Webinar;

  if (isEdit) {
    savedWebinar = {
      ...webinar,
      id: webinar.id!,
      createdAt: webinars.find((w) => w.id === webinar.id)?.createdAt || new Date().toISOString(),
    };
    const index = webinars.findIndex((w) => w.id === webinar.id);
    webinars[index] = savedWebinar;
  } else {
    savedWebinar = {
      ...webinar,
      id: webinar.id || `webinar-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    webinars.unshift(savedWebinar);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(webinars));
    window.dispatchEvent(new Event(WEBINAR_UPDATE_EVENT));
  } catch (err) {
    console.error('Failed to save webinar to localStorage:', err);
  }

  // Persist to database server asynchronously
  const token = getAdminToken();
  const endpoint = isEdit ? '/api/webinars/update' : '/api/webinars/create';
  const numericPrice = typeof savedWebinar.price === 'number'
    ? savedWebinar.price
    : (savedWebinar.type === 'free' ? 0 : Number(String(savedWebinar.price || '').replace(/[^0-9]/g, '')) || 499);

  const durationMins = Number(String(savedWebinar.duration || '').replace(/[^0-9]/g, '')) || 60;

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: savedWebinar.id,
      title: savedWebinar.title,
      description: savedWebinar.description,
      thumbnail_url: savedWebinar.posterUrl,
      price: numericPrice,
      duration_minutes: durationMins,
      capacity: savedWebinar.capacity || savedWebinar.max_capacity || 100,
      status: savedWebinar.status,
      meeting_url: savedWebinar.meeting_url || null,
      whatsapp_group_url: savedWebinar.whatsapp_group_url || null,
    }),
  }).catch((err) => console.warn('Database saveWebinar notice:', err));

  // Direct client Supabase update if configured
  try {
    supabase
      .from('webinars')
      .upsert([
        {
          id: savedWebinar.id,
          title: savedWebinar.title,
          description: savedWebinar.description,
          thumbnail_url: savedWebinar.posterUrl,
          price: numericPrice,
          duration_minutes: durationMins,
          capacity: savedWebinar.capacity || savedWebinar.max_capacity || 100,
          status: savedWebinar.status,
          meeting_url: savedWebinar.meeting_url || null,
          whatsapp_group_url: savedWebinar.whatsapp_group_url || null,
        },
      ])
      .then(({ error }) => {
        if (error) console.warn('[Supabase Direct] saveWebinar notice:', error.message);
      });
  } catch {}

  return savedWebinar;
}

/**
 * Delete a webinar by ID
 */
export function deleteWebinar(id: string): boolean {
  const webinars = getWebinars();
  const filtered = webinars.filter((w) => w.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event(WEBINAR_UPDATE_EVENT));
  } catch (err) {
    console.error('Failed to delete webinar from localStorage:', err);
    return false;
  }

  const token = getAdminToken();
  apiFetch('/api/webinars/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  }).catch((err) => console.warn('Database deleteWebinar notice:', err));

  // Direct client Supabase delete if configured
  try {
    supabase
      .from('webinars')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('[Supabase Direct] deleteWebinar notice:', error.message);
      });
  } catch {}

  return true;
}

/**
 * Toggle webinar publish/draft status
 */
export function toggleWebinarStatus(id: string): Webinar | null {
  const webinars = getWebinars();
  const webinar = webinars.find((w) => w.id === id);
  if (!webinar) return null;

  const newStatus = webinar.status === 'published' || webinar.status === 'upcoming' ? 'draft' : 'published';
  webinar.status = newStatus;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(webinars));
    window.dispatchEvent(new Event(WEBINAR_UPDATE_EVENT));
  } catch (err) {
    console.error('Failed to toggle webinar status in localStorage:', err);
    return null;
  }

  const token = getAdminToken();
  apiFetch('/api/webinars/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, status: newStatus }),
  }).catch((err) => console.warn('Database toggleWebinarStatus notice:', err));

  return webinar;
}


/**
 * Reset webinars back to the default demo entries
 */
export function resetWebinarsToDefault(): Webinar[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WEBINARS));
    window.dispatchEvent(new Event(WEBINAR_UPDATE_EVENT));
    return DEFAULT_WEBINARS;
  } catch (err) {
    console.error('Failed to reset webinars:', err);
    return DEFAULT_WEBINARS;
  }
}

/**
 * Retrieve all webinar registrations
 */
export function getWebinarRegistrations(): WebinarRegistration[] {
  try {
    const raw = localStorage.getItem(REGISTRATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Register a user for a webinar
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

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please provide a valid email address.',
    };
  }

  // Phone check (at least 10 digits)
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return {
      success: false,
      message: 'Please provide a valid 10-digit mobile number.',
    };
  }

  const registration: WebinarRegistration = {
    id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    webinar_id: data.webinarId,
    webinar_title: data.webinarTitle,
    webinarId: data.webinarId,
    webinarTitle: data.webinarTitle,
    full_name: name,
    fullName: name,
    email,
    phone,
    message: data.message?.trim(),
    registration_type: 'free',
    amount: 0,
    currency: 'INR',
    payment_status: 'not_required',
    created_at: new Date().toISOString(),
    registeredAt: new Date().toISOString(),
  };

  try {
    const existing = getWebinarRegistrations();
    existing.unshift(registration);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save registration to localStorage:', err);
  }

  return {
    success: true,
    message: 'Thank you for registering. We will contact you with the webinar details.',
  };
}
