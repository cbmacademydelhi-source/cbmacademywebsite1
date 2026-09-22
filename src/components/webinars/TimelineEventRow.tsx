import React from 'react';
import { Calendar, Clock, Timer, User, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface TimelineEventRowProps {
  webinar: Webinar;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

export function parseWebinarDate(dateStr: string) {
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

export const TimelineEventRow: React.FC<TimelineEventRowProps> = ({
  webinar,
  isFirst,
  isLast,
  onSelect,
  onRegister,
}) => {
  const isFree = webinar.type === 'free';
  const priceDisplay = isFree
    ? 'FREE'
    : typeof webinar.price === 'number'
    ? `₹${webinar.price}`
    : webinar.price || '₹499';

  const { day, month, year } = parseWebinarDate(webinar.date);

  return (
    <div
      id={`timeline-event-${webinar.id}`}
      className="group relative flex items-start gap-4 sm:gap-6 lg:gap-8"
    >
      {/* 3. & 9. Vertical Timeline Column on Left */}
      <div className="flex flex-col items-center shrink-0 self-stretch pt-6 sm:pt-7">
        {/* Timeline Dot */}
        <div
          className={`relative z-10 flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-full transition-all duration-200 ${
            isFirst
              ? 'bg-[#FF6B00] ring-4 ring-orange-100 group-hover:ring-orange-200 group-hover:scale-110'
              : 'bg-[#072B57] ring-4 ring-slate-100 group-hover:bg-[#FF6B00] group-hover:ring-orange-100 group-hover:scale-110'
          }`}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>

        {/* Vertical Connecting Line */}
        {!isLast && (
          <div className="w-[2px] flex-1 bg-[#E5E7EB] my-2 transition-colors duration-200 group-hover:bg-slate-300" />
        )}
      </div>

      {/* 4. Horizontal Event Container / Card */}
      <div
        onClick={() => onSelect(webinar)}
        className="flex-1 overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_2px_10px_rgba(7,43,87,0.04)] transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_10px_28px_rgba(7,43,87,0.08)] cursor-pointer mb-6 sm:mb-7"
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-5 sm:gap-6">
          {/* Left: Webinar Image (approx 280px × 170px on desktop) */}
          <div className="relative w-full lg:w-[280px] h-[180px] sm:h-[190px] lg:h-[170px] shrink-0 overflow-hidden rounded-[12px] bg-slate-100">
            <img
              src={
                webinar.posterUrl ||
                'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
              }
              alt={webinar.title}
              className="h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:brightness-[1.03]"
              referrerPolicy="no-referrer"
              loading="lazy"
            />

            {/* Small status badge on image */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
              {isFree ? (
                <span className="inline-block rounded-md bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                  FREE
                </span>
              ) : (
                <span className="inline-block rounded-md bg-[#FF6B00] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                  PAID
                </span>
              )}
            </div>
          </div>

          {/* Center: Distinctive Date block + Details */}
          <div className="flex flex-1 flex-col sm:flex-row items-start gap-4 sm:gap-5 min-w-0">
            {/* 5. Date Design: Vertical Date Block */}
            <div className="shrink-0 flex sm:flex-col items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 sm:py-2.5 min-w-[70px] text-center shadow-2xs gap-1.5 sm:gap-0">
              <span className="text-[11px] font-extrabold text-[#FF6B00] tracking-wider uppercase">
                {month}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#072B57] leading-none my-0.5">
                {day}
              </span>
              <span className="text-[10px] font-semibold text-[#64748B]">
                {year}
              </span>
            </div>

            {/* Title, description, schedule details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#FF6B00]" />
                  {webinar.time}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
                  <Timer className="h-3 w-3 text-[#FF6B00]" />
                  {webinar.duration || '60 Minutes'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#072B57] leading-snug line-clamp-2 group-hover:text-[#FF6B00] transition-colors">
                {webinar.title}
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-[#1E293B]/75 line-clamp-2 leading-relaxed">
                {webinar.description}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-[#64748B]">
                <User className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="font-semibold text-slate-700">Host:</span>
                <span className="text-slate-600 truncate">{webinar.host || 'CBM Academy'}</span>
              </div>
            </div>
          </div>

          {/* Right: Price & Compact Action Buttons */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E5E7EB] shrink-0 lg:min-w-[170px]">
            {/* 6. Event Status & Price */}
            <div className="text-left lg:text-right">
              <span className="text-[10px] font-bold text-[#64748B] block uppercase tracking-wider">
                {isFree ? 'Registration' : 'Fee'}
              </span>
              <span
                className={`text-lg sm:text-xl font-black ${
                  isFree ? 'text-emerald-600' : 'text-[#072B57]'
                }`}
              >
                {priceDisplay}
              </span>
            </div>

            {/* 7. Action buttons (compact) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(webinar);
                }}
                className="inline-flex items-center justify-center rounded-[8px] border border-[#072B57] bg-white px-3 py-1.5 sm:py-2 text-xs font-bold text-[#072B57] transition-colors hover:bg-slate-50 cursor-pointer"
              >
                View Details
              </button>

              <button
                type="button"
                id={`btn-register-timeline-${webinar.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(webinar);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-[#FF6B00] px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white transition-all duration-150 hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Register Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
