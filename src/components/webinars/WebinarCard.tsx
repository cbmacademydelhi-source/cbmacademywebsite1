import React from 'react';
import { Calendar, Clock, Timer, User, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface WebinarCardProps {
  webinar: Webinar;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

export const WebinarCard: React.FC<WebinarCardProps> = ({
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

  return (
    <div
      id={`webinar-card-${webinar.id}`}
      onClick={() => onSelect(webinar)}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(7,43,87,0.08)] cursor-pointer"
    >
      {/* 1. Large Webinar Poster at the Top (16:9 aspect ratio, rounded top corners) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={
            webinar.posterUrl ||
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
          }
          alt={webinar.title}
          className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* 2. Small badge positioned neatly over/near poster: FREE WEBINAR or PAID WEBINAR */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
          {isFree ? (
            <span className="inline-block rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
              FREE WEBINAR
            </span>
          ) : (
            <span className="inline-block rounded-md bg-[#FF6B00] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
              PAID WEBINAR
            </span>
          )}

          {webinar.status === 'draft' && (
            <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              DRAFT
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* 3. Webinar Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#072B57] line-clamp-2 leading-snug group-hover:text-[#FF6B00] transition-colors">
          {webinar.title}
        </h3>

        {/* 4. Short Description */}
        <p className="mt-2 text-xs sm:text-sm text-[#1E293B]/75 line-clamp-2 leading-relaxed">
          {webinar.description}
        </p>

        {/* 5, 6, 7. Date, Time, Duration, Host */}
        <div className="mt-4 pt-3.5 border-t border-[#E5E7EB] space-y-2 text-xs text-[#1E293B]">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
            <span className="font-semibold text-slate-800">Date:</span>
            <span className="text-slate-600">{webinar.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
            <span className="font-semibold text-slate-800">Time:</span>
            <span className="text-slate-600">{webinar.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <Timer className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
            <span className="font-semibold text-slate-800">Duration:</span>
            <span className="text-slate-600">{webinar.duration || '60 Minutes'}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
            <span className="font-semibold text-slate-800">Host:</span>
            <span className="text-slate-600 truncate">{webinar.host || 'CBM Academy'}</span>
          </div>
        </div>

        {/* 8. Price & 9. Register Now Button */}
        <div className="mt-5 pt-3.5 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              Registration Fee
            </span>
            <span
              className={`text-base font-extrabold ${
                isFree ? 'text-emerald-600' : 'text-[#072B57]'
              }`}
            >
              {priceDisplay}
            </span>
          </div>

          <button
            type="button"
            id={`btn-register-${webinar.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onRegister(webinar);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B00] px-4 py-2.5 text-xs font-bold text-white transition-all duration-150 hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>Register Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
