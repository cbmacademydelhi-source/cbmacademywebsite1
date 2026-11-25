import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_SITE_LOGO_URL,
  SITE_LOGO_SLOT_ID,
  SITE_MEDIA_SLOT_MAP,
  isSafeMediaUrl,
} from '../data/siteMediaSlots';

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

const CACHE_KEY = 'cbm_site_media_cache_v1';

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

function readCachedMedia(): SiteMediaState {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return { logoUrl: DEFAULT_SITE_LOGO_URL, slots: {}, updatedAtMap: {} };
    }
    return sanitizeState(JSON.parse(raw));
  } catch {
    return { logoUrl: DEFAULT_SITE_LOGO_URL, slots: {}, updatedAtMap: {} };
  }
}

function writeCachedMedia(state: SiteMediaState) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
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
  const [state, setState] = useState<SiteMediaState>(() => readCachedMedia());
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const refreshSiteMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/public/site-media', {
        method: 'GET',
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.success) {
        const next = sanitizeState({
          logoUrl: data.logoUrl,
          slots: data.slots,
          updatedAtMap: data.updatedAtMap,
        });
        setState(next);
        writeCachedMedia(next);
      }
    } catch {
      // Keep cached or default images gracefully
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshSiteMedia();
  }, [refreshSiteMedia]);

  // Keep browser favicon and apple-touch-icon synced with live logo
  useEffect(() => {
    syncFavicon(state.logoUrl);
  }, [state.logoUrl]);

  // Keep multiple browser tabs synced when Admin updates media
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CACHE_KEY && e.newValue) {
        try {
          setState(sanitizeState(JSON.parse(e.newValue)));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
      const next: SiteMediaState =
        slotId === SITE_LOGO_SLOT_ID
          ? { ...prev, logoUrl: url, updatedAtMap: nextUpdatedAt }
          : {
              ...prev,
              slots: { ...prev.slots, [slotId]: url },
              updatedAtMap: nextUpdatedAt,
            };
      writeCachedMedia(next);
      return next;
    });
  }, []);

  const applySlotReset = useCallback((slotId: string) => {
    setState((prev) => {
      const nextUpdatedAt = { ...prev.updatedAtMap };
      delete nextUpdatedAt[slotId];

      if (slotId === SITE_LOGO_SLOT_ID) {
        const next: SiteMediaState = {
          ...prev,
          logoUrl: DEFAULT_SITE_LOGO_URL,
          updatedAtMap: nextUpdatedAt,
        };
        writeCachedMedia(next);
        return next;
      }

      const nextSlots = { ...prev.slots };
      delete nextSlots[slotId];
      const next: SiteMediaState = {
        ...prev,
        slots: nextSlots,
        updatedAtMap: nextUpdatedAt,
      };
      writeCachedMedia(next);
      return next;
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
