import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Users,
  Calendar,
  Clock,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { Webinar, WebinarStatus, WebinarType } from '../../types';
import {
  getWebinars,
  saveWebinar,
  deleteWebinar,
  toggleWebinarStatus,
} from '../../services/webinarStorage';
import { AdminWebinarRegistrations } from './AdminWebinarRegistrations';
import { getAdminToken } from '../../services/adminService';

export const AdminWebinars: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'registrations'>('sessions');
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [editWebinar, setEditWebinar] = useState<Partial<Webinar> | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadWebinars = () => {
    setWebinars(getWebinars());
  };

  useEffect(() => {
    loadWebinars();
  }, []);

  const handleToggle = (id: string) => {
    const res = toggleWebinarStatus(id);
    if (res) {
      showToast('success', `Status updated to ${res.status}.`);
      loadWebinars();
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete webinar "${title}"?`)) return;
    deleteWebinar(id);
    showToast('success', 'Webinar deleted.');
    loadWebinars();
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editWebinar || !editWebinar.title || !editWebinar.date || !editWebinar.time) {
      alert('Title, date, and time are required.');
      return;
    }

    const payload: Webinar = {
      id: editWebinar.id || `webinar-${Date.now()}`,
      title: editWebinar.title,
      description: editWebinar.description || '',
      posterUrl: editWebinar.posterUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200',
      type: editWebinar.type || 'free',
      price: editWebinar.price || undefined,
      date: editWebinar.date,
      time: editWebinar.time,
      duration: editWebinar.duration || '60 Minutes',
      host: editWebinar.host || 'CBM Academy Expert Mentor',
      whatYouWillLearn: Array.isArray(editWebinar.whatYouWillLearn)
        ? editWebinar.whatYouWillLearn
        : typeof editWebinar.whatYouWillLearn === 'string'
        ? (editWebinar.whatYouWillLearn as string).split('\n').filter(Boolean)
        : [],
      registrationLink: editWebinar.registrationLink || '',
      capacity: editWebinar.capacity || 100,
      current_registrations: editWebinar.current_registrations || 0,
      status: editWebinar.status || 'published',
      createdAt: editWebinar.createdAt || new Date().toISOString(),
    };

    saveWebinar(payload);
    showToast('success', 'Webinar saved successfully.');
    setEditWebinar(null);
    loadWebinars();
  };

  const adminToken = getAdminToken() || 'admin-local-token';

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

      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-6 h-6 text-[#072B57]" />
            Live Masterclasses & Webinar Hub
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Publish interactive masterclasses and monitor attendee registrations from Supabase.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === 'sessions'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Masterclass Sessions ({webinars.length})
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === 'registrations'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registered Attendees
            </button>
          </div>
          {activeTab === 'sessions' && (
            <button
              onClick={() =>
                setEditWebinar({
                  title: '',
                  description: '',
                  type: 'free',
                  date: new Date().toISOString().slice(0, 10),
                  time: '11:00 AM IST',
                  duration: '60 Minutes',
                  host: 'Lead Growth Marketer, CBM Academy',
                  status: 'published',
                  capacity: 250,
                  whatYouWillLearn: [
                    'How to build AI-driven organic funnels',
                    'High-conversion Meta & Google Ad frameworks',
                    'Live Q&A and hands-on case studies',
                  ],
                })
              }
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-sm font-semibold rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Schedule Masterclass
            </button>
          )}
        </div>
      </div>

      {activeTab === 'registrations' ? (
        <AdminWebinarRegistrations token={adminToken} />
      ) : (
        /* Sessions Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Webinar Session</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Host / Speaker</th>
                  <th className="px-6 py-3.5">Type & Price</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {webinars.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No webinars scheduled yet.
                    </td>
                  </tr>
                ) : (
                  webinars.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 line-clamp-1">{w.title}</div>
                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {w.description || 'Interactive live masterclass'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#072B57]" />
                          {w.date}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {w.time} ({w.duration})
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-800">
                        {w.host}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            w.type === 'free'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {w.type === 'free' ? 'Free Access' : `Paid (₹${w.price})`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            w.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedWebinar(w)}
                            className="p-1.5 text-slate-500 hover:text-[#072B57] hover:bg-slate-100 rounded-lg transition"
                            title="Preview Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditWebinar(w)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Webinar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggle(w.id)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Toggle Published / Draft"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(w.id, w.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Webinar"
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
      )}

      {/* Preview Modal */}
      {selectedWebinar && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#072B57] text-white">
                {selectedWebinar.type.toUpperCase()} MASTERCLASS
              </span>
              <button
                onClick={() => setSelectedWebinar(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600">
              <h3 className="text-base font-bold text-slate-900">{selectedWebinar.title}</h3>
              <p className="text-slate-600 leading-relaxed">{selectedWebinar.description}</p>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Date</span>
                  <span className="font-semibold text-slate-800">{selectedWebinar.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Time & Duration</span>
                  <span className="font-semibold text-slate-800">{selectedWebinar.time} ({selectedWebinar.duration})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Host</span>
                  <span className="font-semibold text-slate-800">{selectedWebinar.host}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Seats / Capacity</span>
                  <span className="font-semibold text-slate-800">{selectedWebinar.capacity || 'Unlimited'}</span>
                </div>
              </div>
              {Array.isArray(selectedWebinar.whatYouWillLearn) && selectedWebinar.whatYouWillLearn.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Key Takeaways:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    {selectedWebinar.whatYouWillLearn.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {editWebinar && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveModal}
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editWebinar.id ? 'Edit Masterclass' : 'Schedule New Masterclass'}
              </h3>
              <button
                type="button"
                onClick={() => setEditWebinar(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Masterclass Title *</label>
                <input
                  type="text"
                  required
                  value={editWebinar.title || ''}
                  onChange={(e) => setEditWebinar({ ...editWebinar, title: e.target.value })}
                  placeholder="e.g. Generative AI Marketing Frameworks for 2026"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072B57]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  value={editWebinar.description || ''}
                  onChange={(e) => setEditWebinar({ ...editWebinar, description: e.target.value })}
                  placeholder="Brief synopsis of what will be covered..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={editWebinar.date || ''}
                    onChange={(e) => setEditWebinar({ ...editWebinar, date: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    value={editWebinar.time || ''}
                    onChange={(e) => setEditWebinar({ ...editWebinar, time: e.target.value })}
                    placeholder="11:00 AM IST"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={editWebinar.duration || '60 Minutes'}
                    onChange={(e) => setEditWebinar({ ...editWebinar, duration: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Host / Speaker</label>
                  <input
                    type="text"
                    value={editWebinar.host || ''}
                    onChange={(e) => setEditWebinar({ ...editWebinar, host: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Type</label>
                  <select
                    value={editWebinar.type || 'free'}
                    onChange={(e) => setEditWebinar({ ...editWebinar, type: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="free">Free Access</option>
                    <option value="paid">Paid Admission</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price (₹, if paid)</label>
                  <input
                    type="text"
                    value={editWebinar.price || ''}
                    onChange={(e) => setEditWebinar({ ...editWebinar, price: e.target.value })}
                    placeholder="e.g. 499"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status</label>
                <select
                  value={editWebinar.status || 'published'}
                  onChange={(e) => setEditWebinar({ ...editWebinar, status: e.target.value as any })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="published">Published (Visible on /webinars)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditWebinar(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-[#072B57] text-white rounded-lg hover:bg-[#0A3D78] transition"
              >
                Save Masterclass
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
