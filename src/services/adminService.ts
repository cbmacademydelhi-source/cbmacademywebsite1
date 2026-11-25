import { supabase } from '../lib/supabase';
import {
  ALLOWED_SITE_MEDIA_SLOT_IDS,
  DEFAULT_SITE_LOGO_URL,
  SITE_LOGO_SLOT_ID,
  SITE_MEDIA_SLOT_MAP,
} from '../data/siteMediaSlots';
import type {
  AdminCourse,
  AdminJob,
  AdminBlog,
  AdminCertificate,
  AdminApplication,
  AdminEnquiry,
  AdminImage,
} from '../../server/adminServer';

export type {
  AdminCourse,
  AdminJob,
  AdminBlog,
  AdminCertificate,
  AdminApplication,
  AdminEnquiry,
  AdminImage,
};

export interface AdminStats {
  courses: { total: number; pending: number; approved: number; rejected: number };
  jobs: { total: number; pending: number; approved: number; rejected: number };
  blogs: { total: number; pending: number; approved: number };
  certificates: { total: number; active: number };
  applications: { total: number; pending: number };
  enquiries: { total: number; unread: number };
  pendingQueue: {
    courses: AdminCourse[];
    jobs: AdminJob[];
    blogs: AdminBlog[];
    applications: AdminApplication[];
    enquiries: AdminEnquiry[];
  };
  dbNotice?: {
    table: string;
    code?: string;
    message?: string;
    timestamp: string;
  } | null;
}

const TOKEN_KEY = 'cbm_admin_access_token';
const USER_KEY = 'cbm_admin_user_data';

export let lastAdminApiError: string | null = null;

export const ADMIN_SESSION_EXPIRED_EVENT = 'cbm-admin-session-expired';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminSession(token: string, user: any) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function notifyAdminSessionExpired() {
  clearAdminSession();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ADMIN_SESSION_EXPIRED_EVENT));
  }
}

// Keep stored admin token synced whenever Supabase automatically refreshes the session
if (typeof window !== 'undefined') {
  try {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token && (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN')) {
        localStorage.setItem(TOKEN_KEY, session.access_token);
      } else if (event === 'SIGNED_OUT') {
        clearAdminSession();
      }
    });
  } catch {
    // ignore listener errors
  }
}

export async function getFreshAdminToken(forceRefresh = false): Promise<string | null> {
  try {
    if (forceRefresh) {
      const { data: refreshed, error: refreshErr } = await supabase.auth.refreshSession();
      if (!refreshErr && refreshed?.session?.access_token) {
        localStorage.setItem(TOKEN_KEY, refreshed.session.access_token);
        return refreshed.session.access_token;
      }
    } else {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.access_token) {
        const expiresAtMs = (session.expires_at || 0) * 1000;
        if (expiresAtMs > 0 && expiresAtMs - Date.now() < 60_000) {
          const { data: refreshed } = await supabase.auth.refreshSession();
          if (refreshed?.session?.access_token) {
            localStorage.setItem(TOKEN_KEY, refreshed.session.access_token);
            return refreshed.session.access_token;
          }
        }
        localStorage.setItem(TOKEN_KEY, session.access_token);
        return session.access_token;
      }
    }
  } catch {
    // Fall back to stored server-issued token if Supabase session isn't active
  }
  return getAdminToken();
}

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function authHeaders(forceRefresh = false): Promise<HeadersInit> {
  const token = await getFreshAdminToken(forceRefresh);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// -----------------------------------------------------------------------------
// AUTHENTICATION
// -----------------------------------------------------------------------------
export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; message?: string; user?: any }> {
  // 1. Try Supabase Auth client directly first
  try {
    const { data: supaData, error: supaErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (!supaErr && supaData?.session?.access_token) {
      const user = {
        email: supaData.user?.email || email.trim(),
        role: supaData.user?.user_metadata?.role || 'admin',
        id: supaData.user?.id,
      };
      setAdminSession(supaData.session.access_token, user);
      return { success: true, user };
    }
  } catch (err) {
    console.warn('[Admin Auth] Supabase Client attempt note:', err);
  }

  // 2. Try Server Admin proxy
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.access_token) {
      setAdminSession(data.access_token, data.user || { email: email.trim(), role: 'admin' });
      return { success: true, user: data.user };
    }
    return { success: false, message: data.message || 'Invalid credentials' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Login connection error' };
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {}
  clearAdminSession();
}

export async function checkAdminSession(): Promise<boolean> {
  const token = await getFreshAdminToken(false);
  if (!token) return false;
  try {
    const res = await fetchWithTimeout('/api/admin/session', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }, 4000);
    if (res.ok) return true;

    if (res.status === 401) {
      const refreshedToken = await getFreshAdminToken(true);
      if (refreshedToken && refreshedToken !== token) {
        const retryRes = await fetchWithTimeout('/api/admin/session', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshedToken}`,
          },
        }, 4000);
        if (retryRes.ok) return true;
      }
      clearAdminSession();
      return false;
    }

    // On static hosting (e.g. GitHub Pages where /api returns 404/405), fall back to active Supabase session
    const { data } = await supabase.auth.getSession();
    return Boolean(data?.session?.access_token);
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// STATS
// -----------------------------------------------------------------------------
export async function fetchAdminStats(): Promise<AdminStats | null> {
  try {
    const res = await fetchWithTimeout('/api/admin/stats', {
      headers: await authHeaders(),
    }, 8000);
    const data = await res.json();
    if (res.ok && data.success && data.stats) {
      return data.stats;
    }
    if (data?.message) {
      lastAdminApiError = data.message;
    }
    return null;
  } catch (err: any) {
    lastAdminApiError = err?.message || 'Network timeout connecting to /api/admin/stats';
    return null;
  }
}

// -----------------------------------------------------------------------------
// COURSES
// -----------------------------------------------------------------------------
export async function fetchAdminCourses(): Promise<AdminCourse[]> {
  try {
    const res = await fetchWithTimeout('/api/admin/courses', {
      headers: await authHeaders(),
    }, 8000);
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.courses)) {
      return data.courses;
    }
    if (data?.message) {
      lastAdminApiError = data.message;
    }
    return [];
  } catch (err: any) {
    lastAdminApiError = err?.message || 'Error loading courses';
    return [];
  }
}

export async function saveCourse(course: Partial<AdminCourse>): Promise<AdminCourse | null> {
  try {
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(course),
    });
    const data = await res.json();
    return data.course || null;
  } catch {
    return null;
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/courses/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// JOBS
// -----------------------------------------------------------------------------
export async function fetchAdminJobs(): Promise<AdminJob[]> {
  try {
    const res = await fetchWithTimeout('/api/admin/jobs', {
      headers: await authHeaders(),
    }, 8000);
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.jobs)) {
      return data.jobs;
    }
    if (data?.message) {
      lastAdminApiError = data.message;
    }
    return [];
  } catch (err: any) {
    lastAdminApiError = err?.message || 'Error loading jobs';
    return [];
  }
}

export async function fetchPublicJobs(): Promise<AdminJob[]> {
  try {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data as AdminJob[];
    }
  } catch {
    // Fall back to backend API
  }

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data as AdminJob[];
    }
  } catch {
    // Fall back to backend API
  }

  try {
    const res = await fetchWithTimeout('/api/public/jobs', { cache: 'no-store' }, 3000);
    const data = await res.json();
    return data.jobs || [];
  } catch {
    return [];
  }
}

export async function saveJob(job: Partial<AdminJob>): Promise<AdminJob | null> {
  try {
    const res = await fetch('/api/admin/jobs', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(job),
    });
    const data = await res.json();
    return data.job || null;
  } catch {
    return null;
  }
}

export async function deleteJob(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/jobs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// BLOGS
// -----------------------------------------------------------------------------
export async function fetchAdminBlogs(): Promise<AdminBlog[]> {
  try {
    const res = await fetchWithTimeout('/api/admin/blogs', {
      headers: await authHeaders(),
    }, 3000);
    const data = await res.json();
    return data.blogs || [];
  } catch {
    return [];
  }
}

export async function fetchPublicBlogs(): Promise<AdminBlog[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data as AdminBlog[];
    }
  } catch {
    // Fall back to backend API
  }

  try {
    const res = await fetchWithTimeout('/api/public/blogs', { cache: 'no-store' }, 3000);
    const data = await res.json();
    return data.blogs || [];
  } catch {
    return [];
  }
}

export async function saveBlog(blog: Partial<AdminBlog>): Promise<AdminBlog | null> {
  try {
    const res = await fetch('/api/admin/blogs', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(blog),
    });
    const data = await res.json();
    return data.blog || null;
  } catch {
    return null;
  }
}

export async function deleteBlog(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/blogs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// CERTIFICATES
// -----------------------------------------------------------------------------
function isSupabaseMissingTableError(error: any): boolean {
  const code = String(error?.code || '');
  const msg = String(error?.message || '');
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    /could not find the table|relation .* does not exist/i.test(msg)
  );
}

export async function fetchAdminCertificates(): Promise<AdminCertificate[]> {
  lastAdminApiError = null;
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data as AdminCertificate[];
    }

    if (error && isSupabaseMissingTableError(error)) {
      lastAdminApiError =
        "Supabase 'certificates' table is not created yet. Run supabase_global_sync_schema.sql in Supabase SQL Editor.";
      return [];
    }
  } catch {
    // Fall back to backend API
  }

  try {
    const res = await fetchWithTimeout(
      '/api/admin/certificates',
      {
        headers: await authHeaders(),
        cache: 'no-store',
      },
      5000
    );
    const { isJson, data } = await safeParseJsonResponse(res);
    if (isJson && res.ok && Array.isArray(data?.certificates)) {
      return data.certificates;
    }
    if (isJson && data?.message) {
      lastAdminApiError = data.message;
    }
    return [];
  } catch (err: any) {
    lastAdminApiError = err?.message || 'Error loading certificates from Supabase.';
    return [];
  }
}

export async function verifyCertificatePublic(id: string): Promise<AdminCertificate | null> {
  const cleanId = String(id || '').trim().toUpperCase();
  if (!cleanId) return null;

  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', cleanId)
      .maybeSingle();

    if (!error) {
      return (data as AdminCertificate) || null;
    }
  } catch {
    // Fall back to backend API
  }

  try {
    const res = await fetchWithTimeout(
      `/api/public/certificates/${encodeURIComponent(cleanId)}`,
      { cache: 'no-store' },
      3000
    );
    if (!res.ok) return null;
    const { isJson, data } = await safeParseJsonResponse(res);
    return isJson ? data?.certificate || null : null;
  } catch {
    return null;
  }
}

export async function saveCertificate(cert: Partial<AdminCertificate>): Promise<AdminCertificate | null> {
  lastAdminApiError = null;
  const record: Partial<AdminCertificate> = {
    id: String(cert.id || '').trim().toUpperCase(),
    student_name: String(cert.student_name || '').trim(),
    course_name: String(cert.course_name || '').trim(),
    issue_date: cert.issue_date || new Date().toISOString().slice(0, 10),
    completion_date: cert.completion_date || cert.issue_date || new Date().toISOString().slice(0, 10),
    grade: cert.grade || undefined,
    status: cert.status || 'active',
  };

  let supaError: any = null;
  try {
    const { data, error } = await supabase
      .from('certificates')
      .upsert([record], { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (!error) {
      return (data || record) as AdminCertificate;
    }

    supaError = error;
    if (isSupabaseMissingTableError(error)) {
      lastAdminApiError =
        "Supabase 'certificates' table is not created yet. Run supabase_global_sync_schema.sql in Supabase SQL Editor.";
      return null;
    }
  } catch (err) {
    supaError = err;
  }

  try {
    const res = await fetch('/api/admin/certificates', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(record),
    });
    const { isJson, data } = await safeParseJsonResponse(res);
    if (isJson && res.ok && data?.certificate) {
      return data.certificate;
    }
    lastAdminApiError =
      (isJson && data?.message) ||
      supaError?.message ||
      'Failed to save certificate to Supabase.';
    return null;
  } catch (err: any) {
    lastAdminApiError =
      supaError?.message || err?.message || 'Failed to save certificate to Supabase.';
    return null;
  }
}

export async function deleteCertificate(id: string): Promise<boolean> {
  lastAdminApiError = null;
  const cleanId = String(id || '').trim().toUpperCase();
  if (!cleanId) return false;

  let supaError: any = null;
  try {
    const { error } = await supabase.from('certificates').delete().eq('id', cleanId);
    if (!error) {
      return true;
    }
    supaError = error;
    if (isSupabaseMissingTableError(error)) {
      lastAdminApiError =
        "Supabase 'certificates' table is not created yet. Run supabase_global_sync_schema.sql in Supabase SQL Editor.";
      return false;
    }
  } catch (err) {
    supaError = err;
  }

  try {
    const res = await fetch(`/api/admin/certificates/${encodeURIComponent(cleanId)}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    if (res.ok) return true;
    const { isJson, data } = await safeParseJsonResponse(res);
    lastAdminApiError =
      (isJson && data?.message) ||
      supaError?.message ||
      'Failed to delete certificate from Supabase.';
    return false;
  } catch (err: any) {
    lastAdminApiError =
      supaError?.message || err?.message || 'Failed to delete certificate from Supabase.';
    return false;
  }
}

// -----------------------------------------------------------------------------
// APPLICATIONS (form_submissions)
// -----------------------------------------------------------------------------
export async function fetchAdminApplications(): Promise<AdminApplication[]> {
  try {
    const res = await fetchWithTimeout('/api/admin/applications', {
      headers: await authHeaders(),
    }, 8000);
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.applications)) {
      return data.applications;
    }
    if (data?.message) {
      lastAdminApiError = data.message;
    }
    return [];
  } catch (err: any) {
    lastAdminApiError = err?.message || 'Error loading applications';
    return [];
  }
}

export async function updateAppStatus(
  id: string,
  status: 'pending' | 'reviewed' | 'approved' | 'rejected',
  notes?: string
): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: await authHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteApp(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// ENQUIRIES (contact_submissions)
// -----------------------------------------------------------------------------
export async function fetchAdminEnquiries(): Promise<AdminEnquiry[]> {
  try {
    const res = await fetchWithTimeout('/api/admin/enquiries', {
      headers: await authHeaders(),
    }, 8000);
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.enquiries)) {
      return data.enquiries;
    }
    if (data?.message) {
      lastAdminApiError = data.message;
    }
    return [];
  } catch (err: any) {
    lastAdminApiError = err?.message || 'Error loading enquiries';
    return [];
  }
}

export async function updateEnqStatus(
  id: string,
  status: 'unread' | 'read' | 'contacted' | 'resolved',
  notes?: string
): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/enquiries/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: await authHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteEnq(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/enquiries/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// IMAGES (Website banners, thumbnails, badges, campus photos)
// -----------------------------------------------------------------------------
export async function fetchAdminImages(): Promise<AdminImage[]> {
  try {
    const res = await fetchWithTimeout('/api/admin/images', {
      headers: await authHeaders(),
    }, 8000);
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.images)) {
      return data.images;
    }
    if (data?.message) {
      lastAdminApiError = data.message;
    }
    return [];
  } catch (err: any) {
    lastAdminApiError = err?.message || 'Error loading images';
    return [];
  }
}

export async function saveAdminImage(image: Partial<AdminImage>): Promise<AdminImage | null> {
  try {
    const res = await fetch('/api/admin/images', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(image),
    });
    const data = await res.json();
    if (res.ok && data.success && data.image) {
      return data.image;
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteAdminImage(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/images/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// LIVE SITE MEDIA (Page-wise Website Images, Banners & CBM Academy Logo)
// -----------------------------------------------------------------------------
export interface SiteMediaUploadResult {
  success: boolean;
  slotId?: string;
  url?: string;
  updatedAt?: string;
  message?: string;
}

const SITE_MEDIA_BUCKET = 'site-media';
const SITE_MEDIA_TABLE = 'site_media';

async function safeParseJsonResponse(
  res: Response
): Promise<{ isJson: boolean; data: any; rawText: string }> {
  const rawText = await res.text();
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { isJson: false, data: null, rawText };
  }
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const looksLikeHtml = trimmed.startsWith('<');
  if (looksLikeHtml && !contentType.includes('application/json')) {
    return { isJson: false, data: null, rawText };
  }
  try {
    return { isJson: true, data: JSON.parse(trimmed), rawText };
  } catch {
    return { isJson: false, data: null, rawText };
  }
}

async function detectClientImageFormat(
  file: File
): Promise<{ ext: string; mime: string } | null> {
  try {
    const headerBuf = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(headerBuf);
    if (bytes.length < 12) return null;

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      return { ext: 'png', mime: 'image/png' };
    }

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return { ext: 'jpg', mime: 'image/jpeg' };
    }

    // WebP: RIFF....WEBP
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return { ext: 'webp', mime: 'image/webp' };
    }

    // GIF: GIF87a or GIF89a
    if (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38 &&
      (bytes[4] === 0x37 || bytes[4] === 0x39) &&
      bytes[5] === 0x61
    ) {
      return { ext: 'gif', mime: 'image/gif' };
    }

    return null;
  } catch {
    return null;
  }
}

async function cleanupOldSupabaseSlotFiles(
  slotId: string,
  keepStoragePath?: string
): Promise<{ removedCount: number; error?: string }> {
  try {
    const { data: files, error } = await supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .list('slots', { limit: 500 });

    if (error || !Array.isArray(files)) {
      return { removedCount: 0, error: error?.message };
    }

    const prefix = `${slotId}_`;
    const pathsToRemove = files
      .map((f) => (typeof f?.name === 'string' ? `slots/${f.name}` : ''))
      .filter((p) => p && p.startsWith(`slots/${prefix}`) && p !== keepStoragePath);

    if (pathsToRemove.length === 0) {
      return { removedCount: 0 };
    }

    const { error: removeErr } = await supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .remove(pathsToRemove);

    if (removeErr) {
      return { removedCount: 0, error: removeErr.message };
    }

    return { removedCount: pathsToRemove.length };
  } catch (err: any) {
    return { removedCount: 0, error: err?.message };
  }
}

async function uploadSiteMediaViaSupabase(
  cleanSlotId: string,
  file: File,
  detected: { ext: string; mime: string }
): Promise<SiteMediaUploadResult> {
  try {
    const randomBytes = new Uint8Array(6);
    crypto.getRandomValues(randomBytes);
    const token = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('');
    const storagePath = `slots/${cleanSlotId}_${Date.now()}_${token}.${detected.ext}`;

    const { error: uploadError } = await supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .upload(storagePath, file, {
        contentType: detected.mime,
        cacheControl: '31536000',
        upsert: true,
      });

    if (uploadError) {
      const msg = uploadError.message || 'Supabase Storage upload failed.';
      if (/bucket not found/i.test(msg)) {
        return {
          success: false,
          message:
            "Supabase Storage bucket 'site-media' is not created yet. Run supabase_global_sync_schema.sql in your Supabase SQL Editor to enable cloud image uploads.",
        };
      }
      if (/row-level security|unauthorized|permission|not allowed/i.test(msg)) {
        return {
          success: false,
          message:
            'Supabase Storage blocked the upload due to permissions. Sign in with your Supabase Admin account and ensure storage policies from supabase_global_sync_schema.sql are applied.',
        };
      }
      return {
        success: false,
        message: `Storage upload failed: ${msg}`,
      };
    }

    const { data: pubData } = supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = pubData?.publicUrl;
    if (!publicUrl) {
      return {
        success: false,
        message: 'Image uploaded but public URL could not be generated.',
      };
    }

    const updatedAt = new Date().toISOString();

    // Persist slot mapping in Supabase site_media table when provisioned (triggers Realtime push across devices)
    const { error: upsertError } = await supabase.from(SITE_MEDIA_TABLE).upsert(
      {
        slot_id: cleanSlotId,
        url: publicUrl,
        storage_path: storagePath,
        updated_at: updatedAt,
      },
      { onConflict: 'slot_id' }
    );

    if (upsertError) {
      console.warn(
        '[SiteMedia] Uploaded to Supabase Storage; site_media table upsert notice:',
        upsertError.message
      );
    }

    // Remove older files for this slot so Storage listing always resolves to the latest image across all devices
    await cleanupOldSupabaseSlotFiles(cleanSlotId, storagePath);

    return {
      success: true,
      slotId: cleanSlotId,
      url: publicUrl,
      updatedAt,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Image upload failed while connecting to Supabase Storage.',
    };
  }
}

export async function uploadSiteMediaFile(
  slotId: string,
  file: File
): Promise<SiteMediaUploadResult> {
  try {
    const cleanSlotId = String(slotId || '').trim();
    if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(cleanSlotId)) {
      return {
        success: false,
        message: 'Invalid image slot identifier.',
      };
    }

    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (file.type && !allowedMimes.includes(file.type.toLowerCase())) {
      return {
        success: false,
        message: 'Only PNG, JPG, WebP, or GIF images are allowed.',
      };
    }

    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return {
        success: false,
        message: 'Image size must be 10 MB or smaller.',
      };
    }

    const detected = await detectClientImageFormat(file);
    if (!detected) {
      return {
        success: false,
        message: 'Unsupported file format. Only valid PNG, JPG, WebP, or GIF images are allowed.',
      };
    }

    // 1. Primary: Direct cloud upload to Supabase Storage + DB (works identically on Desktop, Mobile, Preview, and GitHub Pages)
    const directResult = await uploadSiteMediaViaSupabase(cleanSlotId, file, detected);
    if (directResult.success && directResult.url) {
      return directResult;
    }

    // 2. Fallback: Backend Express API (which itself uploads to Supabase Storage using admin/service credentials)
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read image file.'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      });

      const postToApi = async (forceRefresh: boolean) =>
        fetchWithTimeout(
          '/api/admin/site-media/upload',
          {
            method: 'POST',
            headers: await authHeaders(forceRefresh),
            body: JSON.stringify({ slotId: cleanSlotId, imageData }),
          },
          30000
        );

      let res = await postToApi(false);
      if (res.status === 401) {
        res = await postToApi(true);
      }

      const { isJson, data } = await safeParseJsonResponse(res);
      if (isJson && res.ok && data?.success && data?.url) {
        return {
          success: true,
          slotId: data.slotId || cleanSlotId,
          url: data.url,
          updatedAt: data.updatedAt,
        };
      }

      if (isJson && res.status === 401) {
        notifyAdminSessionExpired();
        return {
          success: false,
          message: data?.message || 'Admin session expired. Please sign in again.',
        };
      }

      if (isJson && data?.message) {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch {
      // Return direct Supabase error below
    }

    return {
      success: false,
      message: directResult.message || 'Image upload failed.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error while uploading image.',
    };
  }
}

export async function resetSiteMediaFile(
  slotId: string
): Promise<{ success: boolean; defaultUrl?: string; message?: string }> {
  try {
    const cleanSlotId = String(slotId || '').trim();
    if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(cleanSlotId)) {
      return {
        success: false,
        message: 'Invalid image slot identifier.',
      };
    }

    const defaultUrl =
      cleanSlotId === SITE_LOGO_SLOT_ID
        ? DEFAULT_SITE_LOGO_URL
        : SITE_MEDIA_SLOT_MAP[cleanSlotId]?.defaultUrl || '';

    // 1. Primary: Direct Supabase reset (delete site_media row + remove all slot files from Storage)
    let directStorageErr: string | undefined;
    try {
      const { data: existingRow } = await supabase
        .from(SITE_MEDIA_TABLE)
        .select('storage_path')
        .eq('slot_id', cleanSlotId)
        .maybeSingle();

      await supabase.from(SITE_MEDIA_TABLE).delete().eq('slot_id', cleanSlotId);

      if (existingRow?.storage_path) {
        await supabase.storage.from(SITE_MEDIA_BUCKET).remove([existingRow.storage_path]);
      }
    } catch {
      // Table may not exist yet; still clean Storage files below
    }

    const cleanup = await cleanupOldSupabaseSlotFiles(cleanSlotId);
    directStorageErr = cleanup.error;

    if (!directStorageErr) {
      // Best-effort notify backend if present
      fetchWithTimeout(
        '/api/admin/site-media/reset',
        {
          method: 'POST',
          headers: await authHeaders(),
          body: JSON.stringify({ slotId: cleanSlotId }),
        },
        5000
      ).catch(() => {});

      return {
        success: true,
        defaultUrl,
      };
    }

    // 2. Fallback: Backend Express API reset
    try {
      const postReset = async (forceRefresh: boolean) =>
        fetchWithTimeout(
          '/api/admin/site-media/reset',
          {
            method: 'POST',
            headers: await authHeaders(forceRefresh),
            body: JSON.stringify({ slotId: cleanSlotId }),
          },
          10000
        );

      let res = await postReset(false);
      if (res.status === 401) {
        res = await postReset(true);
      }

      const { isJson, data } = await safeParseJsonResponse(res);
      if (isJson && res.ok && data?.success) {
        return {
          success: true,
          defaultUrl: data.defaultUrl || defaultUrl,
        };
      }
      if (isJson && data?.message) {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch {
      // Fall through to error message
    }

    return {
      success: false,
      message: directStorageErr || 'Failed to reset image in Supabase Storage.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error while resetting image.',
    };
  }
}

export interface WebinarImageUploadResult {
  success: boolean;
  url?: string;
  updatedAt?: string;
  message?: string;
}

async function uploadWebinarImageViaSupabase(
  file: File,
  detected: { ext: string; mime: string }
): Promise<WebinarImageUploadResult> {
  try {
    const randomBytes = new Uint8Array(6);
    crypto.getRandomValues(randomBytes);
    const token = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('');
    const storagePath = `webinars/webinar_${Date.now()}_${token}.${detected.ext}`;

    const { error: uploadError } = await supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .upload(storagePath, file, {
        contentType: detected.mime,
        cacheControl: '31536000',
        upsert: true,
      });

    if (uploadError) {
      const msg = uploadError.message || 'Supabase Storage upload failed.';
      if (/bucket not found/i.test(msg)) {
        return {
          success: false,
          message:
            "Supabase Storage bucket 'site-media' is not created yet. Run supabase_global_sync_schema.sql in your Supabase SQL Editor to enable cloud image uploads.",
        };
      }
      if (/row-level security|unauthorized|permission|not allowed/i.test(msg)) {
        return {
          success: false,
          message:
            'Supabase Storage blocked the upload due to permissions. Sign in with your Supabase Admin account and ensure storage policies are applied.',
        };
      }
      return {
        success: false,
        message: `Storage upload failed: ${msg}`,
      };
    }

    const { data: pubData } = supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = pubData?.publicUrl;
    if (!publicUrl) {
      return {
        success: false,
        message: 'Image uploaded but public URL could not be generated.',
      };
    }

    return {
      success: true,
      url: publicUrl,
      updatedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Image upload failed while connecting to Supabase Storage.',
    };
  }
}

export async function uploadWebinarImageFile(
  file: File
): Promise<WebinarImageUploadResult> {
  try {
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (file.type && !allowedMimes.includes(file.type.toLowerCase())) {
      return {
        success: false,
        message: 'Only PNG, JPG, WebP, or GIF images are allowed.',
      };
    }

    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return {
        success: false,
        message: 'Image size must be 10 MB or smaller.',
      };
    }

    const detected = await detectClientImageFormat(file);
    if (!detected) {
      return {
        success: false,
        message: 'Unsupported file format. Only valid PNG, JPG, WebP, or GIF images are allowed.',
      };
    }

    // 1. Primary: Direct cloud upload to Supabase Storage
    const directResult = await uploadWebinarImageViaSupabase(file, detected);
    if (directResult.success && directResult.url) {
      return directResult;
    }

    // 2. Fallback: Backend Express API
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read image file.'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      });

      const postToApi = async (forceRefresh: boolean) =>
        fetchWithTimeout(
          '/api/admin/webinars/upload-image',
          {
            method: 'POST',
            headers: await authHeaders(forceRefresh),
            body: JSON.stringify({ imageData }),
          },
          30000
        );

      let res = await postToApi(false);
      if (res.status === 401) {
        res = await postToApi(true);
      }

      const { isJson, data } = await safeParseJsonResponse(res);
      if (isJson && res.ok && data?.success && data?.url) {
        return {
          success: true,
          url: data.url,
          updatedAt: data.updatedAt,
        };
      }

      if (isJson && res.status === 401) {
        notifyAdminSessionExpired();
        return {
          success: false,
          message: data?.message || 'Admin session expired. Please sign in again.',
        };
      }

      if (isJson && data?.message) {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch {
      // Return direct Supabase error below
    }

    return {
      success: false,
      message: directResult.message || 'Webinar image upload failed.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error while uploading webinar image.',
    };
  }
}


