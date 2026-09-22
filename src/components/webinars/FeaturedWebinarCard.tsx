import React from 'react';
import { Calendar, Clock, Timer, User, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface FeaturedWebinarCardProps {
  webinar: Webinar;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

export const FeaturedWebinarCard: React.FC<FeaturedWebinarCardProps> = ({
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
      id={`featured-webinar-${webinar.id}`}
      onClick={() => onSelect(webinar)}
      className="group relative overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_4px_20px_rgba(7,43,87,0.06)] transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(7,43,87,0.1)] cursor-pointer"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left: Large Image (~58% width on desktop, clean 16:9 aspect ratio, controlled max height) */}
        <div className="relative lg:col-span-7 aspect-[16/9] max-h-[340px] sm:max-h-[360px] lg:max-h-[380px] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
          <img
            src={
              webinar.posterUrl ||
              'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80'
            }
            alt={webinar.title}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Badges on poster */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className="inline-block rounded-md bg-[#072B57] px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs">
              FEATURED WEBINAR
            </span>

            {isFree ? (
              <span className="inline-block rounded-md bg-emerald-600 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                FREE WEBINAR
              </span>
            ) : (
              <span className="inline-block rounded-md bg-[#FF6B00] px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                PAID WEBINAR
              </span>
            )}
          </div>
        </div>

        {/* Right: Detailed Information (~42% width on desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6">
          <div>
            {/* Small eyebrow badge */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#FF6B00] tracking-wider uppercase">
                EXCLUSIVE LIVE WORKSHOP
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-[#072B57] leading-snug tracking-tight group-hover:text-[#FF6B00] transition-colors line-clamp-2">
              {webinar.title}
            </h2>

            {/* Short description */}
            <p className="mt-1.5 text-xs sm:text-sm text-[#1E293B]/80 leading-relaxed line-clamp-2">
              {webinar.description}
            </p>

            {/* Date, Time, Duration, Host in compact 2x2 grid */}
            <div className="mt-3.5 pt-3 border-t border-[#E5E7EB] grid grid-cols-2 gap-2 text-xs text-[#1E293B]">
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="font-semibold text-slate-800">Date:</span>
                <span className="text-slate-600 truncate">{webinar.date}</span>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <Clock className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="font-semibold text-slate-800">Time:</span>
                <span className="text-slate-600 truncate">{webinar.time}</span>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <Timer className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="font-semibold text-slate-800">Duration:</span>
                <span className="text-slate-600 truncate">{webinar.duration || '60 Min'}</span>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <User className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="font-semibold text-slate-800">Host:</span>
                <span className="text-slate-600 truncate">{webinar.host || 'CBM Academy'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Pricing & CTAs */}
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Registration Fee
              </span>
              <span
                className={`text-xl sm:text-2xl font-black ${
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
                className="inline-flex items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-bold text-[#072B57] transition-colors hover:border-[#072B57] hover:bg-slate-50 cursor-pointer"
              >
                View Details →
              </button>

              <button
                type="button"
                id={`btn-register-featured-${webinar.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(webinar);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-[#FF6B00] px-4 py-2 text-xs sm:text-sm font-bold text-white transition-all duration-150 hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Register Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
