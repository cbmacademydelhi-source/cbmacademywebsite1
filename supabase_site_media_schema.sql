-- ==============================================================================
-- CBM ACADEMY - IMAGES & BANNERS SUPABASE STORAGE & METADATA SCHEMA
-- ==============================================================================
-- Run this once in the Supabase SQL Editor to enable persistent cloud image
-- uploads & replacements across GitHub Pages, Vercel, and server deployments.
-- ==============================================================================

-- 1. Create public Storage bucket `site-media` (10 MB max, PNG/JPG/WebP/GIF only)
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

-- 2. Create `public.site_media` table to map each website image slot to its live URL
CREATE TABLE IF NOT EXISTS public.site_media (
  slot_id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  storage_path TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

-- 3. Helper function to verify admin caller via JWT email, role, or public.admin_users
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

-- 4. RLS Policies for `public.site_media`
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

-- 5. RLS Policies for `storage.objects` in bucket `site-media`
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
