import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Sparkles } from 'lucide-react';
import { Webinar } from '../../types';

interface WebinarPromoPopupProps {
  upcomingWebinar: Webinar | null;
  onRegister: (webinar: Webinar) => void;
}

const POPUP_SESSION_KEY = 'cbm_webinar_popup_shown_v1';

export const WebinarPromoPopup: React.FC<WebinarPromoPopupProps> = ({
  upcomingWebinar,
  onRegister,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if there is an active upcoming webinar
    if (!upcomingWebinar) {
      return;
    }

    // Check sessionStorage to show once per browser session
    try {
      const alreadyShown = sessionStorage.getItem(POPUP_SESSION_KEY);
      if (alreadyShown) {
        return;
      }

      // Small delay (e.g. 1000ms) after page load so experience is smooth
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    } catch {
      // If sessionStorage fails (e.g. strict private mode), don't break
    }
  }, [upcomingWebinar]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(POPUP_SESSION_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleRegisterClick = () => {
    if (upcomingWebinar) {
      handleClose();
      onRegister(upcomingWebinar);
    }
  };

  if (!isOpen || !upcomingWebinar) return null;

  const isFree = upcomingWebinar.type === 'free';
  const priceDisplay = isFree
    ? 'FREE LIVE WEBINAR'
    : typeof upcomingWebinar.price === 'number'
    ? `PAID WEBINAR &bull; ₹${upcomingWebinar.price}`
    : `PAID WEBINAR &bull; ${upcomingWebinar.price}`;

  return (
    <div
      id="webinar-promo-popup-overlay"
      className="fixed inset-0 z-[10030] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs transition-opacity duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Upcoming Webinar Alert"
    >
      <div
        id="webinar-promo-popup-card"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] transition-transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Label */}
        <div className="flex items-center justify-between bg-[#072B57] px-4 py-2.5 text-white">
          <div className="flex items-center gap-1.5 text-[11px] font-black tracking-wider uppercase text-orange-400">
            <Sparkles className="h-3.5 w-3.5 text-[#FF6B00]" />
            <span>UPCOMING WEBINAR</span>
          </div>

          <button
            type="button"
            id="btn-close-webinar-popup"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-full p-1 text-slate-300 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Poster Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={
              upcomingWebinar.posterUrl ||
              'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
            }
            alt={upcomingWebinar.title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Details Content */}
        <div className="p-5 text-center">
          <h4 className="text-base font-extrabold text-[#072B57] leading-tight line-clamp-2">
            {upcomingWebinar.title}
          </h4>

          {/* Schedule Info */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#FF6B00]" />
              <span className="font-medium">{upcomingWebinar.date}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#FF6B00]" />
              <span className="font-medium">{upcomingWebinar.time}</span>
            </div>
          </div>

          {/* Badge */}
          <div className="mt-3">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-800">
              {priceDisplay}
            </span>
          </div>

          {/* Register Button */}
          <button
            type="button"
            id="btn-popup-register-now"
            onClick={handleRegisterClick}
            className="mt-5 w-full rounded-xl bg-[#FF6B00] py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#e05f00] cursor-pointer shadow-md active:scale-98"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};
