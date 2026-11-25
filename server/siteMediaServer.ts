import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ALLOWED_SITE_MEDIA_SLOT_IDS,
  DEFAULT_SITE_LOGO_URL,
  SITE_LOGO_SLOT_ID,
  SITE_MEDIA_SLOT_MAP,
  isSafeMediaUrl,
} from '../src/data/siteMediaSlots.ts';
import { getSupabaseServer, isSupabaseConfiguredOnServer } from './supabaseServer.ts';

export const SITE_MEDIA_UPLOAD_DIR = path.resolve(
  process.cwd(),
  'public',
  'uploads',
  'site-media'
);

const SITE_MEDIA_STORE_PATH = path.resolve(
  process.cwd(),
  'server',
  '.site_media_store.json'
);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const SITE_MEDIA_BUCKET = (
  process.env.SUPABASE_STORAGE_BUCKET || 'site-media'
).trim() || 'site-media';

const SITE_MEDIA_TABLE = 'site_media';

interface StoredMediaEntry {
  url: string;
  updatedAt: string;
  storagePath?: string;
}

interface StoredSiteMediaFile {
  entries: Record<string, StoredMediaEntry>;
}

function getSupabaseClientForMedia(authToken?: string): {
  client: SupabaseClient | null;
  hasServiceRole: boolean;
} {
  const hasServiceRole = Boolean((process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim());
  if (hasServiceRole) {
    return { client: getSupabaseServer(), hasServiceRole: true };
  }

  // If caller provided a Supabase Auth JWT (3-part JWT), use it so Storage/Table RLS authorizes the admin
  if (authToken && authToken.split('.').length === 3 && isSupabaseConfiguredOnServer()) {
    const url = (
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      'https://cxeztssvgaeytdljoned.supabase.co'
    ).trim();
    const anonKey = (
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      'sb_publishable_sO0rnN9MJzQmBiq-Lm6p3w_EAYKjVOb'
    ).trim();

    if (url && anonKey) {
      return {
        client: createClient(url, anonKey, {
          global: {
            headers: { Authorization: `Bearer ${authToken}` },
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }),
        hasServiceRole: false,
      };
    }
  }

  return { client: getSupabaseServer(), hasServiceRole: false };
}

function withTimeout<T>(promise: PromiseLike<T>, ms = 4000): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase media request timed out')), ms)
    ),
  ]);
}

function ensureStorageDirs() {
  if (!fs.existsSync(SITE_MEDIA_UPLOAD_DIR)) {
    fs.mkdirSync(SITE_MEDIA_UPLOAD_DIR, { recursive: true });
  }
  const storeDir = path.dirname(SITE_MEDIA_STORE_PATH);
  if (!fs.existsSync(storeDir)) {
    fs.mkdirSync(storeDir, { recursive: true });
  }
}

function readStoreFile(): StoredSiteMediaFile {
  try {
    if (fs.existsSync(SITE_MEDIA_STORE_PATH)) {
      const raw = fs.readFileSync(SITE_MEDIA_STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.entries && typeof parsed.entries === 'object') {
        return { entries: parsed.entries };
      }
    }
  } catch (err) {
    console.warn('[SiteMedia] Failed reading store file, starting fresh:', err);
  }
  return { entries: {} };
}

function writeStoreFile(store: StoredSiteMediaFile) {
  ensureStorageDirs();
  const tmpPath = `${SITE_MEDIA_STORE_PATH}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(store, null, 2), 'utf-8');
  fs.renameSync(tmpPath, SITE_MEDIA_STORE_PATH);
}

/**
 * Inspects actual image magic bytes to verify file authenticity.
 * Explicitly allows ONLY PNG, JPEG, WebP, and GIF.
 * Blocks SVG, HTML, scripts, PDFs, executables, and spoofed MIME types.
 */
function detectImageFormatFromMagicBytes(buf: Buffer): { ext: string; mime: string } | null {
  if (!buf || buf.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return { ext: 'png', mime: 'image/png' };
  }

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }

  // WebP: RIFF....WEBP
  if (
    buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buf.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { ext: 'webp', mime: 'image/webp' };
  }

  // GIF: GIF87a or GIF89a
  const gifHeader = buf.subarray(0, 6).toString('ascii');
  if (gifHeader === 'GIF87a' || gifHeader === 'GIF89a') {
    return { ext: 'gif', mime: 'image/gif' };
  }

  return null;
}

/**
 * Resolves a stored /uploads/site-media/<file> URL safely within SITE_MEDIA_UPLOAD_DIR.
 * Returns null if path traversal or outside upload directory.
 */
function resolveSafeUploadedFilePath(url: string): string | null {
  if (typeof url !== 'string' || !url.startsWith('/uploads/site-media/')) {
    return null;
  }
  const baseName = url.slice('/uploads/site-media/'.length);
  if (!baseName || baseName.includes('/') || baseName.includes('\\') || baseName.includes('..')) {
    return null;
  }
  const resolved = path.resolve(SITE_MEDIA_UPLOAD_DIR, baseName);
  if (!resolved.startsWith(SITE_MEDIA_UPLOAD_DIR + path.sep)) {
    return null;
  }
  return resolved;
}

function safeDeleteOldUpload(oldUrl?: string) {
  if (!oldUrl) return;
  const oldPath = resolveSafeUploadedFilePath(oldUrl);
  if (!oldPath) return;
  try {
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  } catch (err) {
    console.warn('[SiteMedia] Non-critical cleanup warning:', err);
  }
}

async function fetchSupabaseSiteMediaEntries(): Promise<Record<string, StoredMediaEntry>> {
  const entries: Record<string, StoredMediaEntry> = {};
  const supabase = getSupabaseServer();
  if (!supabase) return entries;

  try {
    const { data, error } = await withTimeout(
      supabase
        .from(SITE_MEDIA_TABLE)
        .select('slot_id, url, storage_path, updated_at'),
      3000
    );

    if (!error && Array.isArray(data)) {
      for (const row of data) {
        const slotId = typeof row?.slot_id === 'string' ? row.slot_id.trim() : '';
        const url = typeof row?.url === 'string' ? row.url.trim() : '';
        if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(slotId) || !isSafeMediaUrl(url)) continue;
        entries[slotId] = {
          url,
          updatedAt:
            typeof row?.updated_at === 'string' && row.updated_at
              ? row.updated_at
              : new Date().toISOString(),
          storagePath: typeof row?.storage_path === 'string' ? row.storage_path : undefined,
        };
      }
    }
  } catch {
    // Table may not exist yet; gracefully rely on local store
  }

  return entries;
}

async function tryUploadToSupabaseStorage(
  slotId: string,
  safeFilename: string,
  buffer: Buffer,
  mime: string,
  updatedAt: string,
  authToken?: string
): Promise<{ url: string; storagePath: string } | null> {
  const { client, hasServiceRole } = getSupabaseClientForMedia(authToken);
  if (!client) return null;

  const storagePath = `slots/${safeFilename}`;

  const attemptUpload = async () =>
    withTimeout(
      client.storage.from(SITE_MEDIA_BUCKET).upload(storagePath, buffer, {
        contentType: mime,
        cacheControl: '31536000',
        upsert: true,
      }),
      15000
    );

  try {
    let { error } = await attemptUpload();

    // Auto-create public bucket if missing and service role key is configured
    if (error && hasServiceRole && /bucket not found/i.test(error.message || '')) {
      const { error: createErr } = await withTimeout(
        client.storage.createBucket(SITE_MEDIA_BUCKET, {
          public: true,
          fileSizeLimit: MAX_IMAGE_BYTES,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
        }),
        5000
      );
      if (!createErr || /already exists/i.test(createErr.message || '')) {
        const retry = await attemptUpload();
        error = retry.error;
      }
    }

    if (error) {
      console.warn('[SiteMedia] Supabase Storage upload skipped, falling back to local storage:', error.message);
      return null;
    }

    const { data: pubData } = client.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(storagePath);
    const publicUrl = pubData?.publicUrl;
    if (!publicUrl || !isSafeMediaUrl(publicUrl)) {
      return null;
    }

    // Best-effort persist mapping to Supabase site_media table if it exists
    try {
      await withTimeout(
        client.from(SITE_MEDIA_TABLE).upsert(
          {
            slot_id: slotId,
            url: publicUrl,
            storage_path: storagePath,
            updated_at: updatedAt,
          },
          { onConflict: 'slot_id' }
        ),
        4000
      );
    } catch {
      // Non-fatal if site_media table has not been created yet
    }

    return { url: publicUrl, storagePath };
  } catch (err: any) {
    console.warn('[SiteMedia] Supabase Storage unavailable, falling back to local storage:', err?.message || err);
    return null;
  }
}

export async function getPublicSiteMedia(): Promise<{
  logoUrl: string;
  slots: Record<string, string>;
  updatedAtMap: Record<string, string>;
}> {
  const localStore = readStoreFile();
  const remoteEntries = await fetchSupabaseSiteMediaEntries();

  const mergedEntries: Record<string, StoredMediaEntry> = {};

  // Start with verified local store entries
  for (const [slotId, entry] of Object.entries(localStore.entries)) {
    if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(slotId)) continue;
    if (!entry || typeof entry.url !== 'string' || !isSafeMediaUrl(entry.url)) continue;

    if (entry.url.startsWith('/uploads/site-media/')) {
      const diskPath = resolveSafeUploadedFilePath(entry.url);
      if (!diskPath || !fs.existsSync(diskPath)) {
        continue;
      }
    }

    mergedEntries[slotId] = entry;
  }

  // Merge Supabase site_media rows (prefer newer updatedAt when both exist)
  for (const [slotId, remoteEntry] of Object.entries(remoteEntries)) {
    const existing = mergedEntries[slotId];
    if (!existing) {
      mergedEntries[slotId] = remoteEntry;
    } else {
      const existingTs = Date.parse(existing.updatedAt || '') || 0;
      const remoteTs = Date.parse(remoteEntry.updatedAt || '') || 0;
      if (remoteTs >= existingTs) {
        mergedEntries[slotId] = remoteEntry;
      }
    }
  }

  let logoUrl = DEFAULT_SITE_LOGO_URL;
  const slots: Record<string, string> = {};
  const updatedAtMap: Record<string, string> = {};

  for (const [slotId, entry] of Object.entries(mergedEntries)) {
    if (slotId === SITE_LOGO_SLOT_ID) {
      logoUrl = entry.url;
      updatedAtMap[slotId] = entry.updatedAt;
    } else if (SITE_MEDIA_SLOT_MAP[slotId]) {
      slots[slotId] = entry.url;
      updatedAtMap[slotId] = entry.updatedAt;
    }
  }

  return { logoUrl, slots, updatedAtMap };
}

export async function saveUploadedSiteMedia(
  slotId: string,
  base64Payload: string,
  authToken?: string
): Promise<{
  url: string;
  updatedAt: string;
  mime: string;
  sizeBytes: number;
  storage: 'supabase' | 'local';
}> {
  const cleanSlotId = String(slotId || '').trim();
  if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(cleanSlotId)) {
    const err = new Error('Invalid image slot identifier.');
    (err as any).status = 400;
    throw err;
  }

  if (typeof base64Payload !== 'string' || !base64Payload.trim()) {
    const err = new Error('Image data is required.');
    (err as any).status = 400;
    throw err;
  }

  // Strip optional data URI prefix if sent by FileReader
  const cleanedBase64 = base64Payload.replace(/^data:[^;]+;base64,/i, '').trim();

  // Reject clearly oversized base64 strings before decoding
  if (cleanedBase64.length > Math.ceil(MAX_IMAGE_BYTES * 1.4)) {
    const err = new Error('Image exceeds the 10 MB maximum file size.');
    (err as any).status = 400;
    throw err;
  }

  const buffer = Buffer.from(cleanedBase64, 'base64');
  if (!buffer || buffer.length === 0) {
    const err = new Error('Uploaded file could not be decoded.');
    (err as any).status = 400;
    throw err;
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    const err = new Error('Image exceeds the 10 MB maximum file size.');
    (err as any).status = 400;
    throw err;
  }

  const detected = detectImageFormatFromMagicBytes(buffer);
  if (!detected) {
    const err = new Error(
      'Unsupported file format. Only valid PNG, JPG, WebP, or GIF images are allowed.'
    );
    (err as any).status = 400;
    throw err;
  }

  // Generate strictly server-controlled filename (never trust user filename)
  const safeToken = crypto.randomBytes(6).toString('hex');
  const safeFilename = `${cleanSlotId}_${Date.now()}_${safeToken}.${detected.ext}`;
  const updatedAt = new Date().toISOString();

  const store = readStoreFile();
  const previousEntry = store.entries[cleanSlotId];

  // 1. Prefer Supabase Storage when configured and accessible
  const supaUploaded = await tryUploadToSupabaseStorage(
    cleanSlotId,
    safeFilename,
    buffer,
    detected.mime,
    updatedAt,
    authToken
  );

  let publicUrl: string;
  let storagePath: string | undefined;
  let storage: 'supabase' | 'local';

  if (supaUploaded) {
    publicUrl = supaUploaded.url;
    storagePath = supaUploaded.storagePath;
    storage = 'supabase';
  } else {
    // 2. Fallback to local disk storage so preview/self-hosted deployments always work
    ensureStorageDirs();
    const targetPath = path.resolve(SITE_MEDIA_UPLOAD_DIR, safeFilename);
    if (!targetPath.startsWith(SITE_MEDIA_UPLOAD_DIR + path.sep)) {
      const err = new Error('Invalid target upload path.');
      (err as any).status = 400;
      throw err;
    }

    fs.writeFileSync(targetPath, buffer);
    publicUrl = `/uploads/site-media/${safeFilename}`;
    storage = 'local';
  }

  store.entries[cleanSlotId] = {
    url: publicUrl,
    updatedAt,
    ...(storagePath ? { storagePath } : {}),
  };
  writeStoreFile(store);

  // Clean up previous uploaded image file for this slot if any
  if (previousEntry?.url && previousEntry.url !== publicUrl) {
    safeDeleteOldUpload(previousEntry.url);
  }
  if (previousEntry?.storagePath && previousEntry.storagePath !== storagePath) {
    try {
      const { client } = getSupabaseClientForMedia(authToken);
      if (client) {
        await withTimeout(
          client.storage.from(SITE_MEDIA_BUCKET).remove([previousEntry.storagePath]),
          3000
        );
      }
    } catch {
      // Non-critical cleanup
    }
  }

  return {
    url: publicUrl,
    updatedAt,
    mime: detected.mime,
    sizeBytes: buffer.length,
    storage,
  };
}

export async function resetSiteMediaSlot(
  slotId: string,
  authToken?: string
): Promise<{ defaultUrl: string }> {
  const cleanSlotId = String(slotId || '').trim();
  if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(cleanSlotId)) {
    const err = new Error('Invalid image slot identifier.');
    (err as any).status = 400;
    throw err;
  }

  const store = readStoreFile();
  const previousEntry = store.entries[cleanSlotId];

  if (store.entries[cleanSlotId]) {
    delete store.entries[cleanSlotId];
    writeStoreFile(store);
  }

  safeDeleteOldUpload(previousEntry?.url);

  // Best-effort cleanup in Supabase Storage & site_media table
  try {
    const { client } = getSupabaseClientForMedia(authToken);
    if (client) {
      let remoteStoragePath = previousEntry?.storagePath;
      try {
        const { data: existingRow } = await withTimeout(
          client
            .from(SITE_MEDIA_TABLE)
            .select('storage_path')
            .eq('slot_id', cleanSlotId)
            .maybeSingle(),
          3000
        );
        if (existingRow?.storage_path) {
          remoteStoragePath = existingRow.storage_path;
        }
        await withTimeout(
          client.from(SITE_MEDIA_TABLE).delete().eq('slot_id', cleanSlotId),
          3000
        );
      } catch {
        // Table may not exist yet
      }

      if (remoteStoragePath) {
        await withTimeout(
          client.storage.from(SITE_MEDIA_BUCKET).remove([remoteStoragePath]),
          3000
        );
      }
    }
  } catch {
    // Non-critical cleanup
  }

  const defaultUrl =
    cleanSlotId === SITE_LOGO_SLOT_ID
      ? DEFAULT_SITE_LOGO_URL
      : SITE_MEDIA_SLOT_MAP[cleanSlotId]?.defaultUrl || '';

  return { defaultUrl };
}
