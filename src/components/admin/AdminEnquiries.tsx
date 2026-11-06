import React, { useState } from 'react';
import {
  AdminEnquiry,
  updateEnqStatus,
  deleteEnq,
} from '../../services/adminService';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Mail,
  Phone,
  Clock,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminEnquiriesProps {
  enquiries: AdminEnquiry[];
  onRefresh: () => void;
}

export const AdminEnquiries: React.FC<AdminEnquiriesProps> = ({
  enquiries,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'contacted' | 'resolved'>('all');
  const [selectedEnq, setSelectedEnq] = useState<AdminEnquiry | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const status = e.status || 'unread';
    if (filter !== 'all' && status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.phone && e.phone.toLowerCase().includes(q)) ||
        (e.subject && e.subject.toLowerCase().includes(q)) ||
        (e.message && e.message.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleUpdateStatus = async (
    enq: AdminEnquiry,
    newStatus: 'unread' | 'read' | 'contacted' | 'resolved',
    notes?: string
  ) => {
    setActionLoading(true);
    try {
      const ok = await updateEnqStatus(enq.id, newStatus, notes ?? enq.notes);
      if (ok) {
        showToast('success', `Enquiry marked as ${newStatus}.`);
        if (selectedEnq && selectedEnq.id === enq.id) {
          setSelectedEnq({ ...selectedEnq, status: newStatus, notes: notes ?? selectedEnq.notes });
        }
        onRefresh();
      } else {
        showToast('error', 'Failed to update enquiry status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnq) return;
    setActionLoading(true);
    try {
      const ok = await updateEnqStatus(selectedEnq.id, selectedEnq.status, notesInput);
      if (ok) {
        showToast('success', 'Notes saved.');
        setSelectedEnq({ ...selectedEnq, notes: notesInput });
        onRefresh();
      } else {
        showToast('error', 'Failed to save notes.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (enq: AdminEnquiry) => {
    if (!confirm(`Are you sure you want to delete enquiry from "${enq.name}"?`)) return;
    setActionLoading(true);
    try {
      const ok = await deleteEnq(enq.id);
      if (ok) {
        showToast('success', 'Enquiry deleted.');
        if (selectedEnq?.id === enq.id) setSelectedEnq(null);
        onRefresh();
      } else {
        showToast('error', 'Failed to delete enquiry.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date', 'Notes'];
    const rows = filteredEnquiries.map((e) => [
      e.id,
      `"${e.name.replace(/"/g, '""')}"`,
      e.email,
      e.phone || '',
      `"${(e.subject || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      e.status,
      e.created_at,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cbm_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#072B57]" />
            Contact Enquiries
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            General messages and contact form submissions from the CBM Academy website (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">contact_submissions</code>).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV ({filteredEnquiries.length})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enquiries by name, email, phone, subject, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072B57]"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          {(['all', 'unread', 'read', 'contacted', 'resolved'] as const).map((tab) => (
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

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Sender</th>
                <th className="px-6 py-3.5">Subject & Message</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((e) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-slate-50/80 transition ${
                      e.status === 'unread' ? 'bg-amber-50/30 font-medium' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{e.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <a href={`mailto:${e.email}`} className="hover:underline text-slate-600">
                          {e.email}
                        </a>
                        {e.phone && <span>• {e.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      {e.subject && (
                        <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {e.subject}
                        </div>
                      )}
                      <div className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                        {e.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          e.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : e.status === 'contacted'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : e.status === 'read'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                        }`}
                      >
                        {e.status === 'unread' ? 'New / Unread' : e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedEnq(e);
                            setNotesInput(e.notes || '');
                            if (e.status === 'unread') {
                              handleUpdateStatus(e, 'read');
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#072B57] hover:bg-slate-100 rounded-lg transition"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {e.status !== 'resolved' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(e, 'resolved')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Mark Resolved"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          disabled={actionLoading}
                          onClick={() => handleDelete(e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Enquiry"
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
      {selectedEnq && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedEnq.name}</h3>
                <p className="text-xs text-slate-500">{new Date(selectedEnq.created_at).toLocaleString('en-IN')}</p>
              </div>
              <button
                onClick={() => setSelectedEnq(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Email</span>
                  <a href={`mailto:${selectedEnq.email}`} className="font-medium text-[#072B57] hover:underline">
                    {selectedEnq.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Phone</span>
                  <a href={`tel:${selectedEnq.phone}`} className="font-medium text-[#072B57] hover:underline font-mono">
                    {selectedEnq.phone || 'N/A'}
                  </a>
                </div>
                {selectedEnq.subject && (
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Subject</span>
                    <span className="font-semibold text-slate-800">{selectedEnq.subject}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-500 uppercase block mb-1">
                  Message Content:
                </label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs whitespace-pre-wrap leading-relaxed">
                  {selectedEnq.message}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-500 uppercase block mb-1">
                  Internal Notes:
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Replied via email with course brochure."
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

              <div className="pt-2 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedEnq, 'contacted')}
                  className="flex-1 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedEnq, 'resolved')}
                  className="flex-1 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
