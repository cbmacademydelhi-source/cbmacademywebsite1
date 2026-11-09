import { useEffect } from 'react';

/**
 * Global reference count for active scroll locks.
 * Completely disables scrolling on the background webpage when any popup/modal/banner is open.
 * Restores normal page scrolling when the popup closes.
 */
let scrollLockCount = 0;
let previousBodyOverflow = '';
let previousHtmlOverflow = '';
let previousBodyOverscroll = '';
let previousHtmlOverscroll = '';

export function lockScroll() {
  if (typeof document === 'undefined') return;

  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;
    previousBodyOverscroll = document.body.style.overscrollBehavior;
    previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Completely disable scrolling on background page
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'contain';
    document.documentElement.style.overscrollBehavior = 'contain';
  }
  scrollLockCount++;
}

export function unlockScroll() {
  if (typeof document === 'undefined') return;

  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    // Restore normal page scrolling
    document.body.style.overflow = previousBodyOverflow || '';
    document.documentElement.style.overflow = previousHtmlOverflow || '';
    document.body.style.overscrollBehavior = previousBodyOverscroll || '';
    document.documentElement.style.overscrollBehavior = previousHtmlOverscroll || '';
  }
}

/**
 * React hook to completely lock background page scrolling when a popup or banner is open.
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
