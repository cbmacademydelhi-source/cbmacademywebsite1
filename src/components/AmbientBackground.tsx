import React from 'react';

/**
 * AmbientBackground
 * Subtle "living grid" animated background inspired by high-end EdTech and SaaS interfaces.
 *
 * Features:
 * - Dominant warm off-white canvas (#FFFCF8)
 * - Faint, elegant dual-layer dotted and micro-grid pattern
 * - Sparsely distributed soft orange (#FF6B00) and deep navy (#072B57) micro-particles
 *   drifting and gently fading in/out at staggered speeds (11s–17s)
 * - Very subtle, wide horizontal orange ambient light sweep (22s continuous loop)
 * - Zero JS execution runtime overhead; pure GPU-accelerated CSS transforms
 * - Respects prefers-reduced-motion media query
 * - Strictly placed behind content with pointer-events-none and -z-10
 */

interface Particle {
  id: number;
  top: string;
  left: string;
  size: number;
  color: 'orange' | 'navy';
  driftClass: string;
  delay: string;
}

const PARTICLES: Particle[] = [
  { id: 1, top: '12%', left: '8%', size: 4, color: 'orange', driftClass: 'cbm-particle-drift-a', delay: '-1.5s' },
  { id: 2, top: '19%', left: '84%', size: 3.5, color: 'navy', driftClass: 'cbm-particle-drift-b', delay: '-6.2s' },
  { id: 3, top: '28%', left: '32%', size: 4.5, color: 'orange', driftClass: 'cbm-particle-drift-c', delay: '-3.8s' },
  { id: 4, top: '39%', left: '92%', size: 3, color: 'orange', driftClass: 'cbm-particle-drift-a', delay: '-8.5s' },
  { id: 5, top: '48%', left: '15%', size: 4, color: 'navy', driftClass: 'cbm-particle-drift-b', delay: '-4.1s' },
  { id: 6, top: '56%', left: '76%', size: 4.5, color: 'orange', driftClass: 'cbm-particle-drift-c', delay: '-9.7s' },
  { id: 7, top: '68%', left: '22%', size: 3.5, color: 'orange', driftClass: 'cbm-particle-drift-a', delay: '-2.4s' },
  { id: 8, top: '74%', left: '88%', size: 4, color: 'navy', driftClass: 'cbm-particle-drift-b', delay: '-7.3s' },
  { id: 9, top: '85%', left: '46%', size: 4.5, color: 'orange', driftClass: 'cbm-particle-drift-c', delay: '-5.6s' },
  { id: 10, top: '91%', left: '11%', size: 3, color: 'navy', driftClass: 'cbm-particle-drift-a', delay: '-10.2s' },
  { id: 11, top: '6%', left: '55%', size: 3.5, color: 'navy', driftClass: 'cbm-particle-drift-b', delay: '-4.8s' },
  { id: 12, top: '63%', left: '62%', size: 4, color: 'orange', driftClass: 'cbm-particle-drift-c', delay: '-1.9s' },
];

export const AmbientBackground: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Dominant warm off-white canvas (#FFFCF8) */}
      <div className="absolute inset-0 bg-[#FFFCF8]" />

      {/* 2. Very faint living grid and dotted pattern */}
      <div
        className="absolute inset-0 opacity-[0.42]"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(7, 43, 87, 0.045) 1.2px, transparent 1.2px),
            linear-gradient(to right, rgba(7, 43, 87, 0.014) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(7, 43, 87, 0.014) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px, 72px 72px, 72px 72px',
        }}
      />

      {/* 3. Subtle horizontal wide ambient orange light sweep */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="cbm-ambient-wave absolute h-[140%] w-[68vw] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255, 107, 0, 0.045) 0%, rgba(255, 138, 61, 0.02) 45%, transparent 75%)',
          }}
        />
      </div>

      {/* 4. Sparsely distributed soft floating micro-particles */}
      <div className="absolute inset-0">
        {PARTICLES.map((particle) => (
          <span
            key={particle.id}
            className={`absolute rounded-full ${particle.driftClass}`}
            style={{
              top: particle.top,
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor:
                particle.color === 'orange' ? '#FF6B00' : '#072B57',
              boxShadow:
                particle.color === 'orange'
                  ? '0 0 6px rgba(255, 107, 0, 0.35)'
                  : '0 0 6px rgba(7, 43, 87, 0.25)',
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};
