import React, { useRef } from 'react';
import { getAdminToken } from '../services/adminService';

export const CBM_LOGO_URL = '/assets/aistudio/CBM_Academy_Logo___Editable_z_e96afc7b.png';

interface CbmLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'footer';
  height?: number | string;
  showTagline?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Official CBM Academy Logo Component
 * Renders the uploaded official CBM Academy brand logo:
 * - 3D glossy gradient deep navy blue CBM with orange play triangle and growth arrow
 * - Bold uppercase ACADEMY
 * - "AI Integrated Digital Marketing Institute" tagline
 * - Hidden 5-click trigger for admin portal access
 */
export const CbmLogo: React.FC<CbmLogoProps> = ({
  className = '',
  variant = 'light',
  height = 52,
  onClick,
}) => {
  const isDark = variant === 'dark' || variant === 'footer';
  const computedHeight = typeof height === 'number' ? `${height}px` : height;

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<any>(null);

  const handleSecretTrigger = (e: React.MouseEvent<HTMLDivElement>) => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 5) {
      e.preventDefault();
      e.stopPropagation();
      clickCountRef.current = 0;

      // When the logo is clicked 5 times consecutively, open the existing admin login screen
      const token = getAdminToken();
      if (token) {
        window.location.hash = 'admin/dashboard';
      } else {
        window.location.hash = 'admin/login';
      }
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2500);

    if (onClick) {
      onClick(e);
    }
  };

  if (isDark) {
    return (
      <div
        onClick={handleSecretTrigger}
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
    <div
      onClick={handleSecretTrigger}
      className={`inline-flex items-center flex-shrink-0 select-none ${className}`}
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
};
