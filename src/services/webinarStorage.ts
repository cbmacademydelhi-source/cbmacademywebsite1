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

// 12 WEBINARS: 7 FREE, 5 PAID
export const DEFAULT_WEBINARS: Webinar[] = [
  {
    id: 'webinar-ai-tools-2026',
    title: 'AI Tools Every Digital Marketer Should Know in 2026',
    description:
      'Learn how modern AI tools like ChatGPT, Claude, and Midjourney can automate marketing workflows and boost campaign ROI.',
    posterUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    type: 'free',
    price: 'FREE',
    date: 'Sat, Oct 24, 2026',
    time: '6:00 PM IST',
    duration: '60 mins',
    host: 'CBM Academy Faculty',
    whatYouWillLearn: [
      'Prompt engineering frameworks tailored for performance marketing',
      'Using ChatGPT & Claude for high-converting marketing copywriting',
      'AI image and creative asset workflows using Midjourney & Ideogram',
      'Automating audience segmentation and competitive research with AI',
    ],
    status: 'published',
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'webinar-meta-ads-masterclass',
    title: 'Meta Ads Masterclass (Facebook & Instagram Ads)',
    description:
      'Deep dive into Meta Advantage+ campaigns, custom audience scaling, ROAS optimization, and high-converting ad creative frameworks.',
    posterUrl:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    type: 'paid',
    price: 499,
    date: 'Sun, Oct 25, 2026',
    time: '7:00 PM IST',
    duration: '90 mins',
    host: 'CBM Academy Performance Lead',
    whatYouWillLearn: [
      'Meta Advantage+ campaign structure and machine learning signals',
      'Scaling daily ad spend profitably with sustainable ROAS metrics',
      'Systematic creative testing frameworks: hooks, angles, and CTAs',
      'First-party conversion API (CAPI) setup and attribution tracking',
    ],
    status: 'published',
    createdAt: '2026-10-02T11:00:00.000Z',
  },
  {
    id: 'webinar-seo-basics',
    title: 'SEO Basics for Beginners',
    description:
      'Master the foundations of organic search: keyword research, on-page optimization, site architecture, and ranking in modern AI search results.',
    posterUrl:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    type: 'free',
    price: 'FREE',
    date: 'Wed, Oct 28, 2026',
    time: '6:30 PM IST',
    duration: '60 mins',
    host: 'CBM Academy SEO Director',
    whatYouWillLearn: [
      'Keyword intent mapping with Semrush and free Google tools',
      'On-page title, meta, heading, and internal linking best practices',
      'Understanding Google AI Overviews and Generative Engine Optimization',
      'Fixing common technical crawl errors on beginner websites',
    ],
    status: 'published',
    createdAt: '2026-10-03T12:00:00.000Z',
  },
  {
    id: 'webinar-wordpress-elementor',
    title: 'WordPress Website Development with Elementor',
    description:
      'Build responsive, lightning-fast business websites and landing pages without code using WordPress, Elementor Pro, and domain hosting.',
    posterUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    type: 'paid',
    price: 499,
    date: 'Sat, Oct 31, 2026',
    time: '5:00 PM IST',
    duration: '2 hours',
    host: 'CBM Academy Web Lead',
    whatYouWillLearn: [
      'Domain, hosting setup and clean WordPress installation',
      'Designing pixel-perfect responsive layouts with Elementor',
      'Form integration, WhatsApp chat widgets, and lead capture hooks',
      'Speed optimization, caching, and mobile responsiveness testing',
    ],
    status: 'published',
    createdAt: '2026-10-04T13:00:00.000Z',
  },
  {
    id: 'webinar-canva-graphic-design',
    title: 'Graphic Design with Canva for Social Media',
    description:
      'Create eye-catching social media posts, carousel decks, YouTube thumbnails, and professional brand assets using Canva.',
    posterUrl:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    type: 'free',
    price: 'FREE',
    date: 'Sun, Nov 1, 2026',
    time: '6:00 PM IST',
    duration: '60 mins',
    host: 'CBM Creative Team',
    whatYouWillLearn: [
      'Visual hierarchy, font pairing rules, and color contrast theory',
      'Designing multi-slide high-engagement Instagram carousels',
      'Creating click-worthy YouTube thumbnails and banner art',
      'Leveraging Canva Magic Studio AI tools for rapid creative output',
    ],
    status: 'published',
    createdAt: '2026-10-05T14:00:00.000Z',
  },
  {
    id: 'webinar-google-ads-growth',
    title: 'Google Ads for Business Growth',
    description:
      'Practical campaign architecture, search keyword match types, negative keywords, Quality Score optimization, and high-ROI bidding.',
    posterUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    type: 'paid',
    price: 499,
    date: 'Sat, Nov 7, 2026',
    time: '7:00 PM IST',
    duration: '90 mins',
    host: 'CBM Ads Specialist',
    whatYouWillLearn: [
      'Google Search campaigns from keyword research to live launch',
      'Negative keyword sculpting to protect ad budget from bad clicks',
      'Quality Score secrets: landing page relevance and CTR boosting',
      'Conversion tracking with Google Tag Manager and GA4',
    ],
    status: 'published',
    createdAt: '2026-10-06T15:00:00.000Z',
  },
  {
    id: 'webinar-content-copywriting-ai',
    title: 'Content Writing & Copywriting with AI',
    description:
      'Learn copywriting frameworks (AIDA, PAS) combined with AI prompt workflows to produce persuasive articles, landing page copy, and ad headlines.',
    posterUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    type: 'free',
    price: 'FREE',
    date: 'Sun, Nov 8, 2026',
    time: '6:00 PM IST',
    duration: '60 mins',
    host: 'CBM Academy Content Team',
    whatYouWillLearn: [
      'Classic direct-response formulas adapted for modern web copy',
      'Writing human-grade long-form blog articles with AI assistance',
      'Hook generation for social media and video scripts',
      'Editing out generic AI cliches to preserve brand voice',
    ],
    status: 'published',
    createdAt: '2026-10-07T16:00:00.000Z',
  },
  {
    id: 'webinar-linkedin-branding',
    title: 'LinkedIn Personal Branding for Students & Marketers',
    description:
      'Build an influential personal profile on LinkedIn that attracts recruiter inmails, freelance clients, and industry opportunities.',
    posterUrl:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    type: 'free',
    price: 'FREE',
    date: 'Wed, Nov 11, 2026',
    time: '7:30 PM IST',
    duration: '60 mins',
    host: 'CBM Career Desk',
    whatYouWillLearn: [
      'Profile optimization: headline, banner, about section and featured slots',
      'Content ideation strategy to earn consistent impressions and comments',
      'Direct messaging frameworks to connect with marketing directors',
      'Turning profile visibility into freelance leads and job interviews',
    ],
    status: 'published',
    createdAt: '2026-10-08T17:00:00.000Z',
  },
  {
    id: 'webinar-email-automation',
    title: 'Email Marketing & Automation Essentials',
    description:
      'Design automated welcome flows, abandoned cart emails, and newsletter sequences that generate revenue on autopilot.',
    posterUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    type: 'free',
    price: 'FREE',
    date: 'Sat, Nov 14, 2026',
    time: '6:00 PM IST',
    duration: '60 mins',
    host: 'CBM CRM Lead',
    whatYouWillLearn: [
      'List building tactics and lead magnet delivery setup',
      'Writing subject lines that achieve 40%+ open rates',
      'Building automated drip nurture sequences',
      'Email deliverability and avoiding spam filters',
    ],
    status: 'published',
    createdAt: '2026-10-09T18:00:00.000Z',
  },
  {
    id: 'webinar-youtube-growth',
    title: 'YouTube Growth & Video SEO Blueprint',
    description:
      'Learn how to find trending topics, optimize video tags, design high-CTR thumbnails, and rank in YouTube search.',
    posterUrl:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    type: 'free',
    price: 'FREE',
    date: 'Sun, Nov 15, 2026',
    time: '6:00 PM IST',
    duration: '60 mins',
    host: 'CBM Video Media Team',
    whatYouWillLearn: [
      'YouTube algorithm signals: CTR and Average Percentage Viewed (APV)',
      'Keyword research with TubeBuddy and VidIQ',
      'Structuring the first 30 seconds of a video to prevent audience drop-off',
      'Monetization strategies: AdSense, sponsorships, and affiliate links',
    ],
    status: 'published',
    createdAt: '2026-10-10T19:00:00.000Z',
  },
  {
    id: 'webinar-ecommerce-scaling',
    title: 'E-Commerce Dropshipping & Scaling Masterclass',
    description:
      'From product research to profitable Meta Ads testing: master Shopify store setup, Indian COD fulfillment, and scaling winners.',
    posterUrl:
      'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    type: 'paid',
    price: 499,
    date: 'Sat, Nov 21, 2026',
    time: '7:00 PM IST',
    duration: '2 hours',
    host: 'CBM E-Com Specialist',
    whatYouWillLearn: [
      'Winning product validation criteria and competitor spy tools',
      'Shopify high-converting store setup with Indian payment gateways',
      'Managing RTO (Return to Origin) for Cash on Delivery in India',
      'Scaling Meta and TikTok Ads profitably for physical products',
    ],
    status: 'published',
    createdAt: '2026-10-11T20:00:00.000Z',
  },
  {
    id: 'webinar-ga4-analytics',
    title: 'Data Analytics for Marketers: GA4 & Looker Studio',
    description:
      'Turn raw numbers into actionable growth insights. Set up Google Analytics 4 custom events and build executive Looker Studio dashboards.',
    posterUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    type: 'paid',
    price: 499,
    date: 'Sun, Nov 22, 2026',
    time: '7:00 PM IST',
    duration: '90 mins',
    host: 'CBM Analytics Director',
    whatYouWillLearn: [
      'GA4 event-driven data model vs old Universal Analytics',
      'Creating custom conversion events and tracking user funnels',
      'Building live client reporting dashboards in Looker Studio',
      'Calculating blended CAC, LTV, and true campaign ROAS',
    ],
    status: 'published',
    createdAt: '2026-10-12T21:00:00.000Z',
  },
];

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

      // Merge defaults if not on server yet
      for (const def of DEFAULT_WEBINARS) {
        if (!mapped.some((m) => m.id === def.id)) {
          mapped.push(def);
        }
      }

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
