import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface WebinarPromoPopupProps {
  upcomingWebinar: Webinar | null;
  onRegister: (webinar: Webinar) => void;
}

const POPUP_SESSION_KEY = 'cbm_webinar_popup_shown_v1';

function parseDateBadge(dateStr: string) {
  const parts = dateStr.trim().split(' ');
  if (parts.length >= 3) {
    return {
      day: parts[0],
      month: parts[1].slice(0, 3).toUpperCase(),
    };
  }
  return { day: 'LIVE', month: 'SESSION' };
}

export const WebinarPromoPopup: React.FC<WebinarPromoPopupProps> = ({
  upcomingWebinar,
  onRegister,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!upcomingWebinar) return;

    try {
      const alreadyShown = sessionStorage.getItem(POPUP_SESSION_KEY);
      if (alreadyShown) return;

      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    } catch {
      // ignore
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

  const rawPrice = upcomingWebinar.price;
  const numPrice = typeof rawPrice === 'number'
    ? rawPrice
    : Number(String(rawPrice || '').replace(/[^0-9.]/g, ''));
  const isPaid = (typeof rawPrice === 'number' && rawPrice > 0) ||
    (!isNaN(numPrice) && numPrice > 0) ||
    upcomingWebinar.type === 'paid';
  const priceValue = typeof rawPrice === 'number' && rawPrice > 0
    ? rawPrice
    : !isNaN(numPrice) && numPrice > 0
    ? numPrice
    : 499;
  const isFree = !isPaid;
  const priceDisplay = isFree ? 'FREE' : `PAID • ₹${priceValue}`;

  const dateParts = parseDateBadge(upcomingWebinar.date);

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
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          id="btn-close-webinar-popup"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 rounded-full bg-slate-900/60 p-1 text-white hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Photo on Left, Details on Right */}
        <div className="flex flex-col sm:flex-row items-stretch">
          <div className="relative w-full sm:w-[190px] shrink-0 bg-slate-900 min-h-[160px] sm:min-h-full overflow-hidden">
            <img
              src={
                upcomingWebinar.posterUrl ||
                'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
              }
              alt={upcomingWebinar.title ? `${upcomingWebinar.title} - CBM Academy Featured Live Webinar` : 'CBM Academy Featured Live Webinar'}
              title={upcomingWebinar.title || 'CBM Academy Featured Live Webinar'}
              width={800}
              height={450}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

            <div className="absolute top-3 left-3 flex flex-col items-center justify-center rounded-xl bg-white/95 px-2.5 py-1 shadow-sm border border-slate-200/60">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#FF6B00]">
                {dateParts.month}
              </span>
              <span className="text-base font-black text-[#072B57] leading-none">
                {dateParts.day}
              </span>
            </div>

            <div className="absolute bottom-2.5 left-2.5">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-xs ${
                isPaid ? 'bg-[#FF6B00]' : 'bg-emerald-600'
              }`}>
                {priceDisplay}
              </span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] mb-1">
                Next Scheduled Session
              </div>

              <h4 className="text-base font-bold text-[#072B57] leading-snug line-clamp-2">
                {upcomingWebinar.title}
              </h4>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <Calendar className="h-3.5 w-3.5 text-[#FF6B00]" />
                  {upcomingWebinar.date}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-[#FF6B00]" />
                  {upcomingWebinar.time} IST
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Access</span>
                <span className={`text-base font-black ${isFree ? 'text-emerald-600' : 'text-[#072B57]'}`}>
                  {priceDisplay}
                </span>
              </div>

              <button
                type="button"
                id="btn-popup-register-now"
                onClick={handleRegisterClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B00] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Reserve Seat</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
