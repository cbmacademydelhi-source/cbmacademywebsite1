import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Clock,
  GraduationCap,
  Briefcase,
  FileText,
  Video,
  Award,
  Users,
  MessageSquare,
  ShieldCheck,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  Bell,
  Database,
  ChevronRight,
} from 'lucide-react';
import {
  AdminStats,
  AdminCourse,
  AdminJob,
  AdminBlog,
  AdminCertificate,
  AdminApplication,
  AdminEnquiry,
  fetchAdminStats,
  fetchAdminCourses,
  fetchAdminJobs,
  fetchAdminBlogs,
  fetchAdminCertificates,
  fetchAdminApplications,
  fetchAdminEnquiries,
  getAdminUser,
  logoutAdmin,
} from '../../services/adminService';

import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminCourses } from './AdminCourses';
import { AdminJobs } from './AdminJobs';
import { AdminBlogs } from './AdminBlogs';
import { AdminWebinars } from './AdminWebinars';
import { AdminCertificates } from './AdminCertificates';
import { AdminApplications } from './AdminApplications';
import { AdminEnquiries } from './AdminEnquiries';
import { AdminUsers } from './AdminUsers';
import { AdminSettings } from './AdminSettings';

export type AdminTab =
  | 'overview'
  | 'pending'
  | 'courses'
  | 'jobs'
  | 'blogs'
  | 'webinars'
  | 'applications'
  | 'certificates'
  | 'enquiries'
  | 'users'
  | 'settings';

interface AdminLayoutProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  initialTab?: AdminTab;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onLogout,
  onNavigateHome,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Loaded data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [certificates, setCertificates] = useState<AdminCertificate[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);

  const user = getAdminUser();

  const loadAllData = useCallback(async () => {
    setRefreshing(true);

    // Guaranteed safety timeout: Never block the UI for more than 1.5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    try {
      const [sRes, cRes, jRes, bRes, certsRes, appsRes, enqsRes] = await Promise.allSettled([
        fetchAdminStats(),
        fetchAdminCourses(),
        fetchAdminJobs(),
        fetchAdminBlogs(),
        fetchAdminCertificates(),
        fetchAdminApplications(),
        fetchAdminEnquiries(),
      ]);

      if (sRes.status === 'fulfilled' && sRes.value) setStats(sRes.value);
      if (cRes.status === 'fulfilled' && Array.isArray(cRes.value)) setCourses(cRes.value);
      if (jRes.status === 'fulfilled' && Array.isArray(jRes.value)) setJobs(jRes.value);
      if (bRes.status === 'fulfilled' && Array.isArray(bRes.value)) setBlogs(bRes.value);
      if (certsRes.status === 'fulfilled' && Array.isArray(certsRes.value)) setCertificates(certsRes.value);
      if (appsRes.status === 'fulfilled' && Array.isArray(appsRes.value)) setApplications(appsRes.value);
      if (enqsRes.status === 'fulfilled' && Array.isArray(enqsRes.value)) setEnquiries(enqsRes.value);
    } catch (err) {
      console.warn('[Admin] Data loading notice:', err);
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Keep hash synced with tab
  useEffect(() => {
    window.location.hash = `admin/${activeTab}`;
  }, [activeTab]);

  const handleLogout = async () => {
    await logoutAdmin();
    onLogout();
  };

  const effectiveStats: AdminStats = stats || {
    courses: {
      total: courses.length,
      pending: courses.filter((c) => c.status === 'pending').length,
      approved: courses.filter((c) => c.status === 'approved').length,
      rejected: courses.filter((c) => c.status === 'rejected').length,
    },
    jobs: {
      total: jobs.length,
      pending: jobs.filter((j) => j.status === 'pending').length,
      approved: jobs.filter((j) => j.status === 'approved').length,
      rejected: jobs.filter((j) => j.status === 'rejected').length,
    },
    blogs: {
      total: blogs.length,
      pending: blogs.filter((b) => b.status === 'pending').length,
      approved: blogs.filter((b) => b.status === 'approved').length,
    },
    certificates: {
      total: certificates.length,
      active: certificates.filter((c) => c.status === 'active' || c.status === 'approved').length,
    },
    applications: {
      total: applications.length,
      pending: applications.filter((a) => a.status === 'pending').length,
    },
    enquiries: {
      total: enquiries.length,
      unread: enquiries.filter((e) => e.status === 'unread').length,
    },
    pendingQueue: {
      courses: courses.filter((c) => c.status === 'pending'),
      jobs: jobs.filter((j) => j.status === 'pending'),
      blogs: blogs.filter((b) => b.status === 'pending'),
      applications: applications.filter((a) => a.status === 'pending'),
      enquiries: enquiries.filter((e) => e.status === 'unread'),
    },
  };

  const pendingTotal =
    (effectiveStats.courses.pending || 0) +
    (effectiveStats.jobs.pending || 0) +
    (effectiveStats.blogs.pending || 0) +
    (effectiveStats.applications.pending || 0);

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'pending',
      label: 'Pending Approvals',
      icon: Clock,
      badge: pendingTotal > 0 ? pendingTotal : undefined,
      badgeColor: 'bg-[#FF6B00] text-white',
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: GraduationCap,
      badge: stats?.courses.pending ? `${stats.courses.pending} pending` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'jobs',
      label: 'Jobs & Openings',
      icon: Briefcase,
      badge: stats?.jobs.pending ? `${stats.jobs.pending} pending` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'blogs',
      label: 'Blogs & Articles',
      icon: FileText,
      badge: stats?.blogs.pending ? `${stats.blogs.pending} pending` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'webinars',
      label: 'Webinars & Sessions',
      icon: Video,
    },
    {
      id: 'applications',
      label: 'Student Applications',
      icon: Users,
      badge: applications.length > 0 ? applications.length : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'certificates',
      label: 'Certificates Registry',
      icon: Award,
      badge: certificates.length > 0 ? certificates.length : undefined,
    },
    {
      id: 'enquiries',
      label: 'Contact Enquiries',
      icon: MessageSquare,
      badge: stats?.enquiries.unread ? `${stats.enquiries.unread} new` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'users',
      label: 'Admin Team & Roles',
      icon: ShieldCheck,
    },
    {
      id: 'settings',
      label: 'Database & Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased text-[#1E293B]">
      {/* Top Mobile Bar */}
      <div className="lg:hidden bg-[#072B57] text-white px-4 py-3 flex items-center justify-between border-b border-[#0A3D78] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-sm text-[#FF6B00]">
            CBM
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide block">CBM ACADEMY</span>
            <span className="text-[10px] text-orange-300 font-semibold uppercase tracking-wider block">
              Admin Portal
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#072B57] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Brand Header */}
          <div className="p-5 border-b border-[#0D386E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-black text-base text-[#FF6B00] shadow-inner">
                CBM
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-wider text-white">CBM ACADEMY</h1>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mt-0.5">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-200/60">
              Management Suite
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#FF6B00] text-white shadow-sm'
                      : 'text-slate-300 hover:bg-[#0D386E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        item.badgeColor || 'bg-white/20 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Logout */}
          <div className="p-3 border-t border-[#0D386E] space-y-1">
            <button
              onClick={onNavigateHome}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-[#0D386E] hover:text-white transition"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>View Public Site</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for Mobile */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header Bar */}
          <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Admin Panel /
              </span>
              <h2 className="text-base font-bold text-slate-900 capitalize">
                {activeTab.replace('-', ' ')}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Database Status Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase Connected</span>
              </div>

              {/* Refresh button */}
              <button
                onClick={loadAllData}
                disabled={refreshing}
                title="Refresh All Database Data"
                className="p-2 text-slate-500 hover:text-[#072B57] hover:bg-slate-100 rounded-lg transition"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#FF6B00]' : ''}`} />
              </button>

              {/* Admin Profile Chip */}
              <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-[#072B57] text-[#FF6B00] flex items-center justify-center font-bold text-xs shadow-inner">
                  {(user?.email || 'A')[0].toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {user?.email || 'office@cbmacademy.in'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Super Administrator</div>
                </div>
              </div>
            </div>
          </header>

          {/* View Container */}
          <div className="p-6 max-w-7xl w-full mx-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-600">Connecting to Supabase Database...</p>
                <p className="text-xs text-slate-400 mt-1">Loading courses, jobs, blogs & student submissions</p>
              </div>
            ) : (
              <>
                {(activeTab === 'overview' || activeTab === 'pending') && (
                  <AdminDashboardOverview
                    stats={effectiveStats}
                    onRefresh={loadAllData}
                    onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
                  />
                )}

                {activeTab === 'courses' && (
                  <AdminCourses courses={courses} onRefresh={loadAllData} />
                )}

                {activeTab === 'jobs' && (
                  <AdminJobs jobs={jobs} onRefresh={loadAllData} />
                )}

                {activeTab === 'blogs' && (
                  <AdminBlogs blogs={blogs} onRefresh={loadAllData} />
                )}

                {activeTab === 'webinars' && <AdminWebinars />}

                {activeTab === 'applications' && (
                  <AdminApplications applications={applications} onRefresh={loadAllData} />
                )}

                {activeTab === 'certificates' && (
                  <AdminCertificates certificates={certificates} onRefresh={loadAllData} />
                )}

                {activeTab === 'enquiries' && (
                  <AdminEnquiries enquiries={enquiries} onRefresh={loadAllData} />
                )}

                {activeTab === 'users' && <AdminUsers />}

                {activeTab === 'settings' && <AdminSettings />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
