import React, { useState } from 'react';
import { AdminCourse, saveCourse, deleteCourse } from '../../services/adminService';
import {
  GraduationCap,
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
  Layers,
} from 'lucide-react';

interface AdminCoursesProps {
  courses: AdminCourse[];
  onRefresh: () => void;
}

export const AdminCourses: React.FC<AdminCoursesProps> = ({
  courses,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedCourse, setSelectedCourse] = useState<AdminCourse | null>(null);
  const [editCourse, setEditCourse] = useState<Partial<AdminCourse> | null>(null);
  const [rejectionModalCourse, setRejectionModalCourse] = useState<AdminCourse | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredCourses = courses.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = async (c: AdminCourse) => {
    setActionLoading(true);
    try {
      const updated = await saveCourse({
        ...c,
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: 'CBM Administrator',
        rejection_reason: null,
      });
      if (updated) {
        showToast('success', `Course "${c.title}" approved! It is now live on the public website.`);
        onRefresh();
      } else {
        showToast('error', 'Failed to update course status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionModalCourse) return;
    if (!rejectionReason.trim()) {
      alert('Please specify a rejection reason for the author/submitter.');
      return;
    }

    setActionLoading(true);
    try {
      const updated = await saveCourse({
        ...rejectionModalCourse,
        status: 'rejected',
        rejection_reason: rejectionReason.trim(),
      });
      if (updated) {
        showToast('success', `Course "${rejectionModalCourse.title}" rejected. Reason recorded.`);
        setRejectionModalCourse(null);
        setRejectionReason('');
        onRefresh();
      } else {
        showToast('error', 'Failed to reject course.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async (c: AdminCourse) => {
    if (!window.confirm(`Unpublish "${c.title}"? It will be removed from the public website.`)) return;
    setActionLoading(true);
    try {
      await saveCourse({
        ...c,
        status: 'pending',
      });
      showToast('success', `Course "${c.title}" moved back to pending status.`);
      onRefresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete course "${title}"?`)) return;
    setActionLoading(true);
    try {
      const ok = await deleteCourse(id);
      if (ok) {
        showToast('success', `Course "${title}" deleted.`);
        onRefresh();
      } else {
        showToast('error', 'Failed to delete course.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse?.title?.trim()) {
      alert('Course title is required.');
      return;
    }

    setActionLoading(true);
    try {
      const saved = await saveCourse(editCourse);
      if (saved) {
        showToast('success', `Course "${saved.title}" saved successfully.`);
        setEditCourse(null);
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
            Course Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage course curriculum, modules, approval pipeline, and public catalog visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditCourse({
              title: '',
              category: 'Digital Marketing',
              duration: '16 Weeks',
              description: '',
              topics: ['SEO Strategy', 'Paid Media Ads', 'AI Marketing Workflows'],
              status: 'pending',
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#072B57] hover:bg-[#0c3c78] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FF6B00]" />
          <span>Add New Course</span>
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
            placeholder="Search courses by title, category, description..."
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
              {s} ({courses.filter((c) => (s === 'all' ? true : c.status === s)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        {filteredCourses.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No courses found matching your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-[#072B57]">{c.title}</span>

                    {/* Status Badge */}
                    {c.status === 'approved' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved • Public
                      </span>
                    )}
                    {c.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Approval
                      </span>
                    )}
                    {c.status === 'rejected' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}

                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{c.category}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{c.duration}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  {/* Rejection reason notice if rejected */}
                  {c.status === 'rejected' && c.rejection_reason && (
                    <div className="mt-1 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
                      <strong>Rejection Reason:</strong> {c.rejection_reason}
                    </div>
                  )}

                  {/* Topics Pills */}
                  {Array.isArray(c.topics) && c.topics.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {c.topics.slice(0, 4).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                      {c.topics.length > 4 && (
                        <span className="text-[10px] text-slate-400">
                          +{c.topics.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(c)}
                    className="p-2 text-slate-600 hover:text-[#072B57] bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="View Complete Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditCourse(c)}
                    className="p-2 text-slate-600 hover:text-[#072B57] bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Edit Course"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {c.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleApprove(c)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                  )}

                  {c.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        setRejectionModalCourse(c);
                        setRejectionReason('');
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  )}

                  {c.status === 'approved' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUnpublish(c)}
                      className="px-2.5 py-1.5 text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Unpublish
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(c.id, c.title)}
                    className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COURSE DETAILS MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
              <h3 className="text-base font-black text-[#072B57]">Course Details</h3>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Title
                </span>
                <p className="text-sm font-bold text-[#072B57]">{selectedCourse.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Category
                  </span>
                  <p className="text-slate-700">{selectedCourse.category}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Duration
                  </span>
                  <p className="text-slate-700">{selectedCourse.duration}</p>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Status
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                    selectedCourse.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : selectedCourse.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {selectedCourse.status}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Description
                </span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedCourse.description}
                </p>
              </div>

              {selectedCourse.topics && (
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Key Topics Covered
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {selectedCourse.topics.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCourse.rejection_reason && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800">
                  <span className="font-bold block mb-0.5">Rejection Reason:</span>
                  <p>{selectedCourse.rejection_reason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT COURSE MODAL */}
      {editCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white w-full max-w-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-black text-[#072B57]">
                {editCourse.id ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button
                type="button"
                onClick={() => setEditCourse(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Course Title *
              </label>
              <input
                type="text"
                required
                value={editCourse.title || ''}
                onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                placeholder="e.g. Generative AI Marketing Specialization"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editCourse.category || ''}
                  onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
                  placeholder="Phase 1: Foundations"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={editCourse.duration || ''}
                  onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
                  placeholder="16 Weeks • 8h/week"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Course Summary / Description
              </label>
              <textarea
                rows={3}
                value={editCourse.description || ''}
                onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                placeholder="Detailed curriculum overview and practical outcomes..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Topics (Comma separated)
              </label>
              <input
                type="text"
                value={Array.isArray(editCourse.topics) ? editCourse.topics.join(', ') : ''}
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse,
                    topics: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="SEO, Meta Ads, Prompt Engineering, GA4"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Approval Status
              </label>
              <select
                value={editCourse.status || 'pending'}
                onChange={(e) => setEditCourse({ ...editCourse, status: e.target.value as any })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#072B57]"
              >
                <option value="pending">Pending Review (Hidden from Public Website)</option>
                <option value="approved">Approved (Live on Public Website)</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditCourse(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-bold text-white bg-[#072B57] hover:bg-[#0c3c78] rounded-xl"
              >
                {actionLoading ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectionModalCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#E5E7EB] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-black text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Reject Course Submission
              </h3>
              <button
                type="button"
                onClick={() => setRejectionModalCourse(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please enter the internal or feedback reason for rejecting{' '}
              <strong>"{rejectionModalCourse.title}"</strong>. This course will remain hidden from the public website.
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
                placeholder="e.g. Incomplete syllabus topics, missing live project requirements..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionModalCourse(null)}
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
