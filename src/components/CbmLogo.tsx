import React from 'react';

export const CBM_LOGO_URL = '/assets/aistudio/CBM_Academy_Logo___Editable_z_e96afc7b.png';

interface CbmLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'footer';
  height?: number | string;
  showTagline?: boolean;
}

/**
 * Official CBM Academy Logo Component
 * Renders the uploaded official CBM Academy brand logo:
 * - 3D glossy gradient deep navy blue CBM with orange play triangle and growth arrow
 * - Bold uppercase ACADEMY
 * - "AI Integrated Digital Marketing Institute" tagline
 */
export const CbmLogo: React.FC<CbmLogoProps> = ({
  className = '',
  variant = 'light',
  height = 52,
}) => {
  const isDark = variant === 'dark' || variant === 'footer';
  const computedHeight = typeof height === 'number' ? `${height}px` : height;

  if (isDark) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-white/20 shadow-xs max-w-full flex-shrink-0 select-none ${className}`}
      >
        <img
          src={CBM_LOGO_URL}
          alt="CBM Academy - AI Integrated Digital Marketing Institute"
          style={{ height: computedHeight, width: 'auto' }}
          className="max-w-full object-contain block"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center flex-shrink-0 select-none ${className}`}>
      <img
        src={CBM_LOGO_URL}
        alt="CBM Academy - AI Integrated Digital Marketing Institute"
        style={{ height: computedHeight, width: 'auto' }}
        className="max-w-full object-contain block"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
