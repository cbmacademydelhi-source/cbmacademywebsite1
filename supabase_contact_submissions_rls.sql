-- ==============================================================================
-- CBM Academy: Row Level Security (RLS) Policy for 'contact_submissions'
-- ==============================================================================
-- Purpose:
-- 1. Ensure Row Level Security is active on public.contact_submissions.
-- 2. Allow public/anonymous website visitors to INSERT contact and application form submissions.
-- 3. Protect attendee/applicant privacy by preventing unauthorized public SELECT/READ access.
--
-- Instructions:
-- Copy and paste this script into your Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Ensure RLS is enabled on the table
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 2. Grant INSERT permission to anonymous (public website visitors) and authenticated users
DROP POLICY IF EXISTS "Allow public insert to contact_submissions" ON public.contact_submissions;
CREATE POLICY "Allow public insert to contact_submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Disallow public SELECT (protects applicant personal contact details from being read by visitors)
DROP POLICY IF EXISTS "Disallow public select on contact_submissions" ON public.contact_submissions;
CREATE POLICY "Disallow public select on contact_submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (false);

-- 4. Grant explicit table privileges to anon and authenticated roles
GRANT INSERT ON TABLE public.contact_submissions TO anon, authenticated;
