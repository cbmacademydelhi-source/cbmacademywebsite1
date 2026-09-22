import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface ShowcasePosterTileProps {
  webinar: Webinar;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

export function formatCompactDate(dateStr: string) {
  if (!dateStr) return 'OCT 2026';
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    const day = parts[0];
    const month = parts[1].substring(0, 3).toUpperCase();
    return `${day} ${month}`;
  }
  return dateStr;
}

export const ShowcasePosterTile: React.FC<ShowcasePosterTileProps> = ({
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

  const compactDate = formatCompactDate(webinar.date);

  return (
    <div
      id={`poster-tile-${webinar.id}`}
      onClick={() => onSelect(webinar)}
      className="group relative flex flex-col justify-end overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-slate-900 shadow-sm transition-all duration-250 ease-out hover:-translate-y-1.5 hover:shadow-lg cursor-pointer h-[280px] sm:h-[300px] w-full"
    >
      {/* Background Poster Image */}
      <img
        src={
          webinar.posterUrl ||
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
        }
        alt={webinar.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        referrerPolicy="no-referrer"
        loading="lazy"
      />

      {/* Dark Translucent Overlay for High Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#072B57]/95 via-[#072B57]/50 to-transparent" />

      {/* Top Badge: Free / Paid */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
        {isFree ? (
          <span className="inline-block rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
            FREE
          </span>
        ) : (
          <span className="inline-block rounded-md bg-[#FF6B00] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
            PAID
          </span>
        )}
      </div>

      {/* Date Tag Top Right */}
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1 rounded-md bg-black/40 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white border border-white/10">
          <Calendar className="h-2.5 w-2.5 text-[#FF6B00]" />
          {compactDate}
        </span>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 p-4 flex flex-col justify-end text-white">
        <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-orange-300 transition-colors">
          {webinar.title}
        </h4>

        <div className="mt-2.5 flex items-center justify-between border-t border-white/15 pt-2 text-xs">
          <span
            className={`font-black ${
              isFree ? 'text-emerald-400' : 'text-orange-400'
            }`}
          >
            {priceDisplay}
          </span>

          <button
            type="button"
            id={`btn-register-poster-${webinar.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onRegister(webinar);
            }}
            className="inline-flex items-center gap-1 rounded-[6px] bg-[#FF6B00] px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-[#e05f00] cursor-pointer"
          >
            <span>Register</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
