export type SiteMediaPageKey = 'home' | 'courses' | 'about' | 'blog' | 'popups';

export interface SiteMediaPageMeta {
  key: SiteMediaPageKey;
  label: string;
  description: string;
}

export interface SiteMediaSlot {
  id: string;
  page: SiteMediaPageKey;
  pageLabel: string;
  imageNumber: number;
  sectionLabel: string;
  description: string;
  defaultUrl: string;
  aspectHint: string;
}

export const DEFAULT_SITE_LOGO_URL =
  '/assets/aistudio/CBM_Agency_Logo.png_ae66f4fb.png';

export const SITE_LOGO_SLOT_ID = 'site-logo';

export const SITE_LOGO_SLOT = {
  id: SITE_LOGO_SLOT_ID,
  label: 'CBM Academy Logo',
  description:
    'Displayed across the Header, Mobile Menu, Footer, Popups, Certificates, Admin Login, and Browser Favicon.',
  defaultUrl: DEFAULT_SITE_LOGO_URL,
  recommendedHint: 'Transparent PNG or WebP (max 10 MB)',
} as const;

export const SITE_MEDIA_PAGES: SiteMediaPageMeta[] = [
  {
    key: 'home',
    label: 'Home',
    description: 'Homepage hero, Why Choose CBM, How You’ll Learn, and student testimonial images.',
  },
  {
    key: 'courses',
    label: 'Courses',
    description: 'AI Pro Digital Marketing course banner, business opportunities, and career cards.',
  },
  {
    key: 'about',
    label: 'About & Services',
    description: 'About CBM Academy, Who We Are, AI + Digital Marketing, and Agency Services visuals.',
  },
  {
    key: 'blog',
    label: 'Blog',
    description: 'Featured cover images for the Digital Marketing & AI Insights articles.',
  },
  {
    key: 'popups',
    label: 'Popups',
    description: 'Featured promotional popup visual shown to website visitors.',
  },
];

export const SITE_MEDIA_SLOTS: SiteMediaSlot[] = [
  // =========================================================================
  // HOME PAGE (Exact Top-to-Bottom Sequence: Image 1 to Image 16)
  // =========================================================================
  {
    id: 'home-2-why-choose-cbm',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 1,
    sectionLabel: 'Why Choose CBM — Classroom Photo',
    description: 'Students working on computers photo in the Why Choose CBM section.',
    defaultUrl: '/assets/cbm_photos/why_choose_cbm_students.jpg',
    aspectHint: '3:2 Landscape',
  },
  {
    id: 'home-3-why-choose-banner',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 2,
    sectionLabel: 'Why Choose CBM — Full-Width Course Banner',
    description: 'Wide landscape course banner below the Why Choose CBM feature cards.',
    defaultUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop',
    aspectHint: '21:8 Wide Banner',
  },
  {
    id: 'home-4-grow-your-career',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 3,
    sectionLabel: 'Grow Your Career — Main Feature Photo',
    description: 'Main training photo in the "Learn Skills. Build Projects. Grow Your Career." section.',
    defaultUrl: '/assets/cbm_photos/grow_your_career_man.jpg',
    aspectHint: '16:11 Landscape',
  },
  {
    id: 'home-5-learn-step-1',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 4,
    sectionLabel: 'How You’ll Learn — Step 01 Thumbnail',
    description: 'Small thumbnail for Step 01: Four-Month Enhanced Course.',
    defaultUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=320&q=80',
    aspectHint: '4:3 Thumbnail',
  },
  {
    id: 'home-6-learn-step-2',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 5,
    sectionLabel: 'How You’ll Learn — Step 02 Thumbnail',
    description: 'Small thumbnail for Step 02: Alternate-Day Classes.',
    defaultUrl:
      'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=320&q=80',
    aspectHint: '4:3 Thumbnail',
  },
  {
    id: 'home-7-learn-step-3',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 6,
    sectionLabel: 'How You’ll Learn — Step 03 Thumbnail',
    description: 'Small thumbnail for Step 03: AI-Integrated Workflows.',
    defaultUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=320&q=80',
    aspectHint: '4:3 Thumbnail',
  },
  {
    id: 'home-8-learn-step-4',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 7,
    sectionLabel: 'How You’ll Learn — Step 04 Thumbnail',
    description: 'Small thumbnail for Step 04: Small, Focused Batches.',
    defaultUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=320&q=80',
    aspectHint: '4:3 Thumbnail',
  },
  {
    id: 'home-9-learn-step-5',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 8,
    sectionLabel: 'How You’ll Learn — Step 05 Thumbnail',
    description: 'Small thumbnail for Step 05: Beyond Digital Marketing.',
    defaultUrl:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=320&q=80',
    aspectHint: '4:3 Thumbnail',
  },
  {
    id: 'home-10-testimonial-1',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 9,
    sectionLabel: 'Testimonials — Ayesha Khan',
    description: 'Student avatar for Ayesha Khan in the Testimonials carousel.',
    defaultUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop&crop=faces',
    aspectHint: '1:1 Avatar',
  },
  {
    id: 'home-11-testimonial-2',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 10,
    sectionLabel: 'Testimonials — Rahul Sharma',
    description: 'Student avatar for Rahul Sharma in the Testimonials carousel.',
    defaultUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop&crop=faces',
    aspectHint: '1:1 Avatar',
  },
  {
    id: 'home-12-testimonial-3',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 11,
    sectionLabel: 'Testimonials — Simran Kapoor',
    description: 'Student avatar for Simran Kapoor in the Testimonials carousel.',
    defaultUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop&crop=faces',
    aspectHint: '1:1 Avatar',
  },
  {
    id: 'home-13-testimonial-4',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 12,
    sectionLabel: 'Testimonials — Rohan Verma',
    description: 'Student avatar for Rohan Verma in the Testimonials carousel.',
    defaultUrl:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop&crop=faces',
    aspectHint: '1:1 Avatar',
  },
  {
    id: 'home-14-testimonial-5',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 13,
    sectionLabel: 'Testimonials — Amit Joshi',
    description: 'Student avatar for Amit Joshi in the Testimonials carousel.',
    defaultUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop&crop=faces',
    aspectHint: '1:1 Avatar',
  },
  {
    id: 'home-15-testimonial-6',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 14,
    sectionLabel: 'Testimonials — Priya Patel',
    description: 'Student avatar for Priya Patel in the Testimonials carousel.',
    defaultUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop&crop=faces',
    aspectHint: '1:1 Avatar',
  },
  {
    id: 'home-16-testimonial-7',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 15,
    sectionLabel: 'Testimonials — Vikram Malhotra',
    description: 'Student avatar for Vikram Malhotra in the Testimonials carousel.',
    defaultUrl:
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=300&auto=format&fit=crop&crop=faces',
    aspectHint: '1:1 Avatar',
  },
  {
    id: 'home-17-testimonial-8',
    page: 'home',
    pageLabel: 'Home',
    imageNumber: 16,
    sectionLabel: 'Testimonials — Neha Gupta',
    description: 'Student avatar for Neha Gupta in the Testimonials carousel.',
    defaultUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop&crop=faces',
    aspectHint: '1:1 Avatar',
  },

  // =========================================================================
  // COURSES PAGE (Exact Top-to-Bottom Sequence: Image 1)
  // =========================================================================
  {
    id: 'courses-1-hero-poster',
    page: 'courses',
    pageLabel: 'Courses',
    imageNumber: 1,
    sectionLabel: 'AI Pro Digital Marketing Course — Main Banner',
    description: 'Wide landscape banner photo at the top of the Courses page.',
    defaultUrl: '/assets/cbm_photos/courses_group_table.jpg',
    aspectHint: '21:8 Wide Banner',
  },

  // =========================================================================
  // ABOUT & SERVICES PAGE (Exact Top-to-Bottom Sequence: Image 1 to Image 4)
  // =========================================================================
  {
    id: 'about-1-hero-students',
    page: 'about',
    pageLabel: 'About',
    imageNumber: 1,
    sectionLabel: 'About CBM Academy — Hero Photo',
    description: 'Students working together on computers at the top of the About page.',
    defaultUrl: '/assets/cbm_photos/about_cbm_students_together.jpg',
    aspectHint: '3:2 Landscape',
  },
  {
    id: 'about-2-who-we-are',
    page: 'about',
    pageLabel: 'About',
    imageNumber: 2,
    sectionLabel: 'Who We Are — Classroom Photo',
    description: 'CBM Academy classroom photo in the Who We Are section.',
    defaultUrl: '/assets/cbm_photos/who_we_are_empty_classroom.jpg',
    aspectHint: '3:2 Landscape',
  },
  {
    id: 'about-3-ai-meets-dm',
    page: 'about',
    pageLabel: 'About',
    imageNumber: 3,
    sectionLabel: 'Digital Marketing Meets AI — Visual',
    description: 'Feature visual for the AI + Digital Marketing section.',
    defaultUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    aspectHint: '3:2 Landscape',
  },
  {
    id: 'about-4-agency-services',
    page: 'about',
    pageLabel: 'About',
    imageNumber: 4,
    sectionLabel: 'Digital Marketing Services — Agency Photo',
    description: 'Visual for the Digital Marketing Agency in Okhla, New Delhi section.',
    defaultUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    aspectHint: '3:2 Landscape',
  },

  // =========================================================================
  // BLOG PAGE (Exact Sequence: Image 1 to Image 3)
  // =========================================================================
  {
    id: 'blog-1-geo-seo',
    page: 'blog',
    pageLabel: 'Blog',
    imageNumber: 1,
    sectionLabel: 'Article 1 — Generative Engine Optimization (GEO)',
    description: 'Featured cover image for the first blog article.',
    defaultUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    aspectHint: '16:9 Cover',
  },
  {
    id: 'blog-2-meta-ads',
    page: 'blog',
    pageLabel: 'Blog',
    imageNumber: 2,
    sectionLabel: 'Article 2 — Scaling Meta Ads to 4.8x ROAS',
    description: 'Featured cover image for the second blog article.',
    defaultUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    aspectHint: '16:9 Cover',
  },
  {
    id: 'blog-3-ai-stack',
    page: 'blog',
    pageLabel: 'Blog',
    imageNumber: 3,
    sectionLabel: 'Article 3 — Modern Digital Marketer’s AI Stack',
    description: 'Featured cover image for the third blog article.',
    defaultUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    aspectHint: '16:9 Cover',
  },

  // =========================================================================
  // POPUPS (Exact Sequence: Image 1)
  // =========================================================================
  {
    id: 'popup-1-promo-webinar',
    page: 'popups',
    pageLabel: 'Popups',
    imageNumber: 1,
    sectionLabel: 'Course / Webinar Promo Popup — Featured Visual',
    description: 'AI robot visual shown on the left side of the promotional popup.',
    defaultUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    aspectHint: 'Vertical / Square',
  },
];

export const SITE_MEDIA_SLOT_MAP: Record<string, SiteMediaSlot> = Object.fromEntries(
  SITE_MEDIA_SLOTS.map((slot) => [slot.id, slot])
);

export const ALLOWED_SITE_MEDIA_SLOT_IDS: Set<string> = new Set([
  SITE_LOGO_SLOT_ID,
  ...SITE_MEDIA_SLOTS.map((s) => s.id),
]);

/**
 * Validates that a dynamic image URL is safe to render in <img src> and <link href>.
 * Blocks javascript:, data:, vbscript:, protocol-relative //, and arbitrary local paths.
 */
export function isSafeMediaUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > 2048) return false;
  if (trimmed.startsWith('/uploads/site-media/') || trimmed.startsWith('/assets/')) {
    return !trimmed.includes('..') && !trimmed.includes('\\');
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
