-- ==============================================================================
-- CBM Academy: Row Level Security (RLS) Policies for Forms
-- ==============================================================================
-- Table 1: public.form_submissions (Apply Form)
-- Table 2: public.contact_submissions (Contact Inquiries)
-- ==============================================================================

-- 1. Ensure RLS is active
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 2. Allow public/anonymous visitors to INSERT course applications into form_submissions
DROP POLICY IF EXISTS "Allow public insert to form_submissions" ON public.form_submissions;
CREATE POLICY "Allow public insert to form_submissions"
ON public.form_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Disallow public select on form_submissions (protect applicant data)
DROP POLICY IF EXISTS "Disallow public select on form_submissions" ON public.form_submissions;
CREATE POLICY "Disallow public select on form_submissions"
ON public.form_submissions
FOR SELECT
TO authenticated
USING (false);

-- 4. Allow public/anonymous visitors to INSERT into contact_submissions
DROP POLICY IF EXISTS "Allow public insert to contact_submissions" ON public.contact_submissions;
CREATE POLICY "Allow public insert to contact_submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. Disallow public select on contact_submissions
DROP POLICY IF EXISTS "Disallow public select on contact_submissions" ON public.contact_submissions;
CREATE POLICY "Disallow public select on contact_submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (false);

-- 6. Grant INSERT privileges to anon and authenticated roles
GRANT INSERT ON TABLE public.form_submissions TO anon, authenticated;
GRANT INSERT ON TABLE public.contact_submissions TO anon, authenticated;
