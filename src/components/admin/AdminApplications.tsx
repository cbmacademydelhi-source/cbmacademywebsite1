import React, { useState } from 'react';
import {
  AdminApplication,
  updateAppStatus,
  deleteApp,
} from '../../services/adminService';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  MessageSquare,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminApplicationsProps {
  applications: AdminApplication[];
  onRefresh: () => void;
}

export const AdminApplications: React.FC<AdminApplicationsProps> = ({
  applications,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<AdminApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredApps = applications.filter((app) => {
    const status = app.status || 'pending';
    if (filter !== 'all' && status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.toLowerCase().includes(q) ||
        (app.course && app.course.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleUpdateStatus = async (
    app: AdminApplication,
    newStatus: 'pending' | 'reviewed' | 'approved' | 'rejected',
    notes?: string
  ) => {
    setActionLoading(true);
    try {
      const ok = await updateAppStatus(app.id, newStatus, notes ?? app.notes);
      if (ok) {
        showToast('success', `Application for ${app.name} updated to ${newStatus}.`);
        if (selectedApp && selectedApp.id === app.id) {
          setSelectedApp({ ...selectedApp, status: newStatus, notes: notes ?? selectedApp.notes });
        }
        onRefresh();
      } else {
        showToast('error', 'Failed to update application status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const ok = await updateAppStatus(selectedApp.id, selectedApp.status, notesInput);
      if (ok) {
        showToast('success', 'Notes saved.');
        setSelectedApp({ ...selectedApp, notes: notesInput });
        onRefresh();
      } else {
        showToast('error', 'Failed to save notes.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (app: AdminApplication) => {
    if (!confirm(`Are you sure you want to delete application from "${app.name}"?`)) return;
    setActionLoading(true);
    try {
      const ok = await deleteApp(app.id);
      if (ok) {
        showToast('success', 'Application deleted.');
        if (selectedApp?.id === app.id) setSelectedApp(null);
        onRefresh();
      } else {
        showToast('error', 'Failed to delete application.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Course', 'Status', 'Message', 'Date', 'Notes'];
    const rows = filteredApps.map((a) => [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      a.email,
      a.phone,
      `"${(a.course || '').replace(/"/g, '""')}"`,
      a.status,
      `"${(a.message || '').replace(/"/g, '""')}"`,
      a.created_at,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cbm_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center space-x-2 border transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#072B57]" />
            Student Course Applications
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real student enquiries & enrollment requests from Supabase (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">form_submissions</code> table).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV ({filteredApps.length})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, phone number, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072B57] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          {(['all', 'pending', 'reviewed', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Applicant</th>
                <th className="px-6 py-3.5">Course Requested</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No student applications found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{app.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">ID: {app.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                        <span className="line-clamp-1">{app.course || 'General Enquiry'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`mailto:${app.email}`} className="hover:text-[#072B57] hover:underline">
                          {app.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`tel:${app.phone}`} className="hover:text-[#072B57] font-mono">
                          {app.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          app.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'reviewed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : app.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {app.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {app.status === 'reviewed' && <Eye className="w-3 h-3 text-blue-600" />}
                        {app.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {app.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setNotesInput(app.notes || '');
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#072B57] hover:bg-slate-100 rounded-lg transition"
                          title="View Application Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {app.status !== 'approved' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(app, 'approved')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Mark Approved / Enrolled"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(app, 'rejected')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Mark Rejected"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          disabled={actionLoading}
                          onClick={() => handleDelete(app)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedApp.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Submission ID: {selectedApp.id}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-400 block">Email Address</span>
                  <a
                    href={`mailto:${selectedApp.email}`}
                    className="font-medium text-[#072B57] hover:underline text-xs"
                  >
                    {selectedApp.email}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Phone Number</span>
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="font-medium text-[#072B57] hover:underline text-xs font-mono"
                  >
                    {selectedApp.phone}
                  </a>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-400 block">Course Requested</span>
                  <span className="font-semibold text-slate-800">{selectedApp.course || 'Not specified'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-400 block">Submitted At</span>
                  <span className="text-xs text-slate-700">
                    {new Date(selectedApp.created_at).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {selectedApp.message && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                    Student Message / Query:
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs whitespace-pre-wrap">
                    {selectedApp.message}
                  </div>
                </div>
              )}

              {/* Admin Internal Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  Internal Counselor Notes:
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Spoke to student on phone, interested in weekend batch. Scheduled demo class."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072B57]"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={actionLoading}
                  className="mt-1.5 px-3 py-1 bg-slate-800 text-white rounded text-xs font-medium hover:bg-slate-700 transition"
                >
                  Save Notes
                </button>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-2">Change Status:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp, 'approved')}
                    className="flex-1 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Approve / Enrolled
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp, 'reviewed')}
                    className="flex-1 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp, 'rejected')}
                    className="flex-1 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
