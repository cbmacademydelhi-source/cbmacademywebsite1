import { supabase } from '../lib/supabase';
import type {
  AdminCourse,
  AdminJob,
  AdminBlog,
  AdminCertificate,
  AdminApplication,
  AdminEnquiry,
} from '../../server/adminServer';

export type {
  AdminCourse,
  AdminJob,
  AdminBlog,
  AdminCertificate,
  AdminApplication,
  AdminEnquiry,
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
}

const TOKEN_KEY = 'cbm_admin_access_token';
const USER_KEY = 'cbm_admin_user_data';

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

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function authHeaders(): Promise<HeadersInit> {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
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
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetchWithTimeout('/api/admin/session', {
      headers: await authHeaders(),
    }, 3000);
    return res.ok;
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
    }, 3000);
    const data = await res.json();
    return data.stats || null;
  } catch {
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
    }, 3000);
    const data = await res.json();
    return data.courses || [];
  } catch {
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
    }, 3000);
    const data = await res.json();
    return data.jobs || [];
  } catch {
    return [];
  }
}

export async function fetchPublicJobs(): Promise<AdminJob[]> {
  try {
    const res = await fetchWithTimeout('/api/public/jobs', {}, 3000);
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
    const res = await fetchWithTimeout('/api/public/blogs', {}, 3000);
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
export async function fetchAdminCertificates(): Promise<AdminCertificate[]> {
  try {
    const res = await fetchWithTimeout('/api/admin/certificates', {
      headers: await authHeaders(),
    }, 3000);
    const data = await res.json();
    return data.certificates || [];
  } catch {
    return [];
  }
}

export async function verifyCertificatePublic(id: string): Promise<AdminCertificate | null> {
  try {
    const res = await fetchWithTimeout(`/api/public/certificates/${encodeURIComponent(id)}`, {}, 3000);
    if (!res.ok) return null;
    const data = await res.json();
    return data.certificate || null;
  } catch {
    return null;
  }
}

export async function saveCertificate(cert: Partial<AdminCertificate>): Promise<AdminCertificate | null> {
  try {
    const res = await fetch('/api/admin/certificates', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(cert),
    });
    const data = await res.json();
    return data.certificate || null;
  } catch {
    return null;
  }
}

export async function deleteCertificate(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/certificates/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
    return res.ok;
  } catch {
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
    }, 3000);
    const data = await res.json();
    return data.applications || [];
  } catch {
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
    }, 3000);
    const data = await res.json();
    return data.enquiries || [];
  } catch {
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
