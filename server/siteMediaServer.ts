import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  ALLOWED_SITE_MEDIA_SLOT_IDS,
  DEFAULT_SITE_LOGO_URL,
  SITE_LOGO_SLOT_ID,
  SITE_MEDIA_SLOT_MAP,
} from '../src/data/siteMediaSlots.ts';

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

interface StoredMediaEntry {
  url: string;
  updatedAt: string;
}

interface StoredSiteMediaFile {
  entries: Record<string, StoredMediaEntry>;
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

export function getPublicSiteMedia(): {
  logoUrl: string;
  slots: Record<string, string>;
  updatedAtMap: Record<string, string>;
} {
  const store = readStoreFile();
  let logoUrl = DEFAULT_SITE_LOGO_URL;
  const slots: Record<string, string> = {};
  const updatedAtMap: Record<string, string> = {};

  for (const [slotId, entry] of Object.entries(store.entries)) {
    if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(slotId)) continue;
    if (!entry || typeof entry.url !== 'string') continue;

    // Verify local uploaded file still exists on disk before serving it
    if (entry.url.startsWith('/uploads/site-media/')) {
      const diskPath = resolveSafeUploadedFilePath(entry.url);
      if (!diskPath || !fs.existsSync(diskPath)) {
        continue;
      }
    }

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

export function saveUploadedSiteMedia(
  slotId: string,
  base64Payload: string
): { url: string; updatedAt: string; mime: string; sizeBytes: number } {
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

  ensureStorageDirs();

  // Generate strictly server-controlled filename (never trust user filename)
  const safeToken = crypto.randomBytes(6).toString('hex');
  const safeFilename = `${cleanSlotId}_${Date.now()}_${safeToken}.${detected.ext}`;
  const targetPath = path.resolve(SITE_MEDIA_UPLOAD_DIR, safeFilename);

  if (!targetPath.startsWith(SITE_MEDIA_UPLOAD_DIR + path.sep)) {
    const err = new Error('Invalid target upload path.');
    (err as any).status = 400;
    throw err;
  }

  fs.writeFileSync(targetPath, buffer);

  const store = readStoreFile();
  const previousUrl = store.entries[cleanSlotId]?.url;
  const publicUrl = `/uploads/site-media/${safeFilename}`;
  const updatedAt = new Date().toISOString();

  store.entries[cleanSlotId] = {
    url: publicUrl,
    updatedAt,
  };
  writeStoreFile(store);

  // Clean up previous uploaded image file for this slot if any
  if (previousUrl && previousUrl !== publicUrl) {
    safeDeleteOldUpload(previousUrl);
  }

  return {
    url: publicUrl,
    updatedAt,
    mime: detected.mime,
    sizeBytes: buffer.length,
  };
}

export function resetSiteMediaSlot(slotId: string): { defaultUrl: string } {
  const cleanSlotId = String(slotId || '').trim();
  if (!ALLOWED_SITE_MEDIA_SLOT_IDS.has(cleanSlotId)) {
    const err = new Error('Invalid image slot identifier.');
    (err as any).status = 400;
    throw err;
  }

  const store = readStoreFile();
  const previousUrl = store.entries[cleanSlotId]?.url;

  if (store.entries[cleanSlotId]) {
    delete store.entries[cleanSlotId];
    writeStoreFile(store);
  }

  safeDeleteOldUpload(previousUrl);

  const defaultUrl =
    cleanSlotId === SITE_LOGO_SLOT_ID
      ? DEFAULT_SITE_LOGO_URL
      : SITE_MEDIA_SLOT_MAP[cleanSlotId]?.defaultUrl || '';

  return { defaultUrl };
}
