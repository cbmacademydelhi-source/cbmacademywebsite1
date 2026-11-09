import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Copy,
  Check,
  Trash2,
  Edit2,
  ExternalLink,
  Eye,
  X,
  Upload,
  CheckCircle2,
  XCircle,
  FolderOpen,
} from 'lucide-react';
import { AdminImage, fetchAdminImages, saveAdminImage, deleteAdminImage } from '../../services/adminService';
import { useScrollLock } from '../../utils/useScrollLock';

interface AdminImagesProps {
  onRefresh?: () => void;
}

export const AdminImages: React.FC<AdminImagesProps> = () => {
  const [images, setImages] = useState<AdminImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [editImage, setEditImage] = useState<Partial<AdminImage> | null>(null);
  const [previewImage, setPreviewImage] = useState<AdminImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Prevent background page from scrolling when modals or lightboxes are open
  useScrollLock(Boolean(editImage || previewImage));

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminImages();
      setImages(data);
    } catch {
      showToast('error', 'Failed to load image library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleCopyUrl = (img: AdminImage) => {
    if (!img.url) return;
    navigator.clipboard.writeText(img.url);
    setCopiedId(img.id);
    showToast('success', 'Image URL copied to clipboard!');
    setTimeout(() => {
      setCopiedId((curr) => (curr === img.id ? null : curr));
    }, 2000);
  };

  const handleDelete = async (img: AdminImage) => {
    if (!confirm(`Are you sure you want to delete image "${img.title}"?`)) return;
    setActionLoading(true);
    try {
      const ok = await deleteAdminImage(img.id);
      if (ok) {
        showToast('success', 'Image removed successfully.');
        setImages((prev) => prev.filter((i) => i.id !== img.id));
      } else {
        showToast('error', 'Could not delete image.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editImage || !editImage.title || !editImage.url) {
      alert('Image title and URL are required.');
      return;
    }

    setActionLoading(true);
    try {
      const payload: Partial<AdminImage> = {
        ...editImage,
        category: editImage.category || 'banner',
        status: editImage.status || 'active',
        dimensions: editImage.dimensions || '16:9',
      };
      const saved = await saveAdminImage(payload);
      if (saved) {
        showToast('success', `Image "${saved.title}" saved.`);
        setEditImage(null);
        await loadImages();
      } else {
        showToast('error', 'Failed to save image.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setEditImage((prev) => ({
        ...prev,
        title: prev?.title || file.name.replace(/\.[^/.]+$/, ''),
        url: result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const categories = [
    { id: 'all', label: 'All Images' },
    { id: 'banner', label: 'Banners & Hero' },
    { id: 'webinar', label: 'Webinars' },
    { id: 'course', label: 'Courses' },
    { id: 'campus', label: 'Campus & Labs' },
    { id: 'logo', label: 'Logos & Badges' },
  ];

  const filteredImages = images.filter((img) => {
    if (selectedCategory !== 'all' && img.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        img.title.toLowerCase().includes(q) ||
        (img.alt && img.alt.toLowerCase().includes(q)) ||
        (img.category && img.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[10050] px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center space-x-2 border transition-all ${
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

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#FF6B00]" />
            Website & Banner Images
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage, upload and organize website hero banners, webinar thumbnails, logos, and campus assets.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditImage({
              title: '',
              url: '',
              category: 'banner',
              dimensions: '16:9',
              status: 'active',
            })
          }
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05f00] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Image</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? images.length
                : images.filter((i) => i.category === cat.id).length;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#072B57] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-sm">
          Loading image library...
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto">
          <FolderOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No images found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {search ? 'Try clearing your search query.' : 'Upload or add your first image asset.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              {/* Image Preview Box */}
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden cursor-pointer">
                <img
                  src={img.url}
                  alt={img.alt || img.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback visual if broken link
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                {/* Category tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                    {img.category}
                  </span>
                </div>

                {/* Dimensions tag */}
                {img.dimensions && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/90 text-slate-800 backdrop-blur-xs">
                      {img.dimensions}
                    </span>
                  </div>
                )}

                {/* Hover overlay with preview icon */}
                <button
                  type="button"
                  onClick={() => setPreviewImage(img)}
                  title="View full image"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                >
                  <div className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs transition">
                    <Eye className="w-5 h-5" />
                  </div>
                </button>
              </div>

              {/* Details & Actions */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                    {img.title}
                  </h4>
                  {img.alt && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                      Alt: "{img.alt}"
                    </p>
                  )}
                  <div className="mt-2 text-[11px] text-slate-400 font-mono truncate bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    {img.url}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(img)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="Copy Image URL"
                  >
                    {copiedId === img.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditImage(img)}
                      className="p-1.5 text-slate-500 hover:text-[#072B57] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit Image Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(img)}
                      disabled={actionLoading}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          ADD / EDIT IMAGE MODAL
          Scroll locked on background page. Only popup content scrolls.
          ========================================================= */}
      {editImage && (
        <div
          className="fixed inset-0 z-[10030] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setEditImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative my-8 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6B00]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editImage.id ? 'Edit Image Details' : 'Add Website Image / Banner'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditImage(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image Title *
                </label>
                <input
                  type="text"
                  required
                  value={editImage.title || ''}
                  onChange={(e) => setEditImage({ ...editImage, title: e.target.value })}
                  placeholder="e.g. Masterclass Hero Banner"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image URL / Link *
                </label>
                <input
                  type="url"
                  required
                  value={editImage.url || ''}
                  onChange={(e) => setEditImage({ ...editImage, url: e.target.value })}
                  placeholder="https://... (or upload from computer below)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                />
              </div>

              {/* File upload shortcut */}
              <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold block text-slate-800">Or choose file from device</span>
                  <span className="text-[11px] text-slate-400">PNG, JPG, WEBP, SVG</span>
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Browse...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Live Preview if URL is set */}
              {editImage.url && (
                <div>
                  <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Live Preview:
                  </span>
                  <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200 max-h-48">
                    <img
                      src={editImage.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editImage.category || 'banner'}
                    onChange={(e) =>
                      setEditImage({ ...editImage, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                  >
                    <option value="banner">Banner & Hero</option>
                    <option value="webinar">Webinar Poster</option>
                    <option value="course">Course Asset</option>
                    <option value="campus">Campus & Labs</option>
                    <option value="logo">Logo & Badge</option>
                    <option value="other">Other Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Aspect Ratio / Dimensions
                  </label>
                  <input
                    type="text"
                    value={editImage.dimensions || '16:9'}
                    onChange={(e) =>
                      setEditImage({ ...editImage, dimensions: e.target.value })
                    }
                    placeholder="e.g. 16:9, 1:1, 1200x630"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={editImage.alt || ''}
                  onChange={(e) => setEditImage({ ...editImage, alt: e.target.value })}
                  placeholder="Describe the image content..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditImage(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#e05f00] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          LIGHTBOX PREVIEW MODAL
          Scroll locked on background page.
          ========================================================= */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[10040] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
          onClick={() => setPreviewImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 text-white">
              <div>
                <h3 className="text-sm font-bold text-white">{previewImage.title}</h3>
                <span className="text-[11px] text-slate-400 capitalize">
                  {previewImage.category} • {previewImage.dimensions || 'Image'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewImage)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Link</span>
                </button>
                <a
                  href={previewImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Open original"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-center bg-black/50 max-h-[75vh] overflow-hidden">
              <img
                src={previewImage.url}
                alt={previewImage.alt || previewImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
