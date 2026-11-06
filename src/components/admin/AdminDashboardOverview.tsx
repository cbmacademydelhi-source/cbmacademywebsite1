import React from 'react';
import {
  AdminStats,
} from '../../services/adminService';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
  FileCheck,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  stats: AdminStats | null;
  onNavigateTab: (tab: string) => void;
  onRefresh: () => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  stats,
  onNavigateTab,
  onRefresh,
}) => {
  const pendingTotal =
    (stats?.courses.pending || 0) +
    (stats?.jobs.pending || 0) +
    (stats?.blogs.pending || 0) +
    (stats?.applications.pending || 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            <span>Management Overview</span>
          </div>
          <h1 className="text-2xl font-black text-[#072B57] tracking-tight">
            CBM Academy Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status across courses, student applications, job listings, blog posts, and enquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400 font-medium">Pending Review</div>
            <div className="text-lg font-black text-[#FF6B00]">{pendingTotal} Items</div>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="px-4 py-2 text-xs font-bold text-[#072B57] bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] rounded-xl transition-colors cursor-pointer"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Courses Metric */}
        <div
          onClick={() => onNavigateTab('courses')}
          className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#072B57]/30 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#072B57] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            {stats && stats.courses.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {stats.courses.pending} Pending
              </span>
            )}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Courses
          </div>
          <div className="text-2xl font-black text-[#072B57] mt-1">
            {stats?.courses.total ?? 0}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Approved: {stats?.courses.approved ?? 0}</span>
            <span>Rejected: {stats?.courses.rejected ?? 0}</span>
          </div>
        </div>

        {/* Jobs Metric */}
        <div
          onClick={() => onNavigateTab('jobs')}
          className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#072B57]/30 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            {stats && stats.jobs.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {stats.jobs.pending} Pending
              </span>
            )}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Job Listings
          </div>
          <div className="text-2xl font-black text-[#072B57] mt-1">
            {stats?.jobs.total ?? 0}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Live: {stats?.jobs.approved ?? 0}</span>
            <span>Rejected: {stats?.jobs.rejected ?? 0}</span>
          </div>
        </div>

        {/* Applications Metric */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#072B57]/30 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            {stats && stats.applications.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {stats.applications.pending} New
              </span>
            )}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Course Applications
          </div>
          <div className="text-2xl font-black text-[#072B57] mt-1">
            {stats?.applications.total ?? 0}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pending Review: {stats?.applications.pending ?? 0}</span>
            <span className="text-[#FF6B00] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Enquiries Metric */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#072B57]/30 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            {stats && stats.enquiries.unread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {stats.enquiries.unread} Unread
              </span>
            )}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Contact Enquiries
          </div>
          <div className="text-2xl font-black text-[#072B57] mt-1">
            {stats?.enquiries.total ?? 0}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Unread: {stats?.enquiries.unread ?? 0}</span>
            <span className="text-[#FF6B00] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Open <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* PENDING APPROVAL QUEUE - CRITICAL WORKFLOW */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-base font-black text-[#072B57] tracking-tight">
              Pending Approvals Queue
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              {pendingTotal} Waiting
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Content with status "pending" will NOT appear on the public website until approved.
          </span>
        </div>

        {pendingTotal === 0 ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No Pending Approvals</p>
            <p className="text-xs text-slate-500 mt-0.5">
              All submitted courses, jobs, blogs, and applications have been reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending Courses */}
            {stats?.pendingQueue.courses.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#072B57]">{c.title}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                        Course Pending
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{c.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('courses')}
                  className="px-3 py-1.5 text-xs font-bold bg-[#072B57] text-white rounded-lg hover:bg-[#0c3c78] transition-colors self-end sm:self-center"
                >
                  Review Course
                </button>
              </div>
            ))}

            {/* Pending Jobs */}
            {stats?.pendingQueue.jobs.map((j) => (
              <div
                key={j.id}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#072B57]">{j.job_title}</span>
                      <span className="text-xs text-slate-500 font-medium">at {j.company_name}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                        Job Pending
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      Submitted by {j.hr_name} ({j.hr_email}) • {j.location}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('jobs')}
                  className="px-3 py-1.5 text-xs font-bold bg-[#FF6B00] text-white rounded-lg hover:bg-[#e05f00] transition-colors self-end sm:self-center"
                >
                  Review Job
                </button>
              </div>
            ))}

            {/* Pending Applications */}
            {stats?.pendingQueue.applications.map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-800 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#072B57]">{a.name}</span>
                      <span className="text-xs text-slate-500">applied for {a.course}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                        New Application
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Email: {a.email} • Phone: {a.phone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('applications')}
                  className="px-3 py-1.5 text-xs font-bold bg-[#072B57] text-white rounded-lg hover:bg-[#0c3c78] transition-colors self-end sm:self-center"
                >
                  Process Application
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Secondary Quick Nav Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Blogs Quick Card */}
        <div
          onClick={() => onNavigateTab('blogs')}
          className="bg-white p-4 rounded-xl border border-[#E5E7EB] hover:border-[#072B57]/30 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#072B57] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#072B57]">Blog Articles</div>
              <div className="text-[11px] text-slate-500">{stats?.blogs.total ?? 0} Published Articles</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Certificates Quick Card */}
        <div
          onClick={() => onNavigateTab('certificates')}
          className="bg-white p-4 rounded-xl border border-[#E5E7EB] hover:border-[#072B57]/30 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#072B57] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#072B57]">Certificate Registry</div>
              <div className="text-[11px] text-slate-500">{stats?.certificates.total ?? 0} Verified Credentials</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Webinars Quick Card */}
        <div
          onClick={() => onNavigateTab('webinars')}
          className="bg-white p-4 rounded-xl border border-[#E5E7EB] hover:border-[#072B57]/30 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#072B57] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#072B57]">Live Webinars</div>
              <div className="text-[11px] text-slate-500">Masterclasses & Registration Logs</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Connected Supabase Database Inspection Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold text-[#072B57]">
              Supabase Project Schema & Table Inspection
            </h2>
          </div>
          <div className="font-mono text-[11px] bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-slate-600">
            Endpoint: https://cxeztssvgaeytdljoned.supabase.co
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 font-mono">public.form_submissions</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                28 Real Records
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Columns: <span className="font-mono text-slate-700">Id, Name, Email, Phone, Course, Message, created_at</span>
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              Source for: Student Course Applications & Brochure Leads
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 font-mono">public.job_listings</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Table Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Columns: <span className="font-mono text-slate-700">id, company_name, job_title, job_description, location, salary, experience, skills, work_type, hr_name, hr_email, hr_phone, status, created_at</span>
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              Source for: Placement Directorate & Job Board Openings
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 font-mono">public.contact_submissions</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                Table Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Columns: <span className="font-mono text-slate-700">id, full_name, email, phone, message, created_at</span>
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              Source for: Website Contact & Inquiry Forms
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 font-mono">CBM Academic Catalog</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                15 Core Modules
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Modules: <span className="font-mono text-slate-700">SEO, GEO, Meta Ads, Google Ads PMax, Data Analytics, CRO, E-Commerce</span>
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              Source for: Comprehensive Digital Marketing Curriculum
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
