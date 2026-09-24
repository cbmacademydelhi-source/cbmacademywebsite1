import { Webinar, WebinarRegistration, FormSubmissionResult } from '../types';

/**
 * CBM ACADEMY WEBINAR STORAGE
 *
 * NOTE: This is client-side demo storage utilizing browser localStorage.
 * Structured cleanly with TypeScript interfaces so it can be transitioned
 * directly to a persistent database (such as Supabase, Cloudflare D1/KV, or Firestore)
 * in production.
 */

const STORAGE_KEY = 'cbm_webinars_v1';
const REGISTRATIONS_KEY = 'cbm_webinar_registrations_v1';
export const WEBINAR_UPDATE_EVENT = 'cbm_webinars_updated';

// 4 DEMO WEBINARS as specified in requirements
export const DEFAULT_WEBINARS: Webinar[] = [
  {
    id: 'webinar-ai-tools',
    title: 'AI Tools for Digital Marketing',
    description:
      'Learn how modern AI tools can help digital marketers improve productivity and campaign performance.',
    posterUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    type: 'free',
    price: 'FREE',
    date: '28 September 2026',
    time: '6:00 PM',
    duration: '60 Minutes',
    host: 'CBM Academy',
    whatYouWillLearn: [
      'Prompt engineering frameworks tailored for digital performance marketing',
      'Using ChatGPT and Claude for high-converting marketing copywriting',
      'AI image and video asset creation workflows using Midjourney',
      'Automating campaign audience segmentation with AI tools',
    ],
    status: 'published',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'webinar-google-ads',
    title: 'Master Google Ads in 2 Hours',
    description:
      'Learn practical Google Ads campaign setup, targeting and optimization.',
    posterUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    type: 'paid',
    price: 499,
    date: '5 October 2026',
    time: '7:00 PM',
    duration: '2 Hours',
    host: 'CBM Academy',
    whatYouWillLearn: [
      'Full Google Ads account setup and campaign architecture',
      'Mastering Performance Max (PMax) campaigns & smart bidding',
      'Negative keyword sculpting to eliminate ad budget wastage',
      'Conversion tracking via Google Tag Manager and GA4 setup',
    ],
    status: 'published',
    createdAt: '2026-09-16T11:00:00.000Z',
  },
  {
    id: 'webinar-seo-content',
    title: 'SEO & Content Strategy with AI',
    description:
      'Discover modern SEO techniques, generative engine optimization (GEO), and semantic keyword research.',
    posterUrl:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    type: 'free',
    price: 'FREE',
    date: '12 October 2026',
    time: '6:00 PM',
    duration: '90 Minutes',
    host: 'CBM Academy',
    whatYouWillLearn: [
      'Optimizing for AI Overviews, Perplexity and Generative Engine Search',
      'Topical authority clustering and semantic search architecture',
      'Schema markup implementation for knowledge panels',
      'Creating authoritative human-first content that ranks and converts',
    ],
    status: 'published',
    createdAt: '2026-09-17T12:00:00.000Z',
  },
  {
    id: 'webinar-performance-marketing',
    title: 'Performance Marketing Masterclass',
    description:
      'Deep dive into Meta Ads, ROAS optimization, scale-up frameworks, and creative testing.',
    posterUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    type: 'paid',
    price: 999,
    date: '20 October 2026',
    time: '7:00 PM',
    duration: '2 Hours',
    host: 'CBM Academy',
    whatYouWillLearn: [
      'Meta Advantage+ campaigns and algorithm signals',
      'Scaling daily ad spend profitably with sustainable ROAS',
      'Systematic creative testing frameworks: hooks, angles, and CTAs',
      'First-party data capture and attribution in privacy-first environments',
    ],
    status: 'published',
    createdAt: '2026-09-18T14:00:00.000Z',
  },
];

/**
 * Retrieve all webinars from storage (or seed defaults)
 */
export function getWebinars(): Webinar[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WEBINARS));
      return DEFAULT_WEBINARS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WEBINARS));
    return DEFAULT_WEBINARS;
  } catch (err) {
    console.error('Failed to parse webinars from localStorage:', err);
    return DEFAULT_WEBINARS;
  }
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
      id: `webinar-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
    return true;
  } catch (err) {
    console.error('Failed to delete webinar from localStorage:', err);
    return false;
  }
}

/**
 * Toggle webinar publish/draft status
 */
export function toggleWebinarStatus(id: string): Webinar | null {
  const webinars = getWebinars();
  const webinar = webinars.find((w) => w.id === id);
  if (!webinar) return null;

  // If published or upcoming -> switch to draft; if draft or completed -> switch to published
  const newStatus = webinar.status === 'published' || webinar.status === 'upcoming' ? 'draft' : 'published';
  webinar.status = newStatus;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(webinars));
    window.dispatchEvent(new Event(WEBINAR_UPDATE_EVENT));
    return webinar;
  } catch (err) {
    console.error('Failed to toggle webinar status in localStorage:', err);
    return null;
  }
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
