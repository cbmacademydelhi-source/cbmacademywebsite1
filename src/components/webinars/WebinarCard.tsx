import React from 'react';
import { Calendar, Clock, Timer, User, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface WebinarCardProps {
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

export const WebinarCard: React.FC<WebinarCardProps> = ({
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
      id={`webinar-card-${webinar.id}`}
      onClick={() => onSelect(webinar)}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Left: Photo / Poster (Photo on Left) */}
        <div className="relative w-full sm:w-[260px] md:w-[300px] shrink-0 bg-slate-900 overflow-hidden flex items-center justify-center min-h-[190px] sm:min-h-full">
          <img
            src={
              webinar.posterUrl ||
              'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
            }
            alt={webinar.title ? `${webinar.title} - CBM Academy Digital Marketing Event` : 'CBM Academy Digital Marketing Event in Delhi'}
            title={webinar.title || 'CBM Academy Digital Marketing Event'}
            width={800}
            height={450}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

          {/* Calendar Badge */}
          <div className="absolute top-3 left-3 flex flex-col items-center justify-center rounded-xl bg-white/95 px-2.5 py-1.5 shadow-sm border border-slate-200/60 backdrop-blur-xs pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">
              {dateParts.month}
            </span>
            <span className="text-lg font-black text-[#072B57] leading-none">
              {dateParts.day}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 pointer-events-none">
            {isFree ? (
              <span className="rounded-lg bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                FREE
              </span>
            ) : (
              <span className="rounded-lg bg-[#FF6B00] px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                PAID • {priceDisplay}
              </span>
            )}
          </div>
        </div>

        {/* Right: Details (Details on Right) */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
              <span>{webinar.duration || '60 Mins'}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{webinar.host || 'CBM Academy'}</span>
            </div>

            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#072B57] leading-snug group-hover:text-[#FF6B00] transition-colors">
              {webinar.title}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
              {webinar.description}
            </p>

            <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="truncate">{webinar.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="truncate">{webinar.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="truncate">{webinar.duration || '60 Mins'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="truncate">{webinar.host || 'CBM Academy'}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                Registration
              </span>
              <span
                className={`text-lg font-black ${
                  isFree ? 'text-emerald-600' : 'text-[#072B57]'
                }`}
              >
                {priceDisplay}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(webinar);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#072B57] hover:border-[#072B57] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Details
              </button>

              <button
                type="button"
                id={`btn-register-${webinar.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(webinar);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF6B00] px-4 py-2 text-xs font-bold text-white transition-all duration-150 hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Register</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
