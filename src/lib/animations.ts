import { useReducedMotion } from 'motion/react';

/**
 * Premium, subtle scroll-reveal animation configuration
 * Designed for high-end EdTech / SaaS aesthetics:
 * - 500-700ms duration (default 600ms)
 * - Smooth decelerating ease-out curve (no bounce, no overshoot)
 * - 12-14px subtle upward motion
 * - Staggered reveals for cards and grids
 * - Viewport trigger with once: true
 * - Respects prefers-reduced-motion
 */

export const SMOOTH_EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const VIEWPORT_ONCE = {
  once: true,
  margin: '-40px',
  amount: 0.12,
} as const;

/**
 * Generates props for motion elements with fade-in and subtle upward glide.
 */
export function getFadeInUpProps(
  delay = 0,
  shouldReduceMotion = false,
  yOffset = 14,
  duration = 0.6
) {
  if (shouldReduceMotion) {
    return {
      initial: false,
      whileInView: undefined,
      viewport: undefined,
      transition: undefined,
    };
  }

  return {
    initial: { opacity: 0, y: yOffset },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT_ONCE,
    transition: {
      duration,
      delay,
      ease: SMOOTH_EASE_OUT,
    },
  };
}

/**
 * Generates props for container elements that orchestrate staggered child reveals.
 */
export function getStaggerContainerProps(
  staggerChildren = 0.08,
  delayChildren = 0.05,
  shouldReduceMotion = false
) {
  if (shouldReduceMotion) {
    return {
      initial: false,
      whileInView: undefined,
      viewport: undefined,
    };
  }

  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: VIEWPORT_ONCE,
    variants: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren,
          delayChildren,
        },
      },
    },
  };
}

/**
 * Item variant to be used inside a container with getStaggerContainerProps
 */
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: SMOOTH_EASE_OUT,
    },
  },
};
