import React from 'react';

/**
 * AmbientBackground
 * One continuous premium dark background throughout the homepage:
 * - Base canvas: #080808
 * - Strategic, very subtle orange (#FF7200) ambient radial glows
 * - Subtle surface variations without harsh separators or decorative AI-looking elements
 * - Smooth and almost invisible transitions
 */

export const AmbientBackground: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. CONTINUOUS DEEP DARK BASE CANVAS (#080808) */}
      <div className="absolute inset-0 bg-[#080808]" />

      {/* 2. STRATEGIC SUBTLE AMBIENT GLOW 1: Hero area (Upper Right) */}
      <div
        className="absolute -top-32 right-[-10%] w-[750px] h-[750px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 114, 0, 0.08) 0%, rgba(255, 114, 0, 0.02) 45%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* 3. STRATEGIC SUBTLE AMBIENT GLOW 2: Mid-page transition near Tools/Curriculum (Center Left) */}
      <div
        className="absolute top-[38%] left-[-15%] w-[850px] h-[850px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 114, 0, 0.05) 0%, rgba(255, 114, 0, 0.015) 50%, transparent 75%)',
          filter: 'blur(100px)',
        }}
      />

      {/* 4. STRATEGIC SUBTLE AMBIENT GLOW 3: Contact & Campus area (Bottom Right) */}
      <div
        className="absolute -bottom-24 right-[-5%] w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 114, 0, 0.06) 0%, rgba(255, 114, 0, 0.015) 45%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* 5. ULTRA-SUBTLE VIGNETTE FOR IMMERSIVE DEPTH */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
    </div>
  );
};
