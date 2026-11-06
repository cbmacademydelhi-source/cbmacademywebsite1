import React, { useState } from 'react';
import {
  AdminCertificate,
  saveCertificate,
  deleteCertificate,
} from '../../services/adminService';
import {
  Award,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  QrCode,
  Calendar,
  User,
  BookOpen,
  X,
  ShieldCheck,
  ShieldAlert,
  FileSpreadsheet,
  ExternalLink,
} from 'lucide-react';

interface AdminCertificatesProps {
  certificates: AdminCertificate[];
  onRefresh: () => void;
}

export const AdminCertificates: React.FC<AdminCertificatesProps> = ({
  certificates,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'revoked'>('all');
  const [selectedCert, setSelectedCert] = useState<AdminCertificate | null>(null);
  const [editCert, setEditCert] = useState<Partial<AdminCertificate> | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredCerts = certificates.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.student_name.toLowerCase().includes(q) ||
        c.course_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleStatus = async (cert: AdminCertificate) => {
    setActionLoading(true);
    const newStatus = cert.status === 'active' ? 'revoked' : 'active';
    try {
      const updated = await saveCertificate({
        ...cert,
        status: newStatus,
      });
      if (updated) {
        showToast(
          'success',
          `Certificate ${cert.id} is now ${newStatus === 'active' ? 'Active & Valid' : 'Revoked / Inactive'}.`
        );
        onRefresh();
      } else {
        showToast('error', 'Failed to update certificate status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCert) return;
    if (!editCert.id || !editCert.student_name || !editCert.course_name) {
      alert('Certificate ID, Student Name, and Course Name are required.');
      return;
    }
    setActionLoading(true);
    try {
      const payload: Partial<AdminCertificate> = {
        ...editCert,
        id: editCert.id.trim().toUpperCase(),
        status: editCert.status || 'active',
        issue_date: editCert.issue_date || new Date().toISOString().slice(0, 10),
      };
      const saved = await saveCertificate(payload);
      if (saved) {
        showToast('success', `Certificate ${payload.id} saved.`);
        setEditCert(null);
        onRefresh();
      } else {
        showToast('error', 'Failed to save certificate.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (cert: AdminCertificate) => {
    if (!confirm(`Are you sure you want to permanently delete certificate "${cert.id}"?`)) return;
    setActionLoading(true);
    try {
      const ok = await deleteCertificate(cert.id);
      if (ok) {
        showToast('success', 'Certificate deleted.');
        if (selectedCert?.id === cert.id) setSelectedCert(null);
        onRefresh();
      } else {
        showToast('error', 'Failed to delete certificate.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const generateNewId = () => {
    const yr = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `CBM-${yr}-DM-${rand}`;
  };

  const exportCSV = () => {
    const headers = ['Certificate ID', 'Student Name', 'Course', 'Issue Date', 'Completion Date', 'Grade', 'Status'];
    const rows = filteredCerts.map((c) => [
      c.id,
      `"${c.student_name.replace(/"/g, '""')}"`,
      `"${c.course_name.replace(/"/g, '""')}"`,
      c.issue_date,
      c.completion_date || '',
      c.grade || '',
      c.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cbm_certificates_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <Award className="w-6 h-6 text-[#072B57]" />
            Student Certificate Verification Registry
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Certificates saved here can be publicly verified by employers and students at <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">/certificate</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Registry
          </button>
          <button
            onClick={() =>
              setEditCert({
                id: generateNewId(),
                student_name: '',
                course_name: 'Advanced AI & Digital Marketing Mastery Program',
                issue_date: new Date().toISOString().slice(0, 10),
                completion_date: new Date().toISOString().slice(0, 10),
                grade: 'Distinction (A+)',
                status: 'active',
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Issue Certificate
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Certificate ID (e.g. CBM-2024-DM-1049) or student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072B57]"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          {(['all', 'active', 'revoked'] as const).map((tab) => (
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

      {/* Certificates Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Certificate ID</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5">Course Name</th>
                <th className="px-6 py-3.5">Issue Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No certificates found.
                  </td>
                </tr>
              ) : (
                filteredCerts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-[#072B57]">
                      {c.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{c.student_name}</div>
                      {c.grade && <div className="text-xs text-slate-400">Grade: {c.grade}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-800">
                      {c.course_name}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {c.issue_date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          c.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {c.status === 'active' ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        {c.status === 'active' ? 'Active / Valid' : 'Revoked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCert(c)}
                          className="p-1.5 text-slate-500 hover:text-[#072B57] hover:bg-slate-100 rounded-lg transition"
                          title="Preview Certificate"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditCert(c)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Certificate"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleToggleStatus(c)}
                          className={`p-1.5 rounded-lg transition ${
                            c.status === 'active'
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={c.status === 'active' ? 'Revoke Certificate' : 'Activate Certificate'}
                        >
                          {c.status === 'active' ? (
                            <ShieldAlert className="w-4 h-4" />
                          ) : (
                            <ShieldCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleDelete(c)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Certificate"
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

      {/* Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Certificate Preview
              </span>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Card Render */}
            <div className="mt-4 p-6 bg-white border-4 border-amber-300 rounded-xl shadow-inner text-center relative overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-[#FF6B00] tracking-widest mb-1">
                CBM Academy • Certificate of Completion
              </div>
              <h4 className="text-xl font-bold text-[#072B57] mt-2 mb-1">
                {selectedCert.student_name}
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                has successfully completed all modules, assignments, and practical evaluations for
              </p>
              <div className="inline-block bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200 font-semibold text-xs text-slate-900 mb-3">
                {selectedCert.course_name}
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-3 border-t border-slate-200 mt-2">
                <div>
                  <span className="block font-semibold text-slate-800">Issue Date:</span>
                  <span>{selectedCert.issue_date}</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-800">Certificate ID:</span>
                  <span className="font-mono text-[#072B57] font-bold">{selectedCert.id}</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-800">Status:</span>
                  <span
                    className={`font-semibold ${
                      selectedCert.status === 'active' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {selectedCert.status === 'active' ? 'Verified Active' : 'Revoked'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {editCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveModal}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {certificates.some((c) => c.id === editCert.id) ? 'Edit Certificate' : 'Issue New Certificate'}
              </h3>
              <button
                type="button"
                onClick={() => setEditCert(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Certificate ID *</label>
                <input
                  type="text"
                  required
                  value={editCert.id || ''}
                  onChange={(e) => setEditCert({ ...editCert, id: e.target.value.toUpperCase() })}
                  placeholder="CBM-2024-DM-1049"
                  className="w-full p-2.5 font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072B57]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={editCert.student_name || ''}
                  onChange={(e) => setEditCert({ ...editCert, student_name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  value={editCert.course_name || ''}
                  onChange={(e) => setEditCert({ ...editCert, course_name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={editCert.issue_date || ''}
                    onChange={(e) => setEditCert({ ...editCert, issue_date: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grade / Distinction</label>
                  <input
                    type="text"
                    value={editCert.grade || ''}
                    onChange={(e) => setEditCert({ ...editCert, grade: e.target.value })}
                    placeholder="Distinction (A+)"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status</label>
                <select
                  value={editCert.status || 'active'}
                  onChange={(e) => setEditCert({ ...editCert, status: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="active">Active & Valid</option>
                  <option value="revoked">Revoked / Inactive</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditCert(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-1.5 text-xs font-semibold bg-[#072B57] text-white rounded-lg hover:bg-[#0A3D78] transition"
              >
                Save Certificate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
