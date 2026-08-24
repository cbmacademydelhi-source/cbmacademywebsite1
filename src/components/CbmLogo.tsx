import React from 'react';

interface CbmLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'footer';
  height?: number | string;
  showTagline?: boolean;
}

/**
 * Official CBM Academy Logo Component
 * Exactly preserves:
 * - "CBM" in bold orange (#FF6B00)
 * - "Academy" in clean bold black/dark charcoal (#111827)
 * - Full Tagline: "Your Digital Marketing Journey Begins Here"
 * - Maintains 100% original aspect ratio and generous viewBox boundaries to prevent any clipping.
 */
export const CbmLogo: React.FC<CbmLogoProps> = ({
  className = '',
  variant = 'light',
  height = 46,
  showTagline = true,
}) => {
  const isDark = variant === 'dark';

  if (variant === 'footer') {
    return (
      <div className={`inline-flex items-center bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm max-w-full ${className}`}>
        <svg
          viewBox="0 0 720 160"
          className="w-auto h-auto max-w-full select-none"
          style={{ height: typeof height === 'number' ? `${height}px` : height, minWidth: '160px' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="CBM Academy - Your Digital Marketing Journey Begins Here"
        >
          {/* CBM in exact Orange */}
          <text
            x="8"
            y="94"
            fill="#FF6B00"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="96"
            letterSpacing="-1px"
          >
            CBM
          </text>
          
          {/* Academy in exact Black */}
          <text
            x="245"
            y="94"
            fill="#111827"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="700"
            fontSize="96"
            letterSpacing="-0.5px"
          >
            Academy
          </text>

          {/* Exact Full Tagline */}
          {showTagline && (
            <text
              x="10"
              y="142"
              fill="#1E293B"
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
              fontWeight="600"
              fontSize="28"
              letterSpacing="0.2px"
            >
              Your Digital Marketing Journey Begins Here
            </text>
          )}
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none flex-shrink-0 ${className}`}>
      <svg
        viewBox="0 0 720 160"
        className="w-auto h-auto max-w-full transition-transform"
        style={{ height: typeof height === 'number' ? `${height}px` : height, minWidth: '160px' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CBM Academy - Your Digital Marketing Journey Begins Here"
      >
        {/* CBM in exact Orange #FF6B00 */}
        <text
          x="8"
          y="94"
          fill="#FF6B00"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="96"
          letterSpacing="-1px"
        >
          CBM
        </text>

        {/* Academy */}
        <text
          x="245"
          y="94"
          fill={isDark ? '#FFFFFF' : '#111827'}
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="96"
          letterSpacing="-0.5px"
        >
          Academy
        </text>

        {/* Full Tagline */}
        {showTagline && (
          <text
            x="10"
            y="142"
            fill={isDark ? '#E2E8F0' : '#1E293B'}
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontWeight="600"
            fontSize="28"
            letterSpacing="0.2px"
          >
            Your Digital Marketing Journey Begins Here
          </text>
        )}
      </svg>
    </div>
  );
};
