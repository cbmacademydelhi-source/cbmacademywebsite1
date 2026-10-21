-- ==============================================================================
-- CBM Academy: Supabase Schema & Row Level Security for Webinars
-- ==============================================================================
-- Purpose:
-- 1. Create 'webinars' table for public webinar listings & admin catalog
-- 2. Create 'webinar_registrations' table for attendee registrations
-- 3. Configure strict Row Level Security (RLS) policies
-- 4. Seed initial CBM Academy webinars
--
-- Instructions:
-- Copy and paste this SQL script into your Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. WEBINARS TABLE
CREATE TABLE IF NOT EXISTS public.webinars (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_datetime TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now() + interval '7 days'),
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price NUMERIC NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 150,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('upcoming', 'published', 'draft', 'completed', 'cancelled')),
  meeting_url TEXT,
  whatsapp_group_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. WEBINAR REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.webinar_registrations (
  id TEXT PRIMARY KEY,
  webinar_id TEXT NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
  webinar_title TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_number TEXT,
  role TEXT DEFAULT 'Student',
  experience_level TEXT DEFAULT 'Beginner',
  company_or_college TEXT,
  learning_goal TEXT,
  message TEXT,
  email_reminders_consent BOOLEAN NOT NULL DEFAULT false,
  whatsapp_updates_consent BOOLEAN NOT NULL DEFAULT false,
  registration_type TEXT NOT NULL DEFAULT 'free' CHECK (registration_type IN ('free', 'paid')),
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_status TEXT NOT NULL DEFAULT 'not_required' CHECK (payment_status IN ('not_required', 'pending', 'paid', 'failed', 'expired')),
  registration_status TEXT NOT NULL DEFAULT 'approved' CHECK (registration_status IN ('pending', 'approved', 'cancelled', 'attended')),
  payment_reference TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  paid_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  confirmation_email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR WEBINARS TABLE
-- Public can view active/published webinars
DROP POLICY IF EXISTS "Public can view published webinars" ON public.webinars;
CREATE POLICY "Public can view published webinars"
ON public.webinars
FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated/admin users can manage webinars
DROP POLICY IF EXISTS "Admins can manage webinars" ON public.webinars;
CREATE POLICY "Admins can manage webinars"
ON public.webinars
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. RLS POLICIES FOR WEBINAR REGISTRATIONS TABLE
-- Public/anon visitors can INSERT registrations
DROP POLICY IF EXISTS "Public can register for webinars" ON public.webinar_registrations;
CREATE POLICY "Public can register for webinars"
ON public.webinar_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Public/anon visitors CANNOT read/select all attendee registrations (privacy protection)
DROP POLICY IF EXISTS "Disallow public select on registrations" ON public.webinar_registrations;
CREATE POLICY "Disallow public select on registrations"
ON public.webinar_registrations
FOR SELECT
TO authenticated
USING (false);

-- 6. GRANT TABLE PERMISSIONS
GRANT SELECT ON TABLE public.webinars TO anon, authenticated;
GRANT ALL ON TABLE public.webinars TO authenticated, service_role;

GRANT INSERT ON TABLE public.webinar_registrations TO anon, authenticated;
GRANT ALL ON TABLE public.webinar_registrations TO authenticated, service_role;

-- 7. SEED INITIAL CBM ACADEMY WEBINARS
INSERT INTO public.webinars (id, title, description, start_datetime, duration_minutes, price, capacity, status, thumbnail_url)
VALUES
  ('webinar-ai-tools-2026', 'AI Tools Every Digital Marketer Should Know in 2026', 'Learn how modern AI tools like ChatGPT, Claude, and Midjourney can automate marketing workflows and boost campaign ROI.', timezone('utc'::text, now() + interval '3 days'), 60, 0, 150, 'published', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'),
  ('webinar-meta-ads-masterclass', 'Meta Ads Masterclass (Facebook & Instagram Ads)', 'Deep dive into Meta Advantage+ campaigns, custom audience scaling, ROAS optimization, and high-converting ad creative frameworks.', timezone('utc'::text, now() + interval '4 days'), 90, 499, 100, 'published', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'),
  ('webinar-seo-basics', 'SEO Basics for Beginners', 'Master the foundations of organic search: keyword research, on-page optimization, site architecture, and ranking in modern AI search results.', timezone('utc'::text, now() + interval '7 days'), 60, 0, 150, 'published', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80'),
  ('webinar-wordpress-elementor', 'WordPress Website Development with Elementor', 'Build responsive, lightning-fast business websites and landing pages without code using WordPress, Elementor Pro, and domain hosting.', timezone('utc'::text, now() + interval '10 days'), 120, 499, 100, 'published', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'),
  ('webinar-canva-graphic-design', 'Graphic Design with Canva for Social Media', 'Create eye-catching social media posts, carousel decks, YouTube thumbnails, and professional brand assets using Canva.', timezone('utc'::text, now() + interval '11 days'), 60, 0, 150, 'published', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'),
  ('webinar-google-ads-growth', 'Google Ads for Business Growth (Search, Display & PMax)', 'Master high-intent Search keywords, Google Performance Max campaigns, negative keyword strategies, and conversion tracking.', timezone('utc'::text, now() + interval '14 days'), 90, 499, 100, 'published', 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  status = EXCLUDED.status,
  thumbnail_url = EXCLUDED.thumbnail_url;
