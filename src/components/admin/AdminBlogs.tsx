import React, { useState } from 'react';
import {
  AdminBlog,
  saveBlog,
  deleteBlog,
} from '../../services/adminService';
import {
  FileText,
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
  ExternalLink,
  Calendar,
  User,
  Tag,
} from 'lucide-react';

interface AdminBlogsProps {
  blogs: AdminBlog[];
  onRefresh: () => void;
}

export const AdminBlogs: React.FC<AdminBlogsProps> = ({ blogs, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedBlog, setSelectedBlog] = useState<AdminBlog | null>(null);
  const [editBlog, setEditBlog] = useState<Partial<AdminBlog> | null>(null);
  const [rejectionModalBlog, setRejectionModalBlog] = useState<AdminBlog | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredBlogs = blogs.filter((b) => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = async (blog: AdminBlog) => {
    setActionLoading(true);
    try {
      const updated = await saveBlog({
        ...blog,
        status: 'approved',
        published_at: blog.published_at || new Date().toISOString(),
        rejection_reason: null,
      });
      if (updated) {
        showToast('success', `Blog "${blog.title}" approved! It is now visible on the public /blogs page.`);
        onRefresh();
      } else {
        showToast('error', 'Failed to approve blog.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionModalBlog) return;
    if (!rejectionReason.trim()) {
      alert('Please state a rejection reason.');
      return;
    }
    setActionLoading(true);
    try {
      const updated = await saveBlog({
        ...rejectionModalBlog,
        status: 'rejected',
        rejection_reason: rejectionReason.trim(),
      });
      if (updated) {
        showToast('success', `Blog "${rejectionModalBlog.title}" rejected.`);
        setRejectionModalBlog(null);
        setRejectionReason('');
        onRefresh();
      } else {
        showToast('error', 'Failed to reject blog.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBlog) return;
    setActionLoading(true);
    try {
      const payload: Partial<AdminBlog> = {
        ...editBlog,
        status: editBlog.status || 'pending',
      };
      if (!payload.slug && payload.title) {
        payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      const saved = await saveBlog(payload);
      if (saved) {
        showToast('success', 'Blog saved successfully.');
        setEditBlog(null);
        onRefresh();
      } else {
        showToast('error', 'Failed to save blog.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (blog: AdminBlog) => {
    if (!confirm(`Are you sure you want to permanently delete "${blog.title}"?`)) return;
    setActionLoading(true);
    try {
      const ok = await deleteBlog(blog.id);
      if (ok) {
        showToast('success', 'Blog deleted.');
        if (selectedBlog?.id === blog.id) setSelectedBlog(null);
        onRefresh();
      } else {
        showToast('error', 'Failed to delete blog.');
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
            <FileText className="w-6 h-6 text-[#072B57]" />
            Blog & Article Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Articles must be marked <strong>Approved</strong> to appear publicly on <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">/blogs</code>.
          </p>
        </div>
        <button
          onClick={() =>
            setEditBlog({
              title: '',
              slug: '',
              category: 'Digital Marketing',
              author: 'CBM Faculty Team',
              author_role: 'Digital Marketing Lead',
              excerpt: '',
              content: '',
              read_time: '5 min read',
              image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
              status: 'approved',
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Write New Blog
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search blogs by title, category, author, excerpt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072B57]"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
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

      {/* Blogs List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Blog Article</th>
                <th className="px-6 py-3.5">Author</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No articles found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200'}
                          alt={b.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1">{b.title}</div>
                          <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{b.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-medium text-slate-800">{b.author}</div>
                      <div className="text-slate-400">{b.author_role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <Tag className="w-3 h-3 text-[#FF6B00]" />
                        {b.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            b.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {b.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {b.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                          {b.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                          {b.status}
                        </span>
                        {b.status === 'rejected' && b.rejection_reason && (
                          <div className="text-[11px] text-rose-600 mt-1 max-w-xs line-clamp-2">
                            Reason: {b.rejection_reason}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBlog(b)}
                          className="p-1.5 text-slate-500 hover:text-[#072B57] hover:bg-slate-100 rounded-lg transition"
                          title="Preview Blog"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditBlog(b)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {b.status !== 'approved' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleApprove(b)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Approve & Publish to /blogs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {b.status !== 'rejected' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => {
                              setRejectionModalBlog(b);
                              setRejectionReason(b.rejection_reason || '');
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Reject Article"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          disabled={actionLoading}
                          onClick={() => handleDelete(b)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Blog"
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
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#072B57] text-white">
                {selectedBlog.category}
              </span>
              <button
                onClick={() => setSelectedBlog(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-4">
              <img
                src={selectedBlog.image_url}
                alt={selectedBlog.title}
                className="w-full h-52 object-cover rounded-xl border border-slate-200"
              />
              <h3 className="text-xl font-bold text-slate-900">{selectedBlog.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>By {selectedBlog.author} ({selectedBlog.author_role})</span>
                <span>•</span>
                <span>{selectedBlog.read_time}</span>
              </div>
              <p className="text-sm text-slate-700 italic border-l-2 border-[#FF6B00] pl-3">
                {selectedBlog.excerpt}
              </p>
              <div className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                {selectedBlog.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {editBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveModal}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editBlog.id ? 'Edit Blog Article' : 'New Blog Article'}
              </h3>
              <button
                type="button"
                onClick={() => setEditBlog(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editBlog.title || ''}
                  onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                  placeholder="e.g. 10 AI Marketing Trends That Will Define 2026"
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#072B57]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editBlog.category || ''}
                    onChange={(e) => setEditBlog({ ...editBlog, category: e.target.value })}
                    placeholder="AI & Growth, SEO, Meta Ads..."
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Read Time</label>
                  <input
                    type="text"
                    value={editBlog.read_time || '5 min read'}
                    onChange={(e) => setEditBlog({ ...editBlog, read_time: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={editBlog.author || ''}
                    onChange={(e) => setEditBlog({ ...editBlog, author: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Author Role</label>
                  <input
                    type="text"
                    value={editBlog.author_role || ''}
                    onChange={(e) => setEditBlog({ ...editBlog, author_role: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={editBlog.image_url || ''}
                  onChange={(e) => setEditBlog({ ...editBlog, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Excerpt / Brief Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editBlog.excerpt || ''}
                  onChange={(e) => setEditBlog({ ...editBlog, excerpt: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Article Content *</label>
                <textarea
                  rows={6}
                  required
                  value={editBlog.content || ''}
                  onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                  placeholder="Write the full article content here..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
                <select
                  value={editBlog.status || 'pending'}
                  onChange={(e) => setEditBlog({ ...editBlog, status: e.target.value as any })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved (Live on Public /blogs)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditBlog(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold bg-[#072B57] text-white rounded-lg hover:bg-[#0A3D78] transition"
              >
                Save Blog
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModalBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              Reject Blog
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide a clear reason for rejecting &quot;{rejectionModalBlog.title}&quot;.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Article needs more specific case studies and source citations before publication."
              className="w-full mt-3 p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectionModalBlog(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleRejectSubmit}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
