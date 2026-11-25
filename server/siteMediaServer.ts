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

const SLOT_FILENAME_REGEX = /^([a-z0-9-]+)_(\d+)_[a-f0-9]+\.(png|jpg|jpeg|webp|gif)$/i;

async function fetchSupabaseStorageSlotEntries(
  client: SupabaseClient
): Promise<Record<string, StoredMediaEntry>> {
  const entries: Record<string, StoredMediaEntry & { _tsMs: number }> = {};

  try {
    const { data: files, error } = await withTimeout(
      client.storage.from(SITE_MEDIA_BUCKET).list('slots', {
        limit: 500,
        sortBy: { column: 'updated_at', order: 'desc' },
      }),
      4000
    );

    if (error || !Array.isArray(files)) {
      return {};
    }

    for (const file of files) {
      const name = typeof file?.name === 'string' ? file.name : '';
      const match = SLOT_FILENAME_REGEX.exec(name);
      if (!match) continue;

      const slotId = match[1];
      if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(slotId)) continue;

      const tsFromName = Number(match[2]) || 0;
      const tsFromMeta = Date.parse(file.updated_at || file.created_at || '') || 0;
      const tsMs = Math.max(tsFromName, tsFromMeta);
      const storagePath = `slots/${name}`;

      const existing = entries[slotId];
      if (existing && existing._tsMs >= tsMs) {
        continue;
      }

      const { data: pubData } = client.storage
        .from(SITE_MEDIA_BUCKET)
        .getPublicUrl(storagePath);
      const publicUrl = pubData?.publicUrl;
      if (!publicUrl || !isSafeMediaUrl(publicUrl)) continue;

      entries[slotId] = {
        url: publicUrl,
        updatedAt:
          file.updated_at ||
          file.created_at ||
          (tsMs > 0 ? new Date(tsMs).toISOString() : new Date().toISOString()),
        storagePath,
        _tsMs: tsMs,
      };
    }
  } catch (err: any) {
    console.warn('[SiteMedia] Storage slots listing notice:', err?.message || err);
  }

  const cleaned: Record<string, StoredMediaEntry> = {};
  for (const [slotId, entry] of Object.entries(entries)) {
    cleaned[slotId] = {
      url: entry.url,
      updatedAt: entry.updatedAt,
      storagePath: entry.storagePath,
    };
  }
  return cleaned;
}

async function cleanupOldSlotFilesInSupabase(
  client: SupabaseClient,
  slotId: string,
  keepStoragePath?: string
): Promise<void> {
  try {
    const { data: files, error } = await withTimeout(
      client.storage.from(SITE_MEDIA_BUCKET).list('slots', { limit: 500 }),
      4000
    );
    if (error || !Array.isArray(files)) return;

    const prefix = `${slotId}_`;
    const toRemove = files
      .map((f) => (typeof f?.name === 'string' ? `slots/${f.name}` : ''))
      .filter((p) => {
        if (!p) return false;
        const base = p.slice('slots/'.length);
        if (!base.startsWith(prefix)) return false;
        if (keepStoragePath && p === keepStoragePath) return false;
        return true;
      });

    if (toRemove.length > 0) {
      await withTimeout(client.storage.from(SITE_MEDIA_BUCKET).remove(toRemove), 4000);
    }
  } catch {
    // Non-critical cleanup
  }
}

async function fetchSupabaseSiteMediaEntries(): Promise<{
  entries: Record<string, StoredMediaEntry>;
  sourceReached: boolean;
}> {
  const entries: Record<string, StoredMediaEntry> = {};
  const supabase = getSupabaseServer();
  if (!supabase) return { entries, sourceReached: false };

  let tableSucceeded = false;
  try {
    const { data, error } = await withTimeout(
      supabase
        .from(SITE_MEDIA_TABLE)
        .select('slot_id, url, storage_path, updated_at'),
      3500
    );

    if (!error && Array.isArray(data)) {
      tableSucceeded = true;
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
    // Table may not exist yet
  }

  // Always check Storage slots as global cross-device source (works even before site_media table is created)
  const storageEntries = await fetchSupabaseStorageSlotEntries(supabase);
  for (const [slotId, storageEntry] of Object.entries(storageEntries)) {
    const tableEntry = entries[slotId];
    if (!tableEntry) {
      if (!tableSucceeded) {
        entries[slotId] = storageEntry;
      } else {
        // If table exists and has no row for this slot, keep table authoritative unless storage is fresher
        entries[slotId] = storageEntry;
      }
    } else {
      const tableTs = Date.parse(tableEntry.updatedAt || '') || 0;
      const storageTs = Date.parse(storageEntry.updatedAt || '') || 0;
      if (storageTs > tableTs) {
        entries[slotId] = storageEntry;
      }
    }
  }

  return {
    entries,
    sourceReached: tableSucceeded || Object.keys(storageEntries).length > 0,
  };
}

async function tryUploadToSupabaseStorage(
  slotId: string,
  safeFilename: string,
  buffer: Buffer,
  mime: string,
  updatedAt: string,
  authToken?: string
): Promise<{ url: string; storagePath: string; errorMessage?: string } | null> {
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
      console.warn('[SiteMedia] Supabase Storage upload error:', error.message);
      return { url: '', storagePath: '', errorMessage: error.message };
    }

    const { data: pubData } = client.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(storagePath);
    const publicUrl = pubData?.publicUrl;
    if (!publicUrl || !isSafeMediaUrl(publicUrl)) {
      return { url: '', storagePath: '', errorMessage: 'Failed to generate public Supabase image URL.' };
    }

    // Clean up older files for this same slot so Storage always reflects the single active image
    await cleanupOldSlotFilesInSupabase(client, slotId, storagePath);

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
      // Non-fatal if site_media table has not been created yet (Storage slots remain globally synced)
    }

    return { url: publicUrl, storagePath };
  } catch (err: any) {
    console.warn('[SiteMedia] Supabase Storage upload exception:', err?.message || err);
    return { url: '', storagePath: '', errorMessage: err?.message || 'Supabase Storage upload failed.' };
  }
}

export async function getPublicSiteMedia(): Promise<{
  logoUrl: string;
  slots: Record<string, string>;
  updatedAtMap: Record<string, string>;
}> {
  const { entries: mergedEntries } = await fetchSupabaseSiteMediaEntries();

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
  storage: 'supabase';
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

  // Always persist globally to Supabase Storage so all devices see the exact same asset
  const supaUploaded = await tryUploadToSupabaseStorage(
    cleanSlotId,
    safeFilename,
    buffer,
    detected.mime,
    updatedAt,
    authToken
  );

  if (!supaUploaded || !supaUploaded.url) {
    const rawMsg = supaUploaded?.errorMessage || 'Could not upload image to Supabase Storage.';
    const err = new Error(
      /row-level security|unauthorized|permission|not allowed/i.test(rawMsg)
        ? 'Supabase Storage denied upload permission. Please sign in with your Supabase Admin account and ensure storage policies from supabase_global_sync_schema.sql are applied.'
        : /bucket not found/i.test(rawMsg)
        ? "Supabase Storage bucket 'site-media' was not found. Please run supabase_global_sync_schema.sql in Supabase SQL Editor."
        : `Supabase upload failed: ${rawMsg}`
    );
    (err as any).status = /row-level security|unauthorized|permission/i.test(rawMsg) ? 403 : 502;
    throw err;
  }

  return {
    url: supaUploaded.url,
    updatedAt,
    mime: detected.mime,
    sizeBytes: buffer.length,
    storage: 'supabase',
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

  // Clean up both Supabase Storage slot files and public.site_media table row
  const { client } = getSupabaseClientForMedia(authToken);
  if (client) {
    let remoteStoragePath: string | undefined;
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
      try {
        await withTimeout(
          client.storage.from(SITE_MEDIA_BUCKET).remove([remoteStoragePath]),
          3000
        );
      } catch {}
    }

    await cleanupOldSlotFilesInSupabase(client, cleanSlotId);
  }

  // Clean up any legacy local disk entry if present
  try {
    const store = readStoreFile();
    const previousEntry = store.entries[cleanSlotId];
    if (previousEntry) {
      delete store.entries[cleanSlotId];
      writeStoreFile(store);
      safeDeleteOldUpload(previousEntry.url);
    }
  } catch {}

  const defaultUrl =
    cleanSlotId === SITE_LOGO_SLOT_ID
      ? DEFAULT_SITE_LOGO_URL
      : SITE_MEDIA_SLOT_MAP[cleanSlotId]?.defaultUrl || '';

  return { defaultUrl };
}

export async function saveUploadedWebinarImage(
  base64Payload: string,
  authToken?: string
): Promise<{
  url: string;
  updatedAt: string;
  mime: string;
  sizeBytes: number;
  storage: 'supabase';
}> {
  if (typeof base64Payload !== 'string' || !base64Payload.trim()) {
    const err = new Error('Image data is required.');
    (err as any).status = 400;
    throw err;
  }

  const cleanedBase64 = base64Payload.replace(/^data:[^;]+;base64,/i, '').trim();

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

  const safeToken = crypto.randomBytes(6).toString('hex');
  const safeFilename = `webinar_${Date.now()}_${safeToken}.${detected.ext}`;
  const updatedAt = new Date().toISOString();

  const { client, hasServiceRole } = getSupabaseClientForMedia(authToken);
  if (!client) {
    const err = new Error('Supabase Storage is not configured.');
    (err as any).status = 502;
    throw err;
  }

  const storagePath = `webinars/${safeFilename}`;
  const attemptUpload = async () =>
    withTimeout(
      client.storage.from(SITE_MEDIA_BUCKET).upload(storagePath, buffer, {
        contentType: detected.mime,
        cacheControl: '31536000',
        upsert: true,
      }),
      15000
    );

  let { error } = await attemptUpload();

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
    const rawMsg = error.message || 'Supabase Storage upload failed.';
    const err = new Error(
      /row-level security|unauthorized|permission|not allowed/i.test(rawMsg)
        ? 'Supabase Storage denied upload permission. Sign in with your Supabase Admin account and ensure storage policies are configured.'
        : `Supabase webinar image upload failed: ${rawMsg}`
    );
    (err as any).status = /row-level security|unauthorized|permission/i.test(rawMsg) ? 403 : 502;
    throw err;
  }

  const { data: pubData } = client.storage
    .from(SITE_MEDIA_BUCKET)
    .getPublicUrl(storagePath);

  if (!pubData?.publicUrl || !isSafeMediaUrl(pubData.publicUrl)) {
    const err = new Error('Webinar image uploaded but public URL could not be generated.');
    (err as any).status = 502;
    throw err;
  }

  return {
    url: pubData.publicUrl,
    updatedAt,
    mime: detected.mime,
    sizeBytes: buffer.length,
    storage: 'supabase',
  };
}
