-- ==============================================================================
-- CBM Academy - Webinar Registration & Automation System
-- Database Schema for PostgreSQL / Supabase
-- ==============================================================================

-- 1. WEBINARS TABLE
CREATE TABLE IF NOT EXISTS webinars (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price NUMERIC NOT NULL DEFAULT 0,
  registration_deadline TIMESTAMPTZ,
  capacity INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'published', 'draft', 'completed', 'cancelled')),
  meeting_url TEXT,
  whatsapp_group_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Upgrade existing webinars table if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'start_datetime') THEN
    ALTER TABLE webinars ADD COLUMN start_datetime TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'timezone') THEN
    ALTER TABLE webinars ADD COLUMN timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'duration_minutes') THEN
    ALTER TABLE webinars ADD COLUMN duration_minutes INTEGER NOT NULL DEFAULT 60;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'whatsapp_group_url') THEN
    ALTER TABLE webinars ADD COLUMN whatsapp_group_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'meeting_url') THEN
    ALTER TABLE webinars ADD COLUMN meeting_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'thumbnail_url') THEN
    ALTER TABLE webinars ADD COLUMN thumbnail_url TEXT;
  END IF;
END $$;

-- 2. WEBINAR REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS webinar_registrations (
  id TEXT PRIMARY KEY,
  webinar_id TEXT NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Student' CHECK (role IN ('Student', 'Working Professional', 'Business Owner', 'Freelancer', 'Other')),
  experience_level TEXT NOT NULL DEFAULT 'Beginner' CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced')),
  company_or_college TEXT,
  learning_goal TEXT,
  email_reminders_consent BOOLEAN NOT NULL DEFAULT false,
  whatsapp_updates_consent BOOLEAN NOT NULL DEFAULT false,
  registration_status TEXT NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'approved', 'cancelled', 'attended')),
  payment_status TEXT NOT NULL DEFAULT 'not_required' CHECK (payment_status IN ('not_required', 'pending', 'paid', 'failed', 'expired')),
  payment_reference TEXT,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  confirmation_email_sent_at TIMESTAMPTZ,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  razorpay_qr_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  webinar_title TEXT
);

-- Upgrade existing webinar_registrations table columns if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'whatsapp_number') THEN
    ALTER TABLE webinar_registrations ADD COLUMN whatsapp_number TEXT;
    UPDATE webinar_registrations SET whatsapp_number = phone WHERE whatsapp_number IS NULL AND phone IS NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'role') THEN
    ALTER TABLE webinar_registrations ADD COLUMN role TEXT NOT NULL DEFAULT 'Student';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'experience_level') THEN
    ALTER TABLE webinar_registrations ADD COLUMN experience_level TEXT NOT NULL DEFAULT 'Beginner';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'company_or_college') THEN
    ALTER TABLE webinar_registrations ADD COLUMN company_or_college TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'learning_goal') THEN
    ALTER TABLE webinar_registrations ADD COLUMN learning_goal TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'email_reminders_consent') THEN
    ALTER TABLE webinar_registrations ADD COLUMN email_reminders_consent BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'whatsapp_updates_consent') THEN
    ALTER TABLE webinar_registrations ADD COLUMN whatsapp_updates_consent BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'payment_reference') THEN
    ALTER TABLE webinar_registrations ADD COLUMN payment_reference TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'registered_at') THEN
    ALTER TABLE webinar_registrations ADD COLUMN registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'confirmation_email_sent_at') THEN
    ALTER TABLE webinar_registrations ADD COLUMN confirmation_email_sent_at TIMESTAMPTZ;
  END IF;
END $$;

-- Duplicate registration prevention constraint (same email cannot register twice for same webinar)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_webinar_registration_email'
  ) THEN
    ALTER TABLE webinar_registrations ADD CONSTRAINT uq_webinar_registration_email UNIQUE (webinar_id, email);
  END IF;
END $$;

-- 3. REMINDER LOGS TABLE (For automated email reminders)
CREATE TABLE IF NOT EXISTS reminder_logs (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES webinar_registrations(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('24h_before', '1h_before', '15m_before')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed', 'skipped')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_reminder_log_per_type UNIQUE (registration_id, reminder_type)
);

-- Indexes for lightning fast queries, search, and reminder checks
CREATE INDEX IF NOT EXISTS idx_webinars_start_datetime ON webinars(start_datetime);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON webinars(status);

CREATE INDEX IF NOT EXISTS idx_webinar_reg_webinar_id ON webinar_registrations(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_email ON webinar_registrations(email);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_payment_status ON webinar_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_reg_status ON webinar_registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_created_at ON webinar_registrations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reminder_logs_reg_id ON reminder_logs(registration_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_status ON reminder_logs(delivery_status);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_scheduled ON reminder_logs(scheduled_at);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;

-- 1. Webinars Policies:
-- Public can read published/upcoming webinars
DROP POLICY IF EXISTS "Public can view published webinars" ON webinars;
CREATE POLICY "Public can view published webinars"
ON webinars
FOR SELECT
USING (status IN ('upcoming', 'published'));

-- Service role has full access to webinars
DROP POLICY IF EXISTS "Service role full access webinars" ON webinars;
CREATE POLICY "Service role full access webinars"
ON webinars
FOR ALL
USING (auth.role() = 'service_role');

-- 2. Webinar Registrations Policies:
-- Public can submit registration (INSERT only)
DROP POLICY IF EXISTS "Public can insert webinar registrations" ON webinar_registrations;
CREATE POLICY "Public can insert webinar registrations"
ON webinar_registrations
FOR INSERT
WITH CHECK (true);

-- Visitors CANNOT read other attendees' personal data
-- Service role has full access
DROP POLICY IF EXISTS "Service role full access webinar registrations" ON webinar_registrations;
CREATE POLICY "Service role full access webinar registrations"
ON webinar_registrations
FOR ALL
USING (auth.role() = 'service_role');

-- 3. Reminder Logs Policies:
DROP POLICY IF EXISTS "Service role full access reminder logs" ON reminder_logs;
CREATE POLICY "Service role full access reminder logs"
ON reminder_logs
FOR ALL
USING (auth.role() = 'service_role');

-- ==============================================================================
-- SEED DATA: 12 Official CBM Academy Webinars
-- ==============================================================================
INSERT INTO webinars (id, title, description, start_datetime, timezone, duration_minutes, price, capacity, status, meeting_url, whatsapp_group_url, thumbnail_url)
VALUES
  (
    'webinar-ai-tools-2026',
    'AI Tools Every Digital Marketer Should Know in 2026',
    'Learn how modern AI tools like ChatGPT, Claude, and Midjourney can automate marketing workflows and boost campaign ROI.',
    timezone('utc'::text, '2026-10-24 12:30:00+00'::timestamptz),
    'Asia/Kolkata',
    60,
    0,
    150,
    'published',
    'https://meet.google.com/cbm-live-ai',
    'https://chat.whatsapp.com/CBMWebinarAITools',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-meta-ads-masterclass',
    'Meta Ads Masterclass (Facebook & Instagram Ads)',
    'Deep dive into Meta Advantage+ campaigns, custom audience scaling, ROAS optimization, and high-converting ad creative frameworks.',
    timezone('utc'::text, '2026-10-25 13:30:00+00'::timestamptz),
    'Asia/Kolkata',
    90,
    499,
    100,
    'published',
    'https://meet.google.com/cbm-live-meta',
    'https://chat.whatsapp.com/CBMMetaAdsVIP',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-seo-basics',
    'SEO Basics for Beginners',
    'Master the foundations of organic search: keyword research, on-page optimization, site architecture, and ranking in modern AI search results.',
    timezone('utc'::text, '2026-10-28 13:00:00+00'::timestamptz),
    'Asia/Kolkata',
    60,
    0,
    150,
    'published',
    'https://meet.google.com/cbm-live-seo',
    'https://chat.whatsapp.com/CBMSEOBeginners',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-wordpress-elementor',
    'WordPress Website Development with Elementor',
    'Build responsive, lightning-fast business websites and landing pages without code using WordPress, Elementor Pro, and domain hosting.',
    timezone('utc'::text, '2026-10-31 11:30:00+00'::timestamptz),
    'Asia/Kolkata',
    120,
    499,
    100,
    'published',
    'https://meet.google.com/cbm-live-wp',
    'https://chat.whatsapp.com/CBMWordPressPro',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-canva-graphic-design',
    'Graphic Design with Canva for Social Media',
    'Create eye-catching social media posts, carousel decks, YouTube thumbnails, and professional brand assets using Canva.',
    timezone('utc'::text, '2026-11-01 12:30:00+00'::timestamptz),
    'Asia/Kolkata',
    60,
    0,
    200,
    'published',
    'https://meet.google.com/cbm-live-canva',
    'https://chat.whatsapp.com/CBMCanvaDesign',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-google-ads-growth',
    'Google Ads for Business Growth',
    'Practical campaign architecture, search keyword match types, negative keywords, Quality Score optimization, and high-ROI bidding.',
    timezone('utc'::text, '2026-11-07 13:30:00+00'::timestamptz),
    'Asia/Kolkata',
    90,
    499,
    100,
    'published',
    'https://meet.google.com/cbm-live-gads',
    'https://chat.whatsapp.com/CBMGoogleAdsVIP',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-content-copywriting-ai',
    'Content Writing & Copywriting with AI',
    'Learn copywriting frameworks (AIDA, PAS) combined with AI prompt workflows to produce persuasive articles, landing page copy, and ad headlines.',
    timezone('utc'::text, '2026-11-08 12:30:00+00'::timestamptz),
    'Asia/Kolkata',
    60,
    0,
    150,
    'published',
    'https://meet.google.com/cbm-live-copy',
    'https://chat.whatsapp.com/CBMCopywriting',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-linkedin-branding',
    'LinkedIn Personal Branding for Students & Marketers',
    'Build an influential personal profile on LinkedIn that attracts recruiter inmails, freelance clients, and industry opportunities.',
    timezone('utc'::text, '2026-11-11 14:00:00+00'::timestamptz),
    'Asia/Kolkata',
    60,
    0,
    150,
    'published',
    'https://meet.google.com/cbm-live-linkedin',
    'https://chat.whatsapp.com/CBMLinkedInBrand',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-email-automation',
    'Email Marketing & Automation Essentials',
    'Design automated welcome flows, abandoned cart emails, and newsletter sequences that generate revenue on autopilot.',
    timezone('utc'::text, '2026-11-14 12:30:00+00'::timestamptz),
    'Asia/Kolkata',
    60,
    0,
    150,
    'published',
    'https://meet.google.com/cbm-live-email',
    'https://chat.whatsapp.com/CBMEmailAuto',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-youtube-growth',
    'YouTube Growth & Video SEO Blueprint',
    'Learn how to find trending topics, optimize video tags, design high-CTR thumbnails, and rank in YouTube search.',
    timezone('utc'::text, '2026-11-15 12:30:00+00'::timestamptz),
    'Asia/Kolkata',
    60,
    0,
    150,
    'published',
    'https://meet.google.com/cbm-live-yt',
    'https://chat.whatsapp.com/CBMYouTubeSEO',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-ecommerce-scaling',
    'E-Commerce Dropshipping & Scaling Masterclass',
    'From product research to profitable Meta Ads testing: master Shopify store setup, Indian COD fulfillment, and scaling winners.',
    timezone('utc'::text, '2026-11-21 13:30:00+00'::timestamptz),
    'Asia/Kolkata',
    120,
    499,
    100,
    'published',
    'https://meet.google.com/cbm-live-ecom',
    'https://chat.whatsapp.com/CBMEcomScale',
    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'webinar-ga4-analytics',
    'Data Analytics for Marketers: GA4 & Looker Studio',
    'Turn raw numbers into actionable growth insights. Set up Google Analytics 4 custom events and build executive Looker Studio dashboards.',
    timezone('utc'::text, '2026-11-22 13:30:00+00'::timestamptz),
    'Asia/Kolkata',
    90,
    499,
    100,
    'published',
    'https://meet.google.com/cbm-live-ga4',
    'https://chat.whatsapp.com/CBMGA4VIP',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  start_datetime = EXCLUDED.start_datetime,
  duration_minutes = EXCLUDED.duration_minutes,
  price = EXCLUDED.price,
  meeting_url = COALESCE(webinars.meeting_url, EXCLUDED.meeting_url),
  whatsapp_group_url = COALESCE(webinars.whatsapp_group_url, EXCLUDED.whatsapp_group_url),
  thumbnail_url = EXCLUDED.thumbnail_url;
