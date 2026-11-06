-- ==============================================================================
-- CBM ACADEMY - UNIFIED ADMIN & CONTENT DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- ==============================================================================
-- Connects to: https://cxeztssvgaeytdljoned.supabase.co
-- Enables full approval workflow (pending, approved, rejected) across:
-- 1. Courses
-- 2. Jobs
-- 3. Blogs
-- 4. Webinars & Registrations
-- 5. Certificates
-- 6. Form Submissions (Applications)
-- 7. Contact Submissions (Enquiries)
-- 8. Admin Users
-- ==============================================================================

-- 1. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  category TEXT NOT NULL DEFAULT 'Digital Marketing',
  duration TEXT NOT NULL DEFAULT '16 Weeks',
  description TEXT NOT NULL,
  topics JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  hr_name TEXT NOT NULL,
  hr_email TEXT NOT NULL,
  hr_phone TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Delhi NCR',
  salary TEXT,
  experience TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  work_type TEXT NOT NULL DEFAULT 'Full-time' CHECK (work_type IN ('Full-time', 'Part-time', 'Internship', 'Contract', 'Remote')),
  is_remote BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  excerpt TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'Digital Marketing',
  author TEXT NOT NULL DEFAULT 'CBM Academy Faculty',
  read_time TEXT NOT NULL DEFAULT '5 min read',
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. WEBINARS TABLE
CREATE TABLE IF NOT EXISTS public.webinars (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price NUMERIC NOT NULL DEFAULT 0,
  registration_deadline TIMESTAMPTZ,
  capacity INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('upcoming', 'published', 'draft', 'completed', 'cancelled', 'pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  meeting_url TEXT,
  whatsapp_group_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  completion_date TEXT NOT NULL,
  grade TEXT NOT NULL DEFAULT 'Grade A+ (Distinction)',
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'active', 'deactivated', 'pending', 'rejected')),
  rejection_reason TEXT,
  skills_verified JSONB DEFAULT '[]'::jsonb,
  instructor TEXT NOT NULL DEFAULT 'CBM Academic Board',
  qr_code_seed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. FORM_SUBMISSIONS (APPLICATIONS) ENHANCEMENTS
-- Note: 'form_submissions' already exists in Supabase. Add approval columns if missing:
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_submissions' AND column_name = 'status') THEN
    ALTER TABLE public.form_submissions ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_submissions' AND column_name = 'notes') THEN
    ALTER TABLE public.form_submissions ADD COLUMN notes TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_submissions' AND column_name = 'updated_at') THEN
    ALTER TABLE public.form_submissions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
  END IF;
END $$;

-- 7. CONTACT_SUBMISSIONS (ENQUIRIES) ENHANCEMENTS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'status') THEN
    ALTER TABLE public.contact_submissions ADD COLUMN status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'contacted', 'resolved'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'notes') THEN
    ALTER TABLE public.contact_submissions ADD COLUMN notes TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'updated_at') THEN
    ALTER TABLE public.contact_submissions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
  END IF;
END $$;

-- 8. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT 'CBM Admin',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON public.webinars(status);
CREATE INDEX IF NOT EXISTS idx_certificates_id ON public.certificates(id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- COURSES RLS:
-- Public can ONLY view approved courses
DROP POLICY IF EXISTS "Public can view approved courses" ON public.courses;
CREATE POLICY "Public can view approved courses"
ON public.courses FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- JOBS RLS:
-- Public can ONLY view approved jobs
DROP POLICY IF EXISTS "Public can view approved jobs" ON public.jobs;
CREATE POLICY "Public can view approved jobs"
ON public.jobs FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Anyone can submit a job (pending approval)
DROP POLICY IF EXISTS "Public can insert pending jobs" ON public.jobs;
CREATE POLICY "Public can insert pending jobs"
ON public.jobs FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- BLOGS RLS:
-- Public can ONLY view approved blogs
DROP POLICY IF EXISTS "Public can view approved blogs" ON public.blogs;
CREATE POLICY "Public can view approved blogs"
ON public.blogs FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- CERTIFICATES RLS:
-- Public can verify active/approved certificates by ID
DROP POLICY IF EXISTS "Public can verify certificates" ON public.certificates;
CREATE POLICY "Public can verify certificates"
ON public.certificates FOR SELECT
TO anon, authenticated
USING (status IN ('approved', 'active'));
