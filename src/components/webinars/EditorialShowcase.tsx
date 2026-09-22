import React from 'react';
import { Clock, Timer, User, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface EditorialShowcaseProps {
  webinar: Webinar;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

export function parseShowcaseDate(dateStr: string) {
  if (!dateStr) return { day: '28', month: 'SEP', year: '2026' };
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].substring(0, 3).toUpperCase();
    const year = parts[2];
    return { day, month, year };
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = String(d.getFullYear());
    return { day, month, year };
  }
  return { day: '28', month: 'SEP', year: '2026' };
}

export const EditorialShowcase: React.FC<EditorialShowcaseProps> = ({
  webinar,
  onSelect,
  onRegister,
}) => {
  const isFree = webinar.type === 'free';
  const priceDisplay = isFree
    ? 'FREE'
    : typeof webinar.price === 'number'
    ? `₹${webinar.price}`
    : webinar.price || '₹499';

  const { day, month, year } = parseShowcaseDate(webinar.date);

  return (
    <div
      id="main-webinar-showcase-container"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
    >
      {/* LEFT: Large vertical webinar poster (~45% width, 16:10 / 4:3, rounded ~18px) */}
      <div
        onClick={() => onSelect(webinar)}
        className="lg:col-span-5 relative group overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-slate-900 shadow-[0_8px_30px_rgba(7,43,87,0.08)] cursor-pointer"
      >
        <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden">
          <img
            src={
              webinar.posterUrl ||
              'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80'
            }
            alt={webinar.title}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        {/* 7. FEATURED WEBINAR MARKER: "NEXT LIVE" at top-left */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <span className="inline-flex items-center rounded-md bg-[#072B57] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs">
            NEXT LIVE
          </span>

          {isFree ? (
            <span className="inline-flex items-center rounded-md bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              FREE
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-[#FF6B00] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              PAID
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: Information Panel (~55% width, subtle orange vertical accent line) */}
      <div className="lg:col-span-7 flex flex-col justify-center border-l-2 border-[#FF6B00] pl-6 sm:pl-8 py-2">
        {/* Eyebrow Label */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF6B00]">
            {isFree ? 'FREE LIVE SESSION' : 'EXCLUSIVE MASTERCLASS'}
          </span>
        </div>

        {/* Title */}
        <h2
          onClick={() => onSelect(webinar)}
          className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#072B57] tracking-tight leading-tight hover:text-[#FF6B00] transition-colors cursor-pointer"
        >
          {webinar.title}
        </h2>

        {/* Description */}
        <p className="mt-3.5 text-sm sm:text-base text-[#1E293B]/80 leading-relaxed max-w-xl">
          {webinar.description}
        </p>

        {/* 8. Editorial Date & Schedule Display */}
        <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex flex-wrap items-center gap-6 sm:gap-8">
          {/* Editorial date badge */}
          <div className="flex items-baseline gap-1.5 font-bold">
            <span className="text-2xl sm:text-3xl font-black text-[#072B57] leading-none">
              {day}
            </span>
            <span className="text-sm font-black text-[#FF6B00] uppercase">
              {month}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">
              {year}
            </span>
          </div>

          <div className="h-6 w-px bg-[#E5E7EB] hidden sm:block" />

          {/* Time & Duration */}
          <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold text-[#1E293B]">
            <span className="inline-flex items-center gap-1.5 text-slate-700">
              <Clock className="h-4 w-4 text-[#FF6B00]" />
              {webinar.time}
            </span>

            <span className="inline-flex items-center gap-1.5 text-slate-700">
              <Timer className="h-4 w-4 text-[#FF6B00]" />
              {webinar.duration || '60 Minutes'}
            </span>
          </div>

          <div className="h-6 w-px bg-[#E5E7EB] hidden sm:block" />

          {/* Host */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 font-semibold">
            <User className="h-4 w-4 text-[#FF6B00]" />
            <span>HOST: <span className="text-[#072B57]">{webinar.host || 'CBM Academy'}</span></span>
          </div>
        </div>

        {/* 6. Free/Paid & 9. CTAs */}
        <div className="mt-7 pt-5 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wider ${
                isFree
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-orange-50 text-[#FF6B00] border border-orange-200'
              }`}
            >
              {isFree ? 'FREE' : 'PAID'}
            </span>

            <span
              className={`text-2xl font-black ${
                isFree ? 'text-emerald-600' : 'text-[#072B57]'
              }`}
            >
              {priceDisplay}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onSelect(webinar)}
              className="text-xs sm:text-sm font-bold text-[#072B57] hover:text-[#FF6B00] hover:underline transition-colors cursor-pointer"
            >
              View Details
            </button>

            <button
              type="button"
              id="btn-register-showcase-primary"
              onClick={() => onRegister(webinar)}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#FF6B00] px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-150 hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Register Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
