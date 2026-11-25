import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ALLOWED_SITE_MEDIA_SLOT_IDS,
  DEFAULT_SITE_LOGO_URL,
  SITE_LOGO_SLOT_ID,
  SITE_MEDIA_SLOT_MAP,
  isSafeMediaUrl,
} from '../data/siteMediaSlots';
import { supabase } from '../lib/supabase';

export interface SiteMediaState {
  logoUrl: string;
  slots: Record<string, string>;
  updatedAtMap: Record<string, string>;
}

interface SiteMediaContextValue extends SiteMediaState {
  isLoaded: boolean;
  getImageUrl: (slotId: string, fallbackUrl?: string) => string;
  hasOverride: (slotId: string) => boolean;
  applySlotUpdate: (slotId: string, url: string, updatedAt?: string) => void;
  applySlotReset: (slotId: string) => void;
  refreshSiteMedia: () => Promise<void>;
}

const SITE_MEDIA_BUCKET = 'site-media';
const SITE_MEDIA_TABLE = 'site_media';
const SLOT_FILE_REGEX = /^([a-z0-9-]+)_(\d+)_[a-f0-9]+\.(png|jpg|jpeg|webp|gif)$/i;

const DEFAULT_STATE: SiteMediaState = {
  logoUrl: DEFAULT_SITE_LOGO_URL,
  slots: {},
  updatedAtMap: {},
};

function sanitizeState(raw: unknown): SiteMediaState {
  const result: SiteMediaState = {
    logoUrl: DEFAULT_SITE_LOGO_URL,
    slots: {},
    updatedAtMap: {},
  };

  if (!raw || typeof raw !== 'object') return result;
  const obj = raw as Record<string, unknown>;

  if (isSafeMediaUrl(obj.logoUrl)) {
    result.logoUrl = obj.logoUrl;
  }

  if (obj.slots && typeof obj.slots === 'object') {
    for (const [k, v] of Object.entries(obj.slots as Record<string, unknown>)) {
      if (SITE_MEDIA_SLOT_MAP[k] && isSafeMediaUrl(v)) {
        result.slots[k] = v;
      }
    }
  }

  if (obj.updatedAtMap && typeof obj.updatedAtMap === 'object') {
    for (const [k, v] of Object.entries(obj.updatedAtMap as Record<string, unknown>)) {
      if (typeof v === 'string') {
        result.updatedAtMap[k] = v;
      }
    }
  }

  return result;
}

function parseTimestampMs(iso?: string): number {
  if (!iso) return 0;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? 0 : ms;
}

interface ResolvedMediaEntry {
  url: string;
  updatedAt: string;
  tsMs: number;
}

async function fetchStorageSlotEntries(): Promise<{
  ok: boolean;
  entries: Record<string, ResolvedMediaEntry>;
}> {
  const entries: Record<string, ResolvedMediaEntry> = {};
  try {
    const { data: files, error } = await supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .list('slots', {
        limit: 500,
        sortBy: { column: 'updated_at', order: 'desc' },
      });

    if (error || !Array.isArray(files)) {
      return { ok: false, entries };
    }

    for (const file of files) {
      const name = typeof file?.name === 'string' ? file.name.trim() : '';
      if (!name) continue;

      const match = SLOT_FILE_REGEX.exec(name);
      if (!match) continue;

      const slotId = match[1];
      if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(slotId)) continue;

      const tsFromName = Number(match[2]) || 0;
      const metaUpdated =
        (typeof (file as any)?.updated_at === 'string' && (file as any).updated_at) ||
        (typeof (file as any)?.created_at === 'string' && (file as any).created_at) ||
        '';
      const tsFromMeta = parseTimestampMs(metaUpdated);
      const tsMs = Math.max(tsFromName, tsFromMeta);

      const existing = entries[slotId];
      if (existing && existing.tsMs >= tsMs) continue;

      const { data: pub } = supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .getPublicUrl(`slots/${name}`);

      const publicUrl = pub?.publicUrl;
      if (!publicUrl || !isSafeMediaUrl(publicUrl)) continue;

      entries[slotId] = {
        url: publicUrl,
        updatedAt: metaUpdated || (tsMs > 0 ? new Date(tsMs).toISOString() : new Date().toISOString()),
        tsMs,
      };
    }

    return { ok: true, entries };
  } catch {
    return { ok: false, entries };
  }
}

async function fetchTableSlotEntries(): Promise<{
  ok: boolean;
  entries: Record<string, ResolvedMediaEntry>;
}> {
  const entries: Record<string, ResolvedMediaEntry> = {};
  try {
    const { data: rows, error } = await supabase
      .from(SITE_MEDIA_TABLE)
      .select('slot_id, url, updated_at');

    if (error || !Array.isArray(rows)) {
      return { ok: false, entries };
    }

    for (const row of rows) {
      const slotId = typeof row?.slot_id === 'string' ? row.slot_id.trim() : '';
      const url = typeof row?.url === 'string' ? row.url.trim() : '';
      if (!slotId || !ALLOWED_SITE_MEDIA_SLOT_IDS.has(slotId) || !isSafeMediaUrl(url)) {
        continue;
      }

      const updatedAt = typeof row?.updated_at === 'string' ? row.updated_at : new Date().toISOString();
      entries[slotId] = {
        url,
        updatedAt,
        tsMs: parseTimestampMs(updatedAt),
      };
    }

    return { ok: true, entries };
  } catch {
    return { ok: false, entries };
  }
}

function buildStateFromEntries(merged: Record<string, ResolvedMediaEntry>): SiteMediaState {
  let logoUrl = DEFAULT_SITE_LOGO_URL;
  const slots: Record<string, string> = {};
  const updatedAtMap: Record<string, string> = {};

  for (const [slotId, entry] of Object.entries(merged)) {
    if (!isSafeMediaUrl(entry.url)) continue;
    if (slotId === SITE_LOGO_SLOT_ID) {
      logoUrl = entry.url;
      updatedAtMap[slotId] = entry.updatedAt;
    } else if (SITE_MEDIA_SLOT_MAP[slotId]) {
      slots[slotId] = entry.url;
      updatedAtMap[slotId] = entry.updatedAt;
    }
  }

  return sanitizeState({ logoUrl, slots, updatedAtMap });
}

function syncFavicon(logoUrl: string) {
  if (typeof document === 'undefined' || !isSafeMediaUrl(logoUrl)) return;
  try {
    const iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (iconLink) {
      iconLink.href = logoUrl;
    }
    const appleLink = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    if (appleLink) {
      appleLink.href = logoUrl;
    }
  } catch {
    // ignore
  }
}

const SiteMediaContext = createContext<SiteMediaContextValue | null>(null);

export const SiteMediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SiteMediaState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const refreshSiteMedia = useCallback(async () => {
    let loadedFromSupabase = false;

    // 1. Primary source of truth: live Supabase (site_media table + site-media Storage bucket)
    try {
      const [tableResult, storageResult] = await Promise.all([
        fetchTableSlotEntries(),
        fetchStorageSlotEntries(),
      ]);

      if (tableResult.ok || storageResult.ok) {
        const merged: Record<string, ResolvedMediaEntry> = { ...storageResult.entries };

        for (const [slotId, rowEntry] of Object.entries(tableResult.entries)) {
          const storageEntry = merged[slotId];
          if (!storageEntry || rowEntry.tsMs >= storageEntry.tsMs) {
            merged[slotId] = rowEntry;
          }
        }

        setState(buildStateFromEntries(merged));
        loadedFromSupabase = true;
      }
    } catch {
      // Fall back to backend API below
    }

    // 2. Secondary fallback: backend API (which itself queries Supabase with no-store)
    if (!loadedFromSupabase) {
      try {
        const res = await fetch('/api/public/site-media', {
          method: 'GET',
          cache: 'no-store',
        });
        if (res.ok) {
          const rawText = await res.text();
          const trimmed = rawText.trim();
          const contentType = (res.headers.get('content-type') || '').toLowerCase();
          if (trimmed && (!trimmed.startsWith('<') || contentType.includes('application/json'))) {
            const data = JSON.parse(trimmed);
            if (data?.success) {
              setState(
                sanitizeState({
                  logoUrl: data.logoUrl,
                  slots: data.slots,
                  updatedAtMap: data.updatedAtMap,
                })
              );
            }
          }
        }
      } catch {
        // Keep current state gracefully
      }
    }

    setIsLoaded(true);
  }, []);

  // Initial load + Realtime sync + focus/visibility/interval global sync across devices
  useEffect(() => {
    refreshSiteMedia();

    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel('cbm-site-media-sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: SITE_MEDIA_TABLE },
          () => {
            refreshSiteMedia();
          }
        )
        .subscribe();
    } catch {
      // Non-fatal if Realtime isn't enabled yet
    }

    const handleFocus = () => {
      refreshSiteMedia();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSiteMedia();
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshSiteMedia();
      }
    }, 20000);

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [refreshSiteMedia]);

  // Keep browser favicon and apple-touch-icon synced with live logo
  useEffect(() => {
    syncFavicon(state.logoUrl);
  }, [state.logoUrl]);

  const getImageUrl = useCallback(
    (slotId: string, fallbackUrl?: string): string => {
      if (slotId === SITE_LOGO_SLOT_ID) {
        return state.logoUrl || DEFAULT_SITE_LOGO_URL;
      }
      const override = state.slots[slotId];
      if (override && isSafeMediaUrl(override)) {
        return override;
      }
      if (fallbackUrl) return fallbackUrl;
      return SITE_MEDIA_SLOT_MAP[slotId]?.defaultUrl || '';
    },
    [state.logoUrl, state.slots]
  );

  const hasOverride = useCallback(
    (slotId: string): boolean => {
      if (slotId === SITE_LOGO_SLOT_ID) {
        return state.logoUrl !== DEFAULT_SITE_LOGO_URL;
      }
      return Boolean(state.slots[slotId]);
    },
    [state.logoUrl, state.slots]
  );

  const applySlotUpdate = useCallback((slotId: string, url: string, updatedAt?: string) => {
    if (!isSafeMediaUrl(url)) return;
    setState((prev) => {
      const nextUpdatedAt = {
        ...prev.updatedAtMap,
        [slotId]: updatedAt || new Date().toISOString(),
      };
      return slotId === SITE_LOGO_SLOT_ID
        ? { ...prev, logoUrl: url, updatedAtMap: nextUpdatedAt }
        : {
            ...prev,
            slots: { ...prev.slots, [slotId]: url },
            updatedAtMap: nextUpdatedAt,
          };
    });
  }, []);

  const applySlotReset = useCallback((slotId: string) => {
    setState((prev) => {
      const nextUpdatedAt = { ...prev.updatedAtMap };
      delete nextUpdatedAt[slotId];

      if (slotId === SITE_LOGO_SLOT_ID) {
        return {
          ...prev,
          logoUrl: DEFAULT_SITE_LOGO_URL,
          updatedAtMap: nextUpdatedAt,
        };
      }

      const nextSlots = { ...prev.slots };
      delete nextSlots[slotId];
      return {
        ...prev,
        slots: nextSlots,
        updatedAtMap: nextUpdatedAt,
      };
    });
  }, []);

  return (
    <SiteMediaContext.Provider
      value={{
        logoUrl: state.logoUrl,
        slots: state.slots,
        updatedAtMap: state.updatedAtMap,
        isLoaded,
        getImageUrl,
        hasOverride,
        applySlotUpdate,
        applySlotReset,
        refreshSiteMedia,
      }}
    >
      {children}
    </SiteMediaContext.Provider>
  );
};

export function useSiteMedia(): SiteMediaContextValue {
  const ctx = useContext(SiteMediaContext);
  if (!ctx) {
    return {
      logoUrl: DEFAULT_SITE_LOGO_URL,
      slots: {},
      updatedAtMap: {},
      isLoaded: true,
      getImageUrl: (slotId: string, fallbackUrl?: string) => {
        if (slotId === SITE_LOGO_SLOT_ID) return DEFAULT_SITE_LOGO_URL;
        return fallbackUrl || SITE_MEDIA_SLOT_MAP[slotId]?.defaultUrl || '';
      },
      hasOverride: () => false,
      applySlotUpdate: () => {},
      applySlotReset: () => {},
      refreshSiteMedia: async () => {},
    };
  }
  return ctx;
}

export function useSiteImage(slotId: string, fallbackUrl?: string): string {
  const { getImageUrl } = useSiteMedia();
  return getImageUrl(slotId, fallbackUrl);
}

export function useSiteLogo(): string {
  const { logoUrl } = useSiteMedia();
  return logoUrl;
}
