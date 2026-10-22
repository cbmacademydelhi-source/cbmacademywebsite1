import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface CompactWebinarCardProps {
  webinar: Webinar;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

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

export const CompactWebinarCard: React.FC<CompactWebinarCardProps> = ({
  webinar,
  onSelect,
  onRegister,
}) => {
  const rawPrice = webinar.price;
  const numPrice = typeof rawPrice === 'number'
    ? rawPrice
    : Number(String(rawPrice || '').replace(/[^0-9.]/g, ''));
  const isPaid = (typeof rawPrice === 'number' && rawPrice > 0) ||
    (!isNaN(numPrice) && numPrice > 0) ||
    webinar.type === 'paid';
  const priceValue = typeof rawPrice === 'number' && rawPrice > 0
    ? rawPrice
    : !isNaN(numPrice) && numPrice > 0
    ? numPrice
    : 499;
  const isFree = !isPaid;
  const priceDisplay = isFree ? 'FREE' : `₹${priceValue}`;

  const dateParts = parseDateBadge(webinar.date);

  return (
    <article
      id={`compact-webinar-${webinar.id}`}
      onClick={() => onSelect(webinar)}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/40 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Left: Photo / Poster (Photo on Left) */}
        <div className="relative w-full sm:w-[220px] md:w-[250px] shrink-0 bg-slate-900 overflow-hidden flex items-center justify-center min-h-[170px] sm:min-h-full">
          <img
            src={
              webinar.posterUrl ||
              'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80'
            }
            alt={webinar.title ? `${webinar.title} - CBM Academy Live Webinar` : 'CBM Academy Live Webinar Workshop'}
            title={webinar.title || 'CBM Academy Live Webinar Workshop'}
            width={800}
            height={450}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

          {/* Calendar Badge */}
          <div className="absolute top-3 left-3 flex flex-col items-center justify-center rounded-xl bg-white/95 px-2 py-1 shadow-sm border border-slate-200/60 backdrop-blur-xs pointer-events-none">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#FF6B00]">
              {dateParts.month}
            </span>
            <span className="text-base font-black text-[#072B57] leading-none">
              {dateParts.day}
            </span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
            {isFree ? (
              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                FREE
              </span>
            ) : (
              <span className="rounded-md bg-[#FF6B00] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                PAID • {priceDisplay}
              </span>
            )}
          </div>
        </div>

        {/* Right: Details (Details on Right) */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span>{webinar.duration || '60 Mins'}</span>
              <span aria-hidden="true">·</span>
              <span>Online Interactive</span>
            </div>

            <h4 className="text-base font-bold text-[#072B57] leading-snug line-clamp-2 group-hover:text-[#FF6B00] transition-colors">
              {webinar.title}
            </h4>

            <p className="mt-1 text-xs text-slate-600 line-clamp-2">
              {webinar.description}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 text-[#FF6B00]" />
                {webinar.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#FF6B00]" />
                {webinar.time}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <span
              className={`text-base font-black ${
                isFree ? 'text-emerald-600' : 'text-[#072B57]'
              }`}
            >
              {priceDisplay}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(webinar);
                }}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-900 transition-colors cursor-pointer"
              >
                Details
              </button>

              <button
                type="button"
                id={`btn-register-compact-${webinar.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(webinar);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-[#FF6B00] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Register</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
