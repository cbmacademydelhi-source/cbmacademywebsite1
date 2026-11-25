-- ==============================================================================
-- CBM ACADEMY - GLOBAL MULTI-DEVICE SUPABASE SYNC SCHEMA
-- ==============================================================================
-- Run this once in Supabase Dashboard -> SQL Editor -> Run.
-- Enables real-time global synchronization across Desktop, Mobile, Tablet,
-- GitHub Pages, and server deployments for:
--   1. Logo, Images & Banners (`public.site_media` + Storage bucket `site-media`)
--   2. Webinars & Masterclasses (`public.webinars` + `public.webinar_registrations`)
--   3. Certificates Registry (`public.certificates`)
-- ==============================================================================

-- 1. ADMIN USERS TABLE (used by RLS admin check)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT 'CBM Admin',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2. ADMIN VERIFICATION HELPER FOR RLS
CREATE OR REPLACE FUNCTION public.is_cbm_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT
    auth.role() = 'authenticated'
    AND (
      lower(coalesce(auth.jwt() ->> 'email', '')) = 'office@cbmacademy.in'
      OR lower(coalesce(auth.jwt() -> 'user_metadata' ->> 'role', auth.jwt() -> 'app_metadata' ->> 'role', '')) IN ('admin', 'super_admin')
      OR EXISTS (
        SELECT 1
        FROM public.admin_users au
        WHERE lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
    );
$$;

-- ==============================================================================
-- 3. STORAGE BUCKET `site-media` (Logos, Banners, Page Images, Webinar Posters)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS "Public can view site-media files" ON storage.objects;
CREATE POLICY "Public can view site-media files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "Admins can upload site-media files" ON storage.objects;
CREATE POLICY "Admins can upload site-media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-media' AND public.is_cbm_admin());

DROP POLICY IF EXISTS "Admins can update site-media files" ON storage.objects;
CREATE POLICY "Admins can update site-media files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-media' AND public.is_cbm_admin())
WITH CHECK (bucket_id = 'site-media' AND public.is_cbm_admin());

DROP POLICY IF EXISTS "Admins can delete site-media files" ON storage.objects;
CREATE POLICY "Admins can delete site-media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-media' AND public.is_cbm_admin());

-- ==============================================================================
-- 4. SITE MEDIA TABLE (`public.site_media`)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_media (
  slot_id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  storage_path TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site_media" ON public.site_media;
CREATE POLICY "Public can read site_media"
ON public.site_media FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can insert site_media" ON public.site_media;
CREATE POLICY "Admins can insert site_media"
ON public.site_media FOR INSERT
TO authenticated
WITH CHECK (public.is_cbm_admin());

DROP POLICY IF EXISTS "Admins can update site_media" ON public.site_media;
CREATE POLICY "Admins can update site_media"
ON public.site_media FOR UPDATE
TO authenticated
USING (public.is_cbm_admin())
WITH CHECK (public.is_cbm_admin());

DROP POLICY IF EXISTS "Admins can delete site_media" ON public.site_media;
CREATE POLICY "Admins can delete site_media"
ON public.site_media FOR DELETE
TO authenticated
USING (public.is_cbm_admin());

GRANT SELECT ON TABLE public.site_media TO anon, authenticated;
GRANT ALL ON TABLE public.site_media TO authenticated, service_role;

-- ==============================================================================
-- 5. WEBINARS & REGISTRATIONS TABLES (`public.webinars`, `public.webinar_registrations`)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.webinars (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_datetime TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  display_date TEXT,
  display_time TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  host TEXT DEFAULT 'CBM Academy Faculty',
  what_you_will_learn JSONB DEFAULT '[]'::jsonb,
  price NUMERIC NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 150,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('upcoming', 'published', 'draft', 'completed', 'cancelled')),
  meeting_url TEXT,
  whatsapp_group_url TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS display_date TEXT;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS display_time TEXT;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS host TEXT DEFAULT 'CBM Academy Faculty';
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS what_you_will_learn JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published webinars" ON public.webinars;
CREATE POLICY "Public can view published webinars"
ON public.webinars FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can manage webinars" ON public.webinars;
CREATE POLICY "Admins can manage webinars"
ON public.webinars FOR ALL
TO authenticated
USING (public.is_cbm_admin())
WITH CHECK (public.is_cbm_admin());

GRANT SELECT ON TABLE public.webinars TO anon, authenticated;
GRANT ALL ON TABLE public.webinars TO authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.webinar_registrations (
  id TEXT PRIMARY KEY DEFAULT ('reg-' || floor(extract(epoch from now()) * 1000)::text || '-' || substr(md5(random()::text), 1, 6)),
  webinar_id TEXT NOT NULL,
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

ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can register for webinars" ON public.webinar_registrations;
CREATE POLICY "Public can register for webinars"
ON public.webinar_registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view webinar registrations" ON public.webinar_registrations;
CREATE POLICY "Admins can view webinar registrations"
ON public.webinar_registrations FOR SELECT
TO authenticated
USING (public.is_cbm_admin());

DROP POLICY IF EXISTS "Admins can update webinar registrations" ON public.webinar_registrations;
CREATE POLICY "Admins can update webinar registrations"
ON public.webinar_registrations FOR UPDATE
TO authenticated
USING (public.is_cbm_admin())
WITH CHECK (public.is_cbm_admin());

GRANT INSERT ON TABLE public.webinar_registrations TO anon, authenticated;
GRANT ALL ON TABLE public.webinar_registrations TO authenticated, service_role;

-- ==============================================================================
-- 6. CERTIFICATES TABLE (`public.certificates`)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  completion_date TEXT,
  grade TEXT DEFAULT 'Distinction (A+)',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'approved', 'deactivated', 'pending', 'rejected')),
  rejection_reason TEXT,
  skills_verified JSONB DEFAULT '[]'::jsonb,
  instructor TEXT DEFAULT 'CBM Academic Board & Directorate',
  qr_code_seed TEXT,
  credential_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can verify certificates" ON public.certificates;
CREATE POLICY "Public can verify certificates"
ON public.certificates FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
CREATE POLICY "Admins can manage certificates"
ON public.certificates FOR ALL
TO authenticated
USING (public.is_cbm_admin())
WITH CHECK (public.is_cbm_admin());

GRANT SELECT ON TABLE public.certificates TO anon, authenticated;
GRANT ALL ON TABLE public.certificates TO authenticated, service_role;

-- ==============================================================================
-- 7. ENABLE SUPABASE REALTIME FOR INSTANT CROSS-DEVICE UPDATES
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'site_media'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_media;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'webinars'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.webinars;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'certificates'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
  END IF;
END $$;
