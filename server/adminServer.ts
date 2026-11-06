import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseServer } from './supabaseServer.ts';
import fs from 'fs';
import path from 'path';

// Seed data defaults for initial synchronization
import {
  COURSE_MODULES,
  JOB_OPPORTUNITIES,
  BLOG_POSTS,
  VERIFIED_CERTIFICATES,
} from '../src/data/cbmData.ts';

export interface AdminCourse {
  id: string;
  title: string;
  slug?: string;
  category: string;
  duration: string;
  description: string;
  topics: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AdminJob {
  id: string;
  company_name: string;
  company?: string;
  hr_name?: string;
  hr_email?: string;
  hr_phone?: string;
  job_title: string;
  title?: string;
  job_description: string;
  description?: string;
  location: string;
  salary?: string | null;
  experience?: string | null;
  skills: string[];
  requirements?: string[];
  work_type: string;
  type?: string;
  is_remote?: boolean;
  posted_date?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AdminBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  author_role?: string;
  read_time: string;
  image_url: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminCertificate {
  id: string;
  student_name: string;
  course_name: string;
  issue_date: string;
  completion_date?: string;
  grade?: string;
  status: 'active' | 'revoked' | 'approved' | 'deactivated' | 'pending' | 'rejected';
  rejection_reason?: string | null;
  skills_verified?: string[];
  instructor?: string;
  qr_code_seed?: string;
  credential_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  notes?: string | null;
  created_at: string;
}

export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'contacted' | 'resolved';
  notes?: string | null;
  created_at: string;
}

// In-memory + persistent disk fallback store to guarantee zero downtime even before DDL is executed
const CACHE_FILE = path.join(process.cwd(), 'server', '.admin_store_cache.json');

interface AdminStore {
  courses: AdminCourse[];
  jobs: AdminJob[];
  blogs: AdminBlog[];
  certificates: AdminCertificate[];
  applicationMeta?: Record<string, { status: 'pending' | 'reviewed' | 'approved' | 'rejected'; notes?: string | null }>;
  enquiryMeta?: Record<string, { status: 'unread' | 'read' | 'contacted' | 'resolved'; notes?: string | null }>;
}

function getInitialStore(): AdminStore {
  // Convert COURSE_MODULES to AdminCourse list
  const courses: AdminCourse[] = COURSE_MODULES.map((m) => ({
    id: `course-${m.id}`,
    title: m.title,
    slug: m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: m.level || 'Digital Marketing',
    duration: m.duration || '16 Weeks',
    description: m.shortDescription || '',
    topics: m.syllabus || [],
    status: 'approved',
    approved_at: new Date().toISOString(),
    approved_by: 'CBM Academic Board',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  // Convert JOB_OPPORTUNITIES to AdminJob list
  const jobs: AdminJob[] = JOB_OPPORTUNITIES.map((j) => ({
    id: j.id,
    company_name: j.companyCategory,
    hr_name: 'Placement Office',
    hr_email: j.hrEmail || 'office@cbmacademy.in',
    hr_phone: '+91-92115-83150',
    job_title: j.role,
    job_description: `${j.role} opportunity in ${j.location}. Full practical exposure to performance marketing and brand campaigns.`,
    location: j.location,
    salary: j.salary,
    experience: j.experience,
    skills: j.skills || [],
    work_type: j.type,
    is_remote: Boolean(j.isRemote),
    status: 'approved',
    approved_at: new Date().toISOString(),
    approved_by: 'CBM Placement Directorate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  // Convert BLOG_POSTS to AdminBlog list
  const blogs: AdminBlog[] = BLOG_POSTS.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.id,
    excerpt: b.excerpt,
    content: b.content || b.excerpt,
    category: b.category,
    author: b.author.name,
    author_role: b.author.role,
    read_time: b.readTime || '5 min read',
    image_url: b.imageUrl,
    status: 'approved',
    published_at: b.date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  // Convert VERIFIED_CERTIFICATES to AdminCertificate list
  const certificates: AdminCertificate[] = Object.values(VERIFIED_CERTIFICATES).map((c) => ({
    id: c.id,
    student_name: c.studentName,
    course_name: c.courseName,
    issue_date: c.issueDate,
    completion_date: c.completionDate,
    grade: c.grade,
    status: c.status === 'VERIFIED' ? 'active' : 'revoked',
    skills_verified: c.skillsVerified,
    instructor: c.instructor,
    qr_code_seed: c.qrCodeSeed,
    credential_url: c.credentialUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  return { courses, jobs, blogs, certificates };
}

let store: AdminStore = getInitialStore();

function loadStore() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.courses)) {
        store = parsed;
      }
    }
  } catch (err) {
    console.warn('[Admin Store] Read notice:', err);
  }
}

function saveStore() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Admin Store] Write notice:', err);
  }
}

loadStore();
if (!fs.existsSync(CACHE_FILE)) {
  saveStore();
}

// Global schema notices for visibility in the Admin UI
export let lastSupabaseNotice: {
  table: string;
  code?: string;
  message?: string;
  timestamp: string;
} | null = null;

// ==============================================================================
// COURSES
// ==============================================================================
export async function getAdminCourses(): Promise<AdminCourse[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as AdminCourse[];
      }
      if (error) {
        lastSupabaseNotice = {
          table: 'courses',
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (err: any) {
      lastSupabaseNotice = {
        table: 'courses',
        message: err?.message || 'Connection error',
        timestamp: new Date().toISOString(),
      };
    }
  }
  return store.courses;
}

export async function saveAdminCourse(course: Partial<AdminCourse>): Promise<AdminCourse> {
  const now = new Date().toISOString();
  const id = course.id || `course-${Date.now()}`;
  const record: AdminCourse = {
    id,
    title: course.title || 'Untitled Course',
    slug: course.slug || course.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id,
    category: course.category || 'Digital Marketing',
    duration: course.duration || '16 Weeks',
    description: course.description || '',
    topics: course.topics || [],
    status: course.status || 'pending',
    rejection_reason: course.rejection_reason || null,
    approved_at: course.status === 'approved' ? (course.approved_at || now) : null,
    approved_by: course.status === 'approved' ? (course.approved_by || 'CBM Administrator') : null,
    created_at: course.created_at || now,
    updated_at: now,
  };

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('courses').upsert([record], { onConflict: 'id' });
    } catch (err) {
      console.warn('[Supabase Courses Upsert Notice]:', err);
    }
  }

  const existingIdx = store.courses.findIndex((c) => c.id === id);
  if (existingIdx >= 0) {
    store.courses[existingIdx] = record;
  } else {
    store.courses.unshift(record);
  }
  saveStore();
  return record;
}

export async function deleteAdminCourse(id: string): Promise<boolean> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('courses').delete().eq('id', id);
    } catch {}
  }
  store.courses = store.courses.filter((c) => c.id !== id);
  saveStore();
  return true;
}

// ==============================================================================
// JOBS
// ==============================================================================
export async function getAdminJobs(): Promise<AdminJob[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      // 1. Query job_listings in Supabase
      const { data: listings, error: listErr } = await supabase
        .from('job_listings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!listErr && listings && listings.length > 0) {
        return listings.map((j: any) => ({
          id: String(j.id),
          company_name: j.company_name || 'Hiring Partner',
          hr_name: j.hr_name || 'Placement Cell',
          hr_email: j.hr_email || 'office@cbmacademy.in',
          hr_phone: j.hr_phone || '+91-92115-83150',
          job_title: j.job_title || 'Marketing Executive',
          job_description: j.job_description || '',
          location: j.location || 'Delhi NCR',
          salary: j.salary || null,
          experience: j.experience || null,
          skills: Array.isArray(j.skills) ? j.skills : [],
          work_type: j.work_type || 'Full-time',
          is_remote: false,
          status: j.status || 'approved',
          created_at: j.created_at || new Date().toISOString(),
          updated_at: j.updated_at || new Date().toISOString(),
        }));
      }

      // 2. Query jobs table
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as AdminJob[];
      }
    } catch (err: any) {
      console.warn('[Supabase Jobs read notice]:', err?.message);
    }
  }
  return store.jobs;
}

export async function getPublicApprovedJobs(): Promise<AdminJob[]> {
  const all = await getAdminJobs();
  return all.filter((j) => j.status === 'approved');
}

export async function saveAdminJob(job: Partial<AdminJob>): Promise<AdminJob> {
  const now = new Date().toISOString();
  const id = job.id || `job-${Date.now()}`;
  const record: AdminJob = {
    id,
    company_name: job.company_name || 'Hiring Company',
    hr_name: job.hr_name || 'Hiring Manager',
    hr_email: job.hr_email || 'hr@company.com',
    hr_phone: job.hr_phone || '+91-92115-83150',
    job_title: job.job_title || 'Marketing Executive',
    job_description: job.job_description || '',
    location: job.location || 'Delhi NCR',
    salary: job.salary || null,
    experience: job.experience || null,
    skills: job.skills || [],
    work_type: job.work_type || 'Full-time',
    is_remote: Boolean(job.is_remote),
    status: job.status || 'pending',
    rejection_reason: job.rejection_reason || null,
    approved_at: job.status === 'approved' ? (job.approved_at || now) : null,
    approved_by: job.status === 'approved' ? (job.approved_by || 'CBM Placement Cell') : null,
    created_at: job.created_at || now,
    updated_at: now,
  };

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      // Upsert to job_listings with matching schema columns
      await supabase.from('job_listings').upsert([
        {
          id: record.id,
          company_name: record.company_name,
          job_title: record.job_title,
          job_description: record.job_description,
          location: record.location,
          salary: record.salary,
          experience: record.experience,
          skills: record.skills,
          work_type: record.work_type,
          hr_name: record.hr_name,
          hr_email: record.hr_email,
          hr_phone: record.hr_phone,
          status: record.status,
          created_at: record.created_at,
          updated_at: record.updated_at,
        },
      ], { onConflict: 'id' });
    } catch (err) {
      console.warn('[Supabase job_listings Upsert Notice]:', err);
    }

    try {
      await supabase.from('jobs').upsert([record], { onConflict: 'id' });
    } catch {}
  }

  const existingIdx = store.jobs.findIndex((j) => j.id === id);
  if (existingIdx >= 0) {
    store.jobs[existingIdx] = record;
  } else {
    store.jobs.unshift(record);
  }
  saveStore();
  return record;
}

export async function deleteAdminJob(id: string): Promise<boolean> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('job_listings').delete().eq('id', id);
    } catch {}
    try {
      await supabase.from('jobs').delete().eq('id', id);
    } catch {}
  }
  store.jobs = store.jobs.filter((j) => j.id !== id);
  saveStore();
  return true;
}

// ==============================================================================
// BLOGS
// ==============================================================================
export async function getAdminBlogs(): Promise<AdminBlog[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as AdminBlog[];
      }
    } catch {}
  }
  return store.blogs;
}

export async function getPublicApprovedBlogs(): Promise<AdminBlog[]> {
  const all = await getAdminBlogs();
  return all.filter((b) => b.status === 'approved');
}

export async function saveAdminBlog(blog: Partial<AdminBlog>): Promise<AdminBlog> {
  const now = new Date().toISOString();
  const id = blog.id || `blog-${Date.now()}`;
  const record: AdminBlog = {
    id,
    title: blog.title || 'Untitled Post',
    slug: blog.slug || blog.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id,
    excerpt: blog.excerpt || '',
    content: blog.content || blog.excerpt || '',
    category: blog.category || 'Digital Marketing',
    author: blog.author || 'CBM Academy Faculty',
    read_time: blog.read_time || '5 min read',
    image_url: blog.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    status: blog.status || 'approved',
    rejection_reason: blog.rejection_reason || null,
    published_at: blog.published_at || now,
    created_at: blog.created_at || now,
    updated_at: now,
  };

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('blogs').upsert([record], { onConflict: 'id' });
    } catch (err) {
      console.warn('[Supabase Blogs Upsert Notice]:', err);
    }
  }

  const existingIdx = store.blogs.findIndex((b) => b.id === id);
  if (existingIdx >= 0) {
    store.blogs[existingIdx] = record;
  } else {
    store.blogs.unshift(record);
  }
  saveStore();
  return record;
}

export async function deleteAdminBlog(id: string): Promise<boolean> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('blogs').delete().eq('id', id);
    } catch {}
  }
  store.blogs = store.blogs.filter((b) => b.id !== id);
  saveStore();
  return true;
}

// ==============================================================================
// CERTIFICATES
// ==============================================================================
export async function getAdminCertificates(): Promise<AdminCertificate[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as AdminCertificate[];
      }
    } catch {}
  }
  return store.certificates;
}

export async function verifyCertificateById(certId: string): Promise<AdminCertificate | null> {
  const cleanId = certId.trim().toUpperCase();
  const all = await getAdminCertificates();
  const match = all.find((c) => c.id.toUpperCase() === cleanId);
  if (match && (match.status === 'approved' || match.status === 'active')) {
    return match;
  }
  return null;
}

export async function saveAdminCertificate(cert: Partial<AdminCertificate>): Promise<AdminCertificate> {
  const now = new Date().toISOString();
  const id = (cert.id || `CBM-2026-${Math.floor(1000 + Math.random() * 9000)}`).trim().toUpperCase();
  const record: AdminCertificate = {
    id,
    student_name: cert.student_name || 'Graduate Student',
    course_name: cert.course_name || 'Master in AI-Powered Digital Marketing & Growth Specialization',
    issue_date: cert.issue_date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    completion_date: cert.completion_date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    grade: cert.grade || 'Grade A+ (Distinction)',
    status: cert.status || 'approved',
    rejection_reason: cert.rejection_reason || null,
    skills_verified: cert.skills_verified || ['AI SEO', 'Meta Ads', 'Google Ads PMax', 'GA4 Analytics'],
    instructor: cert.instructor || 'CBM Academic Board & Directorate',
    qr_code_seed: cert.qr_code_seed || `CBM-SECURE-AUTH-${id}`,
    created_at: cert.created_at || now,
    updated_at: now,
  };

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('certificates').upsert([record], { onConflict: 'id' });
    } catch (err) {
      console.warn('[Supabase Certificates Upsert Notice]:', err);
    }
  }

  const existingIdx = store.certificates.findIndex((c) => c.id.toUpperCase() === id);
  if (existingIdx >= 0) {
    store.certificates[existingIdx] = record;
  } else {
    store.certificates.unshift(record);
  }
  saveStore();
  return record;
}

export async function deleteAdminCertificate(id: string): Promise<boolean> {
  const cleanId = id.trim().toUpperCase();
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from('certificates').delete().eq('id', cleanId);
    } catch {}
  }
  store.certificates = store.certificates.filter((c) => c.id.toUpperCase() !== cleanId);
  saveStore();
  return true;
}

// ==============================================================================
// APPLICATIONS (form_submissions in Supabase)
// ==============================================================================
export async function getAdminApplications(): Promise<AdminApplication[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((row: any) => {
          const id = String(row.Id || row.id || '');
          const meta = store.applicationMeta?.[id];
          return {
            id,
            name: row.Name || row.name || 'Anonymous Applicant',
            email: row.Email || row.email || '',
            phone: row.Phone || row.phone || '',
            course: row.Course || row.course || 'Digital Marketing',
            message: row.Message || row.message || '',
            status: meta?.status || row.status || 'pending',
            notes: meta?.notes !== undefined ? meta.notes : (row.notes || null),
            created_at: row.created_at || new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      console.warn('[Supabase form_submissions read notice]:', err);
    }
  }
  return [];
}

export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'reviewed' | 'approved' | 'rejected',
  notes?: string
): Promise<boolean> {
  if (!store.applicationMeta) store.applicationMeta = {};
  store.applicationMeta[id] = {
    status,
    notes: notes !== undefined ? notes : (store.applicationMeta[id]?.notes || null),
  };
  saveStore();

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const updates: any = { status };
      if (typeof notes === 'string') updates.notes = notes;
      await supabase
        .from('form_submissions')
        .update(updates)
        .or(`Id.eq.${id},id.eq.${id}`);
    } catch {}
  }
  return true;
}

export async function deleteApplication(id: string): Promise<boolean> {
  if (store.applicationMeta?.[id]) {
    delete store.applicationMeta[id];
    saveStore();
  }
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .or(`Id.eq.${id},id.eq.${id}`);
      return !error;
    } catch {
      return false;
    }
  }
  return false;
}

// ==============================================================================
// ENQUIRIES (contact_submissions in Supabase)
// ==============================================================================
export async function getAdminEnquiries(): Promise<AdminEnquiry[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((row: any) => {
          const id = String(row.id || row.Id || '');
          const meta = store.enquiryMeta?.[id];
          return {
            id,
            name: row.name || row.full_name || row.Name || 'Visitor',
            full_name: row.full_name || row.Name || 'Visitor',
            email: row.email || row.Email || '',
            phone: row.phone || row.Phone || '',
            subject: row.subject || row.Subject || '',
            message: row.message || row.Message || '',
            status: meta?.status || row.status || 'unread',
            notes: meta?.notes !== undefined ? meta.notes : (row.notes || null),
            created_at: row.created_at || new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      console.warn('[Supabase contact_submissions read notice]:', err);
    }
  }
  return [];
}

export async function updateEnquiryStatus(
  id: string,
  status: 'unread' | 'read' | 'contacted' | 'resolved',
  notes?: string
): Promise<boolean> {
  if (!store.enquiryMeta) store.enquiryMeta = {};
  store.enquiryMeta[id] = {
    status,
    notes: notes !== undefined ? notes : (store.enquiryMeta[id]?.notes || null),
  };
  saveStore();

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const updates: any = { status };
      if (typeof notes === 'string') updates.notes = notes;
      await supabase
        .from('contact_submissions')
        .update(updates)
        .eq('id', id);
    } catch {}
  }
  return true;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  if (store.enquiryMeta?.[id]) {
    delete store.enquiryMeta[id];
    saveStore();
  }
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
  return false;
}

// ==============================================================================
// STATS / PENDING APPROVAL QUEUE
// ==============================================================================
export async function getDashboardStats() {
  const [courses, jobs, blogs, certificates, applications, enquiries] = await Promise.all([
    getAdminCourses(),
    getAdminJobs(),
    getAdminBlogs(),
    getAdminCertificates(),
    getAdminApplications(),
    getAdminEnquiries(),
  ]);

  const pendingCourses = courses.filter((c) => c.status === 'pending');
  const approvedCourses = courses.filter((c) => c.status === 'approved');
  const rejectedCourses = courses.filter((c) => c.status === 'rejected');

  const pendingJobs = jobs.filter((j) => j.status === 'pending');
  const approvedJobs = jobs.filter((j) => j.status === 'approved');
  const rejectedJobs = jobs.filter((j) => j.status === 'rejected');

  const pendingBlogs = blogs.filter((b) => b.status === 'pending');
  const approvedBlogs = blogs.filter((b) => b.status === 'approved');

  const pendingApplications = applications.filter((a) => a.status === 'pending');
  const unreadEnquiries = enquiries.filter((e) => e.status === 'unread');

  return {
    courses: {
      total: courses.length,
      pending: pendingCourses.length,
      approved: approvedCourses.length,
      rejected: rejectedCourses.length,
    },
    jobs: {
      total: jobs.length,
      pending: pendingJobs.length,
      approved: approvedJobs.length,
      rejected: rejectedJobs.length,
    },
    blogs: {
      total: blogs.length,
      pending: pendingBlogs.length,
      approved: approvedBlogs.length,
    },
    certificates: {
      total: certificates.length,
      active: certificates.filter((c) => c.status === 'approved' || c.status === 'active').length,
    },
    applications: {
      total: applications.length,
      pending: pendingApplications.length,
    },
    enquiries: {
      total: enquiries.length,
      unread: unreadEnquiries.length,
    },
    pendingQueue: {
      courses: pendingCourses,
      jobs: pendingJobs,
      blogs: pendingBlogs,
      applications: pendingApplications,
      enquiries: unreadEnquiries,
    },
    dbNotice: lastSupabaseNotice,
  };
}
