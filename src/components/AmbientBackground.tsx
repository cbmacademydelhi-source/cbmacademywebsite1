import React from 'react';

/**
 * AmbientBackground
 * Seamless warm peach-cream canvas matching the reference color swatch,
 * embedded with subtle, sophisticated AI & Tech background elements:
 * - Exact Warm Cream / Peach Ivory gradient (#FFFDFB to #FFF5EC to #FEEFE3)
 * - Delicate living tech grid & matrix points
 * - Neural network nodes & synaptic connections
 * - Integrated circuit / AI processor trace pathways
 * - Floating 4-point AI spark stars
 * - Subtle floating AI & tensor tokens (e.g. <AI/>, f(x), [Neural], 0101)
 * - Slow horizontal ambient light sweep & soft floating micro-particles
 * - Fully GPU-accelerated and strictly non-intrusive (pointer-events-none, -z-10)
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
  { id: 1, top: '10%', left: '8%', size: 4, color: 'orange', driftClass: 'cbm-particle-drift-a', delay: '-1.5s' },
  { id: 2, top: '18%', left: '86%', size: 3.5, color: 'navy', driftClass: 'cbm-particle-drift-b', delay: '-6.2s' },
  { id: 3, top: '26%', left: '32%', size: 4.5, color: 'orange', driftClass: 'cbm-particle-drift-c', delay: '-3.8s' },
  { id: 4, top: '38%', left: '92%', size: 3, color: 'orange', driftClass: 'cbm-particle-drift-a', delay: '-8.5s' },
  { id: 5, top: '48%', left: '14%', size: 4, color: 'navy', driftClass: 'cbm-particle-drift-b', delay: '-4.1s' },
  { id: 6, top: '56%', left: '78%', size: 4.5, color: 'orange', driftClass: 'cbm-particle-drift-c', delay: '-9.7s' },
  { id: 7, top: '68%', left: '22%', size: 3.5, color: 'orange', driftClass: 'cbm-particle-drift-a', delay: '-2.4s' },
  { id: 8, top: '76%', left: '89%', size: 4, color: 'navy', driftClass: 'cbm-particle-drift-b', delay: '-7.3s' },
  { id: 9, top: '85%', left: '46%', size: 4.5, color: 'orange', driftClass: 'cbm-particle-drift-c', delay: '-5.6s' },
  { id: 10, top: '92%', left: '11%', size: 3, color: 'navy', driftClass: 'cbm-particle-drift-a', delay: '-10.2s' },
  { id: 11, top: '5%', left: '55%', size: 3.5, color: 'navy', driftClass: 'cbm-particle-drift-b', delay: '-4.8s' },
  { id: 12, top: '62%', left: '62%', size: 4, color: 'orange', driftClass: 'cbm-particle-drift-c', delay: '-1.9s' },
];

export const AmbientBackground: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. DOMINANT WARM PEACH-CREAM CANVAS (MATCHING SWATCH) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FFFDFB 0%, #FFF5EC 40%, #FEEFE3 100%)',
        }}
      />

      {/* 2. FAINT LIVING TECH GRID & MATRIX SYSTEM */}
      <div
        className="absolute inset-0 opacity-[0.38]"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(7, 43, 87, 0.05) 1.2px, transparent 1.2px),
            linear-gradient(to right, rgba(234, 88, 12, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(7, 43, 87, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px, 72px 72px, 72px 72px',
        }}
      />

      {/* 3. AI CIRCUIT & NEURAL BUS TRACES (VECTOR GRAPHICS) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.32]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cbmCircuitGradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="cbmCircuitGradNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#072B57" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Top-Right: Neural Network Constellation */}
        <g className="cbm-neural-pulse" transform="translate(40, 20)">
          {/* Synaptic connection paths */}
          <line x1="88%" y1="6%" x2="94%" y2="12%" stroke="url(#cbmCircuitGradOrange)" strokeWidth="1.4" strokeDasharray="3 3" />
          <line x1="94%" y1="12%" x2="91%" y2="22%" stroke="url(#cbmCircuitGradNavy)" strokeWidth="1.2" />
          <line x1="91%" y1="22%" x2="84%" y2="18%" stroke="url(#cbmCircuitGradOrange)" strokeWidth="1.2" />
          <line x1="84%" y1="18%" x2="88%" y2="6%" stroke="url(#cbmCircuitGradOrange)" strokeWidth="1.2" />
          <line x1="94%" y1="12%" x2="98%" y2="8%" stroke="url(#cbmCircuitGradOrange)" strokeWidth="1.2" />

          {/* Neural Nodes */}
          <circle cx="88%" cy="6%" r="3.5" fill="#EA580C" fillOpacity="0.35" />
          <circle cx="88%" cy="6%" r="1.5" fill="#FFFFFF" />
          <circle cx="94%" cy="12%" r="4.5" fill="#072B57" fillOpacity="0.3" />
          <circle cx="94%" cy="12%" r="2" fill="#FFFFFF" />
          <circle cx="91%" cy="22%" r="3.5" fill="#EA580C" fillOpacity="0.35" />
          <circle cx="84%" cy="18%" r="3" fill="#F59E0B" fillOpacity="0.4" />
          <circle cx="98%" cy="8%" r="2.5" fill="#EA580C" fillOpacity="0.3" />
        </g>

        {/* Mid-Left: AI Microchip Silicon Traces (45-degree angle paths) */}
        <g opacity="0.8">
          {/* Circuit line 1 */}
          <path
            d="M -10,220 L 70,220 L 115,265 L 180,265"
            fill="none"
            stroke="url(#cbmCircuitGradOrange)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="180" cy="265" r="3" fill="#EA580C" fillOpacity="0.5" />

          {/* Circuit line 2 */}
          <path
            d="M -10,250 L 50,250 L 95,295 L 150,295"
            fill="none"
            stroke="url(#cbmCircuitGradNavy)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="150" cy="295" r="2.5" fill="#072B57" fillOpacity="0.4" />

          {/* Circuit line 3 */}
          <path
            d="M 60,340 L 110,340 L 140,310 L 210,310"
            fill="none"
            stroke="url(#cbmCircuitGradOrange)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
          <circle cx="210" cy="310" r="3" fill="#F59E0B" fillOpacity="0.4" />
        </g>

        {/* Bottom-Right: Neural Accelerator Path */}
        <g opacity="0.75">
          <path
            d="M 98% 70% L 92% 70% L 88% 75% L 82% 75%"
            fill="none"
            stroke="url(#cbmCircuitGradOrange)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="82%" cy="75%" r="3" fill="#EA580C" fillOpacity="0.45" />

          <path
            d="M 98% 74% L 94% 74% L 90% 79% L 85% 79%"
            fill="none"
            stroke="url(#cbmCircuitGradNavy)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="85%" cy="79%" r="2.5" fill="#072B57" fillOpacity="0.4" />
        </g>
      </svg>

      {/* 4. FLOATING 4-POINT AI SPARK ICONS (GEMINI/AI-STYLE SPARKLES) */}
      <div className="absolute inset-0">
        {/* Spark 1 - Top Left */}
        <div className="cbm-ai-spark-1 absolute top-[14%] left-[6%] text-[#EA580C]">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 0Q12 7.5 19.5 12Q12 16.5 12 24Q12 16.5 4.5 12Q12 7.5 12 0Z" />
          </svg>
        </div>

        {/* Spark 2 - Center Right */}
        <div className="cbm-ai-spark-2 absolute top-[44%] right-[8%] text-[#F59E0B]">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0Q12 7.5 19.5 12Q12 16.5 12 24Q12 16.5 4.5 12Q12 7.5 12 0Z" />
          </svg>
        </div>

        {/* Spark 3 - Lower Mid */}
        <div className="cbm-ai-spark-1 absolute top-[80%] left-[24%] text-[#EA580C]/80">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0Q12 7.5 19.5 12Q12 16.5 12 24Q12 16.5 4.5 12Q12 7.5 12 0Z" />
          </svg>
        </div>

        {/* Spark 4 - Top Mid */}
        <div className="cbm-ai-spark-2 absolute top-[6%] left-[48%] text-[#072B57]/60">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0Q12 7.5 19.5 12Q12 16.5 12 24Q12 16.5 4.5 12Q12 7.5 12 0Z" />
          </svg>
        </div>
      </div>

      {/* 5. FAINT AI & TECH TOKENS (MONOSPACE SUBTLE ATMOSPHERE) */}
      <div className="hidden md:block absolute inset-0 font-mono text-[11px] font-semibold select-none">
        {/* Token: <AI /> */}
        <div className="cbm-code-token absolute top-[22%] left-[4%] text-[#EA580C]/30 px-2 py-0.5 rounded border border-orange-300/20 bg-orange-100/10">
          &lt;AI /&gt;
        </div>

        {/* Token: [Neural] */}
        <div className="cbm-code-token absolute top-[34%] right-[5%] text-[#072B57]/30 px-2 py-0.5 rounded border border-blue-300/20 bg-blue-100/10" style={{ animationDelay: '-4s' }}>
          [Neural.Net]
        </div>

        {/* Token: σ(W·x + b) */}
        <div className="cbm-code-token absolute top-[65%] left-[8%] text-[#EA580C]/25 px-2 py-0.5 rounded border border-orange-300/15" style={{ animationDelay: '-7s' }}>
          σ(W·x + b)
        </div>

        {/* Token: 010101 */}
        <div className="cbm-code-token absolute top-[88%] right-[14%] text-[#072B57]/25 tracking-widest" style={{ animationDelay: '-2s' }}>
          01101001
        </div>
      </div>

      {/* 6. HORIZONTAL WIDE AMBIENT WARM ORANGE LIGHT SWEEP */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="cbm-ambient-wave absolute h-[140%] w-[68vw] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255, 107, 0, 0.05) 0%, rgba(254, 215, 170, 0.03) 45%, transparent 75%)',
          }}
        />
      </div>

      {/* 7. SPARSELY DISTRIBUTED FLOATING MICRO-PARTICLES */}
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
