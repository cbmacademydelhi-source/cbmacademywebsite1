/**
 * Production and Live API Configuration
 * Supports:
 * - Direct relative /api/... calls (Dev, Preview, & Same-origin fullstack production)
 * - VITE_API_BASE_URL (Explicit configuration)
 * - Automatic live backend fallback if relative /api/... is not served by a static host (e.g. custom domain / static hosting)
 */

export const LIVE_BACKEND_URL = 'https://ais-pre-6ruqk6q33c4f3mamycvwcd-820564251138.asia-east1.run.app';

export function getApiBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL || (import.meta as any).env?.VITE_BACKEND_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '';
}

/**
 * Fetch from API with automatic fallback to live backend if relative endpoint returns 404 or HTML (e.g. on static hosting)
 */
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  // Keep absolute URLs exactly as provided
  if (/^https?:\/\//i.test(endpoint)) {
    return fetch(endpoint, options);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const customBase = getApiBaseUrl();

  // If custom API base URL is explicitly set, use it directly
  if (customBase) {
    const targetUrl = `${customBase}${cleanEndpoint}`;
    return fetch(targetUrl, options);
  }

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  const isLiveBackendHost =
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('6ruqk6q33c4f3mamycvwcd') ||
      window.location.hostname.includes('run.app'));

  // Try relative endpoint first
  try {
    const res = await fetch(cleanEndpoint, options);

    const contentType = res.headers.get('content-type') || '';
    const isHtml = contentType.includes('text/html');

    if (res.ok && !isHtml) {
      return res;
    }

    // Fallback to live backend for static hosting
    if (!isLocalhost && !isLiveBackendHost && (res.status === 404 || isHtml)) {
      console.warn(
        `[API] Relative endpoint ${cleanEndpoint} returned status ${res.status} (${contentType}), falling back to LIVE backend...`
      );

      const fallbackUrl = `${LIVE_BACKEND_URL}${cleanEndpoint}`;
      return await fetch(fallbackUrl, options);
    }

    return res;
  } catch (netErr) {
    // Network error → retry with live backend
    if (!isLocalhost && !isLiveBackendHost) {
      console.warn(
        `[API] Relative fetch failed for ${cleanEndpoint}, retrying with LIVE backend:`,
        netErr
      );

      const fallbackUrl = `${LIVE_BACKEND_URL}${cleanEndpoint}`;
      return await fetch(fallbackUrl, options);
    }

    throw netErr;
  }
}

