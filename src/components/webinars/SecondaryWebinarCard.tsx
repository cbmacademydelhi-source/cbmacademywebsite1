import React from 'react';
import { Calendar, Clock, Timer, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface SecondaryWebinarCardProps {
  webinar: Webinar;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

export const SecondaryWebinarCard: React.FC<SecondaryWebinarCardProps> = ({
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
      id={`secondary-webinar-${webinar.id}`}
      onClick={() => onSelect(webinar)}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_2px_12px_rgba(7,43,87,0.05)] transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(7,43,87,0.08)] cursor-pointer"
    >
      {/* 16:9 Image at top */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={
            webinar.posterUrl ||
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
          }
          alt={webinar.title}
          className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Small Free / Paid badge */}
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
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#072B57] leading-snug line-clamp-2 group-hover:text-[#FF6B00] transition-colors">
            {webinar.title}
          </h3>

          {/* Short description */}
          <p className="mt-2.5 text-xs sm:text-sm text-[#1E293B]/75 leading-relaxed line-clamp-2">
            {webinar.description}
          </p>

          {/* Date & Time */}
          <div className="mt-4 pt-3.5 border-t border-[#E5E7EB] grid grid-cols-2 gap-2 text-xs text-[#1E293B]">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
              <span className="text-slate-600 truncate">{webinar.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
              <span className="text-slate-600 truncate">{webinar.time}</span>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <Timer className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
              <span className="text-slate-600 truncate">Duration: {webinar.duration || '60 Minutes'}</span>
            </div>
          </div>
        </div>

        {/* Footer: Price & Actions */}
        <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              Fee
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
              className="inline-flex items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-bold text-[#072B57] hover:border-[#072B57] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              View Details →
            </button>

            {typeof webinar.max_capacity === 'number' &&
            typeof webinar.current_registrations === 'number' &&
            webinar.current_registrations >= webinar.max_capacity ? (
              <span className="inline-flex items-center justify-center rounded-[8px] bg-slate-200 px-3.5 py-2 text-xs font-bold text-slate-500 cursor-not-allowed">
                Closed
              </span>
            ) : (
              <button
                type="button"
                id={`btn-register-secondary-${webinar.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(webinar);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-[#FF6B00] px-3.5 py-2 text-xs font-bold text-white transition-all duration-150 hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Register</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
