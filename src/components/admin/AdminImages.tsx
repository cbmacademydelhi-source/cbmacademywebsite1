import React, { useState, useRef, useMemo } from 'react';
import {
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  X,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  SITE_LOGO_SLOT,
  SITE_LOGO_SLOT_ID,
  SITE_MEDIA_PAGES,
  SITE_MEDIA_SLOTS,
  SiteMediaPageKey,
  SiteMediaSlot,
} from '../../data/siteMediaSlots';
import { useSiteMedia } from '../../context/SiteMediaContext';
import {
  uploadSiteMediaFile,
  resetSiteMediaFile,
} from '../../services/adminService';

interface AdminImagesProps {
  onRefresh?: () => void;
}

const ACCEPTED_IMAGE_TYPES = 'image/png,image/jpeg,image/webp,image/gif';

export const AdminImages: React.FC<AdminImagesProps> = ({ onRefresh }) => {
  const {
    logoUrl,
    getImageUrl,
    hasOverride,
    updatedAtMap,
    applySlotUpdate,
    applySlotReset,
    refreshSiteMedia,
  } = useSiteMedia();

  const [selectedPage, setSelectedPage] = useState<'all' | SiteMediaPageKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null);
  const [resettingSlotId, setResettingSlotId] = useState<string | null>(null);
  const [refreshingMedia, setRefreshingMedia] = useState(false);

  const [notice, setNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [previewItem, setPreviewItem] = useState<{
    title: string;
    subtitle: string;
    url: string;
    slotId: string;
    isLogo?: boolean;
  } | null>(null);

  // Single reusable hidden file input for clean instant replace UX
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeTargetSlotRef = useRef<string | null>(null);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => {
      setNotice((curr) => (curr?.message === message ? null : curr));
    }, 5000);
  };

  const triggerFilePicker = (slotId: string) => {
    activeTargetSlotRef.current = slotId;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slotId = activeTargetSlotRef.current;
    if (!file || !slotId) return;

    setUploadingSlotId(slotId);
    setNotice(null);

    try {
      const result = await uploadSiteMediaFile(slotId, file);
      if (result.success && result.url) {
        applySlotUpdate(slotId, result.url, result.updatedAt);
        await refreshSiteMedia();
        onRefresh?.();

        if (slotId === SITE_LOGO_SLOT_ID) {
          showNotice(
            'success',
            'CBM Academy Logo updated! The new logo is now live across the entire website.'
          );
        } else {
          const slot = SITE_MEDIA_SLOTS.find((s) => s.id === slotId);
          const label = slot
            ? `${slot.pageLabel} — Image ${slot.imageNumber}`
            : 'Website image';
          showNotice(
            'success',
            `${label} replaced successfully! The live website has been updated.`
          );
        }

        // Update open lightbox preview if inspecting this slot
        setPreviewItem((curr) =>
          curr && curr.slotId === slotId ? { ...curr, url: result.url! } : curr
        );
      } else {
        showNotice('error', result.message || 'Failed to upload image.');
      }
    } finally {
      setUploadingSlotId(null);
      activeTargetSlotRef.current = null;
    }
  };

  const handleResetSlot = async (slotId: string, label: string) => {
    setResettingSlotId(slotId);
    setNotice(null);

    try {
      const result = await resetSiteMediaFile(slotId);
      if (result.success) {
        applySlotReset(slotId);
        await refreshSiteMedia();
        onRefresh?.();
        showNotice('success', `${label} restored to its original default image.`);

        setPreviewItem((curr) =>
          curr && curr.slotId === slotId && result.defaultUrl
            ? { ...curr, url: result.defaultUrl }
            : curr
        );
      } else {
        showNotice('error', result.message || 'Failed to restore default image.');
      }
    } finally {
      setResettingSlotId(null);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshingMedia(true);
    try {
      await refreshSiteMedia();
      onRefresh?.();
    } finally {
      setRefreshingMedia(false);
    }
  };

  const customizedCount = useMemo(() => {
    return SITE_MEDIA_SLOTS.filter((slot) => hasOverride(slot.id)).length;
  }, [hasOverride]);

  const pageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SITE_MEDIA_SLOTS.length };
    for (const page of SITE_MEDIA_PAGES) {
      counts[page.key] = SITE_MEDIA_SLOTS.filter((s) => s.page === page.key).length;
    }
    return counts;
  }, []);

  const filteredPagesWithSlots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SITE_MEDIA_PAGES.filter(
      (page) => selectedPage === 'all' || page.key === selectedPage
    )
      .map((page) => {
        const slots = SITE_MEDIA_SLOTS.filter((slot) => {
          if (slot.page !== page.key) return false;
          if (!q) return true;
          const imageTitle = `${slot.pageLabel} image ${slot.imageNumber}`.toLowerCase();
          return (
            imageTitle.includes(q) ||
            slot.sectionLabel.toLowerCase().includes(q) ||
            slot.description.toLowerCase().includes(q) ||
            slot.pageLabel.toLowerCase().includes(q)
          );
        });
        return { page, slots };
      })
      .filter((group) => group.slots.length > 0);
  }, [selectedPage, searchQuery]);

  const logoIsCustom = hasOverride(SITE_LOGO_SLOT_ID);
  const logoUploading = uploadingSlotId === SITE_LOGO_SLOT_ID;
  const logoResetting = resettingSlotId === SITE_LOGO_SLOT_ID;

  const formatUpdatedDate = (iso?: string) => {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Shared Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        onChange={handleFileSelected}
        className="hidden"
        aria-label="Upload replacement image"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#072B57] tracking-tight">
            Images &amp; Banners
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the CBM Academy logo and every website image in exact page-wise sequence. Replaced images go live automatically without changing layout or design.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs">
            <span className="font-extrabold text-[#072B57]">{SITE_MEDIA_SLOTS.length}</span> Slots
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="font-extrabold text-[#FF6B00]">{customizedCount}</span> Replaced
          </div>

          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={refreshingMedia}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-[#072B57] transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshingMedia ? 'animate-spin text-[#FF6B00]' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {notice && (
        <div
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs font-semibold shadow-xs ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =====================================================================
          DEDICATED SECTION: CBM ACADEMY LOGO MANAGEMENT
      ===================================================================== */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-[#072B57] to-[#0D3C75] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                  {SITE_LOGO_SLOT.label}
                </h2>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    logoIsCustom
                      ? 'bg-[#FF6B00] text-white'
                      : 'bg-white/15 text-blue-100'
                  }`}
                >
                  {logoIsCustom ? 'Custom Logo Active' : 'Default Logo'}
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-0.5">
                {SITE_LOGO_SLOT.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {logoIsCustom && (
              <button
                type="button"
                disabled={logoResetting || logoUploading}
                onClick={() => handleResetSlot(SITE_LOGO_SLOT_ID, 'CBM Academy Logo')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${logoResetting ? 'animate-spin' : ''}`} />
                <span>{logoResetting ? 'Restoring...' : 'Reset Default'}</span>
              </button>
            )}

            <button
              type="button"
              disabled={logoUploading || logoResetting}
              onClick={() => triggerFilePicker(SITE_LOGO_SLOT_ID)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-60"
            >
              {logoUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading Logo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload / Replace Logo</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Light Surface Preview (Header / Popups) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Header Preview (Light Background)
              </span>
              <button
                type="button"
                onClick={() =>
                  setPreviewItem({
                    title: 'CBM Academy Logo',
                    subtitle: 'Global Website Brand Logo',
                    url: logoUrl,
                    slotId: SITE_LOGO_SLOT_ID,
                    isLogo: true,
                  })
                }
                className="text-[11px] font-bold text-[#072B57] hover:text-[#FF6B00] inline-flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect</span>
              </button>
            </div>
            <div className="h-24 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-3">
              <img
                src={logoUrl}
                alt="CBM Academy Logo Preview on Light Background"
                className="max-h-16 w-auto object-contain"
              />
            </div>
          </div>

          {/* Dark Surface Preview (Footer) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Footer Preview (Navy Background)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {SITE_LOGO_SLOT.recommendedHint}
              </span>
            </div>
            <div className="h-24 rounded-lg bg-[#072B57] border border-[#0D386E] flex items-center justify-center p-3">
              <div className="inline-flex items-center justify-center bg-white px-3.5 py-2 rounded-xl shadow-xs">
                <img
                  src={logoUrl}
                  alt="CBM Academy Logo Preview on Dark Background"
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PAGE-WISE FILTER BAR & SEARCH
      ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedPage('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedPage === 'all'
                ? 'bg-[#072B57] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            All Pages ({pageCounts.all})
          </button>

          {SITE_MEDIA_PAGES.map((page) => (
            <button
              key={page.key}
              type="button"
              onClick={() => setSelectedPage(page.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedPage === page.key
                  ? 'bg-[#FF6B00] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {page.label} ({pageCounts[page.key]})
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search page, image #, or section..."
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          PAGE-WISE & SEQUENCE-WISE IMAGE SLOTS
      ===================================================================== */}
      {filteredPagesWithSlots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No matching image slots</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try clearing your search or switching to “All Pages”.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredPagesWithSlots.map(({ page, slots }) => (
            <section
              key={page.key}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
            >
              {/* Page Section Header */}
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#072B57] text-white flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-[#072B57] tracking-tight">
                      {page.label} Page
                    </h2>
                    <p className="text-xs text-slate-500">{page.description}</p>
                  </div>
                </div>
                <span className="inline-flex items-center self-start sm:self-auto px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-[#072B57]">
                  {slots.length} {slots.length === 1 ? 'Image' : 'Images'} in Sequence
                </span>
              </div>

              {/* Ordered Grid of Image Slots */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {slots.map((slot: SiteMediaSlot) => {
                  const currentUrl = getImageUrl(slot.id, slot.defaultUrl);
                  const isCustom = hasOverride(slot.id);
                  const isUploading = uploadingSlotId === slot.id;
                  const isResetting = resettingSlotId === slot.id;
                  const isBusy = isUploading || isResetting;
                  const updatedLabel = formatUpdatedDate(updatedAtMap[slot.id]);
                  const slotHeading = `${slot.pageLabel} — Image ${slot.imageNumber}`;

                  return (
                    <article
                      key={slot.id}
                      className={`rounded-xl border overflow-hidden flex flex-col justify-between transition ${
                        isCustom
                          ? 'border-[#FF6B00]/50 bg-orange-50/15 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Top Bar: Page Name + Image Number */}
                      <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#072B57] text-white text-[11px] font-extrabold shrink-0">
                            {slot.imageNumber}
                          </span>
                          <span className="text-xs font-extrabold text-[#072B57] truncate">
                            {slotHeading}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                            isCustom
                              ? 'bg-orange-100 text-[#FF6B00] border border-orange-200'
                              : 'bg-slate-200/70 text-slate-600'
                          }`}
                        >
                          {isCustom ? 'Custom' : 'Default'}
                        </span>
                      </div>

                      {/* Live Image Preview */}
                      <div
                        onClick={() =>
                          setPreviewItem({
                            title: slotHeading,
                            subtitle: slot.sectionLabel,
                            url: currentUrl,
                            slotId: slot.id,
                          })
                        }
                        className="relative aspect-[16/10] bg-slate-100 overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={currentUrl}
                          alt={`${slotHeading} — ${slot.sectionLabel}`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                        />

                        {/* Hover Preview Overlay */}
                        <div className="absolute inset-0 bg-[#072B57]/0 group-hover:bg-[#072B57]/35 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-[#072B57] text-[11px] font-bold shadow-md">
                            <Eye className="w-3.5 h-3.5 text-[#FF6B00]" />
                            <span>View Full Preview</span>
                          </span>
                        </div>

                        {/* Aspect Ratio Tag */}
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/75 text-white text-[10px] font-semibold backdrop-blur-xs">
                          {slot.aspectHint}
                        </span>
                      </div>

                      {/* Details + Actions */}
                      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug">
                            {slot.sectionLabel}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {slot.description}
                          </p>
                          {isCustom && updatedLabel && (
                            <p className="text-[10px] font-semibold text-emerald-700 mt-1.5">
                              Updated on {updatedLabel}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => triggerFilePicker(slot.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#072B57] hover:bg-[#0B3B75] text-white text-xs font-bold transition cursor-pointer disabled:opacity-60"
                          >
                            {isUploading ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF6B00]" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5 text-[#FF6B00]" />
                                <span>Upload / Replace</span>
                              </>
                            )}
                          </button>

                          {isCustom && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleResetSlot(slot.id, slotHeading)}
                              title="Restore original default image"
                              className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                              <span className="hidden sm:inline">Reset</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* =====================================================================
          FULL-SIZE IMAGE PREVIEW LIGHTBOX MODAL
      ===================================================================== */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview"
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#072B57]">
                  {previewItem.title}
                </h3>
                <p className="text-xs text-slate-500">{previewItem.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-100 p-6 flex items-center justify-center max-h-[65vh] overflow-auto">
              <img
                src={previewItem.url}
                alt={previewItem.title}
                className={`max-h-[55vh] w-auto rounded-lg shadow-sm ${
                  previewItem.isLogo ? 'object-contain bg-white p-4' : 'object-contain'
                }`}
              />
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Supported formats: PNG, JPG, WebP, GIF (max 10 MB)
              </span>
              <div className="flex items-center gap-2">
                {hasOverride(previewItem.slotId) && (
                  <button
                    type="button"
                    disabled={resettingSlotId === previewItem.slotId}
                    onClick={() => handleResetSlot(previewItem.slotId, previewItem.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-rose-300 text-xs font-bold text-slate-700 hover:text-rose-700 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                )}
                <button
                  type="button"
                  disabled={uploadingSlotId === previewItem.slotId}
                  onClick={() => triggerFilePicker(previewItem.slotId)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-bold transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {previewItem.isLogo ? 'Upload / Replace Logo' : 'Upload / Replace Image'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
