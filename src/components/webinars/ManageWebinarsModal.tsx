import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Webinar, WebinarStatus, WebinarType } from '../../types';
import {
  getWebinars,
  saveWebinar,
  deleteWebinar,
  toggleWebinarStatus,
  resetWebinarsToDefault,
} from '../../services/webinarStorage';

interface ManageWebinarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWebinarsUpdated?: () => void;
}

export const ManageWebinarsModal: React.FC<ManageWebinarsModalProps> = ({
  isOpen,
  onClose,
  onWebinarsUpdated,
}) => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [type, setType] = useState<WebinarType>('free');
  const [price, setPrice] = useState<string>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60 Minutes');
  const [host, setHost] = useState('CBM Academy');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [status, setStatus] = useState<WebinarStatus>('published');

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadData = () => {
    const list = getWebinars();
    setWebinars(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setNotification(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPosterUrl('');
    setType('free');
    setPrice('');
    setDate('');
    setTime('');
    setDuration('60 Minutes');
    setHost('CBM Academy');
    setWhatYouWillLearn('');
    setRegistrationLink('');
    setStatus('published');
    setShowForm(false);
  };

  const handleEditClick = (w: Webinar) => {
    setEditingId(w.id);
    setTitle(w.title);
    setDescription(w.description);
    setPosterUrl(w.posterUrl || '');
    setType(w.type);
    setPrice(w.price ? String(w.price).replace(/[^0-9]/g, '') : '');
    setDate(w.date);
    setTime(w.time);
    setDuration(w.duration || '60 Minutes');
    setHost(w.host || 'CBM Academy');
    setWhatYouWillLearn(
      Array.isArray(w.whatYouWillLearn) ? w.whatYouWillLearn.join('\n') : ''
    );
    setRegistrationLink(w.registrationLink || '');
    setStatus(w.status);
    setShowForm(true);

    // Scroll to form
    const container = document.getElementById('manage-webinars-scrollable');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !date.trim() || !time.trim()) {
      setNotification({
        type: 'error',
        message: 'Please fill in Title, Description, Date, and Time.',
      });
      return;
    }

    const learnList = whatYouWillLearn
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const saved = saveWebinar({
      id: editingId || undefined,
      title: title.trim(),
      description: description.trim(),
      posterUrl:
        posterUrl.trim() ||
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      type,
      price: type === 'paid' ? Number(price) || 499 : 'FREE',
      date: date.trim(),
      time: time.trim(),
      duration: duration.trim() || '60 Minutes',
      host: host.trim() || 'CBM Academy',
      whatYouWillLearn:
        learnList.length > 0
          ? learnList
          : [
              'Practical digital marketing techniques and frameworks',
              'Live execution strategy and campaign optimization',
            ],
      registrationLink: registrationLink.trim() || undefined,
      status,
    });

    loadData();
    onWebinarsUpdated?.();

    setNotification({
      type: 'success',
      message: editingId
        ? `Webinar "${saved.title}" updated successfully.`
        : `New webinar "${saved.title}" created successfully.`,
    });

    resetForm();
  };

  const handleDelete = (id: string, webinarTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${webinarTitle}"?`)) {
      deleteWebinar(id);
      loadData();
      onWebinarsUpdated?.();
      setNotification({
        type: 'success',
        message: `Webinar "${webinarTitle}" deleted.`,
      });
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = toggleWebinarStatus(id);
    if (updated) {
      loadData();
      onWebinarsUpdated?.();
      setNotification({
        type: 'success',
        message: `Status updated to "${updated.status.toUpperCase()}".`,
      });
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Reset all webinars back to the 4 default CBM Academy demo webinars?'
      )
    ) {
      resetWebinarsToDefault();
      loadData();
      onWebinarsUpdated?.();
      resetForm();
      setNotification({
        type: 'success',
        message: 'Reset back to 4 demo webinars successfully.',
      });
    }
  };

  return (
    <div
      id="manage-webinars-modal-overlay"
      className="fixed inset-0 z-[10025] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="manage-webinars-modal-card"
        className="relative my-6 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-webinars-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#072B57] px-6 py-4 text-white shrink-0">
          <div>
            <h3 id="manage-webinars-title" className="text-lg font-bold">
              Manage Webinars
            </h3>
            <p className="text-xs text-slate-300">
              Create, edit, delete, and publish live webinars without changing code
            </p>
          </div>

          <button
            type="button"
            id="btn-close-manage-webinars"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3 shrink-0">
          <div className="text-xs font-semibold text-slate-600">
            Total Webinars: <span className="font-bold text-[#072B57]">{webinars.length}</span>
          </div>

          <div className="flex items-center gap-2">
            {!showForm && (
              <button
                type="button"
                id="btn-open-add-webinar-form"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B00] px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#e05f00] cursor-pointer shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Webinar</span>
              </button>
            )}

            <button
              type="button"
              id="btn-reset-demo-webinars"
              onClick={handleResetDefaults}
              title="Reset to initial 4 demo webinars"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3 text-slate-500" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div id="manage-webinars-scrollable" className="flex-1 overflow-y-auto p-6 space-y-6">
          {notification && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-xs ${
                notification.type === 'success'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Add / Edit Form */}
          {showForm && (
            <div
              id="webinar-editor-form-box"
              className="rounded-2xl border border-[#FF6B00]/40 bg-orange-50/20 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-orange-200/50 mb-4">
                <h4 className="text-sm font-extrabold text-[#072B57] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#FF6B00]" />
                  <span>{editingId ? 'Edit Webinar' : 'Add New Webinar'}</span>
                </h4>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-webinar-title"
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. AI Tools for Digital Marketing"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="input-webinar-desc"
                      rows={2}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Short summary of what attendees will learn"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] resize-none"
                    />
                  </div>

                  {/* Poster URL */}
                  <div>
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      Poster/Image URL
                    </label>
                    <input
                      id="input-webinar-poster"
                      type="url"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  {/* Free or Paid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-[#072B57] mb-1">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="select-webinar-type"
                        value={type}
                        onChange={(e) => setType(e.target.value as WebinarType)}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                      >
                        <option value="free">FREE</option>
                        <option value="paid">PAID</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#072B57] mb-1">
                        Price {type === 'paid' && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        id="input-webinar-price"
                        type="number"
                        disabled={type === 'free'}
                        value={type === 'free' ? '' : price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={type === 'free' ? '0' : '499'}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-webinar-date"
                      type="text"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g. 28 September 2026"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-webinar-time"
                      type="text"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 6:00 PM"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      Duration
                    </label>
                    <input
                      id="input-webinar-duration"
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 60 Minutes or 2 Hours"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  {/* Host Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      Host Name
                    </label>
                    <input
                      id="input-webinar-host"
                      type="text"
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      placeholder="e.g. CBM Academy"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  {/* What You Will Learn */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      What You Will Learn <span className="text-slate-400 font-normal">(one point per line)</span>
                    </label>
                    <textarea
                      id="input-webinar-learn"
                      rows={3}
                      value={whatYouWillLearn}
                      onChange={(e) => setWhatYouWillLearn(e.target.value)}
                      placeholder={"AI prompt engineering for marketers\nCreating high-converting ad copy\nGA4 conversion tracking"}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] resize-none"
                    />
                  </div>

                  {/* Registration Link & Status */}
                  <div>
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      Registration Link <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="input-webinar-reglink"
                      type="url"
                      value={registrationLink}
                      onChange={(e) => setRegistrationLink(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#072B57] mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="select-webinar-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as WebinarStatus)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00]"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    id="btn-save-webinar"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#072B57] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0c3c78] cursor-pointer shadow-sm"
                  >
                    <span>{editingId ? 'Save Changes' : 'Add Webinar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Webinars List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Webinars In Directory
            </h4>

            {webinars.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                No webinars found. Click &quot;Add New Webinar&quot; to create one.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 rounded-xl border border-[#E5E7EB] bg-white">
                {webinars.map((w) => {
                  const isFree = w.type === 'free';
                  const isPublished = w.status === 'published' || w.status === 'upcoming';

                  return (
                    <div
                      key={w.id}
                      id={`manage-item-${w.id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <img
                          src={w.posterUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'}
                          alt={w.title}
                          className="h-14 w-20 rounded-lg object-cover bg-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="text-sm font-bold text-[#072B57] truncate">
                              {w.title}
                            </h5>

                            {isFree ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                FREE
                              </span>
                            ) : (
                              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#FF6B00]">
                                PAID (₹{w.price || 499})
                              </span>
                            )}

                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                isPublished
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {w.status}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3">
                            <span>📅 {w.date}</span>
                            <span>⏰ {w.time}</span>
                            <span>⌛ {w.duration || '60m'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {/* Publish / Unpublish */}
                        <button
                          type="button"
                          id={`btn-toggle-publish-${w.id}`}
                          onClick={() => handleToggleStatus(w.id)}
                          title={isPublished ? 'Unpublish to Draft' : 'Publish Webinar'}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                            isPublished
                              ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                              : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {isPublished ? (
                            <>
                              <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                              <span>Unpublish</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5 text-blue-600" />
                              <span>Publish</span>
                            </>
                          )}
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          id={`btn-edit-${w.id}`}
                          onClick={() => handleEditClick(w)}
                          aria-label={`Edit ${w.title}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                          <span>Edit</span>
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          id={`btn-delete-${w.id}`}
                          onClick={() => handleDelete(w.id, w.title)}
                          aria-label={`Delete ${w.title}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
