import React, { useState } from 'react';
import { AdminJob, saveJob, deleteJob } from '../../services/adminService';
import {
  Briefcase,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  Building2,
  MapPin,
  Mail,
  Phone,
  IndianRupee,
} from 'lucide-react';

interface AdminJobsProps {
  jobs: AdminJob[];
  onRefresh: () => void;
}

export const AdminJobs: React.FC<AdminJobsProps> = ({
  jobs,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const [editJob, setEditJob] = useState<Partial<AdminJob> | null>(null);
  const [rejectionModalJob, setRejectionModalJob] = useState<AdminJob | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredJobs = jobs.filter((j) => {
    if (filter !== 'all' && j.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        j.job_title.toLowerCase().includes(q) ||
        j.company_name.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.hr_name.toLowerCase().includes(q) ||
        j.hr_email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = async (job: AdminJob) => {
    setActionLoading(true);
    try {
      const updated = await saveJob({
        ...job,
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: 'CBM Placement Directorate',
        rejection_reason: null,
      });
      if (updated) {
        showToast('success', `Job "${job.job_title}" at ${job.company_name} approved! It is now live on the public Jobs page.`);
        onRefresh();
      } else {
        showToast('error', 'Failed to approve job.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionModalJob) return;
    if (!rejectionReason.trim()) {
      alert('Please specify a rejection reason.');
      return;
    }

    setActionLoading(true);
    try {
      const updated = await saveJob({
        ...rejectionModalJob,
        status: 'rejected',
        rejection_reason: rejectionReason.trim(),
      });
      if (updated) {
        showToast('success', `Job "${rejectionModalJob.job_title}" marked as rejected.`);
        setRejectionModalJob(null);
        setRejectionReason('');
        onRefresh();
      } else {
        showToast('error', 'Failed to reject job.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async (job: AdminJob) => {
    if (!window.confirm(`Unpublish "${job.job_title}"? It will be hidden from the public Jobs portal.`)) return;
    setActionLoading(true);
    try {
      await saveJob({
        ...job,
        status: 'pending',
      });
      showToast('success', `Job "${job.job_title}" moved back to pending review.`);
      onRefresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete job "${title}"?`)) return;
    setActionLoading(true);
    try {
      const ok = await deleteJob(id);
      if (ok) {
        showToast('success', `Job "${title}" deleted.`);
        onRefresh();
      } else {
        showToast('error', 'Failed to delete job.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJob?.job_title?.trim() || !editJob?.company_name?.trim()) {
      alert('Job title and company name are required.');
      return;
    }

    setActionLoading(true);
    try {
      const saved = await saveJob(editJob);
      if (saved) {
        showToast('success', `Job "${saved.job_title}" saved successfully.`);
        setEditJob(null);
        onRefresh();
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#072B57] tracking-tight">
            Job Posting Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review employer submissions, approve job listings, and manage graduate hiring opportunities.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditJob({
              company_name: '',
              hr_name: 'Placement Office',
              hr_email: 'office@cbmacademy.in',
              hr_phone: '+91-92115-83150',
              job_title: '',
              job_description: '',
              location: 'Delhi NCR',
              salary: '₹4.5 - 7.0 LPA',
              experience: 'Freshers & 0-2 Years',
              skills: ['SEO', 'Meta Ads', 'Google Ads'],
              work_type: 'Full-time',
              is_remote: false,
              status: 'approved',
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#072B57] hover:bg-[#0c3c78] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FF6B00]" />
          <span>Add New Job</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by role, company, location, HR..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                filter === s
                  ? 'bg-[#072B57] text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-[#E5E7EB]'
              }`}
            >
              {s} ({jobs.filter((j) => (s === 'all' ? true : j.status === s)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        {filteredJobs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No job listings found matching your search.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {filteredJobs.map((j) => (
              <div
                key={j.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-[#072B57]">{j.job_title}</span>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {j.company_name}
                    </span>

                    {/* Status Badge */}
                    {j.status === 'approved' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved • Public
                      </span>
                    )}
                    {j.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </span>
                    )}
                    {j.status === 'rejected' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}

                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{j.location}</span>
                    {j.is_remote && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                        Remote
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {j.job_description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-0.5">
                    {j.salary && <span>Salary: {j.salary}</span>}
                    {j.experience && <span>Exp: {j.experience}</span>}
                    <span>HR: {j.hr_name} ({j.hr_email})</span>
                  </div>

                  {/* Rejection notice */}
                  {j.status === 'rejected' && j.rejection_reason && (
                    <div className="mt-1 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
                      <strong>Rejection Reason:</strong> {j.rejection_reason}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(j)}
                    className="p-2 text-slate-600 hover:text-[#072B57] bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="View Complete Job Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditJob(j)}
                    className="p-2 text-slate-600 hover:text-[#072B57] bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Edit Job"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {j.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleApprove(j)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}

                  {j.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        setRejectionModalJob(j);
                        setRejectionReason('');
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  )}

                  {j.status === 'approved' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUnpublish(j)}
                      className="px-2.5 py-1.5 text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Unpublish
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(j.id, j.job_title)}
                    className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
              <h3 className="text-base font-black text-[#072B57]">Job Listing Details</h3>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Job Title & Company
                </span>
                <p className="text-sm font-bold text-[#072B57]">
                  {selectedJob.job_title} at {selectedJob.company_name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Location
                  </span>
                  <p className="text-slate-800 font-medium">{selectedJob.location}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Work Type
                  </span>
                  <p className="text-slate-800 font-medium">{selectedJob.work_type}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Salary / Compensation
                  </span>
                  <p className="text-slate-800 font-medium">{selectedJob.salary || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Experience Level
                  </span>
                  <p className="text-slate-800 font-medium">{selectedJob.experience || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  HR / Recruiter Contact
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p>Name: {selectedJob.hr_name}</p>
                  <p>Email: {selectedJob.hr_email}</p>
                  <p>Phone: {selectedJob.hr_phone}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Job Description
                </span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">
                  {selectedJob.job_description}
                </p>
              </div>

              {selectedJob.rejection_reason && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800">
                  <span className="font-bold block mb-0.5">Rejection Reason:</span>
                  <p>{selectedJob.rejection_reason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT JOB MODAL */}
      {editJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white w-full max-w-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-black text-[#072B57]">
                {editJob.id ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h3>
              <button
                type="button"
                onClick={() => setEditJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={editJob.job_title || ''}
                  onChange={(e) => setEditJob({ ...editJob, job_title: e.target.value })}
                  placeholder="e.g. Performance Marketing Executive"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={editJob.company_name || ''}
                  onChange={(e) => setEditJob({ ...editJob, company_name: e.target.value })}
                  placeholder="e.g. MediaCraft Agency"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editJob.location || ''}
                  onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                  placeholder="Delhi NCR"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work Type
                </label>
                <select
                  value={editJob.work_type || 'Full-time'}
                  onChange={(e) => setEditJob({ ...editJob, work_type: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={editJob.salary || ''}
                  onChange={(e) => setEditJob({ ...editJob, salary: e.target.value })}
                  placeholder="₹4.5 - 7.0 LPA"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  HR Name
                </label>
                <input
                  type="text"
                  value={editJob.hr_name || ''}
                  onChange={(e) => setEditJob({ ...editJob, hr_name: e.target.value })}
                  placeholder="Recruiter Name"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  HR Email
                </label>
                <input
                  type="email"
                  value={editJob.hr_email || ''}
                  onChange={(e) => setEditJob({ ...editJob, hr_email: e.target.value })}
                  placeholder="hr@company.com"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  HR Phone
                </label>
                <input
                  type="text"
                  value={editJob.hr_phone || ''}
                  onChange={(e) => setEditJob({ ...editJob, hr_phone: e.target.value })}
                  placeholder="+91-XXXXX-XXXXX"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Description
              </label>
              <textarea
                rows={4}
                required
                value={editJob.job_description || ''}
                onChange={(e) => setEditJob({ ...editJob, job_description: e.target.value })}
                placeholder="Key responsibilities, qualifications, and requirements..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Approval Status
              </label>
              <select
                value={editJob.status || 'pending'}
                onChange={(e) => setEditJob({ ...editJob, status: e.target.value as any })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
              >
                <option value="pending">Pending Review (Hidden from Public Jobs Page)</option>
                <option value="approved">Approved (Live on Public Jobs Page)</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditJob(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-bold text-white bg-[#072B57] hover:bg-[#0c3c78] rounded-xl"
              >
                {actionLoading ? 'Saving...' : 'Save Job'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectionModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#E5E7EB] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-black text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Reject Job Submission
              </h3>
              <button
                type="button"
                onClick={() => setRejectionModalJob(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please enter the reason for rejecting{' '}
              <strong>"{rejectionModalJob.job_title}"</strong> at {rejectionModalJob.company_name}.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Rejection Reason *
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Unverified employer, missing stipend details, spam role..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionModalJob(null)}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleRejectSubmit}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
