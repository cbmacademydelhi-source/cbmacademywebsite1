import { useEffect } from 'react';

/**
 * Global reference count for active scroll locks.
 * Ensures that if multiple popups, modals, or banners are open simultaneously,
 * the background page scroll remains locked until the last popup closes.
 */
let scrollLockCount = 0;
let previousBodyOverflow = '';
let previousHtmlOverflow = '';

export function lockScroll() {
  if (typeof document === 'undefined') return;

  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;

    // Prevent background page from scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  scrollLockCount++;
}

export function unlockScroll() {
  if (typeof document === 'undefined') return;

  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    // Restore page scrolling when the popup closes
    document.body.style.overflow = previousBodyOverflow || '';
    document.documentElement.style.overflow = previousHtmlOverflow || '';
  }
}

/**
 * React hook to lock background page scrolling when a popup, modal, or banner is open.
 * Only the popup itself can scroll if its content requires scrolling.
 * Page scrolling is restored automatically when the popup closes or unmounts.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [isLocked]);
}
